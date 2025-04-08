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

const segmentEfforts2LineChartData = (
  data: SegmentEffort[],
): ChartData<"line"> => {
  const labels: ChartData<"line">["labels"] = data.map((activity) =>
    activity.start_date ? new Date(activity.start_date).toDateString() : "-",
  );

  const minPerKmList: (number | null)[] = data.map((activity) => {
    const meters = activity.distance;
    const time = activity.elapsed_time;

    if (!meters || !time) return null;

    const km = meters / 1000;
    const minutes = time / 60;

    return minutes / km;
  });

  const cadenceList: (number | null)[] = data.map((activity) => {
    const cadence = activity.average_cadence || null;

    return cadence;
  });

  const datasets: ChartData<"line">["datasets"] = [
    // {
    //   label: "Cadence",
    //   data: data.map((activity) => Number(activity.average_cadence) * 2),
    // },
    {
      label: "Heart Rate",
      yAxisID: "yLeft",
      data: data.map((activity) => activity.average_heartrate || 0),
    },
    // {
    //   label: "Distance (meters)",
    //   data: data.map((activity) => activity.distance || 0),
    // },
    // {
    //   label: "Time (seconds)",
    //   data: data.map((activity) => activity.elapsed_time || 0),
    // },
    // {
    //   label: "min / km",
    //   data: data.map((activity) => {
    //     const meters = activity.distance || 0;
    //     const time = activity.elapsed_time || 0;

    //     const km = meters / 1000;
    //     const minutes = time / 60;

    //     return minutes / km;
    //   }),
    // },
    {
      label: "cadence / pace",
      yAxisID: "yRight",
      data: zipWith(minPerKmList, cadenceList, (pace, cadence) =>
        pace && cadence ? { pace, cadence } : null,
      )
        .filter(
          (item): item is { pace: number; cadence: number } => item !== null,
        )
        .map(({ pace, cadence }) => {
          return cadence / pace;
        }),
    },
    {
      label: "m / heartbeat",
      yAxisID: "yRight",
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
    segmentEfforts2LineChartData,
  );

  return (
    <div>
      <h3>Segment Efforts</h3>
      <h4>{data?.[0].name}</h4>
      <Chart chartData={chartData} />
    </div>
  );
};
