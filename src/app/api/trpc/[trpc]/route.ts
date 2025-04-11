import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { NextRequest } from "next/server";

import { createContext } from "~/trpc/init";
import { appRouter } from "~/trpc/routers/_app";

/**
 * This is the handler of all client side queries and mutations
 */
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => createContext({ req }),
  });

export const GET = handler;
export const POST = handler;
