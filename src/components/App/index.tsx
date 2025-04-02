"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { useSession } from "next-auth/react";
import { AppRouterResponses } from "~/trpc/routers/_app";

type Activity = AppRouterResponses["getActivities"][0];

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <li>
      {activity.name} {activity.distance}
      <Link href={`/activity/${activity.id}`}>View</Link>
    </li>
  );
};

const ListActivities = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.getActivities.queryOptions());

  console.log("ListActivities stravaAccessToken", data);

  return (
    <ul>
      {data?.map((activity, i) => <ActivityItem key={i} activity={activity} />)}
    </ul>
  );
};

export const App = () => {
  console.log("Rendering IndexPage");
  const { data: session } = useSession();
  console.log("session", session);

  return (
    <div>
      {session?.user ? (
        <Link href="/api/auth/signout">Sign out</Link>
      ) : (
        <Link href="/api/auth/signin">Sign in</Link>
      )}
      {session?.user && <ListActivities />}
    </div>
  );
};
