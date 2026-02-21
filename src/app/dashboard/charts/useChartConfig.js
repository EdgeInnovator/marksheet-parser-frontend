import { useCallback, useEffect, useState } from "react";

export const useChartConfig = () => {
  const [isSmallViewport, setIsSmallViewport] = useState(false);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsSmallViewport(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);
    
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Responsive chart configuration
  const getChartConfig = useCallback(() => {
    if (isSmallViewport) {
      return {
        height: 400,
        margin: { top: 15, right: 15, bottom: 50, left: 30 },
        xAxisAngle: -45,
        xAxisHeight: 100,
        xAxisFontSize: 10,
        yAxisFontSize: 10,
        yAxisWidth: 35,
        legendFontSize: "12px",
        legendIconSize: 10,
        labelFontSize: 8,
      };
    } else {
      return {
        height: 300,
        margin: { top: 15, right: 15, bottom: 5, left: 5 },
        xAxisAngle: 0,
        xAxisHeight: 60,
        xAxisFontSize: 12,
        yAxisFontSize: 12,
        yAxisWidth: 25,
        legendFontSize: "14px",
        legendIconSize: 12,
        labelFontSize: 10,
      };
    }
  }, [isSmallViewport]);

  // Practical chart config (smaller fonts)
  const getPracticalChartConfig = useCallback(() => {
    if (isSmallViewport) {
      return {
        height: 400,
        margin: { top: 15, right: 15, bottom: 50, left: 30 },
        xAxisAngle: -45,
        xAxisHeight: 100,
        xAxisFontSize: 8,
        yAxisFontSize: 8,
        yAxisWidth: 35,
        legendFontSize: "10px",
        legendIconSize: 8,
        labelFontSize: 8,
      };
    } else {
      return {
        height: 300,
        margin: { top: 15, right: 15, bottom: 5, left: 5 },
        xAxisAngle: 0,
        xAxisHeight: 60,
        xAxisFontSize: 12,
        yAxisFontSize: 12,
        yAxisWidth: 25,
        legendFontSize: "14px",
        legendIconSize: 12,
        labelFontSize: 10,
      };
    }
  }, [isSmallViewport]);

  return {
    isSmallViewport,
    getChartConfig,
    getPracticalChartConfig
  };
};
