import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandlestickChart = ({ data, width, height }) => {
  const chartContainerRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const candlestickSeriesRef = useRef(null);

  useEffect(() => {
    if (!chartInstanceRef.current) {
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
      });

      candlestickSeriesRef.current =
        chartInstanceRef.current.addCandlestickSeries();

      return () => {
        //chartInstanceRef.current.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(data);
    }
  }, [data]);

  useEffect(() => {
    // Handle chart resizing here
    if (chartInstanceRef.current) {
      chartInstanceRef.current.resize(width, height);
    }
  }, [width]);

  return <div ref={chartContainerRef} />;
};

export default CandlestickChart;
