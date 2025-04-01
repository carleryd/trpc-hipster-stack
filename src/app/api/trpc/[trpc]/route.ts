import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { createContext } from "~/trpc/init";
import { appRouter } from "~/trpc/routers/_app";

/**
 * This is the handler of all client side queries and mutations
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });

export const GET = handler;
export const POST = handler;
