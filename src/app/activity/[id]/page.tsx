"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useTRPC } from "~/trpc/client";

export default () => {
  const trpc = useTRPC();

  const pathname = usePathname();

  const [_start, _activity, activityId] = pathname.split("/");

  const { data } = useQuery(
    trpc.getActivityStream.queryOptions({ activityId: Number(activityId) }),
  );

  return <>{JSON.stringify(data)}</>;
};
