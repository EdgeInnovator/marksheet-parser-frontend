import { useCallback, useEffect, useState } from "react";
import {
  PieChart as RechartsPieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import { api } from "../../config/axiosSetup";
import { getCokie } from "../../utils/utils";

const SubjectPieChart = ({ userId, role = "student", title = "Subject Performance Analysis" }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [pieData, setPieData] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

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

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      
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
          <RechartsPieChart>
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
          </RechartsPieChart>
        </ResponsiveContainer>
      )}
      
      {pieData.length === 0 && selectedSubject && (
        <div className="text-center py-8 text-gray-500">
          No assessment data available for {selectedSubject}
        </div>
      )}
    </div>
  );
};

export default SubjectPieChart;
