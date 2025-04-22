import { ChartData } from "chart.js";
import { zipWith } from "lodash";
import { AppRouterResponses } from "~/trpc/routers/_app";
import { RequireKeys } from "~/types/utils";
import { meterPerSecondToMinPerKm } from "./math";
import { ActivityWithStream } from "~/components/App";

// TODO: Should this be NonNullable? Also create some tests for the endpoint perhaps? To validate these
export type ActivityDetailed = NonNullable<
  AppRouterResponses["getActivities"]
>[0] & {
  average_heartrate: number;
  average_cadence: number;
};

export const sortByAscDate = (activitiesWithStream: ActivityWithStream[]) =>
  activitiesWithStream
    .filter(
      (
        activityWithStream,
      ): activityWithStream is {
        activity: RequireKeys<ActivityWithStream["activity"], "start_date">;
      } & Pick<ActivityWithStream, "stream"> =>
        activityWithStream.activity.start_date !== null,
    )
    .sort(
      ({ activity: aa }, { activity: ab }) =>
        new Date(aa.start_date).getTime() - new Date(ab.start_date).getTime(),
    );

export const withRequiredValues = (segmentEfforts: ActivityDetailed[]) =>
  segmentEfforts.filter(
    ({ average_heartrate, average_cadence }) =>
      (average_heartrate || 0) > 0 && (average_cadence || 0) > 0,
  );

const DataSetLabel = {
  cadence: "Cadence",
  heartRate: "Heart Rate",
  meterPerSecond: "pace (m / s)",
  minPerKm: "pace (min / km)",
  cadencePerPace: "cadence / pace",
  meterPerHeartBeat: "m / heartbeat",
};

export const activities2LineChartData = (
  data: ActivityDetailed[],
): ChartData<"line"> => {
  const labels: ChartData<"line">["labels"] = data.map((activity) =>
    activity.start_date ? new Date(activity.start_date).toDateString() : "-",
  );

  const meterPerSecond: (number | null)[] = data.map((activity) => {
    const meters = activity.distance;
    const seconds = activity.elapsed_time;

    if (!meters || !seconds) return null;

    return meters / seconds;
  });

  const minPerKm: (number | null)[] = data.map((activity) => {
    const meterPerSecond = activity.average_speed;

    return meterPerSecond ? meterPerSecondToMinPerKm(meterPerSecond) : null;
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
      label: DataSetLabel.minPerKm,
      yAxisID: "yLeft3",
      data: minPerKm,
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
      hidden: true,
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
        const meterPerSecond = activity.average_speed || 0;
        const meterPerMinute = meterPerSecond * 60;
        const heartratePerMinute = activity.average_heartrate || 0;

        return meterPerMinute / heartratePerMinute;
      }),
    },
  ];

  return {
    labels,
    datasets,
  };
};
