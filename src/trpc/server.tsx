import "server-only"; // <-- ensure this file cannot be imported from the client
import { cache } from "react";
import { makeQueryClient } from "./query-client";
import { AppRouter } from "~/trpc/routers/_app";
import { createTRPCReact } from "@trpc/react-query";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCReact<AppRouter>();
