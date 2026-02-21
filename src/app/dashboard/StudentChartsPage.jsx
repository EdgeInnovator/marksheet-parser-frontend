import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../config/axiosSetup";
import { getCokie } from "../utils/utils";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import StudentCharts from "./charts/StudentCharts";

export default function StudentChartsPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const userData = JSON.parse(getCokie("ACTIVE_USER"));
    setActiveUser(userData.id);
    setUserRole(userData.role || 'student');
  }, []);

  // Redirect non-student users
  if (userRole !== 'student') {
    return (
      <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[48px] font-bold mb-4">Access Denied</h1>
          <p className="text-[20px] mb-8">This page is only available for students.</p>
          <NavLink 
            to="/dashboard" 
            className="bg-black text-[#b9f36a] px-6 py-3 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors"
          >
            BACK TO DASHBOARD
          </NavLink>
        </div>
      </div>
    );
  }

  const fetchChartsData = useCallback(async () => {
    console.log(activeUser)
    if (!activeUser) return;

    try {
      const response = await api.get(`/marksheet/exams?user_id=${activeUser}`);
      if(response.status === 200){
        return response.data
      }
    } catch (error) {
      console.error("Error fetching charts data:", error);
    }
  }, [activeUser]);

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      
      {/* Navbar */}
      <Navbar userRole={userRole} />

      <main className="flex-1 px-[20px] sm:px-[40px] py-[20px] sm:py-[40px]">

        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.9] font-extrabold">
            MY <br />CHARTS<span>.</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold mt-4">
            VISUALIZE MY PROGRESS.
          </p>
        </section>

        {/* Charts Section */}
        <section className="space-y-8">
          <StudentCharts userId={activeUser} role={userRole} />
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
