import { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar,
  Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis,
  Legend
} from "recharts";
import { useChartData } from "./useChartData";

const FATheoryChart = ({ userId, role = "student", title = "FA Theory Marks" }) => {
  const [faTheoryMarks, setFaTheoryMarks] = useState([]);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const { response, loading, filterSubjectsByType } = useChartData(userId, role);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsSmallViewport(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);
    
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Create FA theory marks structure
  const createFaTheoryMarks = useCallback(() => {
    const theory = filterSubjectsByType("theory");
    return theory
      .filter(subject => {
        // Filter out subjects where both obtained and max marks are 0 or null
        const obtained = subject.fa_th_obt || 0;
        const max = subject.fa_th_max || 0;
        return obtained > 0 || max > 0;
      })
      .map(subject => ({
        subject_name: subject.subject_name,
        fa_th_max: subject.fa_th_max || 0,
        fa_th_obt: subject.fa_th_obt || 0
      }));
  }, [filterSubjectsByType]);

  useEffect(() => {
    const faTheory = createFaTheoryMarks();
    setFaTheoryMarks(faTheory);
  }, [createFaTheoryMarks]);

  // Calculate Y-axis domain
  const getFaTheoryYDomain = useCallback(() => {
    if (faTheoryMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...faTheoryMarks.map((item) =>
        Math.max(item.fa_th_max || 0, item.fa_th_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [faTheoryMarks]);

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

  const chartConfig = getChartConfig();

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      {loading && <p>Loading...</p>}
      {!loading && (
        <ResponsiveContainer width="100%" height={chartConfig.height}>
          <BarChart data={faTheoryMarks} margin={chartConfig.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="subject_name"
              angle={chartConfig.xAxisAngle}
              textAnchor={chartConfig.xAxisAngle ? "end" : "middle"}
              height={chartConfig.xAxisHeight}
              interval={0}
              tick={{ fontSize: chartConfig.xAxisFontSize, fill: "#333" }}
            />
            <YAxis
              domain={getFaTheoryYDomain()}
              tick={{ fontSize: chartConfig.yAxisFontSize, fill: "#333" }}
              width={chartConfig.yAxisWidth}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: chartConfig.legendFontSize }}
              iconSize={chartConfig.legendIconSize}
            />
            <Bar
              dataKey="fa_th_obt"
              fill="#82ca9d"
              name="Obtained Marks"
              label={{
                position: "top",
                fontSize: chartConfig.labelFontSize,
                fill: "#666",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FATheoryChart;
