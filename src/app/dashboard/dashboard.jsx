import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import { api } from "../config/axiosSetup";
import { toast } from "react-toastify";
import { getCokie } from "../utils/utils";

// Role-specific components
import StudentStats from "./StudentStats";
import TeacherStats from "./TeacherStats";
import StudentCharts from "./StudentCharts";
import TeacherCharts from "./TeacherCharts";
import StudentTable from "./StudentTable";
import TeacherTable from "./TeacherTable";

export default function Dashboard({ userRole = "student" }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(getCokie("ACTIVE_USER"));
    // console.log(userId);
    setActiveUser(userId.id);
  }, []);

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

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);

      const response = await api.post("/marksheet/upload", formData);

      toast.success("Marksheet uploaded successfully!");

      let savedFilename =
        response.data?.files?.[0]?.saved_filename || selectedFile.name;

      setUploadedFile({
        ...selectedFile,
        savedName: savedFilename,
      });

      setSelectedFile(null);
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleParse = async () => {
    if (!uploadedFile) {
      toast.error("No file to parse");
      return;
    }

    setIsParsing(true);

    try {
      const filenameToUse =
        uploadedFile.savedName || uploadedFile.name;

      await api.post("/marksheet/parse", {
        filename: filenameToUse,
      });

      toast.success("Marksheet parsed successfully!");
      setUploadedFile(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Parse failed";
      toast.error(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      
      {/* Navbar */}
      <header className="px-[60px] py-[40px] flex justify-between items-center">
        <div className="flex items-center gap-3 font-bold">
          <span className="w-8 h-8 bg-black block" />
          M. PARSER
        </div>

        <nav className="space-x-8 text-[12px] font-semibold">
          <NavLink to="/dashboard">DASHBOARD</NavLink>
          <NavLink to="/about-us">ABOUT US</NavLink>
          <NavLink to="/logout">LOGOUT</NavLink>
        </nav>
      </header>

      <main className="flex-1 px-[60px] py-[40px]">

        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[80px] leading-[0.9] font-extrabold">
            DASH <br />BOARD<span>.</span>
          </h1>
          <p className="text-[20px] font-bold mt-4">
            {userRole === "student"
              ? "TRACK MY PROGRESS."
              : "ANALYZE SMARTER."}
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-4 gap-8 mb-10">
          {userRole === "student" ? (
            <StudentStats />
          ) : (
            <TeacherStats />
          )}
        </section>

        {/* Upload + Table */}
        <section className="grid grid-cols-3 gap-8 mb-10">

          <div className="bg-white p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isUploading || isParsing}
            />

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="mt-4 w-full bg-black text-[#b9f36a] px-6 py-3 font-bold border-[2px] border-black"
              >
                {isUploading ? "UPLOADING..." : "UPLOAD MARKSHEET"}
              </button>
            )}

            {uploadedFile && (
              <button
                onClick={handleParse}
                disabled={isParsing}
                className="mt-4 w-full bg-blue-600 text-white px-6 py-3 font-bold"
              >
                {isParsing ? "PARSING..." : "PARSE MARKSHEET"}
              </button>
            )}
          </div>

          <div className="col-span-2">
            {userRole === "student" ? (
              <StudentTable />
            ) : (
              <TeacherTable />
            )}
          </div>
        </section>

        {/* Charts */}
        <section className="grid md:grid-cols-2 gap-8 mb-10">
          {userRole === "student" ? (
            <StudentCharts fetchUploads={fetchChartsData} />
          ) : (
            <TeacherCharts />
          )}
        </section>

      </main>

      <footer className="px-[60px] py-[30px] border-t-[3px] border-black text-[11px] font-semibold">
        2026 MARKSHEET PARSER
      </footer>
    </div>
  );
}
