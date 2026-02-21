import { useCallback, useEffect, useState } from "react";
import {
  BarChart, Bar,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis,
  Legend,
  PieChart, Pie, Cell
} from "recharts";

const StudentCharts = ({ fetchUploads }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theoryMarks, setTheoryMarks] = useState([]);
  const [practicalMarks, setPracticalMarks] = useState([]);
  const [faTheoryMarks, setFaTheoryMarks] = useState([]);
  const [faPracticalMarks, setFaPracticalMarks] = useState([]);
  const [saTheoryMarks, setSaTheoryMarks] = useState([]);
  const [saPracticalMarks, setSaPracticalMarks] = useState([]);
  const [isSmallViewport, setIsSmallViewport] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [pieData, setPieData] = useState([]);

  // Check viewport size
  useEffect(() => {
    const checkViewport = () => {
      setIsSmallViewport(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (fetchUploads) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const data = await fetchUploads();
          console.log("Charts data received:", data);
          setResponse(data);
        } catch (error) {
          console.error("Error fetching charts data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [fetchUploads]);

  // Filter theory subjects
  const filterTheoryMarks = useCallback(() => {
    if (!response?.data?.length) return [];

    console.log("Processing theory marks...");

    return response.data[0].subjects.filter(
      (item) => item.subject_type === "theory",
    );
  }, [response]);

  // Filter practical subjects
  const filterPracticalMarks = useCallback(() => {
    if (!response?.data?.length) return [];

    console.log("Processing practical marks...");

    return response.data[0].subjects.filter(
      (item) => item.subject_type === "practical",
    );
  }, [response]);

  // Create FA theory marks structure
  const createFaTheoryMarks = useCallback(() => {
    const theory = filterTheoryMarks();
    return theory.map((subject) => ({
      subject_name: subject.subject_name,
      fa_th_max: subject.fa_th_max || 0,
      fa_th_obt: subject.fa_th_obt || 0,
    }));
  }, [filterTheoryMarks]);

  // Create FA practical marks structure
  const createFaPracticalMarks = useCallback(() => {
    const allSubjects = [...filterTheoryMarks(), ...filterPracticalMarks()];
    return allSubjects.map((subject) => ({
      subject_name: subject.subject_name,
      fa_pr_max: subject.fa_pr_max || 0,
      fa_pr_obt: subject.fa_pr_obt || 0,
    }));
  }, [filterTheoryMarks, filterPracticalMarks]);

  // Create SA theory marks structure
  const createSaTheoryMarks = useCallback(() => {
    const theory = filterTheoryMarks();
    return theory.map((subject) => ({
      subject_name: subject.subject_name,
      sa_th_max: subject.sa_th_max || 0,
      sa_th_obt: subject.sa_th_obt || 0,
    }));
  }, [filterTheoryMarks]);

  // Create SA practical marks structure
  const createSaPracticalMarks = useCallback(() => {
    const allSubjects = [...filterTheoryMarks(), ...filterPracticalMarks()];
    return allSubjects.map((subject) => ({
      subject_name: subject.subject_name,
      sa_pr_max: subject.sa_pr_max || 0,
      sa_pr_obt: subject.sa_pr_obt || 0,
    }));
  }, [filterTheoryMarks, filterPracticalMarks]);

  useEffect(() => {
    const filtered = filterTheoryMarks();
    setTheoryMarks(filtered);
  }, [filterTheoryMarks]);

  useEffect(() => {
    const filtered = filterPracticalMarks();
    setPracticalMarks(filtered);
  }, [filterPracticalMarks]);

  useEffect(() => {
    const faTheory = createFaTheoryMarks();
    setFaTheoryMarks(faTheory);
  }, [createFaTheoryMarks]);

  useEffect(() => {
    const faPractical = createFaPracticalMarks();
    setFaPracticalMarks(faPractical);
  }, [createFaPracticalMarks]);

  useEffect(() => {
    const saTheory = createSaTheoryMarks();
    setSaTheoryMarks(saTheory);
  }, [createSaTheoryMarks]);

  useEffect(() => {
    const saPractical = createSaPracticalMarks();
    setSaPracticalMarks(saPractical);
  }, [createSaPracticalMarks]);

  // Calculate Y-axis domain for FA Theory
  const getFaTheoryYDomain = useCallback(() => {
    if (faTheoryMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...faTheoryMarks.map((item) =>
        Math.max(item.fa_th_max || 0, item.fa_th_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [faTheoryMarks]);

  // Calculate Y-axis domain for FA Practical
  const getFaPracticalYDomain = useCallback(() => {
    if (faPracticalMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...faPracticalMarks.map((item) =>
        Math.max(item.fa_pr_max || 0, item.fa_pr_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [faPracticalMarks]);

  // Calculate Y-axis domain for SA Theory
  const getSaTheoryYDomain = useCallback(() => {
    if (saTheoryMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...saTheoryMarks.map((item) =>
        Math.max(item.sa_th_max || 0, item.sa_th_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [saTheoryMarks]);

  // Calculate Y-axis domain for SA Practical
  const getSaPracticalYDomain = useCallback(() => {
    if (saPracticalMarks.length === 0) return [0, 100];
    const maxMark = Math.max(
      ...saPracticalMarks.map((item) =>
        Math.max(item.sa_pr_max || 0, item.sa_pr_obt || 0),
      ),
    );
    return [0, maxMark];
  }, [saPracticalMarks]);

  // Get all subjects for dropdown
  const getAllSubjects = useCallback(() => {
    if (!response?.data?.length) return [];
    return response.data[0].subjects.map(subject => subject.subject_name);
  }, [response]);

  // Calculate pie chart data for selected subject
  const calculatePieData = useCallback((subjectName) => {
    if (!response?.data?.length || !subjectName) return [];
    
    const subject = response.data[0].subjects.find(s => s.subject_name === subjectName);
    if (!subject) return [];

    const data = [];
    
    // FA Theory
    if (subject.fa_th_max && subject.fa_th_obt) {
      const percentage = ((subject.fa_th_obt / subject.fa_th_max) * 100).toFixed(1);
      data.push({
        name: 'FA Theory',
        value: parseFloat(percentage),
        obtained: subject.fa_th_obt,
        max: subject.fa_th_max
      });
    }
    
    // FA Practical
    if (subject.fa_pr_max && subject.fa_pr_obt) {
      const percentage = ((subject.fa_pr_obt / subject.fa_pr_max) * 100).toFixed(1);
      data.push({
        name: 'FA Practical',
        value: parseFloat(percentage),
        obtained: subject.fa_pr_obt,
        max: subject.fa_pr_max
      });
    }
    
    // SA Theory
    if (subject.sa_th_max && subject.sa_th_obt) {
      const percentage = ((subject.sa_th_obt / subject.sa_th_max) * 100).toFixed(1);
      data.push({
        name: 'SA Theory',
        value: parseFloat(percentage),
        obtained: subject.sa_th_obt,
        max: subject.sa_th_max
      });
    }
    
    // SA Practical
    if (subject.sa_pr_max && subject.sa_pr_obt) {
      const percentage = ((subject.sa_pr_obt / subject.sa_pr_max) * 100).toFixed(1);
      data.push({
        name: 'SA Practical',
        value: parseFloat(percentage),
        obtained: subject.sa_pr_obt,
        max: subject.sa_pr_max
      });
    }
    
    return data;
  }, [response]);

  // Handle subject selection
  const handleSubjectChange = useCallback((e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    const data = calculatePieData(subject);
    setPieData(data);
  }, [calculatePieData]);

  // Initialize pie data when response changes
  useEffect(() => {
    const subjects = getAllSubjects();
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
      const data = calculatePieData(subjects[0]);
      setPieData(data);
    }
  }, [response, getAllSubjects, calculatePieData, selectedSubject]);

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

  console.log("Theory Marks:", theoryMarks);
  console.log("Practical Marks:", practicalMarks);
  console.log("FA Theory Marks:", faTheoryMarks);
  console.log("FA Practical Marks:", faPracticalMarks);
  console.log("SA Theory Marks:", saTheoryMarks);
  console.log("SA Practical Marks:", saPracticalMarks);

  return (
    <>
      {loading && <p>Loading...</p>}
      
      {/* Subject Performance Pie Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
        <h3 className="text-lg font-bold mb-4">Subject Performance Analysis</h3>
        
        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Subject:</label>
          <select 
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold"
          >
            {getAllSubjects().map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'][index % 4]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}%`,
                  `${props.payload.obtained}/${props.payload.max} marks`,
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        
        {pieData.length === 0 && selectedSubject && (
          <div className="text-center py-8 text-gray-500">
            No assessment data available for {selectedSubject}
          </div>
        )}
      </div>

      {/* FA Theory Marks Chart */}
      {/* FA Theory Marks Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-4">FA Theory Marks</h3>

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
      </div>
      {/* FA Practical Marks Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-4">FA Practical Marks</h3>
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
      </div>

      {/* SA Theory Marks Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-4">SA Theory Marks</h3>
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
      </div>

      {/* SA Practical Marks Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-lg font-bold mb-4">SA Practical Marks</h3>
        <ResponsiveContainer width="100%" height={chartConfig.height}>
          <BarChart data={saPracticalMarks} margin={chartConfig.margin}>
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
              domain={getSaPracticalYDomain()}
              tick={{ fontSize: 8, fill: "#333" }}
              width={chartConfig.yAxisWidth}
            />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "10px" }} iconSize={8} />
            <Bar
              dataKey="sa_pr_obt"
              fill="#82ca9d"
              name="Obtained Marks"
              label={{ position: "top", fontSize: 8, fill: "#666" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default StudentCharts;
