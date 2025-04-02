import { getActivityStreams, getLoggedInAthleteActivities } from "~/api/strava";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure, isStravaAuth } from "../init";
import { z } from "zod";

export type AppRouter = typeof appRouter;

export type AppRouterResponses = inferRouterOutputs<AppRouter>;

export const appRouter = createTRPCRouter({
  test: baseProcedure.query(() => {
    return "Hello world!";
  }),
  getActivities: baseProcedure.use(isStravaAuth).query(async ({ ctx }) => {
    try {
      console.log("### Bearer", ctx.stravaAccessToken);

      const { response, data } = await getLoggedInAthleteActivities({
        headers: {
          Authorization: `Bearer ${ctx.stravaAccessToken}`,
        },
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: response.statusText,
        });
      }

      return data;
    } catch (e) {
      console.error("Error fetching activities:", e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }),
  getActivityStream: baseProcedure
    .input(
      z.object({
        activityId: z.number(),
      }),
    )
    .use(isStravaAuth)
    .query(async ({ ctx, input: { activityId } }) => {
      try {
        console.log("### Bearer", ctx.stravaAccessToken);

        if (!activityId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "activityId is required",
          });
        }

        const { data, response } = await getActivityStreams({
          path: {
            id: activityId,
          },
          query: {
            keys: ["time", "distance", "latlng", "altitude", "velocity_smooth"],
            key_by_type: true,
          },
          headers: {
            Authorization: `Bearer ${ctx.stravaAccessToken}`,
          },
        });

        if (!response.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: response.statusText,
          });
        }

        return data;
      } catch (e) {
        console.error("Error fetching activities:", e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }),
});
