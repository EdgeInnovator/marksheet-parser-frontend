import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { api } from "../../config/axiosSetup";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

export default function TeacherAnalytics({ userId }) {
  const [theoryVsPractical, setTheoryVsPractical] = useState(null);
  const [weaknessData, setWeaknessData] = useState(null);
  const [scoreDistribution, setScoreDistribution] = useState(null);
  const [subjectPerformance, setSubjectPerformance] = useState([]);
  const [topBottomStudents, setTopBottomStudents] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchAllAnalytics();
    }
  }, [userId]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all analytics endpoints in parallel
      const [
        theoryPracticalRes,
        weaknessRes,
        scoreDistRes,
        subjectPerfRes,
        topBottomRes,
        chartDataRes
      ] = await Promise.all([
        api.get('/analytics/teacher/theory-vs-practical').catch(() => null),
        api.get('/analytics/teacher/weakness').catch(() => null),
        api.get('/analytics/teacher/score-distribution').catch(() => null),
        api.get('/analytics/teacher/subject-performance').catch(() => null),
        api.get('/analytics/teacher/top-bottom').catch(() => null),
        api.get('/analytics/teacher/chart-data').catch(() => null)
      ]);

      if (theoryPracticalRes?.data) setTheoryVsPractical(theoryPracticalRes.data);
      if (weaknessRes?.data) setWeaknessData(weaknessRes.data);
      if (scoreDistRes?.data) setScoreDistribution(scoreDistRes.data);
      if (subjectPerfRes?.data) setSubjectPerformance(subjectPerfRes.data || []);
      if (topBottomRes?.data) setTopBottomStudents(topBottomRes.data);
      if (chartDataRes?.data) setChartData(chartDataRes.data);

      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load some analytics data');
    } finally {
      setLoading(false);
    }
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
      {/* Theory vs Practical Performance */}
      {theoryVsPractical && (
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-xl font-bold mb-4">Theory vs Practical Performance</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 border-2 border-blue-200">
              <div className="text-3xl font-black text-blue-600">{theoryVsPractical.theoryStrong}</div>
              <div className="text-sm font-medium text-blue-800">Theory Strong</div>
            </div>
            <div className="text-center p-4 bg-green-50 border-2 border-green-200">
              <div className="text-3xl font-black text-green-600">{theoryVsPractical.balanced}</div>
              <div className="text-sm font-medium text-green-800">Balanced</div>
            </div>
            <div className="text-center p-4 bg-orange-50 border-2 border-orange-200">
              <div className="text-3xl font-black text-orange-600">{theoryVsPractical.practicalStrong}</div>
              <div className="text-sm font-medium text-orange-800">Practical Strong</div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Performance Chart */}
      {chartData && (
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-xl font-bold mb-4">Subject Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.labels.map((label, index) => ({
              subject: label,
              theory: chartData.theory[index],
              practical: chartData.practical[index]
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="theory" fill="#8884d8" name="Theory" />
              <Bar dataKey="practical" fill="#82ca9d" name="Practical" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Student Weakness Detection */}
      {weaknessData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {weaknessData.theoryWeak?.length > 0 && (
            <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <h3 className="text-lg font-bold mb-4 text-red-600">Theory Weak Areas</h3>
              <ul className="space-y-2">
                {weaknessData.theoryWeak.map((subject, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 bg-red-50 border border-red-200">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-red-600 font-bold">{subject.avgTheory}% avg</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {weaknessData.practicalWeak?.length > 0 && (
            <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
              <h3 className="text-lg font-bold mb-4 text-orange-600">Practical Weak Areas</h3>
              <ul className="space-y-2">
                {weaknessData.practicalWeak.map((subject, idx) => (
                  <li key={idx} className="flex justify-between items-center p-2 bg-orange-50 border border-orange-200">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-orange-600 font-bold">{subject.avgPractical}% avg</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Score Distribution */}
      {scoreDistribution && (
        <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
          <h3 className="text-xl font-bold mb-4">Score Distribution</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Theory Scores</h4>
              <div className="space-y-2">
                {Object.entries(scoreDistribution.theory || {}).map(([range, count]) => (
                  <div key={range} className="flex items-center gap-2">
                    <div className="w-20 text-sm font-medium">{range}%</div>
                    <div className="flex-1 h-8 bg-gray-200 rounded overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Practical Scores</h4>
              <div className="space-y-2">
                {Object.entries(scoreDistribution.practical || {}).map(([range, count]) => (
                  <div key={range} className="flex items-center gap-2">
                    <div className="w-20 text-sm font-medium">{range}%</div>
                    <div className="flex-1 h-8 bg-gray-200 rounded overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${Math.min((count / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="w-8 text-right font-bold">{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top/Bottom Students */}
      {topBottomStudents && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
            <h3 className="text-lg font-bold mb-4 text-green-600">Top Performers</h3>
            <ul className="space-y-2">
              {(topBottomStudents.top || []).map((student, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-green-50 border-2 border-green-200">
                  <span className="font-medium flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                    {student.name}
                  </span>
                  <span className="text-green-700 font-black">{student.score} marks</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
            <h3 className="text-lg font-bold mb-4 text-orange-600">Students Needing Support</h3>
            <ul className="space-y-2">
              {(topBottomStudents.bottom || []).map((student, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-orange-50 border-2 border-orange-200">
                  <span className="font-medium">{student.name}</span>
                  <span className="text-orange-700 font-black">{student.score} marks</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border-2 border-yellow-400 p-4 text-yellow-800">
          Note: Some analytics data could not be loaded. The dashboard will display available data.
        </div>
      )}
    </div>
  );
}
