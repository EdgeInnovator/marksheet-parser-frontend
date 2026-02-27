import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import BulkFileUpload from "../../components/BulkFileUpload";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { api } from "../config/axiosSetup";
import { toast } from "react-toastify";
import { getCokie } from "../utils/utils";
import { 
  handleApiResponse, 
  handleApiError, 
  validateBulkUploadResponse, 
  createUploadFormData 
} from "../utils/apiHelpers";

// Teacher-specific components
import TeacherStats from "./TeacherStats";
import TeacherTable from "./TeacherTable";

// Chart components for teachers (only pie and radar)
import TeacherCharts from "./charts/TeacherCharts";

export default function TeacherDashboard() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(getCokie("ACTIVE_USER"));
    setActiveUser(userId.id);
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

  const handleFilesSelect = (files) => {
    setSelectedFiles(files);
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = createUploadFormData(selectedFiles, { teacher_id: activeUser });
      const response = await api.post("/api/teacher/upload-marksheets", formData);
      
      const validation = validateBulkUploadResponse(response.data);

      if (validation.valid) {
        // Success case
        if (validation.isPartialSuccess) {
          toast.info(`Partial success: ${validation.uploadedCount} uploaded, ${validation.failedCount} failed`);
        } else {
          toast.success(`${validation.uploadedCount} file(s) uploaded successfully!`);
        }

        // Handle uploaded files
        if (validation.uploadedFiles.length > 0) {
          setUploadedFiles([...uploadedFiles, ...validation.uploadedFiles]);
        }

        // Show extracted students info
        if (validation.extractedStudents.length > 0) {
          const studentNames = validation.extractedStudents.map(s => s.student_name).join(', ');
          toast.info(`Extracted students: ${studentNames}`);
        }

        // Show failed files if any
        if (validation.failedFiles.length > 0) {
          validation.failedFiles.forEach(({ filename, error }) => {
            toast.error(`${filename}: ${error}`);
          });
        }
      } else {
        // Complete failure case
        toast.error(validation.error || "Bulk upload failed");
        
        // Show all failed files
        if (validation.failedFiles.length > 0) {
          validation.failedFiles.forEach(({ filename, error }) => {
            toast.error(`${filename}: ${error}`);
          });
        }
      }

      // Clear selected files after upload attempt
      setSelectedFiles([]);
      
      // Refresh the page to update student dropdowns with new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error("Bulk upload error:", error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleParse = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("No files to parse");
      return;
    }

    setIsParsing(true);

    try {
      // Use the existing marksheet/generate endpoint for parsing
      const response = await api.post("/marksheet/generate");

      toast.success(response.data?.message || "Marksheets parsed successfully!");
      setUploadedFiles([]);
      
      // Refresh the page to update charts with new data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
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
      <Navbar userRole="teacher" />

      <main className="flex-1 px-[20px] sm:px-[40px] py-[20px] sm:py-[40px]">

        {/* Title */}
        <section className="mb-10">
          <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.9] font-extrabold">
            DASH <br />BOARD<span>.</span>
          </h1>
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold mt-4">
            ANALYZE SMARTER.
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <TeacherStats />
        </section>

        {/* Upload + Table */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 lg:p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
              <BulkFileUpload
                onFilesSelect={handleFilesSelect}
                disabled={isUploading || isParsing}
                clearFiles={uploadedFiles.length === 0}
              />

              {selectedFiles.length > 0 && (
                <button
                  onClick={handleBulkUpload}
                  disabled={isUploading}
                  className="mt-4 w-full bg-black text-[#b9f36a] px-4 py-3 sm:px-6 font-bold border-[2px] border-black text-sm sm:text-base"
                >
                  {isUploading ? "UPLOADING..." : `UPLOAD ${selectedFiles.length} MARKSHEET${selectedFiles.length !== 1 ? 'S' : ''}`}
                </button>
              )}

              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleParse}
                  disabled={isParsing}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-3 sm:px-6 font-bold text-sm sm:text-base"
                >
                  {isParsing ? "PARSING..." : `PARSE ${uploadedFiles.length} MARKSHEET${uploadedFiles.length !== 1 ? 'S' : ''}`}
                </button>
              )}
            </div>

            <div className="lg:col-span-2">
              <TeacherTable />
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-[24px] sm:text-[32px] font-bold">CHARTS</h2>
            <NavLink
              to="/teacher-charts"
              className="bg-black text-[#b9f36a] px-4 sm:px-6 py-2 sm:py-3 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors text-sm sm:text-base"
            >
              VIEW ALL CHARTS ↗
            </NavLink>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Use TeacherCharts component with student dropdowns */}
            <TeacherCharts userId={activeUser} role="teacher" />
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
