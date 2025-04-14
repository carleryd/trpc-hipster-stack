import {
  Chart as ChartJs,
  ChartData,
  ChartEvent,
  ActiveElement,
} from "chart.js/auto";
import { useEffect, useState } from "react";

const RenderChart = ({
  chartRef,
  chartData,
}: {
  chartRef: HTMLCanvasElement;
  chartData: ChartData<"line">;
}) => {
  useEffect(() => {
    let chart: ChartJs | null = null;

    if (chartRef && chartData) {
      chart = new ChartJs(chartRef, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          onClick: (event: ChartEvent, elements: ActiveElement[]) => {
            const index = elements[0]?.index || 0;
            const data = chartData.datasets[index];
          },
          // stacked: false,
          scales: {
            yLeft1: {
              type: "linear",
              display: true,
              position: "left",

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
            yLeft2: {
              type: "linear",
              display: true,
              position: "left",

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
            yLeft3: {
              type: "linear",
              display: true,
              position: "left",

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
            yRight1: {
              type: "linear",
              display: true,
              position: "right",

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
            yRight2: {
              type: "linear",
              display: true,
              position: "right",

              // grid line settings
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              },
            },
          },
        },
      });
    }

    return () => {
      console.log("destroying chart");
      chart?.destroy();
    };
  }, [chartRef, chartData]);

  return null;
};

export const Chart = ({ chartData }: { chartData: ChartData<"line"> }) => {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);

  return (
    <>
      <canvas
        id="lineChart"
        ref={setCanvasRef}
        width="600"
        height="400"
      ></canvas>
      {canvasRef && <RenderChart chartRef={canvasRef} chartData={chartData} />}
    </>
  );
};
