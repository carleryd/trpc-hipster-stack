"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { signIn, signOut, useSession } from "next-auth/react";
import type { AppRouterResponses } from "~/trpc/routers/_app";
import { Chart, ChartData } from "chart.js/auto";

type Activity = NonNullable<AppRouterResponses["getActivities"]>[0];

const ActivityItem = ({ activity }: { activity: Activity }) => {
  return (
    <li>
      {activity.name} {activity.distance}
      <Link href={`/activity/${activity.id}`}>View</Link>
    </li>
  );
};

const activityData2ChartData = (data: Activity[]): ChartData<"line"> => {
  const labels: ChartData<"line">["labels"] = data.map(
    (activity) => activity.start_date || "-",
  );
  const datasets: ChartData<"line">["datasets"] = [
    {
      label: "Distance",
      data: data.map((activity) => activity.distance || 0),
    },
  ];

  return {
    labels,
    datasets,
  };
};

const ListStarredSegments = () => {
  try {
    const trpc = useTRPC();

    console.log("### ListStarredSegments", trpc.getStarredSegments, trpc);

    const { data } = useQuery(trpc.getStarredSegments.queryOptions());

    return (
      <div>
        <h3>Starred segments </h3>
        {data?.map((segment, i) => (
          <div key={i}>
            <h4>{segment.name}</h4>
            <p>{segment.distance}</p>
            <Link href={`/segment/${segment.id}`}>View</Link>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    console.error("Error fetching starred segments:", e);
    return null;
  }
};

const ListActivities = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.getActivities.queryOptions());

  // console.log("ListActivities stravaAccessToken", data);

  const ctx = document.getElementById("myChart") as HTMLCanvasElement | null;

  useEffect(() => {
    console.log("ctx", ctx);
    if (ctx && data) {
      console.log("ctx if", ctx);
      new Chart(ctx, {
        type: "line",
        data: activityData2ChartData(data || []),
        options: {
          responsive: true,
          interaction: {
            intersect: false,
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [ctx, data]);

  return null;
};
// {data?.map((activity, i) => <ActivityItem key={i} activity={activity} />)}

export const App = () => {
  const { data: session } = useSession();
  console.log("### App session", session);

  return (
    <div>
      {session?.user ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn("strava")}>Sign in</button>
      )}
      {session?.user && <ListStarredSegments />}
    </div>
  );
};
