import { Chart as ChartJs, ChartData } from "chart.js/auto";
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
      console.log("RenderChart", chartRef, chartData);
      chart = new ChartJs(chartRef, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          interaction: {
            mode: "index",
            intersect: false,
          },
          // stacked: false,
          scales: {
            yLeft: {
              type: "linear",
              display: true,
              position: "left",
            },
            yRight: {
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
        width="400"
        height="400"
      ></canvas>
      {canvasRef && <RenderChart chartRef={canvasRef} chartData={chartData} />}
    </>
  );
};
