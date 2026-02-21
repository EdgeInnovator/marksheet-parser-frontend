import { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar,
  Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis,
  Legend
} from "recharts";
import { api } from "../../config/axiosSetup";
import { getCokie } from "../../utils/utils";

const SATheoryChart = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saTheoryMarks, setSaTheoryMarks] = useState([]);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const checkViewport = () => {
      setIsSmallViewport(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener("resize", checkViewport);
    
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(getCokie("ACTIVE_USER"));
    setActiveUser(userData.id);
  }, []);

  useEffect(() => {
    if (activeUser) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/marksheet/exams?user_id=${activeUser}`);
          setResponse(response.data);
        } catch (error) {
          console.error("Error fetching charts data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [activeUser]);

  const filterTheoryMarks = useCallback(() => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects.filter(item => item.subject_type === "theory");
  }, [response]);

  const createSaTheoryMarks = useCallback(() => {
    const theory = filterTheoryMarks();
    return theory.map(subject => ({
      subject_name: subject.subject_name,
      sa_th_max: subject.sa_th_max || 0,
      sa_th_obt: subject.sa_th_obt || 0
    }));
  }, [filterTheoryMarks]);

  useEffect(() => {
    const saTheory = createSaTheoryMarks();
    setSaTheoryMarks(saTheory);
  }, [createSaTheoryMarks]);

  const getSaTheoryYDomain = useCallback(() => {
    if (saTheoryMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...saTheoryMarks.map((item) =>
        Math.max(item.sa_th_max || 0, item.sa_th_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [saTheoryMarks]);

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
      <h3 className="text-lg font-bold mb-4">SA Theory Marks</h3>
      {loading && <p>Loading...</p>}
      {!loading && (
        <ResponsiveContainer width="100%" height={chartConfig.height}>
          <BarChart data={saTheoryMarks} margin={chartConfig.margin}>
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
              domain={getSaTheoryYDomain()}
              tick={{ fontSize: chartConfig.yAxisFontSize, fill: "#333" }}
              width={chartConfig.yAxisWidth}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{ fontSize: chartConfig.legendFontSize }}
              iconSize={chartConfig.legendIconSize}
            />
            <Bar
              dataKey="sa_th_obt"
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

export default SATheoryChart;
