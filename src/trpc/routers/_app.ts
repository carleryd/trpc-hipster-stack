import { z } from "zod";
import * as stravaSchema from "~/api/stravaApi";
import { ENV_VARS } from "~/utils/env";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../init";

export type AppRouter = typeof appRouter;

const stravaTokenResponseSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  expires_at: z.number().optional(),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
});

export const appRouter = createTRPCRouter({
  test: publicProcedure.query(() => {
    return "Hello world!";
  }),
  getActivities: publicProcedure // TODO: Make protected if no token
    // .input(z.object({ stravaAccessToken: z.string() }))
    .query(async ({ ctx }) => {
      if (!ctx.token?.accessToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "No access token",
        });
      }

      try {
        // TODO: We need to change the Bearer here!
        // TODO: Get token from session
        console.log("### Bearer ctx.token.accessToken", ctx.token.accessToken);
        const stravaApi = new stravaSchema.Api({
          baseApiParams: {
            headers: {
              Authorization: `Bearer ${ctx.token.accessToken}`,
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
  getStravaAuthToken: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input: { code } }) => {
      try {
        const baseUrl = "https://www.strava.com";
        const path = "/api/v3/oauth/token";

        const body = new URLSearchParams({
          client_id: ENV_VARS.STRAVA_CLIENT_ID,
          client_secret: ENV_VARS.STRAVA_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
        }).toString();

        console.log("body", body);

        const res = await fetch(baseUrl + path, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        if (!res.ok) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: res.statusText,
          });
        }

        const json = await res.json();
        const parsedJson = stravaTokenResponseSchema.safeParse(json);

        if (!parsedJson.success) {
          console.error("Invalid response from Strava", json);

          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid response from Strava",
          });
        }

        return parsedJson.data;
      } catch (e) {
        console.error("Error exchanging Strava token:", e);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: e instanceof Error ? e.message : "Unknown error",
        });
      }
    }),
});
