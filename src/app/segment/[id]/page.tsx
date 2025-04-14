"use client";
import { useQuery } from "@tanstack/react-query";
import { ChartData } from "chart.js";
import { usePathname } from "next/navigation";
import { Chart } from "~/components/Chart";
import { useTRPC } from "~/trpc/client";
import { AppRouterResponses } from "~/trpc/routers/_app";
import { RequireKeys } from "~/types/utils";
import { pipe } from "fp-ts/lib/function";
import { zipWith } from "fp-ts/lib/Array";
import { uniqBy } from "lodash";
import { Grid } from "@mui/material";

type SegmentEffort = NonNullable<AppRouterResponses["getSegmentEfforts"]>[0];

const sortByAscDate = (segmentEfforts: SegmentEffort[]) =>
  segmentEfforts
    .filter(
      (
        segmentEffort,
      ): segmentEffort is RequireKeys<SegmentEffort, "start_date"> =>
        segmentEffort.start_date !== null,
    )
    .sort(
      ({ start_date: sdA }, { start_date: sdB }) =>
        new Date(sdA).getTime() - new Date(sdB).getTime(),
    );

const withRequiredValues = (segmentEfforts: SegmentEffort[]) =>
  segmentEfforts.filter(
    ({ average_heartrate, average_cadence }) =>
      (average_heartrate || 0) > 0 && (average_cadence || 0) > 0,
  );

const noDuplicatesInSameDay = (segmentEfforts: SegmentEffort[]) =>
  uniqBy(segmentEfforts, ({ start_date }) => {
    if (!start_date) return null;

    const dayInMs = 1000 * 60 * 60 * 24;
    const day = Math.floor(new Date(start_date).getTime() / dayInMs);

    console.log("### noDuplicatesInSameDay", day);

    // TODO: See if I can fetch each segment data detailed when hovering
    // display this in chart under main chart
    // can heavily cache in Redis!

    return day;
  });

const DataSetLabel = {
  cadence: "Cadence",
  heartRate: "Heart Rate",
  meterPerSecond: "pace (m / s)",
  cadencePerPace: "cadence / pace",
  meterPerHeartBeat: "m / heartbeat",
};

const segmentEfforts2LineChartData = (
  data: SegmentEffort[],
): ChartData<"line"> => {
  const labels: ChartData<"line">["labels"] = data.map((activity) =>
    activity.start_date ? new Date(activity.start_date).toDateString() : "-",
  );

  console.log("### segmentEfforts2LineChartData", data);

  const meterPerSecond: (number | null)[] = data.map((activity) => {
    const meters = activity.distance;
    const seconds = activity.elapsed_time;

    if (!meters || !seconds) return null;

    return meters / seconds;
  });

  const minPerKm: (number | null)[] = data.map((activity) => {
    const meters = activity.distance;
    const seconds = activity.elapsed_time;

    if (!meters || !seconds) return null;

    const km = meters / 1000;
    const minutes = seconds / 60;

    return minutes / km;
  });

  const cadenceList: (number | null)[] = data.map((activity) => {
    const cadence = activity.average_cadence || null;

    return cadence;
  });

  const datasets: ChartData<"line">["datasets"] = [
    {
      label: DataSetLabel.cadence,
      data: data.map((activity) => Number(activity.average_cadence) * 2),
      yAxisID: "yLeft1",
    },
    {
      label: DataSetLabel.heartRate,
      data: data.map((activity) => activity.average_heartrate || 0),
      yAxisID: "yLeft2",
    },
    // {
    //   label: "Distance (meters)",
    //   data: data.map((activity) => activity.distance || 0),
    // },
    {
      label: DataSetLabel.meterPerSecond,
      yAxisID: "yLeft3",
      data: meterPerSecond,
    },
    // {
    //   label: DataSetLabel.cadencePerPace,
    //   // hidden: !dataSetVisibility.cadencePerPace,
    //   yAxisID: "yLeft1",
    //   data: zipWith(meterPerSecond, cadenceList, (pace, cadence) =>
    //     pace && cadence ? { pace, cadence } : null,
    //   )
    //     .filter(
    //       (item): item is { pace: number; cadence: number } => item !== null,
    //     )
    //     .map(({ pace, cadence }) => {
    //       return cadence / pace;
    //     }),
    // },
    {
      label: "cadence / min / km",
      yAxisID: "yRight1",
      data: zipWith(minPerKm, cadenceList, (minPerKm, cadence) =>
        minPerKm && cadence ? { minPerKm, cadence } : null,
      )
        .filter(
          (item): item is { minPerKm: number; cadence: number } =>
            item !== null,
        )
        .map(({ minPerKm, cadence }) => {
          return cadence / minPerKm;
        }),
    },
    {
      label: DataSetLabel.meterPerHeartBeat,
      yAxisID: "yRight2",
      hidden: true,
      data: data.map((activity) => {
        const meters = activity.distance || 0;
        const heartrate = activity.average_heartrate || 0;

        return meters / heartrate;
      }),
    },
  ];

  return {
    labels,
    datasets,
  };
};

export default () => {
  const trpc = useTRPC();

  const pathname = usePathname();

  const [_empty, _resource, segmentId] = pathname.split("/");

  const { data } = useQuery(
    trpc.getSegmentEfforts.queryOptions({ segmentId: Number(segmentId) }),
  );

  const segmentEfforts = data || [];

  const chartData = pipe(
    segmentEfforts,
    sortByAscDate,
    withRequiredValues,
    noDuplicatesInSameDay,
    segmentEfforts2LineChartData,
  );

  return (
    <Grid>
      <h3>Segment Efforts</h3>
      <h4>{data?.[0]?.name || "-"}</h4>
      <Grid maxWidth={800}>
        <Chart chartData={chartData} />
      </Grid>
    </Grid>
  );
};
