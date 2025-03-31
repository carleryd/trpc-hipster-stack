/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "~/trpc/routers/_app";

// export only the type definition of the API
// None of the actual implementation is exposed to the client

// export API handler
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({ session: null }), // TODO: Use import
  });

export const GET = handler;
export const POST = handler;
