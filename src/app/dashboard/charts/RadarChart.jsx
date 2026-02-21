import { useCallback, useEffect, useState } from "react";
import {
  RadarChart as RechartsRadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import { api } from "../../config/axiosSetup";
import { getCokie } from "../../utils/utils";

const PerformanceRadarChart = ({ userId, role = "student", title = "Overall Performance Analysis" }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radarData, setRadarData] = useState([]);
  const [radarView, setRadarView] = useState('overall');
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

  // Calculate radar chart data for different views
  const calculateRadarData = useCallback((view = 'overall') => {
    if (!response?.data?.length) return [];
    
    const subjects = response.data[0].subjects;
    const radarData = [];
    
    let filteredSubjects = subjects;
    
    // Filter subjects based on view
    if (view === 'theory') {
      filteredSubjects = subjects.filter(subject => subject.subject_type === 'theory');
    } else if (view === 'practical') {
      filteredSubjects = subjects.filter(subject => subject.subject_type === 'practical');
    }
    
    // Create radar data for each subject
    filteredSubjects.forEach(subject => {
      const subjectData = {
        subject: subject.subject_name,
      };
      
      // Add assessment percentages if data exists
      if (subject.fa_th_max && subject.fa_th_obt) {
        subjectData.faTheory = Math.round((subject.fa_th_obt / subject.fa_th_max) * 100);
      }
      
      if (subject.fa_pr_max && subject.fa_pr_obt) {
        subjectData.faPractical = Math.round((subject.fa_pr_obt / subject.fa_pr_max) * 100);
      }
      
      if (subject.sa_th_max && subject.sa_th_obt) {
        subjectData.saTheory = Math.round((subject.sa_th_obt / subject.sa_th_max) * 100);
      }
      
      if (subject.sa_pr_max && subject.sa_pr_obt) {
        subjectData.saPractical = Math.round((subject.sa_pr_obt / subject.sa_pr_max) * 100);
      }
      
      // Only include subject if it has at least one assessment
      const hasData = Object.keys(subjectData).some(key => key !== 'subject' && subjectData[key] !== undefined);
      if (hasData) {
        radarData.push(subjectData);
      }
    });
    
    return radarData;
  }, [response]);

  // Handle radar view change
  const handleRadarViewChange = useCallback((e) => {
    const view = e.target.value;
    setRadarView(view);
    const data = calculateRadarData(view);
    setRadarData(data);
  }, [calculateRadarData]);

  // Initialize radar data when response changes
  useEffect(() => {
    const data = calculateRadarData(radarView);
    setRadarData(data);
  }, [response, calculateRadarData, radarView]);

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      
      {/* Radar View Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Select View:</label>
        <select 
          value={radarView}
          onChange={handleRadarViewChange}
          className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold"
        >
          <option value="overall">All Subjects</option>
          <option value="theory">Theory Subjects Only</option>
          <option value="practical">Practical Subjects Only</option>
        </select>
      </div>
      
      {radarData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <RechartsRadarChart data={radarData}>
            <PolarGrid stroke="#ddd" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: '#333' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#666' }}
            />
            
            {/* FA Theory */}
            <Radar 
              name="FA Theory" 
              dataKey="faTheory" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            {/* FA Practical */}
            <Radar 
              name="FA Practical" 
              dataKey="faPractical" 
              stroke="#82ca9d" 
              fill="#82ca9d" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            {/* SA Theory */}
            <Radar 
              name="SA Theory" 
              dataKey="saTheory" 
              stroke="#ffc658" 
              fill="#ffc658" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            {/* SA Practical */}
            <Radar 
              name="SA Practical" 
              dataKey="saPractical" 
              stroke="#ff7c7c" 
              fill="#ff7c7c" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            
            <Tooltip 
              formatter={(value, name) => [`${value}%`, name]}
            />
            <Legend />
          </RechartsRadarChart>
        </ResponsiveContainer>
      )}
      
      {radarData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No performance data available for radar chart
        </div>
      )}
    </div>
  );
};

export default PerformanceRadarChart;
