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
import { inRange, range, zipWith, head, tail } from "lodash";
import { RequireKeys } from "~/types/utils";
import { z } from "zod";
import { accumulateMetadata } from "next/dist/lib/metadata/resolve-metadata";
import { ChartData } from "chart.js/auto";

export type Activity = NonNullable<AppRouterResponses["getActivities"]>[0];
export type ActivityStream = NonNullable<
  AppRouterResponses["getActivityStream"]
>;
export type ActivityWithStream = {
  activity: Activity;
  stream?: ActivityStream;
};

type HeartRateZone = "ZONE_1" | "ZONE_2" | "ZONE_3" | "ZONE_4" | "ZONE_5";

type ActivityHeartRateZoneData = {
  zone: HeartRateZone;
  heartRate: number;
  distance: number;
  time: number;
}[];

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

type ZoneAverages = {
  minPerKm: number;
  heartRate: number;
  time: number;
};
const getAveragesForZone = (
  list: ActivityHeartRateZoneData,
  zone: HeartRateZone,
): ZoneAverages => {
  const { distance, heartRateSum, time } = list
    .filter((zoneData) => zoneData.zone === zone)
    .reduce(
      (acc, zoneData) => ({
        distance: acc.distance + zoneData.distance,
        heartRateSum: acc.heartRateSum + zoneData.heartRate,
        time: acc.time + 1,
      }),
      { distance: 0, heartRateSum: 0, time: 0 },
    );

  const meters = distance;
  const averageHeartRate = heartRateSum / time;
  const metersPerSecond = meters / time;
  const minPerKm = meterPerSecondToMinPerKm(metersPerSecond);

  return {
    minPerKm,
    heartRate: averageHeartRate,
    time,
  };
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
            {(activities || []).map((activity, index) => {
              const isActivitySelected = (selectedActivityIds || []).includes(
                String(activity.id),
              );

              return (
                <ListActivityItem
                  key={index}
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

const DUMMY_ATHLETE_ZONES_RESPONSE = {
  heart_rate: {
    custom_zones: false,
    zones: [
      {
        min: 0,
        max: 123,
      },
      {
        min: 123,
        max: 153,
      },
      {
        min: 153,
        max: 169,
      },
      {
        min: 169,
        max: 184,
      },
      {
        min: 184,
        max: -1,
      },
    ],
  },
};

const zones = DUMMY_ATHLETE_ZONES_RESPONSE.heart_rate.zones;

// TODO: These overlap, but lodash inRange is not inclusive end so it works
export const HEART_RATE_ZONES = {
  ZONE_1: {
    min: zones[0].min,
    max: zones[0]?.max,
  },
  ZONE_2: {
    min: zones[1].min,
    max: zones[1]?.max,
  },
  ZONE_3: {
    min: zones[2].min,
    max: zones[2]?.max,
  },
  ZONE_4: {
    min: zones[3].min,
    max: zones[3]?.max,
  },
  ZONE_5: {
    min: zones[4].min,
    max: Number.MAX_SAFE_INTEGER,
  },
};

const getZoneForHeartRate = (heartRate: number) => {
  if (
    inRange(heartRate, HEART_RATE_ZONES.ZONE_1.min, HEART_RATE_ZONES.ZONE_1.max)
  ) {
    return "ZONE_1";
  } else if (
    inRange(heartRate, HEART_RATE_ZONES.ZONE_2.min, HEART_RATE_ZONES.ZONE_2.max)
  ) {
    return "ZONE_2";
  } else if (
    inRange(heartRate, HEART_RATE_ZONES.ZONE_3.min, HEART_RATE_ZONES.ZONE_3.max)
  ) {
    return "ZONE_3";
  } else if (
    inRange(heartRate, HEART_RATE_ZONES.ZONE_4.min, HEART_RATE_ZONES.ZONE_4.max)
  ) {
    return "ZONE_4";
  } else if (
    inRange(heartRate, HEART_RATE_ZONES.ZONE_5.min, HEART_RATE_ZONES.ZONE_5.max)
  ) {
    return "ZONE_5";
  } else {
    // TODO: Handle better somehow
    throw new Error("Heart rate not in any zone");
  }
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

  const activitiesWithStreamData: ActivityWithStream[] = zipWith(
    activityStreams,
    selectedActivities || [],
    (stream, activity) => {
      return {
        activity,
        stream,
      };
    },
  );

  const sorted = sortByAscDate(activitiesWithStreamData);
  // const withDefinedStream = sorted.filter(
  //   (
  //     activityWithStream,
  //   ): activityWithStream is {
  //     activity: (typeof activityWithStream)["activity"];
  //     stream: NonNullable<(typeof activityWithStream)["stream"]> & { stream: { heartrate: { data: number[]} }};

  //   } => Array.isArray(activityWithStream.stream) && Array.isArray(activityWithStream.stream.heartrate?.data),
  // );

  const activitiesZoneData: ActivityHeartRateZoneData[] = sorted
    .map((activity) => {
      if (
        activity.stream?.heartrate?.data &&
        activity.stream?.distance?.data &&
        activity.stream?.time?.data
      ) {
        const heartRateData = activity.stream.heartrate.data;
        const distanceData = activity.stream.distance.data;
        const timeData = activity.stream.time.data;

        const heartRateZoneData: ActivityHeartRateZoneData = zipWith(
          heartRateData,
          distanceData,
          timeData,
          (heartRate, distance, time) => {
            const zone = getZoneForHeartRate(heartRate);

            return {
              zone,
              heartRate,
              distance,
              time,
            };
          },
        );

        const headData = head(heartRateZoneData);
        const tailData = tail(heartRateZoneData);

        // TODO: Also 0-set the time
        const adjustedZoneData =
          tailData.length > 0
            ? tailData.map((zoneData, index) => {
                const previousData =
                  index > 0
                    ? tailData[index - 1]
                    : (headData as NonNullable<typeof headData>); // If we have tail, we have head!

                return {
                  ...zoneData,
                  distance: zoneData.distance - previousData.distance,
                  time:
                    zoneData.time -
                    (headData as NonNullable<typeof headData>).time,
                };
              })
            : tailData;

        return adjustedZoneData;
      } else {
        return null;
      }
    })
    .filter(
      (maybeData): maybeData is ActivityHeartRateZoneData => maybeData !== null,
    );

  console.log(
    "### zone 1",
    activitiesZoneData.map((zoneData) =>
      getAveragesForZone(zoneData, "ZONE_1"),
    ),
  );

  const zone2Averages = activitiesZoneData.map((zoneData) =>
    getAveragesForZone(zoneData, "ZONE_2"),
  );
  const zone3Averages = activitiesZoneData.map((zoneData) =>
    getAveragesForZone(zoneData, "ZONE_3"),
  );
  const zone4Averages = activitiesZoneData.map((zoneData) =>
    getAveragesForZone(zoneData, "ZONE_4"),
  );

  console.log("### zone 2", zone2Averages);
  console.log("### zone 3", zone3Averages);
  console.log("### zone 4", zone4Averages);
  console.log(
    "### zone 5",
    activitiesZoneData.map((zoneData) =>
      getAveragesForZone(zoneData, "ZONE_5"),
    ),
  );
  console.log("### activity zone data", activitiesZoneData);

  const lineChartData: ChartData<"line"> = {
    labels: sorted.map(({ activity }) =>
      new Date(activity.start_date).toDateString(),
    ),
    datasets: [
      {
        label: "Zone 2 speed",
        data: zone2Averages.map((x) => x.minPerKm),
      },
      {
        label: "Zone 3 speed",
        data: zone3Averages.map((x) => x.minPerKm),
      },
      {
        label: "Zone 4 speed",
        data: zone4Averages.map((x) => x.minPerKm),
      },
    ],
  };

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
      <Chart chartData={lineChartData} />
    </Grid>
  );
};

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
