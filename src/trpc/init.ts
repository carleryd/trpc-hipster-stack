/**
 * If you need to add transformers for special data types like `Temporal.Instant` or `Temporal.Date`, `Decimal.js`, etc you can do so here.
 * Make sure to import this file rather than `superjson` directly.
 * @see https://github.com/blitz-js/superjson#recipes
 */
import superjson from "superjson";
import { initTRPC, TRPCError } from "@trpc/server";
import { getServerSession, NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { ENV_VARS } from "~/utils/env";
import { getToken } from "next-auth/jwt";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const authOptions: NextAuthOptions = {
  providers: [
    StravaProvider({
      clientId: ENV_VARS.STRAVA_CLIENT_ID,
      clientSecret: ENV_VARS.STRAVA_CLIENT_SECRET,
      authorization: {
        params: {
          approval_prompt: "auto",
          scope: "activity:read",
        },
      },
    }),
  ],
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

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(authOptions);
  const token = await getToken({
    req: opts.req,
    secret: ENV_VARS.NEXTAUTH_SECRET,
  });

  return {
    session,
    stravaAccessToken: token?.accessToken,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const isStravaAuth = t.middleware(({ ctx, next }) => {
  if (!(typeof ctx.stravaAccessToken === "string")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No access token" });
  }

  return next({ ctx: { stravaAccessToken: ctx.stravaAccessToken } });
});
