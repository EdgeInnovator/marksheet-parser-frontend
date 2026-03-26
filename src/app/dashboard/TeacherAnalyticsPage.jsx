import React, { useEffect, useState } from 'react';
import { getCokie } from '../utils/utils';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TeacherAnalytics from './charts/TeacherAnalytics';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';

export default function TeacherAnalyticsPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const activeUserCookie = getCokie("ACTIVE_USER");
    if (activeUserCookie) {
      try {
        const userData = JSON.parse(activeUserCookie);
        if (userData.role === 'staff' && userData.id) {
          setActiveUser(userData.id);
        } else {
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error parsing cookie:', error);
      }
    } else {
      window.location.href = '/login';
    }
    setLoading(false);
  }, []);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const response = await api.get(`/analytics/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        link.setAttribute('download', `analytics_export_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('CSV Export started!');
      } else {
        // Handle JSON export - download as file
        const dataStr = JSON.stringify(response.data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const link = document.createElement('a');
        link.href = dataUri;
        link.setAttribute('download', 'analytics_data.json');
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('JSON Export successful!');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export analytics data');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#b9f36a] flex items-center justify-center">
        <div className="loading loading-spinner loading-lg text-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      <Navbar userRole="staff" />
      
      <main className="flex-1 px-[20px] sm:px-[40px] py-[20px] sm:py-[40px]">
        {/* New Improved Header Card */}
        <section className="mb-12">
          <div className="bg-white border-[4px] border-black p-8 sm:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <h1 className="text-[40px] sm:text-[50px] lg:text-[64px] leading-[0.9] font-black uppercase mb-4">
                ANALYTICS <br className="hidden sm:block" />CENTRAL<span>.</span>
              </h1>
              <div className="flex items-center gap-3">
                <span className="w-12 h-1 bg-black"></span>
                <p className="text-sm sm:text-base font-bold text-gray-600 uppercase tracking-[0.2em]">
                  Real-time Class Insights
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <button 
                onClick={() => handleExport('json')}
                disabled={exporting}
                className="flex-1 sm:flex-none bg-[#b9f36a] text-black px-6 py-4 font-black text-xs uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zM9 12h6M9 16h6"></path>
                </svg>
                JSON
              </button>
              
              <button 
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="flex-1 sm:flex-none bg-[#b9f36a] text-black px-6 py-4 font-black text-xs uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                CSV
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full sm:w-auto bg-[#b9f36a] text-black px-8 py-4 font-black text-xs uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                BACK
              </button>
            </div>
          </div>
        </section>

        {/* Analytics Content */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeUser && <TeacherAnalytics userId={activeUser} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
