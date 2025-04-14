"use client";
import React from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import type { AppRouterResponses } from "~/trpc/routers/_app";
import { ChartData } from "chart.js/auto";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";
import { Chart } from "../Chart";
import { pipe } from "fp-ts/lib/function";
import {
  activities2LineChartData,
  ActivityDetailed,
  sortByAscDate,
  withRequiredValues,
} from "~/utils/dataTransformation";

type Activity = NonNullable<AppRouterResponses["getActivities"]>[0];

const ActivityItem = ({
  activity,
  selected,
}: {
  activity: Activity;
  selected: boolean;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const getActivitiesQueryKey = trpc.getSelectedActivityIds.pathKey();

  const { mutate } = useMutation(
    trpc.setSelectedActivity.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: getActivitiesQueryKey,
        }),
    }),
  );
  // Explicit constant required to get type narrowing into Checkbox onChange
  const activityId = activity.id;

  if (!activityId) {
    throw new Error("Activity ID is missing");
  }

  return (
    <ListItem>
      <Box display="flex" flexDirection="row">
        <Box>
          <Checkbox
            defaultChecked={selected}
            onChange={(e) => {
              mutate({ activityId, selected: e.target.checked });
            }}
          />
        </Box>
        <Box>
          <Typography variant="h6">{activity.name}</Typography>
          <Typography variant="inherit">
            Distance: {(activity.distance || 0) / 1000} km
          </Typography>
          <Typography variant="inherit">
            {activity.start_date
              ? new Date(activity.start_date).toDateString()
              : "-"}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
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

  const { data: selectedActivityIds, refetch } = useQuery(
    trpc.getSelectedActivityIds.queryOptions(),
  );

  const { data } = useQuery(trpc.getActivities.queryOptions());

  const activities = (data || []) as ActivityDetailed[];

  const selectedActivities = activities.filter((activity) =>
    selectedActivityIds?.includes(String(activity.id)),
  );

  const chartData = pipe(
    selectedActivities,
    sortByAscDate,
    withRequiredValues,
    activities2LineChartData,
  );

  return (
    <Grid>
      <Button
        onClick={() => {
          console.log("### REFETCHING");
          return refetch();
        }}
      >
        Refresh
      </Button>
      <Chart chartData={chartData} />
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
      <Grid flex={1}>
        <Typography variant="h5">Activities</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : activitiesResponse ? (
          <ListActivities activities={activitiesResponse} />
        ) : (
          <Typography variant="h6">No activities found</Typography>
        )}
      </Grid>
      <Grid flex={1}>
        <Typography variant="h5">Comparison</Typography>
        <SelectedActivitiesComparison />
      </Grid>
    </Grid>
  );
};
