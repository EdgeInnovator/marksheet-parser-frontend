import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { validatePDFFile, formatFileSize } from '../app/utils/fileUpload';

export default function BulkFileUpload({ onFilesSelect, disabled = false, clearFiles = false }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Clear internal state when clearFiles prop changes
  useEffect(() => {
    if (clearFiles) {
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearFiles]);

  const handleFilesSelect = (files) => {
    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach(file => {
      const validation = validatePDFFile(file);
      
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ file: file.name, error: validation.error });
      }
    });

    // Show errors for invalid files
    invalidFiles.forEach(({ file, error }) => {
      toast.error(`${file}: ${error}`, {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
      });
    });

    // Add valid files to selection
    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onFilesSelect(newFiles);
      
      // Show success message for valid files
      validFiles.forEach(file => {
        toast.success(`File "${file.name}" selected (${formatFileSize(file.size)})`, {
          position: "top-right",
          autoClose: 3000,
          theme: "light",
        });
      });
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFilesSelect(files);
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
      handleFilesSelect(files);
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelect(newFiles);
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFilesSelect([]);
  };

  const getTotalSize = () => {
    return selectedFiles.reduce((total, file) => total + file.size, 0);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      {!selectedFiles || selectedFiles.length === 0 ? (
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
            UPLOAD MARKSHEETS
          </h3>
          <p className="text-[11px] text-gray-600 mb-4">
            Drag & drop PDF files here or click to browse
          </p>
          <p className="text-[10px] text-gray-500">
            PDF files only • Max 5MB per file • Multiple files supported
          </p>
          <button 
            type="button"
            className="mt-6 bg-[#b9f36a] text-black px-6 py-3 font-bold border-[2px] border-black hover:bg-black hover:text-[#b9f36a] transition-colors"
            disabled={disabled}
          >
            CHOOSE FILES ↗
          </button>
        </div>
      ) : (
        <div className="bg-white border-[3px] border-black p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-bold text-[12px]">
                  {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected
                </p>
                <p className="text-[10px] text-gray-600">
                  Total size: {formatFileSize(getTotalSize())}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 bg-black text-[#b9f36a] text-sm font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black"
              >
                Add More
              </button>
              <button
                type="button"
                onClick={clearAllFiles}
                className="px-3 py-1 bg-red-500 text-white text-sm font-bold border-[2px] border-red-600 hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-lg">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{file.name}</p>
                    <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 text-[10px] mt-4">
            ✓ {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} ready for upload
          </div>
        </div>
      )}
    </div>
  );
}
