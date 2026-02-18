import React, { useState, useEffect } from 'react';
import { Download, Eye, Trash } from 'lucide-react';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { getCokie } from '../utils/utils';

export default function StudentTable() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserUploads = async () => {
    try {
      // Get current user from cookies
      const activeUser = getCokie('ACTIVE_USER');
      const userData = activeUser ? JSON.parse(activeUser) : null;
      
      console.log('=== FETCHING USER UPLOADS ===');
      console.log('User data:', userData);
      console.log('User ID:', userData?.id);
      
      const response = await api({
        url: '/marksheet/uploaded-files',
        method: 'POST',
        data: {
          user_id: userData?.id
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      // Handle both database records and file system responses
      const filesData = response.data?.data || [];
      console.log('Files data:', filesData);
      console.log('Files count:', filesData.length);
      setFiles(filesData);
    } catch (error) {
      console.error('=== FETCH ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast.error(`Failed to load uploaded files: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await api({
        url: `/files/download/${filename}`,
        method: 'GET',
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
      
      // Refresh file list to update display
      fetchUserUploads();
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const handleView = async (filename) => {
    try {
      const response = await api({
        url: `/files/view/${filename}`,
        method: 'GET'
      });
      
      // Show file metadata in a modal or alert
      const fileData = response.data;
      
      toast.info(`File: ${fileData.filename}\nSize: ${(fileData.size / 1024 / 1024).toFixed(2)} MB\nModified: ${new Date(fileData.upload_date).toLocaleDateString()}\nStatus: ${fileData.parse_status}\nStudent: ${fileData.parsed_data?.student_name || 'N/A'}`);
    } catch (error) {
      console.error('=== VIEW ERROR ===');
      console.error('Error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      toast.error('Failed to view file details');
    }
  };

  const handleDelete = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete ${filename}?`)) {
      return;
    }
    
    try {
      await api({
        url: `/files/${filename}`,
        method: 'DELETE'
      });
      
      toast.success('File deleted successfully');
      fetchUserUploads(); // Refresh list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  useEffect(() => {
    fetchUserUploads();
    
    // Make function available globally for dashboard to call
    window.fetchUserUploads = fetchUserUploads;
  }, []);

  // Add manual refresh button
  const handleManualRefresh = () => {
    console.log('=== MANUAL REFRESH TRIGGERED ===');
    fetchUserUploads();
    toast.info('Table refreshed manually');
  };

  if (loading) {
    return (
      <div className="col-span-2 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide">
          MY RESULTS
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading uploaded files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="border-b-[3px] border-black p-4 font-bold text-[11px] tracking-wide flex justify-between items-center">
        <span>MY RESULTS</span>
        <button
          onClick={handleManualRefresh}
          className="bg-blue-600 text-white px-3 py-1 text-[10px] font-bold border-[2px] border-blue-600 hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
      
      {files.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No marksheets uploaded yet</p>
        </div>
      ) : (
        <table className="w-full text-[12px]">
          <thead className="border-b-[3px] border-black">
            <tr className="text-left">
              <th className="p-4">FILENAME</th>
              <th>SIZE</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index} className="border-b border-gray-400">
                <td className="p-4 font-medium">{file.filename}</td>
                <td>
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Database record'}
                </td>
                <td>
                  {file.modified 
                    ? new Date(file.modified).toLocaleDateString()
                    : file.created_at 
                      ? new Date(file.created_at).toLocaleDateString()
                      : 'N/A'
                  }
                </td>
                <td>
                  <span className="bg-[#b9f36a] px-3 py-1 border border-black text-[10px] font-bold">
                    UPLOADED
                  </span>
                </td>
                <td>
                  <div className="flex gap-2 cursor-pointer">
                    <Eye 
                      size={16} 
                      onClick={() => handleView(file.filename)}
                      title="View details"
                    />
                    <Download 
                      size={16} 
                      onClick={() => handleDownload(file.filename)}
                      title="Download file"
                    />
                    <Trash 
                      size={16} 
                      onClick={() => handleDelete(file.filename)}
                      title="Delete file"
                      className="text-red-600 hover:text-red-800"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
