"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import { useSession } from "next-auth/react";
import type { AppRouterResponses } from "~/trpc/routers/_app";
import { Chart, ChartData } from "chart.js/auto";
import { CircularProgress, Grid, Typography } from "@mui/material";

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

const ListActivities = ({
  activities,
}: {
  activities: NonNullable<AppRouterResponses["getActivities"]>;
}) => {
  return (
    <Grid>
      {activities.map((activity) => (
        <Grid key={activity.id}>
          <ActivityItem activity={activity} />
        </Grid>
      ))}
    </Grid>
  );
};

export const App = () => {
  const trpc = useTRPC();

  const { data: activitiesResponse, isLoading } = useQuery(
    trpc.getActivities.queryOptions(),
  );

  return (
    <Grid>
      <Typography variant="h5">Activities</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : activitiesResponse ? (
        <ListActivities activities={activitiesResponse} />
      ) : (
        <Typography variant="h6">No activities found</Typography>
      )}
    </Grid>
  );
};
