"use client";
import React from "react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useTRPC } from "~/trpc/client";
import type { AppRouterResponses } from "~/trpc/routers/_app";
import {
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
import { formatStringNumberWithDecimalPrecision } from "~/utils/formatting";
import { meterPerSecondToMinPerKm } from "~/utils/math";
import { zipWith } from "lodash";

type Activity = NonNullable<AppRouterResponses["getActivities"]>[0];
type ActivityStream = NonNullable<AppRouterResponses["getActivityStream"]>;

const ActivityStreamDisplay = ({ activityId }: { activityId: number }) => {
  const trpc = useTRPC();

  const { data: activityStream, isLoading } = useQuery(
    trpc.getActivityStream.queryOptions({
      activityId,
    }),
  );

  console.log("### Activity stream", activityStream);

  return (
    <Grid>{isLoading ? <CircularProgress size={5} /> : <>Fetched!</>}</Grid>
  );
};

const FetchActivityStreamTableCell = ({
  activityId,
  isActivitySelected,
}: {
  activityId: number;
  isActivitySelected: boolean;
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

  return (
    <TableCell>
      <Checkbox
        checked={isActivitySelected}
        onChange={(e) => {
          mutate({
            activityId,
            selected: e.target.checked,
          });
        }}
      />
      {isActivitySelected && <ActivityStreamDisplay activityId={activityId} />}
    </TableCell>
  );
};

const ListActivityItem = ({
  activity,
  isActivitySelected,
}: {
  activity: Activity;
  isActivitySelected: boolean;
}) => {
  return (
    <TableRow key={activity.id}>
      <TableCell>{activity.name}</TableCell>
      <TableCell>
        {activity.start_date
          ? new Date(activity.start_date).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell>{(activity.distance || 0) / 1000}</TableCell>
      <TableCell>{activity.average_heartrate || 0}</TableCell>
      {/** TODO: I think I need to fetch stream data for each activity to get HR zone info,
                  otherwise can't make good judgement call on whether to include in aggregate */}
      {/** Show the name and date, then loading spinner as we get the rest */}
      <TableCell>
        {activity.average_speed
          ? pipe(
              activity.average_speed,
              meterPerSecondToMinPerKm,
              String,
              (str) => formatStringNumberWithDecimalPrecision(str, 2),
            )
          : "-"}
      </TableCell>
      <FetchActivityStreamTableCell
        activityId={activity.id}
        isActivitySelected={isActivitySelected}
      />
    </TableRow>
  );
};

const ListActivities = () => {
  const trpc = useTRPC();

  const { data: activities, isLoading } = useQuery(
    trpc.getActivities.queryOptions(),
  );

  const { data: selectedActivityIds } = useQuery(
    trpc.getSelectedActivityIds.queryOptions(),
  );

  console.log("### ListActivities", activities, selectedActivityIds);

  return (
    <Grid>
      <TableContainer>
        {isLoading && <CircularProgress />}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Distance (km)</TableCell>
              <TableCell>Heart Rate</TableCell>
              <TableCell>Pace (min / km)</TableCell>
              <TableCell>Compare</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(activities || []).map((activity) => {
              const isActivitySelected = (selectedActivityIds || []).includes(
                String(activity.id),
              );

              return (
                <ListActivityItem
                  activity={activity}
                  isActivitySelected={isActivitySelected}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
};

const SelectedActivitiesComparison = () => {
  const trpc = useTRPC();

  const { data: selectedActivityIds, refetch } = useQuery(
    trpc.getSelectedActivityIds.queryOptions(),
  );

  const { data: activities } = useQuery(trpc.getActivities.queryOptions());

  const selectedActivities = (activities || []).filter((activity) =>
    selectedActivityIds?.includes(String(activity.id)),
  );

  const activityStreamResults = useQueries({
    queries: (selectedActivityIds || []).map((activityId) =>
      trpc.getActivityStream.queryOptions({ activityId: Number(activityId) }),
    ),
  });

  const activityStreams = activityStreamResults.map(({ data }) => data);

  const activitiesWithStreamData: {
    activity: Activity;
    stream?: ActivityStream;
  }[] = zipWith(
    activityStreams,
    selectedActivities || [],
    (stream, activity) => {
      return {
        activity,
        stream,
      };
    },
  );

  // const activities = (data || []) as ActivityDetailed[];

  // const selectedActivities = activities.filter((activity) =>
  //   selectedActivityIds?.includes(String(activity.id)),
  // );

  // const chartData = pipe(
  //   selectedActivities,
  //   sortByAscDate,
  //   withRequiredValues,
  //   activities2LineChartData,
  // );

  console.log("### activityStreams", activitiesWithStreamData);

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
    </Grid>
  );
};
// <Chart chartData={chartData} />

export const App = () => (
  <Grid container display="flex" flexDirection="column">
    <Grid
      container
      flex={1}
      width="100%"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Typography variant="h5">Comparison</Typography>
      <Grid maxWidth={800}>
        <SelectedActivitiesComparison />
      </Grid>
    </Grid>
    <Grid flex={1}>
      <Typography variant="h5">Activities</Typography>
      <ListActivities />
    </Grid>
  </Grid>
);
