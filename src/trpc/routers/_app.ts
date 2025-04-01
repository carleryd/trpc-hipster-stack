import * as stravaSchema from "~/api/stravaApi";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure, isStravaAuth } from "../init";

export type AppRouter = typeof appRouter;

export const appRouter = createTRPCRouter({
  test: baseProcedure.query(() => {
    return "Hello world!";
  }),
  getActivities: baseProcedure.use(isStravaAuth).query(async ({ ctx }) => {
    try {
      console.log("### Bearer", ctx.stravaAccessToken);
      const stravaApi = new stravaSchema.Api({
        baseApiParams: {
          headers: {
            Authorization: `Bearer ${ctx.stravaAccessToken}`,
          },
        },
      });

      const res = await stravaApi.athlete.getLoggedInAthleteActivities();

      if (!res.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: res.statusText,
        });
      }

      return res.data;
    } catch (e) {
      console.error("Error fetching activities:", e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }),
});
