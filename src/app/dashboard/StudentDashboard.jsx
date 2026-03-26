import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FileUpload from "../../components/FileUpload";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../config/axiosSetup";
import { toast } from "react-toastify";
import { getCokie } from "../utils/utils";
import { 
  handleApiResponse, 
  handleApiError, 
  validateSingleUploadResponse,
  validateSimpleUploadResponse,
  validateMarksheetUploadResponse,
  validateParseResponse,
  createUploadFormData 
} from "../utils/apiHelpers";

// Student-specific components
import StudentTable from "./StudentTable";
import { StatCardsContainer } from "../../components/StatCards";
// Individual chart components from charts folder
import FATheoryChart from "./charts/FATheoryChart";
import FAPracticalChart from "./charts/FAPracticalChart";
import SATheoryChart from "./charts/SATheoryChart";
import SAPracticalChart from "./charts/SAPracticalChart";
import SubjectPieChart from "./charts/PieChart";
import PerformanceRadarChart from "./charts/RadarChart";

export default function StudentDashboard() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [selectedCharts, setSelectedCharts] = useState([]);

  useEffect(() => {
    const userId = JSON.parse(getCokie("ACTIVE_USER"));
    setActiveUser(userId.id);
    
    // Randomly select 2 charts for students
    const allCharts = ['faTheory', 'faPractical', 'saTheory', 'saPractical', 'pieChart', 'radarChart'];
    const shuffled = [...allCharts].sort(() => 0.5 - Math.random());
    setSelectedCharts(shuffled.slice(0, 2));
  }, []);

  const fetchChartsData = useCallback(async () => {
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
      // Create FormData with 'files' field for the /marksheet/upload route
      const formData = new FormData();
      formData.append("files", selectedFile); // Backend expects 'files' field

      const response = await api.post("/marksheet/upload", formData);
      
      const validation = validateMarksheetUploadResponse(response.data);

      if (validation.valid) {
        toast.success(validation.message || "Marksheet uploaded successfully!");
        
        // Store uploaded file info
        if (validation.uploadedFiles.length > 0) {
          const uploadedFile = validation.uploadedFiles[0];
          setUploadedFile({
            ...selectedFile,
            savedName: uploadedFile.saved_filename,
            originalName: uploadedFile.original_filename,
          });
        }
      } else {
        toast.error(validation.error || "Upload validation failed");
      }

      setSelectedFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
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

      const response = await api.post("/marksheet/parse", {
        filename: filenameToUse,
      });

      const validation = validateParseResponse(response.data);

      if (validation.valid) {
        toast.success(validation.message || "Marksheet parsed successfully!");
        
        // Store parsed student data
        if (validation.studentData) {
          setParsedData(validation.studentData);
          console.log("Parsed student data:", validation.studentData);
        }
        
        // Clear uploaded file after successful parse
        setUploadedFile(null);
      } else {
        toast.error(validation.error || "Parse validation failed");
      }
    } catch (error) {
      console.error("Parse error:", error);
      const errorMessage =
        error.response?.data?.detail || 
        error.response?.data?.message || 
        error.message || 
        "Parse failed";
      toast.error(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      
      {/* Navbar */}
      <Navbar userRole="student" />

      <main className="flex-1 px-[20px] sm:px-[40px] py-[20px] sm:py-[40px]">

        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.9] font-extrabold">
            DASH <br />BOARD<span>.</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold mt-4">
            TRACK MY PROGRESS.
          </p>
        </section>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="text-[24px] sm:text-[32px] font-bold mb-6">OVERVIEW<span>.</span></h2>
          {activeUser && <StatCardsContainer userId={activeUser} route={1} />}
        </section>

        {/* Upload + Table */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 lg:p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col items-center">
              <FileUpload
                onFileSelect={handleFileSelect}
                disabled={isUploading || isParsing}
              />

              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-4 w-full bg-black text-[#b9f36a] px-4 py-3 sm:px-6 font-bold border-[2px] border-black text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  {isUploading ? "UPLOADING..." : "UPLOAD MARKSHEET"}
                </button>
              )}

              {uploadedFile && (
                <button
                  onClick={handleParse}
                  disabled={isParsing}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-3 sm:px-6 font-bold text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  {isParsing ? "PARSING..." : "PARSE MARKSHEET"}
                </button>
              )}
            </div>

            <div className="lg:col-span-2">
              <StudentTable />
            </div>
          </div>
        </section>

        

        {/* Charts */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-[24px] sm:text-[32px] font-bold">CHARTS</h2>
            <NavLink
              to="/student-charts"
              className="bg-black text-[#b9f36a] px-4 sm:px-6 py-2 sm:py-3 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors text-sm sm:text-base"
            >
              VIEW ALL CHARTS ↗
            </NavLink>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {selectedCharts.map((chartType, index) => {
              switch(chartType) {
                case 'faTheory':
                  return <FATheoryChart key={index} userId={activeUser} role="student" />;
                case 'faPractical':
                  return <FAPracticalChart key={index} userId={activeUser} role="student" />;
                case 'saTheory':
                  return <SATheoryChart key={index} userId={activeUser} role="student" />;
                case 'saPractical':
                  return <SAPracticalChart key={index} userId={activeUser} role="student" />;
                case 'pieChart':
                  return <SubjectPieChart key={index} userId={activeUser} role="student" />;
                case 'radarChart':
                  return <PerformanceRadarChart key={index} userId={activeUser} role="student" />;
                default:
                  return null;
              }
            })}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
