"use client";
import React from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import type { AppRouterResponses } from "~/trpc/routers/_app";
import { ChartData } from "chart.js/auto";
import { Checkbox, CircularProgress, Grid, Typography } from "@mui/material";

type Activity = NonNullable<AppRouterResponses["getActivities"]>[0];

const ActivityItem = ({
  activity,
  selected,
}: {
  activity: Activity;
  selected: boolean;
}) => {
  const trpc = useTRPC();

  const { mutate } = useMutation(trpc.setActivitySelection.mutationOptions());
  // Explicit constant required to get type narrowing into Checkbox onChange
  const activityId = activity.id;

  if (!activityId) {
    throw new Error("Activity ID is missing");
  }

  return (
    <li>
      {activity.name} {activity.distance}
      <Link href={`/activity/${activityId}`}>View</Link>
      <Checkbox
        defaultChecked={selected}
        onChange={(e) => {
          console.log("### Checkbox", e.target.checked);
          mutate({ activityId, selected: e.target.checked });
        }}
      />
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
  const trpc = useTRPC();

  const { data: selectedActivityIds } = useQuery(
    trpc.getSelectedActivityIds.queryOptions(),
  );

  console.log("### ListActivities", selectedActivityIds);

  return (
    <Grid>
      {activities
        .filter((activity): activity is { id: number } & Activity =>
          Boolean(activity.id),
        )
        .map((activity) => (
          <Grid key={activity.id}>
            <ActivityItem
              activity={activity}
              selected={
                selectedActivityIds?.includes(String(activity.id)) || false
              }
            />
          </Grid>
        ))}
    </Grid>
  );
};

const SelectedActivitiesComparison = () => {
  const trpc = useTRPC();

  const { data: selectedActivityIds } = useQuery(
    trpc.getSelectedActivityIds.queryOptions(),
  );

  return (
    <Grid>
      {selectedActivityIds?.map((activityId) => (
        <Grid>
          <Typography variant="h6">{activityId}</Typography>
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
    <Grid container display="flex" flexDirection="row">
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
      <Grid>
        <Typography variant="h5">Comparison</Typography>
        <SelectedActivitiesComparison />
      </Grid>
    </Grid>
  );
};
