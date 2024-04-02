
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const LineChart = ({ data, width , height }) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const lineSeriesRef = useRef(null);

  useEffect(() => {
    chartInstanceRef.current = createChart(chartContainerRef.current, {
      width: width,
      height: height,
    });
    chartInstanceRef.current.applyOptions({
      layout: {
        background: {
          color: "#f1f6f9",
        },
      },
      lineSeries: {
        color: "#007bff",
        lineWidth: 2,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    lineSeriesRef.current = chartInstanceRef.current.addLineSeries();

    if (lineSeriesRef.current) {
      const formattedData = data.map(({ time, price }) => ({
        time: time,
        value: price,
      }));
      lineSeriesRef.current.setData(formattedData);
    }
    return () => {
      chartInstanceRef.current.remove();
    };
  }, [data, width]);


  return <div ref={chartContainerRef} />;
};

export default LineChart;
