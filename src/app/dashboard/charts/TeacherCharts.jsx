import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { api } from '../../config/axiosSetup';
import { handleApiError, validateStudentsResponse, formatStudentOptions } from '../../utils/apiHelpers';
import { getCokie } from '../../utils/utils';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

export default function TeacherCharts({ userId }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [pieData, setPieData] = useState([]);
  const [radarData, setRadarData] = useState([]);
  const [radarView, setRadarView] = useState('overall');
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch students for teacher
  useEffect(() => {
    // Security check - ensure this is a staff user
    const activeUser = getCokie('ACTIVE_USER');
    const userData = activeUser ? JSON.parse(activeUser) : null;
    
    if (!userData || userData.role !== 'staff') {
      console.error('Non-staff user attempted to access teacher charts');
      setError('Access Denied: Staff only');
      return;
    }

    if (userId) {
      const fetchStudents = async () => {
        try {
          console.log("Fetching students for teacher:", userId);
          // Use the new detailed teacher students endpoint
          const response = await api.get(`/marksheet/teacher/students/${userId}`);
          console.log("Students API response:", response);
          console.log("Students response data:", response.data);
          
          if (response.data?.students) {
            const students = response.data.students;
            console.log("Students data received:", students);
            console.log("Total students:", response.data.total_students);
            console.log("Registered count:", response.data.registered_count);
            console.log("Unregistered count:", response.data.unregistered_count);
            setStudents(students);
            
            // Auto-select first student if available
            if (students.length > 0) {
              const firstStudentName = students[0].name;
              setSelectedStudent(firstStudentName);
              console.log("Auto-selected student:", firstStudentName);
            } else {
              console.log("No students found in response");
              setSelectedStudent('');
            }
          } else {
            console.error("No students data in response");
            console.log("Full response structure:", response.data);
            setStudents([]);
            setSelectedStudent('');
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
          setSelectedStudent('');
        }
      };

      fetchStudents();
    }
  }, [userId]);

  // Fetch student data when student changes
  useEffect(() => {
    if (selectedStudent) {
      const fetchStudentData = async () => {
        try {
          setLoading(true);
          console.log("Fetching data for student:", selectedStudent);
          
          // Find student ID from students array
          const student = students.find(s => s.name === selectedStudent);
          if (!student) {
            console.error("Student not found in list");
            return;
          }
          
          // Use the new individual student data endpoint
          if (!student.id || student.id === 'teacher') {
            console.error('Invalid student ID:', student.id);
            return;
          }
          
          const response = await api.get(`/marksheet/${student.id}`);
          console.log("Student data response:", response);
          
          if (response.data?.marksheets) {
            setStudentData(response.data);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [selectedStudent, students]);

  // Get all subjects from student data
  const getAllSubjects = useCallback(() => {
    if (!studentData?.marksheets?.length) return [];
    
    const subjects = new Set();
    studentData.marksheets.forEach(marksheet => {
      marksheet.subjects.forEach(subject => {
        subjects.add(subject.subject_name);
      });
    });
    
    return Array.from(subjects);
  }, [studentData]);

  // Calculate pie chart data for a subject
  const calculatePieData = useCallback((subject) => {
    if (!studentData?.marksheets?.length) return [];
    
    const data = [];
    
    studentData.marksheets.forEach(marksheet => {
      const subjectData = marksheet.subjects.find(s => s.subject_name === subject);
      if (subjectData) {
        // FA Theory
        if (subjectData.fa_theory_max > 0) {
          const percentage = (subjectData.fa_theory_obt / subjectData.fa_theory_max) * 100;
          data.push({
            name: 'FA Theory',
            value: parseFloat(percentage.toFixed(2)),
            obtained: subjectData.fa_theory_obt,
            max: subjectData.fa_theory_max
          });
        }
        
        // FA Practical
        if (subjectData.fa_practical_max > 0) {
          const percentage = (subjectData.fa_practical_obt / subjectData.fa_practical_max) * 100;
          data.push({
            name: 'FA Practical',
            value: parseFloat(percentage.toFixed(2)),
            obtained: subjectData.fa_practical_obt,
            max: subjectData.fa_practical_max
          });
        }
        
        // SA Theory
        if (subjectData.sa_theory_max > 0) {
          const percentage = (subjectData.sa_theory_obt / subjectData.sa_theory_max) * 100;
          data.push({
            name: 'SA Theory',
            value: parseFloat(percentage.toFixed(2)),
            obtained: subjectData.sa_theory_obt,
            max: subjectData.sa_theory_max
          });
        }
        
        // SA Practical
        if (subjectData.sa_practical_max > 0) {
          const percentage = (subjectData.sa_practical_obt / subjectData.sa_practical_max) * 100;
          data.push({
            name: 'SA Practical',
            value: parseFloat(percentage.toFixed(2)),
            obtained: subjectData.sa_practical_obt,
            max: subjectData.sa_practical_max
          });
        }
      }
    });
    
    return data;
  }, [studentData]);

  // Calculate radar chart data
  const calculateRadarData = useCallback((view = 'overall') => {
    if (!studentData?.marksheets?.length) return [];
    
    const subjects = getAllSubjects();
    const radarData = [];
    
    subjects.forEach(subjectName => {
      let faTheoryTotal = 0, faTheoryMax = 0;
      let faPracticalTotal = 0, faPracticalMax = 0;
      let saTheoryTotal = 0, saTheoryMax = 0;
      let saPracticalTotal = 0, saPracticalMax = 0;
      let count = 0;
      
      studentData.marksheets.forEach(marksheet => {
        const subject = marksheet.subjects.find(s => s.subject_name === subjectName);
        if (subject) {
          faTheoryTotal += subject.fa_theory_obt || 0;
          faTheoryMax += subject.fa_theory_max || 0;
          faPracticalTotal += subject.fa_practical_obt || 0;
          faPracticalMax += subject.fa_practical_max || 0;
          saTheoryTotal += subject.sa_theory_obt || 0;
          saTheoryMax += subject.sa_theory_max || 0;
          saPracticalTotal += subject.sa_practical_obt || 0;
          saPracticalMax += subject.sa_practical_max || 0;
          count++;
        }
      });
      
      if (count > 0) {
        const dataPoint = {
          subject: subjectName,
          faTheory: faTheoryMax > 0 ? parseFloat(((faTheoryTotal / faTheoryMax) * 100).toFixed(2)) : 0,
          faPractical: faPracticalMax > 0 ? parseFloat(((faPracticalTotal / faPracticalMax) * 100).toFixed(2)) : 0,
          saTheory: saTheoryMax > 0 ? parseFloat(((saTheoryTotal / saTheoryMax) * 100).toFixed(2)) : 0,
          saPractical: saPracticalMax > 0 ? parseFloat(((saPracticalTotal / saPracticalMax) * 100).toFixed(2)) : 0
        };
        
        // Filter based on view
        if (view === 'theory') {
          delete dataPoint.faPractical;
          delete dataPoint.saPractical;
        } else if (view === 'practical') {
          delete dataPoint.faTheory;
          delete dataPoint.saTheory;
        }
        
        radarData.push(dataPoint);
      }
    });
    
    return radarData;
  }, [studentData, getAllSubjects]);

  // Handle student selection
  const handleStudentChange = useCallback((e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    // Reset subject when student changes
    setSelectedSubject('');
    setPieData([]);
  }, []);

  // Handle subject selection
  const handleSubjectChange = useCallback((e) => {
    const subject = e.target.value;
    setSelectedSubject(subject);
    const data = calculatePieData(subject);
    setPieData(data);
  }, [calculatePieData]);

  // Handle radar view change
  const handleRadarViewChange = useCallback((e) => {
    const view = e.target.value;
    setRadarView(view);
    const data = calculateRadarData(view);
    setRadarData(data);
  }, [calculateRadarData]);

  // Initialize pie data when response or student changes
  useEffect(() => {
    if (studentData && selectedStudent) {
      const subjects = getAllSubjects();
      if (subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(subjects[0]);
        const data = calculatePieData(subjects[0]);
        setPieData(data);
      }
    }
  }, [studentData, getAllSubjects, calculatePieData, selectedSubject, selectedStudent]);

  // Initialize radar data when response or student changes
  useEffect(() => {
    if (studentData && selectedStudent) {
      const data = calculateRadarData(radarView);
      setRadarData(data);
    }
  }, [studentData, calculateRadarData, radarView, selectedStudent]);

  return (
    <>
      {loading && <p>Loading...</p>}
      
      {/* Subject Performance Pie Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 mb-6">
        <h3 className="text-lg font-bold mb-4">Student Performance Analysis</h3>
        
        {/* Student Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Student:</label>
          <select 
            value={selectedStudent}
            onChange={handleStudentChange}
            className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold mb-4"
          >
            {students.length > 0 ? (
              students.map((student, index) => (
                <option key={index} value={student.name}>
                  {student.name}
                </option>
              ))
            ) : (
              <option value="">No students available</option>
            )}
          </select>
          {students.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              No students found. Please upload marksheets first.
            </p>
          )}
        </div>

        {/* Subject Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Subject:</label>
          <select 
            value={selectedSubject}
            onChange={handleSubjectChange}
            className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold"
            disabled={!selectedStudent}
          >
            {getAllSubjects().map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {/* Pie Chart */}
        {pieData.length > 0 && selectedStudent && (
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
                    fill={COLORS[index % COLORS.length]} 
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
        
        {(!selectedStudent || pieData.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            {selectedStudent ? 
              "No assessment data available for this student" : 
              "Please select a student to view performance data"
            }
          </div>
        )}
      </div>

      {/* Overall Performance Radar Chart */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 mb-6">
        <h3 className="text-lg font-bold mb-4">Student Overall Performance Analysis</h3>
        
        {/* Student Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Student:</label>
          <select 
            value={selectedStudent}
            onChange={handleStudentChange}
            className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold mb-4"
          >
            {students.length > 0 ? (
              students.map((student, index) => (
                <option key={index} value={student.name}>
                  {student.name}
                </option>
              ))
            ) : (
              <option value="">No students available</option>
            )}
          </select>
          {students.length === 0 && (
            <p className="text-xs text-red-500 mt-1">
              No students found. Please upload marksheets first.
            </p>
          )}
        </div>

        {/* Radar View Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select View:</label>
          <select 
            value={radarView}
            onChange={handleRadarViewChange}
            className="w-full p-2 border-[2px] border-black bg-white text-sm font-semibold"
            disabled={!selectedStudent}
          >
            <option value="overall">All Subjects</option>
            <option value="theory">Theory Subjects Only</option>
            <option value="practical">Practical Subjects Only</option>
          </select>
        </div>
        
        {radarData.length > 0 && selectedStudent && (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
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
              {radarData[0]?.faTheory !== undefined && (
                <Radar 
                  name="FA Theory" 
                  dataKey="faTheory" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
              
              {/* FA Practical */}
              {radarData[0]?.faPractical !== undefined && (
                <Radar 
                  name="FA Practical" 
                  dataKey="faPractical" 
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
              
              {/* SA Theory */}
              {radarData[0]?.saTheory !== undefined && (
                <Radar 
                  name="SA Theory" 
                  dataKey="saTheory" 
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
              
              {/* SA Practical */}
              {radarData[0]?.saPractical !== undefined && (
                <Radar 
                  name="SA Practical" 
                  dataKey="saPractical" 
                  stroke="#ff7c7c" 
                  fill="#ff7c7c" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              )}
              
              <Tooltip 
                formatter={(value, name) => [`${value}%`, name]}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
        
        {(!selectedStudent || radarData.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            {selectedStudent ? 
              "No performance data available for this student" : 
              "Please select a student to view performance analysis"
            }
          </div>
        )}
      </div>
    </>
  );
}
