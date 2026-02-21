import React, { useState, useEffect } from 'react';
import { Download, Eye, Trash } from 'lucide-react';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { getCokie } from '../utils/utils';
import ViewMarksheetModal from '../../components/ViewMarksheetModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';

export default function StudentTable() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  const fetchUserUploads = async () => {
    try {
      // Get current user from cookies
      const activeUser = getCokie('ACTIVE_USER');
      const userData = activeUser ? JSON.parse(activeUser) : null;
      
      
      const response = await api({
        url: '/marksheet/uploaded-files',
        method: 'POST',
        data: {
          user_id: userData?.id
        }
      });
    
      
      // Handle both database records and file system responses
      const filesData = response.data?.data || [];
      setFiles(filesData);
    } catch (error) {
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

  const handleView = (filename) => {
    setSelectedFile(filename);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
  };

  const handleDelete = (filename) => {
    setFileToDelete(filename);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    try {
      await api({
        url: `/files/${fileToDelete}`,
        method: 'DELETE'
      });
      
      toast.success('File deleted successfully');
      fetchUserUploads(); // Refresh list
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    } finally {
      setIsDeleteModalOpen(false);
      setFileToDelete(null);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setFileToDelete(null);
  };

  useEffect(() => {
    fetchUserUploads();
    
    // Make function available globally for dashboard to call
    window.fetchUserUploads = fetchUserUploads;
  }, []);

  // Add manual refresh button
  const handleManualRefresh = () => {
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
              <th className='hidden md:table-cell'>SIZE</th>
              <th className='hidden md:table-cell'>DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index} className="border-b border-gray-400">
                <td className="p-4 font-medium">{file.filename}</td>
                <td className='hidden md:table-cell'>
                  {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Database record'}
                </td>
                <td className='hidden md:table-cell'>
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
                    {file.size && (
                      <Download 
                        size={16} 
                        onClick={() => handleDownload(file.filename)}
                        title="Download file"
                      />
                    )}
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
      
      <ViewMarksheetModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        filename={selectedFile}
      />
      
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        filename={fileToDelete}
      />
    </div>
  );
}
