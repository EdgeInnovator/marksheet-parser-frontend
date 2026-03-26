import React, { useState, useEffect } from 'react';
import { api } from '../app/config/axiosSetup';

// ROUTE 1: Classic Split Layout
export const StatCardRoute1 = ({ title, value, subtitle, color = "black" }) => {
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

  return (
    <div className={`bg-white border-[4px] ${getColorClasses()} p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold uppercase">{title}</h3>
        <div className="w-12 h-12 bg-black flex items-center justify-center">
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
export const StatCardRoute2 = ({ title, value, subtitle, color = "black" }) => {
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

  return (
    <div className={`bg-white border-[4px] ${getColorClasses()} p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200`}>
      <div className="text-center">
        <div className="inline-block w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        const response = await api.get(`/marksheet/stats/${userId}`);
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

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
        const response = await api.get(`/marksheet/stats/${userId}`);
        setStats(response.data);
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
            {stats.slice(0, 2).map((stat, index) => (
              <StatCardRoute2 key={index} {...stat} />
            ))}
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
