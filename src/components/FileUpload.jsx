import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { validatePDFFile, formatFileSize } from '../app/utils/fileUpload';

export default function FileUpload({ onFileSelect, disabled = false, clearFile = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Clear internal state when clearFile prop changes
  useEffect(() => {
    if (clearFile) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearFile]);

  const handleFileSelect = (file) => {
    // Validate file
    const validation = validatePDFFile(file);
    
    if (!validation.valid) {
      toast.error(validation.error, {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }

    // File is valid
    setSelectedFile(file);
    onFileSelect(file);
    
    toast.success(`File "${file.name}" selected (${formatFileSize(file.size)})`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Make clearFileInput available globally
  if (typeof window !== 'undefined') {
    window.clearFileInput = clearFileInput;
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      {!selectedFile ? (
        <div
          className={`border-[3px] border-dashed border-black p-8 text-center cursor-pointer transition-all ${
            isDragging 
              ? 'bg-[#b9f36a] border-solid' 
              : 'bg-white hover:bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="text-5xl mb-4 text-[#b9f36a]">
            ⬆
          </div>
          <h3 className="font-bold tracking-widest text-[14px] mb-2">
            UPLOAD MARKSHEET
          </h3>
          <p className="text-[11px] text-gray-600 mb-4">
            Drag & drop your PDF here or click to browse
          </p>
          <p className="text-[10px] text-gray-500">
            PDF files only • Max 5MB
          </p>
          <button 
            type="button"
            className="mt-6 bg-[#b9f36a] text-black px-6 py-3 font-bold border-[2px] border-black hover:bg-black hover:text-[#b9f36a] transition-colors"
            disabled={disabled}
          >
            CHOOSE FILE ↗
          </button>
        </div>
      ) : (
        <div className="bg-white border-[3px] border-black p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl">📄</div>
              <div>
                <p className="font-bold text-[12px] truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-gray-600">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-red-500 hover:text-red-700 font-bold text-[12px]"
            >
              ✕
            </button>
          </div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 text-[10px]">
            ✓ File ready for upload
          </div>
        </div>
      )}
    </div>
  );
}
