# 📄 **Student Upload API Documentation**

## 🎯 **New Student Upload Route**

### **Endpoint:** `POST /marksheet/upload`

**Purpose:** Upload single marksheet file (simple upload without student name extraction)

---

## 📤 **Request Format**

### **Headers:**
```javascript
{
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json'
  // Note: Content-Type is automatically set by browser for FormData
}
```

### **Form Data:**
```javascript
const formData = new FormData();
formData.append('files', fileObject); // Backend expects 'files' field
```

### **JavaScript Example:**
```javascript
const handleUpload = async (selectedFile) => {
  const formData = new FormData();
  formData.append('files', selectedFile);

  try {
    const response = await api.post('/marksheet/upload', formData);
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

### **cURL Example:**
```bash
curl -X POST "http://127.0.0.1:8000/marksheet/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "files=@student_marksheet.pdf"
```

---

## 📥 **Response Format**

### **Success Response (200 OK):**
```json
{
  "message": "Successfully uploaded 2 files",
  "files": [
    {
      "original_filename": "marksheet1.pdf",
      "saved_filename": "marksheet1.pdf"
    },
    {
      "original_filename": "marksheet2.pdf", 
      "saved_filename": "marksheet2_1.pdf"
    }
  ]
}
```

### **Error Response (400 Bad Request):**
```json
{
  "detail": "No files selected"
}
```

### **Error Response (400 Bad Request) - Invalid File Type:**
```json
{
  "detail": "Invalid file type for document.txt. Allowed types: .pdf, .jpg, .jpeg, .png"
}
```

---

## 🔍 **Parse Route Documentation**

### **Endpoint:** `POST /marksheet/parse`

**Purpose:** Parse a specific uploaded marksheet file to extract student information

**Request Format:**
```javascript
// Headers:
{
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}

// Body: JSON with filename
POST /marksheet/parse
{
  "filename": "marksheet1.pdf"
}
```

**cURL Example:**
```bash
curl -X POST "http://127.0.0.1:8000/marksheet/parse" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename": "marksheet1.pdf"}'
```

### **Response Format:**
```json
{
  "success": true,
  "data": {
    "student_name": "AYUSH KUMAR SINGH",
    "student_id": "202112345",
    "semester": "FIFTH SEMESTER",
    "program": "DIPLOMA IN COMPUTER ENGINEERING",
    "courses": [
      {
        "course_code": "MATHEMATI",
        "course_name": "Mathematics",
        "credits": 3,
        "grade": "A",
        "gpa_points": 4.0
      },
      {
        "course_code": "COMPUTER",
        "course_name": "Computer Programming",
        "credits": 3,
        "grade": "B+",
        "gpa_points": 3.3
      }
    ],
    "total_credits": 6,
    "gpa": 3.65,
    "academic_standing": "Good"
  }
}
```

### **Error Responses:**
```json
// File not found
{
  "detail": "File not found"
}

// Invalid filename
{
  "detail": "Invalid filename"
}

// Only PDF files supported
{
  "detail": "Only PDF files are supported"
}

// Processing error
{
  "detail": "Error processing file: <error_message>"
}
```

---

## 🔧 **Frontend Integration Example**

### **Complete Upload + Parse Flow:**
```javascript
import React, { useState } from 'react';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { validateMarksheetUploadResponse, validateParseResponse } from '../utils/apiHelpers';

function StudentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);

      const response = await api.post("/marksheet/upload", formData);
      
      const validation = validateMarksheetUploadResponse(response.data);

      if (validation.valid) {
        toast.success(validation.message || "Marksheet uploaded successfully!");
        
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
      const filenameToUse = uploadedFile.savedName || uploadedFile.name;

      const response = await api.post("/marksheet/parse", {
        filename: filenameToUse,
      });

      const validation = validateParseResponse(response.data);

      if (validation.valid) {
        toast.success(validation.message || "Marksheet parsed successfully!");
        
        if (validation.studentData) {
          setParsedData(validation.studentData);
          console.log("Parsed student data:", validation.studentData);
        }
        
        setUploadedFile(null);
      } else {
        toast.error(validation.error || "Parse validation failed");
      }
    } catch (error) {
      console.error("Parse error:", error);
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files[0])} />
      
      <button onClick={handleUpload} disabled={!selectedFile || isUploading}>
        {isUploading ? "Uploading..." : "Upload Marksheet"}
      </button>
      
      <button onClick={handleParse} disabled={!uploadedFile || isParsing}>
        {isParsing ? "Parsing..." : "Parse Marksheet"}
      </button>
      
      {parsedData && (
        <div>
          <h3>Parsed Student Data:</h3>
          <p>Name: {parsedData.student_name}</p>
          <p>ID: {parsedData.student_id}</p>
          <p>GPA: {parsedData.gpa}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 **Summary Table**

| Route | Method | Purpose | Response Structure |
|-------|--------|----------|-------------------|
| `/marksheet/upload` | POST | Upload marksheet files | `{ message: string, files: array }` |
| `/marksheet/parse` | POST | Parse uploaded file | `{ success: boolean, data: object }` |

---

**This complete implementation now matches your backend exactly!** 📄✨

---

## 🔄 **Frontend Implementation**

### **Component Usage:**
```jsx
import React, { useState } from 'react';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { validateSimpleUploadResponse, handleApiError } from '../utils/apiHelpers';

function StudentUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
      const formData = new FormData();
      formData.append("files", selectedFile);

      const response = await api.post("/marksheet/upload", formData);
      
      const validation = validateMarksheetUploadResponse(response.data);

      if (validation.valid) {
        if (validation.studentInfo) {
          toast.success(`${validation.message} - Student: ${validation.studentInfo.name}`);
        } else {
          toast.success(validation.message || "Marksheet uploaded successfully!");
        }
        
        setUploadedFile({
          ...selectedFile,
          savedName: validation.filename,
          examId: validation.examId,
          studentInfo: validation.studentInfo,
        });
        
        if (validation.processingError) {
          toast.warning(`Processing issue: ${validation.processingError}`);
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

  return (
    <div>
      {/* File selection component */}
      <input type="file" accept=".pdf" onChange={(e) => handleFileSelect(e.target.files[0])} />
      
      <button 
        onClick={handleUpload} 
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Marksheet"}
      </button>
    </div>
  );
}
```

---

## 📋 **Key Features**

### **File Handling:**
- ✅ **Single File Upload**: Students upload one file at a time
- ✅ **File Validation**: Only PDF files allowed
- ✅ **Duplicate Handling**: Automatically renames duplicate files
- ✅ **Safe Filenames**: Removes special characters from filenames

### **Response Structure:**
- ✅ **Consistent Format**: Always returns `message` and `files` array
- ✅ **File Mapping**: Maps original filename to saved filename
- ✅ **Error Details**: Clear error messages for different failure scenarios

### **Security:**
- ✅ **Authentication Required**: Bearer token authentication
- ✅ **File Type Validation**: Server-side validation of file extensions
- ✅ **Safe Filename Generation**: Prevents path traversal attacks

---

## 🆚 **Comparison with Teacher Upload**

| Feature | Student Upload (`/upload`) | Teacher Upload (`/api/teacher/upload-marksheets`) |
|---------|---------------------------|---------------------------------------------------|
| **Purpose** | Simple file upload | Bulk upload with student extraction |
| **Files** | Single file | Multiple files |
| **Field Name** | `files` | `files` (array) |
| **Student Name** | Not extracted | Extracted automatically |
| **Teacher Mapping** | Not required | Automatic mapping |
| **Response** | File info only | File info + students + mappings |
| **Use Case** | Student self-upload | Teacher bulk upload |

---

## 🧪 **Testing Scenarios**

### **Success Cases:**
1. **Valid PDF Upload**
   - Upload a valid PDF file
   - Expected: Success message with file info
   - Check: File saved with correct name

2. **Duplicate File Upload**
   - Upload same filename twice
   - Expected: File renamed with counter
   - Check: `original_filename` vs `saved_filename`

### **Error Cases:**
1. **No File Selected**
   - Submit without selecting file
   - Expected: 400 error with "No files selected"
   - Check: Proper error handling

2. **Invalid File Type**
   - Upload non-PDF file
   - Expected: 400 error with file type message
   - Check: File validation works

3. **Large File Upload**
   - Upload very large PDF
   - Expected: Should handle gracefully
   - Check: Timeout and size limits

---

## 🚀 **Integration Notes**

### **Frontend Integration:**
- Use `FileUpload` component for file selection
- Integrate with `StudentDashboard` component
- Handle loading states and error messages
- Update UI after successful upload

### **Backend Integration:**
- Ensure `/upload` route is properly configured
- File storage location is accessible
- Error handling covers all edge cases
- Logging for debugging upload issues

---

**This simple upload route provides students with an easy way to upload marksheets without the complexity of student name extraction and teacher mapping.** 📄✨
