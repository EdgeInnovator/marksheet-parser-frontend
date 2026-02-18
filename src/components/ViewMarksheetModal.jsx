import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, User, Award, TrendingUp } from 'lucide-react';
import { api } from '../app/config/axiosSetup';
import { toast } from 'react-toastify';

export default function ViewMarksheetModal({ isOpen, onClose, filename }) {
  const [marksheetData, setMarksheetData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && filename) {
      fetchMarksheetData();
    }
  }, [isOpen, filename]);

  const fetchMarksheetData = async () => {
    setLoading(true);
    try {
      const response = await api({
        url: `/files/view/${filename}`,
        method: 'GET'
      });
      
      setMarksheetData(response.data.data);
    } catch (error) {
      console.error('Error fetching marksheet data:', error);
      toast.error('Failed to load marksheet details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api({
        url: `/files/download/${filename}`,
        method: 'GET',
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
          <h2 className="text-2xl font-bold tracking-wider">MARKSHEET DETAILS</h2>
          <button 
            onClick={onClose}
            className="btn btn-circle btn-sm bg-red-500 text-white border-2 border-black hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg text-[#b9f36a]"></div>
          </div>
        ) : marksheetData ? (
          <div className="space-y-6">
            {/* File Information */}
            <div className="bg-gray-50 border-2 border-black p-4">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <FileText size={20} />
                FILE INFORMATION
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Filename:</span>
                  <p className="text-gray-700">{marksheetData.filename}</p>
                </div>
                <div>
                  <span className="font-semibold">File Size:</span>
                  <p className="text-gray-700">
                    {marksheetData.size ? `${(marksheetData.size / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Upload Date:</span>
                  <p className="text-gray-700">
                    {marksheetData.upload_date 
                      ? new Date(marksheetData.upload_date).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Parse Status:</span>
                  <p className="text-gray-700">
                    <span className="badge badge-success bg-[#b9f36a] text-black border-black">
                      {marksheetData.parse_status || 'UPLOADED'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Student Information */}
            {marksheetData.parsed_data && (
              <>
                <div className="bg-blue-50 border-2 border-black p-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <User size={20} />
                    STUDENT INFORMATION
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold">Student Name:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.student_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Enrollment No:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.enrollment_no || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Examination:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.examination || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Semester:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.semester || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Course:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.course || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Subjects Count:</span>
                      <p className="text-gray-700">{marksheetData.parsed_data.subjects_count || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Subject Grades */}
                {marksheetData.parsed_data.subjects && marksheetData.parsed_data.subjects.length > 0 && (
                  <div className="bg-green-50 border-2 border-black p-4">
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Award size={20} />
                      SUBJECT GRADES
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="table table-zebra table-sm w-full">
                        <thead>
                          <tr className="border-b-2 border-black">
                            <th className="text-left">SUBJECT</th>
                            <th className="text-center">MARKS</th>
                            <th className="text-center">GRADE</th>
                            <th className="text-center">STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marksheetData.parsed_data.subjects.map((subject, index) => (
                            <tr key={index} className="border-b border-gray-300">
                              <td className="font-medium">{subject.name || 'N/A'}</td>
                              <td className="text-center">{subject.marks || 'N/A'}</td>
                              <td className="text-center">
                                <span className="badge badge-info bg-blue-200 text-black border-black">
                                  {subject.grade || 'N/A'}
                                </span>
                              </td>
                              <td className="text-center">
                                <span className={`badge ${
                                  subject.status === 'PASS' 
                                    ? 'badge-success bg-[#b9f36a] text-black border-black'
                                    : 'badge-error bg-red-200 text-black border-black'
                                }`}>
                                  {subject.status || 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Overall Performance */}
                <div className="bg-yellow-50 border-2 border-black p-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <TrendingUp size={20} />
                    OVERALL PERFORMANCE
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#b9f36a]">
                        {marksheetData.parsed_data.total_marks_obtained || 'N/A'}
                      </div>
                      <div className="text-gray-600">Total Marks Obtained</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {marksheetData.parsed_data.percentage || 'N/A'}%
                      </div>
                      <div className="text-gray-600">Percentage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        {marksheetData.parsed_data.result || 'N/A'}
                      </div>
                      <div className="text-gray-600">Result</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {marksheetData.parsed_data.gpa || 'N/A'}
                      </div>
                      <div className="text-gray-600">GPA</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t-2 border-black">
              <button 
                onClick={handleDownload}
                className="btn bg-[#b9f36a] text-black border-2 border-black hover:bg-black hover:text-[#b9f36a] font-bold"
              >
                <Download size={16} />
                Download
              </button>
              <button 
                onClick={onClose}
                className="btn bg-red-500 text-white border-2 border-black hover:bg-red-600 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No marksheet data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
