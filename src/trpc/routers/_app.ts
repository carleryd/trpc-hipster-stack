import {
  getActivityStreams,
  GetActivityStreamsData,
  GetActivityStreamsResponse,
  getEffortsBySegmentId,
  getLoggedInAthleteActivities,
  getLoggedInAthleteStarredSegments,
  SummaryActivity,
} from "~/api/strava";
import { inferRouterOutputs, TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  baseProcedure,
  stravaProcedure,
  stravaClient,
} from "../init";
import { z } from "zod";
import { map } from "lodash";
import Redis from "ioredis";
import { zipWith } from "fp-ts/lib/Array";

export type AppRouter = typeof appRouter;

export type AppRouterResponses = inferRouterOutputs<AppRouter>;

// TODO: Persist in DB/Redis
const selectedActivities: Record<string, boolean> = {};
// const persistedActivities: Record<
//   string,
//   NonNullable<AppRouterResponses["getActivities"]>[0]
// > = {};

const redis = new Redis({
  host: process.env.VALKEY_HOST || "localhost",
  port: 6379,
});

export const appRouter = createTRPCRouter({
  test: baseProcedure.query(() => {
    return "Hello world!";
  }),
  getActivities: stravaProcedure.query(async ({ ctx }) => {
    try {
      console.log("### Bearer", ctx.stravaAccessToken);

      const { data, error } = await getLoggedInAthleteActivities({
        client: stravaClient,
        query: {
          per_page: 100,
        },
        headers: {
          Authorization: `Bearer ${ctx.stravaAccessToken}`,
        },
      });

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
        });
      }

      try {
        const activities: SummaryActivity[] = data || [];

        console.log("### activiteies", activities);

        const additionalActivityDataSchema = z.object({
          id: z.number(),
          average_cadence: z.number().optional(),
          average_heartrate: z.number(),
        });

        const enrichedActivities = activities
          .map((activity) => additionalActivityDataSchema.safeParse(activity))
          .filter(({ success }) => success === true);

        const mergedActivities = zipWith(
          activities,
          enrichedActivities,
          (x, y) => ({ ...x, ...y }),
        );

        console.log("### parsed activities", mergedActivities);

        const onlyRunningActivities = mergedActivities.filter(
          (activity) => activity.type === "Run",
        );

        return onlyRunningActivities;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Unable to parsed additional activity data",
        });
      }
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
    .mutation(async ({ input: { activityId, selected } }) => {
      selectedActivities[activityId] = selected;

      console.log("### selectedActivities", selectedActivities);

      return selectedActivities;
    }),
  getSelectedActivityIds: stravaProcedure.query(async ({}) => {
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
    .query(
      async ({
        ctx,
        input: { activityId },
      }): Promise<GetActivityStreamsResponse> => {
        try {
          console.log("### Bearer", ctx.stravaAccessToken);

          const activityStreamKeys: GetActivityStreamsData["query"]["keys"] = [
            "distance",
            "heartrate",
            "cadence",
            "velocity_smooth",
            "altitude",
            "time",
          ];

          const redisKey = `activity:stream:${activityStreamKeys.sort().join(",")}:${activityId}`;

          console.log("### redisKey", redisKey);

          const cachedActivityStream = await redis.get(redisKey);

          if (cachedActivityStream) {
            console.log("### Redis cache hit");
            return JSON.parse(cachedActivityStream);
          }

          // console.log(value); // → Hello from Valkey!

          const { data, error } = await getActivityStreams({
            client: stravaClient,
            path: {
              id: activityId,
            },
            query: {
              keys: activityStreamKeys,
              key_by_type: true,
            },
            headers: {
              Authorization: `Bearer ${ctx.stravaAccessToken}`,
            },
          });

          if (error) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }

          await redis.set(redisKey, JSON.stringify(data));

          return data;
        } catch (e) {
          console.error("Error fetching activities:", e);

          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e instanceof Error ? e.message : "Unknown error",
          });
        }
      },
    ),
  getStarredSegments: stravaProcedure.query(async ({ ctx }) => {
    try {
      console.log("### Bearer", ctx.stravaAccessToken);

      const { data, error } = await getLoggedInAthleteStarredSegments({
        client: stravaClient,
        query: {},
        headers: {
          Authorization: `Bearer ${ctx.stravaAccessToken}`,
        },
      });

      if (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message,
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

        const { data, error } = await getEffortsBySegmentId({
          client: stravaClient,
          query: {
            segment_id: segmentId,
          },
          headers: {
            Authorization: `Bearer ${ctx.stravaAccessToken}`,
          },
        });

        if (error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
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
