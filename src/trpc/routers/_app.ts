import {
  getActivityStreams,
  getEffortsBySegmentId,
  getLoggedInAthleteActivities,
  getLoggedInAthleteStarredSegments,
} from "~/api/strava";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import { createTRPCRouter, baseProcedure, stravaProcedure } from "../init";
import { z } from "zod";
import { map, mapValues } from "lodash";

export type AppRouter = typeof appRouter;

export type AppRouterResponses = inferRouterOutputs<AppRouter>;

// TODO: Persist in DB/Redis
const selectedActivities: Record<string, boolean> = {};
// const persistedActivities: Record<
//   string,
//   NonNullable<AppRouterResponses["getActivities"]>[0]
// > = {};

export const appRouter = createTRPCRouter({
  test: baseProcedure.query(() => {
    return "Hello world!";
  }),
  getActivities: stravaProcedure.query(async ({ ctx }) => {
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

      const onlyRunningActivities = data?.filter(
        (activity) => activity.type === "Run",
      );

      return onlyRunningActivities;
    } catch (e) {
      console.error("Error fetching activities:", e);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }),
  setSelectedActivity: stravaProcedure
    .input(
      z.object({
        activityId: z.number(),
        selected: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input: { activityId, selected } }) => {
      selectedActivities[activityId] = selected;

      console.log("### selectedActivities", selectedActivities);

      return selectedActivities;
    }),
  getSelectedActivityIds: stravaProcedure.query(async ({ ctx }) => {
    try {
      const x = map(selectedActivities, (value, key) =>
        value ? key : null,
      ).filter((value) => value !== null);

      console.log("### selectedActivityIds x", x);

      return x;
    } catch (e) {
      console.error("Error fetching activities:", e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }),
  getActivityStream: stravaProcedure
    .input(
      z.object({
        activityId: z.number(),
      }),
    )
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
  getStarredSegments: stravaProcedure.query(async ({ ctx }) => {
    try {
      console.log("### Bearer", ctx.stravaAccessToken);

      const { data, response } = await getLoggedInAthleteStarredSegments({
        query: {},
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
  getSegmentEfforts: stravaProcedure
    .input(
      z.object({
        segmentId: z.number(),
      }),
    )
    .query(async ({ ctx, input: { segmentId } }) => {
      try {
        console.log("### Bearer", ctx.stravaAccessToken);

        if (!segmentId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "segmentId is required",
          });
        }

        const { data, response } = await getEffortsBySegmentId({
          query: {
            segment_id: segmentId,
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
