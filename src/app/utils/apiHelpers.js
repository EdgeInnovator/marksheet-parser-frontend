// API response handling utilities for updated backend endpoints

/**
 * Handles API responses consistently across the application
 * @param {Object} response - Axios response object
 * @param {string} successMessage - Custom success message (optional)
 * @returns {Object} - { success: boolean, message: string, data: any }
 */
export const handleApiResponse = (response, successMessage = null) => {
  if (response.data?.success) {
    return {
      success: true,
      message: successMessage || response.data?.message || 'Operation successful',
      data: response.data
    };
  } else {
    return {
      success: false,
      message: response.data?.message || response.data?.detail || 'Operation failed',
      data: response.data
    };
  }
};

/**
 * Handles API errors consistently across the application
 * @param {Object} error - Axios error object
 * @returns {string} - Error message
 */
export const handleApiError = (error) => {
  if (error.response?.status === 403) {
    return 'Access denied: You do not have permission to perform this action';
  }
  
  if (error.response?.status === 401) {
    return 'Authentication required: Please log in again';
  }
  
  if (error.response?.status === 400) {
    return error.response?.data?.detail || 
           error.response?.data?.message || 
           'Invalid request: Please check your input';
  }
  
  if (error.response?.status === 404) {
    return 'Resource not found: The requested resource does not exist';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error: Please try again later';
  }
  
  // Network or other errors
  if (error.message === 'Network Error') {
    return 'Network error: Please check your internet connection';
  }
  
  return error.response?.data?.detail || 
         error.response?.data?.message || 
         error.message || 
         'An unexpected error occurred';
};

/**
 * Validates marksheet upload response structure (for /marksheet/upload route)
 * @param {Object} response - API response data
 * @returns {Object} - Validation result
 */
export const validateMarksheetUploadResponse = (response) => {
  if (!response?.files || !Array.isArray(response.files)) {
    return {
      valid: false,
      uploadedFiles: [],
      message: response?.detail || 'Upload failed - invalid response format'
    };
  }
  
  return {
    valid: true,
    uploadedFiles: response.files,
    message: response?.message || `Successfully uploaded ${response.files.length} file(s)`,
    error: null
  };
};

/**
 * Validates parse response structure (for /marksheet/parse route)
 * @param {Object} response - API response data
 * @returns {Object} - Validation result
 */
export const validateParseResponse = (response) => {
  if (!response?.success) {
    return {
      valid: false,
      studentData: null,
      error: response?.detail || 'Parse failed'
    };
  }
  
  return {
    valid: true,
    studentData: response?.data || null,
    message: 'Marksheet parsed successfully',
    error: null
  };
};

/**
 * Validates simple upload response structure (for /upload route)
 * @param {Object} response - API response data
 * @returns {Object} - Validation result
 */
export const validateSimpleUploadResponse = (response) => {
  if (!response?.files || !Array.isArray(response.files)) {
    return {
      valid: false,
      uploadedFiles: [],
      error: response?.detail || 'Upload failed - invalid response format'
    };
  }
  
  return {
    valid: true,
    uploadedFiles: response.files,
    message: response?.message || `Successfully uploaded ${response.files.length} file(s)`,
    error: null
  };
};

/**
 * Validates upload response structure for single file upload
 * @param {Object} response - API response data
 * @returns {Object} - { valid: boolean, studentName: string|null, error: string|null }
 */
export const validateSingleUploadResponse = (response) => {
  if (!response?.success) {
    return {
      valid: false,
      studentName: null,
      error: response?.detail || 'Upload failed'
    };
  }
  
  if (!response?.student_name) {
    return {
      valid: false,
      studentName: null,
      error: 'Student name not found in response'
    };
  }
  
  return {
    valid: true,
    studentName: response.student_name,
    error: null
  };
};

/**
 * Validates bulk upload response structure
 * @param {Object} response - API response data
 * @returns {Object} - Validation result with detailed information
 */
export const validateBulkUploadResponse = (response) => {
  // Handle both success (200) and partial success (207) cases
  if (!response?.success) {
    return {
      valid: false,
      uploadedCount: 0,
      failedCount: response?.failed_files?.length || 0,
      uploadedFiles: [],
      extractedStudents: [],
      failedFiles: response?.failed_files || [],
      error: response?.message || response?.detail || 'Bulk upload failed'
    };
  }
  
  // For partial success (207), success is still true but we have failed files
  const uploadedCount = response?.uploaded_files?.length || 0;
  const failedCount = response?.failed_files?.length || 0;
  
  return {
    valid: true,
    uploadedCount: uploadedCount,
    failedCount: failedCount,
    uploadedFiles: response?.uploaded_files || [],
    extractedStudents: response?.extracted_students || [],
    failedFiles: response?.failed_files || [],
    teacherStudentsMappings: response?.teacher_students_mappings || [],
    error: null,
    isPartialSuccess: failedCount > 0 && uploadedCount > 0
  };
};

/**
 * Validates students list response structure
 * @param {Object} response - API response data
 * @returns {Object} - Validation result
 */
export const validateStudentsResponse = (response) => {
  if (!response?.success) {
    return {
      valid: false,
      students: [],
      totalCount: 0,
      error: response?.detail || 'Failed to fetch students'
    };
  }
  
  const students = response?.data?.students || [];
  
  return {
    valid: true,
    students: students,
    totalCount: response?.data?.total_count || students.length,
    error: null
  };
};

/**
 * Formats student data for display in dropdowns
 * @param {Array} students - Array of student objects
 * @returns {Array} - Formatted student options
 */
export const formatStudentOptions = (students) => {
  return students.map(student => ({
    value: student.student_name,
    label: student.student_name,
    id: student.id,
    teacherId: student.teacher_id,
    createdAt: student.created_at
  }));
};

/**
 * Creates FormData for file uploads with consistent field names
 * @param {File|Array} files - Single file or array of files
 * @param {Object} additionalData - Additional form data
 * @returns {FormData} - Form data object
 */
export const createUploadFormData = (files, additionalData = {}) => {
  const formData = new FormData();
  
  if (Array.isArray(files)) {
    // Bulk upload
    files.forEach(file => {
      formData.append("files", file);
    });
  } else {
    // Single upload
    formData.append("file", files);
  }
  
  // Add additional data
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });
  
  return formData;
};
