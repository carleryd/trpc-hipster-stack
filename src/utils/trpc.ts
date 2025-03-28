import {
  httpBatchLink,
  httpSubscriptionLink,
  loggerLink,
  splitLink,
} from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { ssrPrepass } from "@trpc/next/ssrPrepass";
import type { AppRouter } from "../pages/api/trpc/[trpc]";
import { transformer } from "./transformer";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, we return a relative URL
    return "";
  }
  // When rendering on the server, we return an absolute URL

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    const url = getBaseUrl() + "/api/trpc";
    return {
      links: [
        /**
         * The function passed to enabled is an example in case you want to the link to
         * log to your console in development and only log errors in production
         */
        // loggerLink({
        //   enabled: (opts) =>
        //     (process.env.NODE_ENV === "development" &&
        //       typeof window !== "undefined") ||
        //     (opts.direction === "down" && opts.result instanceof Error),
        // }),
        splitLink({
          condition: (op) => op.type === "subscription",
          true: httpSubscriptionLink({
            url,
            transformer,
          }),
          false: httpBatchLink({
            url,
            transformer,
          }),
        }),
      ],
    };
  },
  ssr: true,
  ssrPrepass,
  transformer,
});
