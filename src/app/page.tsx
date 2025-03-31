import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { App } from "~/components/App";
import { getQueryClient } from "~/trpc/server";

export default function Home() {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <App />
    </HydrationBoundary>
  );
}
