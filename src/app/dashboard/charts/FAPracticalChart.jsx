import { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar,
  Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis,
  Legend
} from "recharts";
import { api } from "../../config/axiosSetup";
import { getCokie } from "../../utils/utils";

const FAPracticalChart = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [faPracticalMarks, setFaPracticalMarks] = useState([]);
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

  const filterPracticalMarks = useCallback(() => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects.filter(item => item.subject_type === "practical");
  }, [response]);

  const createFaPracticalMarks = useCallback(() => {
    const allSubjects = [...filterTheoryMarks(), ...filterPracticalMarks()];
    return allSubjects.map(subject => ({
      subject_name: subject.subject_name,
      fa_pr_max: subject.fa_pr_max || 0,
      fa_pr_obt: subject.fa_pr_obt || 0
    }));
  }, [filterTheoryMarks, filterPracticalMarks]);

  useEffect(() => {
    const faPractical = createFaPracticalMarks();
    setFaPracticalMarks(faPractical);
  }, [createFaPracticalMarks]);

  const getFaPracticalYDomain = useCallback(() => {
    if (faPracticalMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...faPracticalMarks.map((item) =>
        Math.max(item.fa_pr_max || 0, item.fa_pr_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [faPracticalMarks]);

  const getChartConfig = useCallback(() => {
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

  const chartConfig = getChartConfig();

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-4">FA Practical Marks</h3>
      {loading && <p>Loading...</p>}
      {!loading && (
        <ResponsiveContainer width="100%" height={chartConfig.height}>
          <BarChart data={faPracticalMarks} margin={chartConfig.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="subject_name"
              angle={chartConfig.xAxisAngle}
              textAnchor={chartConfig.xAxisAngle ? "end" : "middle"}
              height={chartConfig.xAxisHeight}
              interval={0}
              tick={{ fontSize: 8, fill: "#333" }}
            />
            <YAxis
              domain={getFaPracticalYDomain()}
              tick={{ fontSize: 8, fill: "#333" }}
              width={chartConfig.yAxisWidth}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "10px" }} iconSize={8} />
            <Bar
              dataKey="fa_pr_obt"
              fill="#82ca9d"
              name="Obtained Marks"
              label={{ position: "top", fontSize: 8, fill: "#666" }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default FAPracticalChart;
