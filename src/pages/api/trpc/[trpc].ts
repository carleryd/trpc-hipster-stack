/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import * as trpcNext from "@trpc/server/adapters/next";
import { publicProcedure, router } from "~/server/trpc";
import { z } from "zod";
import * as stravaSchema from "~/api/stravaApi";
import { ENV_VARS } from "~/utils/env";
import { TRPCError } from "@trpc/server";

console.log("ENV_VARS", ENV_VARS);

const stravaTokenResponseSchema = z.object({
  token_type: z.string(),
  access_token: z.string(),
  expires_at: z.number().optional(),
  expires_in: z.number().optional(),
  refresh_token: z.string().optional(),
});

const appRouter = router({
  getActivities: publicProcedure
    .input(z.object({ accessToken: z.string() }))
    .query(async ({ input: { accessToken } }) => {
      try {
        // TODO: We need to change the Bearer here!
        const stravaApi = new stravaSchema.Api({
          baseApiParams: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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
  getStravaAccessToken: publicProcedure
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

        console.log("################ START ##################");

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

        // console.log(`
        //   curl --location '${baseUrl + path}' \\
        //     --header 'Content-Type: application/x-www-form-urlencoded' \\
        //     --data-urlencode 'client_id=${ENV_VARS.STRAVA_CLIENT_ID}' \\
        //     --data-urlencode 'client_secret=${ENV_VARS.STRAVA_CLIENT_SECRET}' \\
        //     --data-urlencode 'code=${code}' \\
        //     --data-urlencode 'grant_type=authorization_code'
        //   `);

        // console.log("res", res);
        console.log("################ END ##################");

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

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({ session: null }),
});
