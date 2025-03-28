/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v11/router
 * @see https://trpc.io/docs/v11/procedures
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { transformer } from "../utils/transformer";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer,
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user?.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx,
  });
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthed);

export const router = t.router;
