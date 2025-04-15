/**
 * If you need to add transformers for special data types like `Temporal.Instant` or `Temporal.Date`, `Decimal.js`, etc you can do so here.
 * Make sure to import this file rather than `superjson` directly.
 * @see https://github.com/blitz-js/superjson#recipes
 */
import { initTRPC, TRPCError } from "@trpc/server";
import NextAuth, { NextAuthConfig } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { getToken, JWT } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@hey-api/client-axios";

type MyJWT = JWT & {
  refreshToken?: string;
  accessToken?: string;
  accessTokenExpiresAt?: string | null;
};

export const stravaClient = createClient({
  baseURL: "https://www.strava.com/api/v3",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

stravaClient.instance.interceptors.request.use((request) => {
  console.log(
    `[OUTGOING] ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`,
  );
  if (request.data instanceof URLSearchParams) {
    console.log(`[BODY] ${request.data.toString()}`);
  } else {
    console.log("[BODY]", request.data);
  }
  return request;
});

const getRefreshedToken = async (token: MyJWT) => {
  console.log("### Refreshing token", token);
  try {
    if (!token.refreshToken) {
      throw new Error("No refresh token");
    }

    const body = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

    const { data, error } = await stravaClient.post({
      url: "/oauth/token",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (error) {
      console.error("Error refreshing Strava access token:", error);
      throw new Error("Failed to refresh access token");
    }

    const stravaTokenResponseSchema = z.object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number(),
    });

    const parsedRefreshToken = stravaTokenResponseSchema.safeParse(data);

    if (!parsedRefreshToken.success) {
      console.error(
        "Error parsing Strava token response:",
        parsedRefreshToken.error,
      );
      throw new Error("Error parsing Strava token response");
    }

    return {
      ...token,
      accessToken: parsedRefreshToken.data.access_token,
      accessTokenExpiresAt: parsedRefreshToken.data.expires_at * 1000,
      refreshToken: parsedRefreshToken.data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};

export const authOptions: NextAuthConfig = {
  providers: [
    StravaProvider({
      clientId: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      authorization: {
        params: {
          approval_prompt: "auto",
          scope: "activity:read",
        },
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    async jwt({ token, account }) {
      console.log("### JWT", { token, account });
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          accessTokenExpiresAt: account.expires_at
            ? account.expires_at * 1000
            : null,
          refreshToken: account.refresh_token,
        };
      }

      const isTokenExpired =
        typeof token.accessTokenExpiresAt === "number" &&
        Date.now() >= token.accessTokenExpiresAt;

      if (isTokenExpired) {
        const refreshedToken = await getRefreshedToken(token);

        console.log("### Token expired - refreshed token:", refreshedToken);

        return refreshedToken;
      } else {
        return token;
      }
    },
  },
  // session: {
  //   strategy: "database",
  // },
};

export const { auth, handlers } = NextAuth(authOptions);

export const createContext = async (opts: { req: NextRequest }) => {
  const session = await auth();

  try {
    const token = await getToken({
      req: opts.req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    return {
      session,
      stravaAccessToken: token?.accessToken,
    };
  } catch (e) {
    return {
      session,
      stravaAccessToken: null,
    };
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

const isStravaAuth = t.middleware(({ ctx, next }) => {
  if (!(typeof ctx.stravaAccessToken === "string")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No access token" });
  }

  return next({ ctx: { stravaAccessToken: ctx.stravaAccessToken } });
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const stravaProcedure = t.procedure.use(isStravaAuth);
