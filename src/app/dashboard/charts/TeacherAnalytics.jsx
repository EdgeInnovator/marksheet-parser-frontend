import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';
import { api } from "../../config/axiosSetup";
import { getCokie } from "../../utils/utils";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function TeacherAnalytics({ userId }) {
  // Main states based on user's 6 routes
  const [theoryVsPractical, setTheoryVsPractical] = useState(null); // Route 1
  const [topBottomStudents, setTopBottomStudents] = useState(null); // Route 2
  const [weaknessData, setWeaknessData] = useState([]); // Route 2 - Weakness
  const [histogramData, setHistogramData] = useState(null); // Route 3
  const [radarData, setRadarData] = useState(null); // Route 4
  const [filters, setFilters] = useState({ // Route 5
    examinations: [],
    semesters: [],
    courses: [],
    subject_types: [],
    mark_types: []
  });
  const [semesterProgress, setSemesterProgress] = useState(null); // Route 6
  
  // Internal UI states
  const [role, setRole] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    semester: '',
    course: '',
    examination: ''
  });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [bottomPerformers, setBottomPerformers] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState('');
  
  // Loading states
  const [loading, setLoading] = useState(true); // Global initial load
  const [chartLoading, setChartLoading] = useState({
    histogram: false,
    radar: false,
    progress: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const activeUserCookie = getCokie("ACTIVE_USER");
    if (activeUserCookie) {
      try {
        const userData = JSON.parse(activeUserCookie);
        setRole(userData.role);
        if (userData.role !== 'staff') {
          setError('Access Denied: Staff only');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error parsing cookie in TeacherAnalytics:', err);
      }
    }

    if (userId) {
      // Initial parallel fetch of static/global data
      const initData = async () => {
        setLoading(true);
        try {
          await Promise.all([
            fetchFilters(),
            fetchStudents(),
            fetchPrimaryAnalytics()
          ]);
        } catch (err) {
          setError('Failed to initialize analytics');
        } finally {
          setLoading(false);
        }
      };
      initData();
    }
  }, [userId]);

  // Handle filtering students when global filters change
  useEffect(() => {
    if (students.length > 0) {
      const filtered = students.filter(student => {
        const matchSemester = !selectedFilters.semester || 
          student.semester === selectedFilters.semester || 
          student.latest_exam?.semester === selectedFilters.semester;
        
        const matchCourse = !selectedFilters.course || 
          student.course === selectedFilters.course || 
          student.latest_exam?.course === selectedFilters.course;
          
        const matchExam = !selectedFilters.examination || 
          student.examination === selectedFilters.examination || 
          student.latest_exam?.exam_name === selectedFilters.examination;

        return matchSemester && matchCourse && matchExam;
      });

      setFilteredStudents(filtered);

      // Sort and derive Top/Bottom performers from the filtered list
      const studentsWithScores = filtered
        .filter(s => s.latest_exam?.total_marks_obtained !== undefined)
        .sort((a, b) => (b.latest_exam?.total_marks_obtained || 0) - (a.latest_exam?.total_marks_obtained || 0));

      setTopPerformers(studentsWithScores.slice(0, 5));
      setBottomPerformers([...studentsWithScores].reverse().slice(0, 5));

      // Auto-select the first student in the filtered list if current selection is not in it
      if (filtered.length > 0) {
        const currentStillValid = filtered.some(s => s.enrollment_no === selectedEnrollment);
        if (!currentStillValid) {
          const firstFiltered = filtered[0];
          setSelectedEnrollment(firstFiltered.enrollment_no || '');
          fetchSemesterProgress(firstFiltered.enrollment_no);
        }
      } else {
        setSelectedEnrollment('');
        setSemesterProgress(null);
      }
    }
  }, [selectedFilters.semester, selectedFilters.course, selectedFilters.examination, students]);

  // Fetch dynamic analytics when filters change
  useEffect(() => {
    if (userId && !loading) {
      fetchHistogram();
      fetchRadar();
    }
  }, [selectedFilters.semester, selectedFilters.course]);

  // Fetch progress when enrollment changes
  useEffect(() => {
    if (selectedEnrollment && !loading) {
      fetchSemesterProgress();
    }
  }, [selectedEnrollment]);

  const fetchFilters = async () => {
    try {
      const res = await api.get('/analytics/charts/available-filters');
      if (res.data?.success) {
        setFilters(res.data.data);
        if (res.data.data.semesters?.length > 0 && !selectedFilters.semester) {
          setSelectedFilters(prev => ({ ...prev, semester: res.data.data.semesters[0] }));
        }
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/marksheet/teacher/students/${userId}`);
      if (res.data?.students) {
        setStudents(res.data.students);
        if (res.data.students.length > 0) {
          const firstStudent = res.data.students[0];
          setSelectedEnrollment(firstStudent.enrollment_no || '');
          // Immediately fetch progress for the first student
          fetchSemesterProgress(firstStudent.enrollment_no);
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchPrimaryAnalytics = async () => {
    try {
      const [theoryPracticalRes, topBottomRes, weaknessRes] = await Promise.all([
        api.get('/analytics/teacher/theory-vs-practical'),
        api.get('/analytics/teacher/top-bottom'),
        api.get('/analytics/teacher/weakness').catch(() => ({ data: [] }))
      ]);
      if (theoryPracticalRes.data) setTheoryVsPractical(theoryPracticalRes.data);
      if (topBottomRes.data) setTopBottomStudents(topBottomRes.data);
      if (weaknessRes.data) setWeaknessData(weaknessRes.data);
    } catch (err) {
      console.error('Error fetching primary analytics:', err);
    }
  };

  const fetchHistogram = async () => {
    setChartLoading(prev => ({ ...prev, histogram: true }));
    try {
      const params = new URLSearchParams();
      if (selectedFilters.semester) params.append('semester', selectedFilters.semester);
      if (selectedFilters.course) params.append('course', selectedFilters.course);
      
      const res = await api.get(`/teacher/dashboard/histogram?${params.toString()}`);
      if (res.data?.success) {
        setHistogramData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching histogram:', err);
    } finally {
      setChartLoading(prev => ({ ...prev, histogram: false }));
    }
  };

  const fetchRadar = async () => {
    setChartLoading(prev => ({ ...prev, radar: true }));
    try {
      const params = new URLSearchParams();
      if (selectedFilters.semester) params.append('semester', selectedFilters.semester);
      
      const res = await api.get(`/teacher/dashboard/radar?${params.toString()}`);
      if (res.data?.success) {
        setRadarData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching radar:', err);
    } finally {
      setChartLoading(prev => ({ ...prev, radar: false }));
    }
  };

  const fetchSemesterProgress = async (enrollmentNo) => {
    const targetEnrollment = enrollmentNo || selectedEnrollment;
    if (!targetEnrollment) return;

    setChartLoading(prev => ({ ...prev, progress: true }));
    try {
      const res = await api.get(`/analytics/charts/semester-progress?enrollment_no=${targetEnrollment}`);
      if (res.data?.success && res.data.data?.length > 0) {
        setSemesterProgress(res.data.data[0]);
      }
    } catch (err) {
      console.error('Error fetching semester progress:', err);
    } finally {
      setChartLoading(prev => ({ ...prev, progress: false }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-[#b9f36a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters Section */}
      <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-8 h-8 bg-[#b9f36a] border-2 border-black flex items-center justify-center">🔍</span>
          Analytics Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase tracking-wider">Semester</label>
            <select 
              name="semester" 
              value={selectedFilters.semester} 
              onChange={handleFilterChange}
              className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#b9f36a] appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="">All Semesters</option>
              {filters.semesters?.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase tracking-wider">Course</label>
            <select 
              name="course" 
              value={selectedFilters.course} 
              onChange={handleFilterChange}
              className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#b9f36a] appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="">All Courses</option>
              {filters.courses?.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-black uppercase tracking-wider">Examination</label>
            <select 
              name="examination" 
              value={selectedFilters.examination} 
              onChange={handleFilterChange}
              className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#b9f36a] appearance-none"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
            >
              <option value="">All Exams</option>
              {filters.examinations?.map(exam => (
                <option key={exam} value={exam}>{exam}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Theory vs Practical Performance */}
        {theoryVsPractical && (
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
            <h3 className="text-xl font-bold mb-6">Theory vs Practical</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-50 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-blue-600 mb-2">{theoryVsPractical.theoryStrong}</div>
                <div className="text-xs font-black uppercase tracking-tighter text-blue-900">Theory Strong</div>
              </div>
              <div className="text-center p-6 bg-green-50 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-green-600 mb-2">{theoryVsPractical.balanced}</div>
                <div className="text-xs font-black uppercase tracking-tighter text-green-900">Balanced</div>
              </div>
              <div className="text-center p-6 bg-orange-50 border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-4xl font-black text-orange-600 mb-2">{theoryVsPractical.practicalStrong}</div>
                <div className="text-xs font-black uppercase tracking-tighter text-orange-900">Practical Strong</div>
              </div>
            </div>
          </div>
        )}

        {/* Score Distribution Histogram */}
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 min-h-[350px] flex flex-col">
          <h3 className="text-xl font-bold mb-4">Score Distribution (Overall %)</h3>
          {chartLoading.histogram ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="loading loading-spinner text-black"></div>
            </div>
          ) : histogramData ? (
            <>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300} key={`histogram-${histogramData.total_exams}`}>
                  <BarChart 
                    data={histogramData.bins}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#666' }}
                    />
                    <YAxis 
                      domain={[0, 'dataMax']}
                      tick={{ fontSize: 12, fill: '#666' }}
                      axisLine={{ stroke: '#666' }}
                      label={{ value: 'Number of Students', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#666' } }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '0' }}
                      labelStyle={{ fontWeight: 'bold' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="#b9f36a" 
                      stroke="#000" 
                      strokeWidth={2}
                      radius={[0, 0, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center text-sm font-bold">
                Total Exams: {histogramData.total_exams}
              </div>
            </>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Performance Radar */}
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-4">Subject Averages (Radar)</h3>
          {chartLoading.radar ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="loading loading-spinner text-black"></div>
            </div>
          ) : radarData ? (
            <>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData.subjects}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Avg %"
                      dataKey="avg_percentage"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 text-center text-sm font-bold">
                Semester: {radarData.semester}
              </div>
            </>
          ) : null}
        </div>

        {/* Semester Progress Line Chart */}
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 min-h-[400px] flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-xl font-bold">Student Progress</h3>
            <select 
              value={selectedEnrollment} 
              onChange={(e) => {
                setSelectedEnrollment(e.target.value);
                fetchSemesterProgress(e.target.value);
              }}
              className="bg-white border-2 border-black px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-[#b9f36a] appearance-none min-w-[200px]"
              style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1em' }}
            >
              <option value="">Select Student</option>
              {filteredStudents.map(s => (
                <option key={s.enrollment_no} value={s.enrollment_no}>{s.name}</option>
              ))}
            </select>
          </div>
          {chartLoading.progress ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="loading loading-spinner text-black"></div>
            </div>
          ) : semesterProgress ? (
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={semesterProgress.semester_labels.map((label, idx) => ({
                  semester: label,
                  percentage: semesterProgress.percentages[idx]
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#ff7c7c" 
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#ff7c7c', stroke: '#000', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 font-bold">
              Select a student to view progress
            </div>
          )}
        </div>
      </div>

      {/* Top/Bottom Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-lg font-bold mb-4 text-green-600 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">↑</span>
            Top Performers
          </h3>
          <ul className="space-y-3">
            {topPerformers.length > 0 ? (
              topPerformers.map((student, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-green-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold flex items-center gap-2">
                    <span className="w-6 h-6 bg-black text-[#b9f36a] border-2 border-black flex items-center justify-center text-xs font-black">{idx + 1}</span>
                    {student.name}
                  </span>
                  <span className="text-black font-black">{student.latest_exam?.total_marks_obtained}</span>
                </li>
              ))
            ) : (
              <li className="text-center py-4 text-gray-500 font-bold">No student data for current filters</li>
            )}
          </ul>
        </div>

        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-lg font-bold mb-4 text-orange-600 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">↓</span>
            Students Needing Support
          </h3>
          <ul className="space-y-3">
            {bottomPerformers.length > 0 ? (
              bottomPerformers.map((student, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-orange-50 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <span className="font-bold">{student.name}</span>
                  <span className="text-black font-black">{student.latest_exam?.total_marks_obtained}</span>
                </li>
              ))
            ) : (
              <li className="text-center py-4 text-gray-500 font-bold">No student data for current filters</li>
            )}
          </ul>
        </div>
      </div>

      {/* Subject Weakness Detection */}
      {weaknessData && weaknessData.length > 0 && (
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-600">
            <span className="w-8 h-8 bg-red-100 border-2 border-black flex items-center justify-center">⚠️</span>
            Subject Weakness Detection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {weaknessData.map((item, idx) => (
              <div key={idx} className="bg-red-50 border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="font-black text-lg mb-1 uppercase truncate">{item.subject}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] font-black uppercase text-red-800">Failure Count</div>
                    <div className="text-2xl font-black">{item.failure_count}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase text-red-800">Avg Marks</div>
                    <div className="text-2xl font-black">{item.average_marks.toFixed(1)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border-2 border-yellow-400 p-4 text-yellow-800 font-bold">
          Note: Some analytics data could not be loaded. The dashboard will display available data.
        </div>
      )}
    </div>
  );
}

