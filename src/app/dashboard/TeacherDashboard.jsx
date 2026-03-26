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
import TeacherTable from "./TeacherTable";
import { StatCardsContainer } from "../../components/StatCards";

export default function TeacherDashboard() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    try {
      const activeUserCookie = getCokie("ACTIVE_USER");
      console.log('ACTIVE_USER cookie raw:', activeUserCookie);
      
      if (activeUserCookie) {
        const userData = JSON.parse(activeUserCookie);
        console.log('Parsed user data structure:', userData);
        console.log('User role:', userData.role);
        
        // Final security check - ensure this is a staff user
        if (userData.role !== 'staff') {
          console.error('Non-staff user attempted to access teacher dashboard');
          window.location.href = '/dashboard'; // Redirect back to general dashboard
          return;
        }

        if (userData.id) {
          setActiveUser(userData.id);
          console.log('Set activeUser to:', userData.id);
        } else {
          console.error('No ID field found in user data');
          // Try to find ID in other possible fields
          const possibleIdFields = ['user_id', 'userId', 'id', 'pk'];
          const foundId = possibleIdFields.find(field => userData[field]);
          if (foundId) {
            setActiveUser(userData[foundId]);
            console.log('Found ID in field:', foundId, 'value:', userData[foundId]);
          } else {
            console.error('No valid ID field found in user data');
          }
        }
      } else {
        console.log('No ACTIVE_USER cookie found');
      }
    } catch (error) {
      console.error('Error parsing ACTIVE_USER cookie:', error);
    }
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
      // Use the new bulk upload endpoint
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      // Add staff_id to help backend with store_parsed_result
      formData.append('staff_id', activeUser);

      const response = await api.post("/marksheet/upload-pdf-bulk", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      
      // Show detailed results
      toast.success(`Upload Complete: ${result.uploaded} uploaded, ${result.parsed} parsed, ${result.failed} failed`);
      
      // Show details for each file
      result.details?.forEach((detail, index) => {
        if (detail.status === 'success') {
          toast.success(`${detail.filename}: ${detail.status} (Exam ID: ${detail.exam_id})`);
        } else {
          toast.error(`${detail.filename}: ${detail.error}`);
        }
      });

      // Update uploaded files state
      setUploadedFiles(prev => [...prev, ...selectedFiles]);
      setSelectedFiles([]);
      
      // Note: fetchUploads is not available in TeacherDashboard
      // The data will be refreshed when the component re-renders or user navigates
      
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error(`Bulk upload failed: ${error.response?.data?.message || error.message}`);
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
    let successCount = 0;
    let failCount = 0;

    // Parse each file individually
    for (const file of uploadedFiles) {
      try {
        const response = await api.post("/marksheet/parse", {
          filename: file.name
        });

        if (response.data?.success) {
          toast.success(`${file.name}: Parsed successfully! GPA: ${response.data.data?.gpa || 'N/A'}`);
          successCount++;
        } else {
          toast.warning(`${file.name}: Parse completed but no data returned`);
        }
      } catch (error) {
        console.error(`Parse error for ${file.name}:`, error);
        const errorMsg = error.response?.data?.detail || error.message;
        toast.error(`${file.name}: ${errorMsg}`);
        failCount++;
      }
    }

    setIsParsing(false);
    setUploadedFiles([]);

    // Show summary
    if (successCount > 0) {
      toast.success(`Parse complete: ${successCount} succeeded, ${failCount} failed`);
      // Refresh the page to update charts with new data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else if (failCount > 0) {
      toast.error(`All ${failCount} files failed to parse`);
    }
  };

  return (
    <div className="min-h-screen bg-[#b9f36a] text-black font-['IBM_Plex_Mono',monospace] flex flex-col">
      
      {/* Navbar */}
      <Navbar userRole="staff" />

      <main className="flex-1 px-[20px] sm:px-[40px] py-[20px] sm:py-[40px]">

        {/* Title */}
        <section className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-[48px] sm:text-[64px] lg:text-[80px] leading-[0.9] font-extrabold">
                DASH <br />BOARD<span>.</span>
              </h1>
              <p className="text-[16px] sm:text-[18px] lg:text-[20px] font-bold mt-4">
                ANALYZE SMARTER.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="text-[24px] sm:text-[32px] font-bold mb-6 uppercase">Overview Analytics<span>.</span></h2>
          {activeUser ? (
            <StatCardsContainer userId={activeUser} route={2} />
          ) : (
            <div className="text-center py-8">
              <p>Loading user data...</p>
            </div>
          )}
        </section>

        {/* Upload + Table */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 lg:p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col items-center">
              <BulkFileUpload
                onFilesSelect={handleFilesSelect}
                disabled={isUploading || isParsing}
                clearFiles={uploadedFiles.length === 0}
              />

              {selectedFiles.length > 0 && (
                <button
                  onClick={handleBulkUpload}
                  disabled={isUploading}
                  className="mt-4 w-full bg-black text-[#b9f36a] px-4 py-3 sm:px-6 font-bold border-[2px] border-black text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  {isUploading ? "UPLOADING..." : `UPLOAD ${selectedFiles.length} MARKSHEET${selectedFiles.length !== 1 ? 'S' : ''}`}
                </button>
              )}

              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleParse}
                  disabled={isParsing}
                  className="mt-4 w-full bg-blue-600 text-white px-4 py-3 sm:px-6 font-bold text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
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

        {/* Advanced Analytics */}
        <section className="mb-10">
          <div className="bg-white border-[3px] border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <h2 className="text-[28px] sm:text-[36px] font-black uppercase mb-4">Advanced Analytics<span>.</span></h2>
              <p className="text-[16px] font-bold text-gray-700 uppercase">
                Explore deep insights, class distribution, radar charts, and individual student progress trends in our dedicated analytics suite.
              </p>
            </div>
            <NavLink
              to="/teacher-analytics"
              className="bg-[#b9f36a] text-black px-8 py-4 font-black text-lg uppercase border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all whitespace-nowrap"
            >
              Open Analytics ↗
            </NavLink>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
