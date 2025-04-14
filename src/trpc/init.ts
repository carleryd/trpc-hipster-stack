/**
 * If you need to add transformers for special data types like `Temporal.Instant` or `Temporal.Date`, `Decimal.js`, etc you can do so here.
 * Make sure to import this file rather than `superjson` directly.
 * @see https://github.com/blitz-js/superjson#recipes
 */
import { initTRPC, TRPCError } from "@trpc/server";
import NextAuth, { NextAuthConfig } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

console.log(
  "### env",
  process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
  process.env.STRAVA_CLIENT_SECRET,
  process.env.NEXTAUTH_SECRET,
);

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
      console.log("### jwt", { token, account });
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  // session: {
  //   strategy: "database",
  // },
};

export const { auth, handlers } = NextAuth(authOptions);

export const createContext = async (opts: { req: NextRequest }) => {
  const session = await auth();
  // console.log("### createContext secret", process.env.NEXTAUTH_SECRET);

  try {
    const token = await getToken({
      req: opts.req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    console.log("### createContext token -", token);
    console.log("### createContext session -", session);
    console.log("### createContext req -", opts.req);
    console.log("### createContext cookies -", opts.req.headers.get("cookie"));

    return {
      session,
      stravaAccessToken: token?.accessToken,
      // stravaAccessToken: "ac79ec202cb19e179e7abaf859715bcb1ef68838",
    };
  } catch (e) {
    console.error("### createContext - Error creating context:", e);
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
  console.log("### isStravaAuth", ctx);
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
