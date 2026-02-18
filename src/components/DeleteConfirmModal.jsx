import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, filename }) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
          <h2 className="text-xl font-bold tracking-wider flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            CONFIRM DELETE
          </h2>
          <button 
            onClick={onClose}
            className="btn btn-circle btn-sm bg-gray-500 text-white border-2 border-black hover:bg-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* Warning Message */}
        <div className="bg-red-50 border-2 border-red-600 p-4 mb-6">
          <div className="flex items-center gap-3">
            <Trash2 size={24} className="text-red-600" />
            <div>
              <p className="font-bold text-red-800">Are you sure you want to delete this file?</p>
              <p className="text-sm text-red-700 mt-1">This action cannot be undone.</p>
            </div>
          </div>
        </div>

        {/* File Details */}
        <div className="bg-gray-50 border-2 border-black p-4 mb-6">
          <h3 className="font-bold text-sm mb-2">FILE TO DELETE:</h3>
          <p className="text-gray-800 font-mono text-sm break-all">{filename}</p>
        </div>

        {/* Warning List */}
        <div className="mb-6">
          <ul className="text-sm space-y-1">
            <li className="flex items-center gap-2">
              <span className="text-red-600">•</span>
              <span>The file will be permanently deleted from the system</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">•</span>
              <span>All associated data will be lost</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">•</span>
              <span>This action cannot be reversed</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="btn bg-gray-500 text-white border-2 border-black hover:bg-gray-600 font-bold"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn bg-red-600 text-white border-2 border-black hover:bg-red-700 font-bold flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete File
          </button>
        </div>
      </div>
    </div>
  );
}
