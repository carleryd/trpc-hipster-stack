"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useTRPC } from "~/trpc/client";

/**
 * Activity analysis page
 *
 * Select activities to compare against
 */

export default () => {
  const trpc = useTRPC();

  const pathname = usePathname();

  const [_empty, _resource, activityId] = pathname.split("/");

  const { data } = useQuery(
    trpc.getActivityStream.queryOptions({ activityId: Number(activityId) }),
  );

  return <>{JSON.stringify(Object.keys(data || {}))}</>;
};
