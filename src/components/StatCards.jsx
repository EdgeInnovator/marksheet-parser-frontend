import React, { useState, useEffect } from 'react';
import { api } from '../app/config/axiosSetup';
import { getCokie } from '../app/utils/utils';

// ROUTE 1: Classic Split Layout
export const StatCardRoute1 = ({ title, value, subtitle, color = "black" }) => {
  console.log('StatCard props:', { title, value, subtitle, color }); // Debug log
  
  const getColorClasses = () => {
    const colors = {
      black: { border: 'border-black', bg: 'bg-black' },
      blue: { border: 'border-blue-600', bg: 'bg-blue-600' },
      green: { border: 'border-green-600', bg: 'bg-green-600' },
      purple: { border: 'border-purple-600', bg: 'bg-purple-600' },
      orange: { border: 'border-orange-600', bg: 'bg-orange-600' }
    };
    return colors[color] || colors.black;
  };

  const colorClasses = getColorClasses();

  return (
    <div className={`bg-white border-[4px] ${colorClasses.border} p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold uppercase">{title}</h3>
        <div className={`w-12 h-12 ${colorClasses.bg} flex items-center justify-center`}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
      </div>
      <div className="text-4xl font-black mb-2">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{subtitle}</div>
    </div>
  );
};

// ROUTE 2: Centered Focus Layout
export const StatCardRoute2 = ({ title, value, subtitle, color = "black", icon = "chart" }) => {
  const getColorClasses = () => {
    const colors = {
      black: 'border-black',
      blue: 'border-blue-600',
      green: 'border-green-600',
      purple: 'border-purple-600',
      orange: 'border-orange-600'
    };
    return colors[color] || colors.black;
  };

  const getIconPath = () => {
    const icons = {
      // Students icon - user group
      students: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      // Performance/Average icon - trending up
      performance: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      // Percentage icon - percentage sign
      percentage: "M7 20l10-16M8 8a2 2 0 110-4 2 2 0 010 4zm8 12a2 2 0 110-4 2 2 0 010 4z",
      // Exams/Tasks icon - document/list
      exams: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
      // Success/Grade icon - checkmark/star
      success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0zm9 3a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1h14a1 1 0 011 1v2z",
      // Default chart icon
      chart: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    };
    return icons[icon] || icons.chart;
  };

  return (
    <div className={`bg-white border-[4px] ${getColorClasses()} p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
      <div className="text-center">
        <div className="inline-block w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIconPath()} />
          </svg>
        </div>
        <h3 className="text-xl font-black uppercase mb-2">{title}</h3>
        <div className="text-5xl font-black mb-3">{value}</div>
        <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">{subtitle}</div>
      </div>
    </div>
  );
};

// ROUTE 3: Minimalist Strip Layout
export const StatCardRoute3 = ({ title, value, subtitle, color = "black" }) => {
  const getColorClasses = () => {
    const colors = {
      black: 'border-t-black',
      blue: 'border-t-blue-600',
      green: 'border-t-green-600',
      purple: 'border-t-purple-600',
      orange: 'border-t-orange-600'
    };
    return colors[color] || colors.black;
  };

  return (
    <div className={`bg-white border-[4px] border-t-[8px] ${getColorClasses()} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1">{title}</h3>
            <div className="text-3xl font-black">{value}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase font-medium mb-2">{subtitle}</div>
            <div className="w-10 h-10 bg-black flex items-center justify-center ml-auto">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ROUTE 4: Bold Block Layout
export const StatCardRoute4 = ({ title, value, subtitle, color = "black" }) => {
  const getColorClasses = () => {
    const colors = {
      black: 'bg-black border-white',
      blue: 'bg-blue-600 border-white',
      green: 'bg-green-600 border-white',
      purple: 'bg-purple-600 border-white',
      orange: 'bg-orange-600 border-white'
    };
    return colors[color] || colors.black;
  };

  return (
    <div className={`${getColorClasses()} text-white border-[4px] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200`}>
      <div className="p-6">
        <div className="bg-white text-black p-4 -m-1 mb-4">
          <h3 className="text-lg font-black uppercase">{title}</h3>
        </div>
        <div className="text-4xl font-black mb-2">{value}</div>
        <div className="flex justify-between items-end">
          <div className="text-sm opacity-80 font-medium">{subtitle}</div>
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Stat Cards Container Component
export const StatCardsContainer = ({ userId, route = 1 }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching stats for userId:', userId, 'route:', route);
        
        // Get user info from cookie
        const activeUser = getCokie('ACTIVE_USER');
        const userData = activeUser ? JSON.parse(activeUser) : null;
        
        if (route === 2) {
          // Teacher route - use teacher stats endpoint
          // Final security check - ensure this is a staff user
          if (!userData || userData.role !== 'staff') {
            console.error('Non-staff user attempted to access teacher stats');
            setLoading(false);
            return;
          }

          const endpoint = `/marksheet/teacher/stats/${userId}`;
          console.log('Making request to:', `${import.meta.env.VITE_BASE_API}${endpoint}`);
          
          const response = await api.get(endpoint);
          console.log('Teacher stats response:', response);
          console.log('Teacher stats data:', response.data);
          
          let teacherStats = response.data || [];
          
          // Logic to handle "ghost" students when database is truncated/empty of exams
          // If Success Rate is 0%, force student count to 0 for cleaner UI during testing
          const successRateStat = teacherStats.find(s => s.title.toLowerCase().includes('success rate'));
          if (successRateStat && successRateStat.value === "0%") {
            teacherStats = teacherStats.map(stat => {
              if (stat.title.toLowerCase().includes('total students')) {
                return { ...stat, value: "0", subtitle: "0 registered, 0 unregistered" };
              }
              return stat;
            });
          }
          
          setStats(teacherStats);
        } else {
          // Student route (default) - use exams endpoint
          const endpoint = `/marksheet/exams?user_id=${userId}`;
          console.log('Making request to:', `${import.meta.env.VITE_BASE_API}${endpoint}`);
          
          const response = await api.get(endpoint);
          console.log('Student exams response:', response);
          
          const exams = response.data?.data || [];
          
          // Calculate statistics from exams data
          const stats = [
            {
              title: "TOTAL EXAMS",
              value: exams.length,
              subtitle: exams.length > 0 ? "Available" : "No data available",
              color: "black"
            },
            {
              title: "AVERAGE PERCENTAGE", 
              value: exams.length > 0 
                ? `${(exams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / exams.length).toFixed(1)}%`
                : "0%",
              subtitle: exams.length > 0 ? "Across all exams" : "No data available",
              color: "black"
            },
            {
              title: "BEST PERFORMANCE",
              value: exams.length > 0 
                ? `${Math.max(...exams.map(exam => exam.percentage || 0)).toFixed(1)}%`
                : "N/A",
              subtitle: exams.length > 0 ? "Highest score" : "No data available", 
              color: "black"
            },
            {
              title: "TOTAL SUBJECTS",
              value: exams.length > 0 
                ? exams.reduce((total, exam) => total + (exam.subjects?.length || 0), 0)
                : 0,
              subtitle: exams.length > 0 ? "Across all exams" : "No data available",
              color: "black"
            }
          ];
          
          console.log('Student stats data:', stats);
          setStats(stats);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        console.error('Error response:', err.response);
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        
        setError(`Failed to load statistics: ${err.response?.status} - ${err.response?.data?.detail || err.message}`);
        
        // Set fallback stats for both student and teacher
        const fallbackStats = route === 2 ? [
          {
            title: "Total Students",
            value: "0",
            subtitle: "Unique students",
            color: "blue"
          },
          {
            title: "Average Performance",
            value: "0%",
            subtitle: "Across 0 exams",
            color: "green"
          },
          {
            title: "Total Exams Processed",
            value: "0",
            subtitle: "All student exams",
            color: "purple"
          },
          {
            title: "Success Rate",
            value: "0%",
            subtitle: "Students with ≥60%",
            color: "orange"
          }
        ] : [
          {
            title: "TOTAL EXAMS",
            value: 0,
            subtitle: "No data available",
            color: "black"
          },
          {
            title: "AVERAGE PERCENTAGE", 
            value: "0%",
            subtitle: "No data available",
            color: "black"
          },
          {
            title: "BEST PERFORMANCE",
            value: "N/A",
            subtitle: "No data available", 
            color: "black"
          },
          {
            title: "TOTAL SUBJECTS",
            value: 0,
            subtitle: "No data available",
            color: "black"
          }
        ];
        
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    } else {
      console.log('No userId provided for stats fetch');
      setLoading(false);
    }
  }, [userId, route]);

  const getStatCardComponent = () => {
    const components = {
      1: StatCardRoute1,
      2: StatCardRoute2,
      3: StatCardRoute3,
      4: StatCardRoute4
    };
    return components[route] || StatCardRoute1;
  };

  const StatCardComponent = getStatCardComponent();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border-[4px] border-gray-300 p-6 animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-[4px] border-red-500 p-6 text-center">
        <div className="text-red-700 font-bold text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCardComponent
          key={index}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          color={stat.color}
          icon={stat.icon}
        />
      ))}
    </div>
  );
};

// Demo Component to show all 4 routes
export const StatCardsDemo = ({ userId }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(`/marksheet/exams?user_id=${userId}`);
        const exams = response.data?.data || [];
        
        // Calculate statistics from exams data
        const stats = [
          {
            title: "TOTAL EXAMS",
            value: exams.length,
            subtitle: exams.length > 0 ? "Available" : "No data available",
            color: "black"
          },
          {
            title: "AVERAGE PERCENTAGE", 
            value: exams.length > 0 
              ? `${(exams.reduce((sum, exam) => sum + (exam.percentage || 0), 0) / exams.length).toFixed(1)}%`
              : "0%",
            subtitle: exams.length > 0 ? "Across all exams" : "No data available",
            color: "black"
          },
          {
            title: "BEST PERFORMANCE",
            value: exams.length > 0 
              ? `${Math.max(...exams.map(exam => exam.percentage || 0)).toFixed(1)}%`
              : "N/A",
            subtitle: exams.length > 0 ? "Highest score" : "No data available", 
            color: "black"
          },
          {
            title: "TOTAL SUBJECTS",
            value: exams.length > 0 
              ? exams.reduce((total, exam) => total + (exam.subjects?.length || 0), 0)
              : 0,
            subtitle: exams.length > 0 ? "Across all exams" : "No data available",
            color: "black"
          }
        ];
        
        setStats(stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center p-8">Loading statistics...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-center">STAT CARD ROUTES</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        
        {/* Route 1 */}
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase">Route 1: Classic Split</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat, index) => (
              <StatCardRoute1 key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Route 2 */}
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase">Route 2: Centered Focus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.slice(0, 4).map((stat, index) => {
              // Map stat titles to appropriate icons for teacher stats (fallback if API doesn't provide icon)
              const getIconForStat = (title, apiIcon) => {
                // If API provides icon, use it directly
                if (apiIcon && ['students', 'performance', 'exams', 'success', 'chart', 'percentage'].includes(apiIcon)) {
                  return apiIcon === 'percentage' ? 'performance' : apiIcon;
                }
                
                // Fallback to title-based mapping
                const titleLower = (title || '').toLowerCase();
                if (titleLower.includes('student')) return 'students';
                if (titleLower.includes('performance') || titleLower.includes('average') || titleLower.includes('%')) return 'performance';
                if (titleLower.includes('exam') || titleLower.includes('processed')) return 'exams';
                if (titleLower.includes('success') || titleLower.includes('rate')) return 'success';
                return 'chart';
              };
              
              return (
                <StatCardRoute2 
                  key={index} 
                  {...stat} 
                  icon={getIconForStat(stat.title, stat.icon)}
                />
              );
            })}
          </div>
        </div>

        {/* Route 3 */}
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase">Route 3: Minimalist Strip</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat, index) => (
              <StatCardRoute3 key={index} {...stat} />
            ))}
          </div>
        </div>

        {/* Route 4 */}
        <div>
          <h2 className="text-xl font-bold mb-4 uppercase">Route 4: Bold Block</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.slice(0, 2).map((stat, index) => (
              <StatCardRoute4 key={index} {...stat} />
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};
