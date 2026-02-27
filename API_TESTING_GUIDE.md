# Frontend API Testing Guide

This guide provides comprehensive testing instructions for the updated frontend components with the new backend API endpoints.

## 📋 **Updated API Endpoints**

### 1. **POST /marksheet/upload** (Single Upload)
- **Used by**: Student Dashboard
- **Purpose**: Upload single marksheet file
- **Request**: FormData with `files` field
- **Response**: `{ message: string, files: array }`

### 2. **POST /api/teacher/upload-marksheets** (Bulk Upload)
- **Used by**: Teacher Dashboard  
- **Purpose**: Upload multiple marksheets and map to teacher
- **Request**: FormData with `files[]` array and `teacher_id`
- **Response**: Complex response with success/failure details

### 3. **GET /api/teacher/students** (Student List)
- **Used by**: Teacher Charts Component
- **Purpose**: Get list of students assigned to teacher
- **Request**: Query param `teacher_id`
- **Response**: `{ success: boolean, data: { students: [], total_count: number } }`

## 🧪 **Testing Scenarios**

### **Single Upload Testing (Student Dashboard)**

#### **Success Cases:**
1. **Valid PDF Upload**
   - Upload a valid PDF with student name
   - Expected: Success toast, student name extracted
   - Check: `student_name` in response, file stored correctly

2. **Large PDF Upload**
   - Upload PDF near size limit (5MB)
   - Expected: Should handle gracefully
   - Check: No timeout, proper error if too large

#### **Error Cases:**
1. **Invalid File Type**
   - Upload non-PDF file (JPG, DOCX, etc.)
   - Expected: Error toast about file type
   - Check: 400 Bad Request response

2. **Corrupted PDF**
   - Upload corrupted PDF file
   - Expected: Error toast about processing
   - Check: Proper error message in response

3. **No Student Name**
   - Upload PDF without recognizable student name
   - Expected: Error toast about name extraction
   - Check: 400 response with "Student name not found"

4. **Network Error**
   - Test with backend server down
   - Expected: Network error toast
   - Check: Proper error handling

### **Bulk Upload Testing (Teacher Dashboard)**

#### **Success Cases:**
1. **Multiple Valid PDFs**
   - Upload 3-5 valid PDF files
   - Expected: Success toast with count
   - Check: All files processed, students extracted

2. **Mixed Success/Failure**
   - Upload 2 valid PDFs + 1 invalid
   - Expected: Partial success message
   - Check: Success files processed, failed files listed

3. **Large Batch Upload**
   - Upload 10+ valid PDFs
   - Expected: Success with all files
   - Check: Performance, timeout handling

#### **Error Cases:**
1. **All Files Invalid**
   - Upload only invalid files
   - Expected: Complete failure message
   - Check: All files listed as failed

2. **Missing Teacher ID**
   - Test with invalid/missing teacher_id
   - Expected: Authentication/authorization error
   - Check: 403 Forbidden response

3. **Duplicate Files**
   - Upload same files multiple times
   - Expected: Should handle duplicates gracefully
   - Check: No unexpected errors

### **Student List Testing (Teacher Charts)**

#### **Success Cases:**
1. **Valid Teacher ID**
   - Load teacher dashboard with valid ID
   - Expected: Student list populated
   - Check: Dropdown populated with student names

2. **Empty Student List**
   - Teacher with no assigned students
   - Expected: Empty state message
   - Check: No errors, proper empty state

3. **Large Student List**
   - Teacher with many students (20+)
   - Expected: All students loaded
   - Check: Performance, dropdown usability

#### **Error Cases:**
1. **Invalid Teacher ID**
   - Access with invalid teacher_id
   - Expected: Access denied error
   - Check: 403 Forbidden response

2. **Unauthorized Access**
   - Student trying to access teacher data
   - Expected: Access denied
   - Check: Proper authorization check

## 🔧 **Testing Tools & Commands**

### **Browser Developer Tools**
1. **Network Tab**: Monitor API calls
2. **Console**: Check for JavaScript errors
3. **Application Tab**: Verify localStorage/cookies

### **cURL Commands for Backend Testing**

#### **Single Upload Test**
```bash
curl -X POST "http://127.0.0.1:8000/upload-marksheet/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test_student.pdf"
```

#### **Bulk Upload Test**
```bash
curl -X POST "http://127.0.0.1:8000/api/teacher/upload-marksheets" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "files=@student1.pdf" \
  -F "files=@student2.pdf" \
  -F "teacher_id=1"
```

#### **Student List Test**
```bash
curl -X GET "http://127.0.0.1:8000/api/teacher/students?teacher_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📝 **Test Checklist**

### **Frontend Components**
- [ ] StudentDashboard.jsx upload functionality
- [ ] TeacherDashboard.jsx bulk upload
- [ ] TeacherCharts.jsx student loading
- [ ] Error toast notifications
- [ ] Loading states
- [ ] Form validation

### **API Integration**
- [ ] Correct endpoint URLs
- [ ] Proper request headers
- [ ] FormData structure
- [ ] Response parsing
- [ ] Error handling

### **User Experience**
- [ ] Clear success/error messages
- [ ] Loading indicators
- [ ] File validation feedback
- [ ] Responsive design
- [ ] Accessibility

### **Edge Cases**
- [ ] Network failures
- [ ] Server errors
- [ ] Large files
- [ ] Invalid file types
- [ ] Empty responses
- [ ] Timeout handling

## 🐛 **Common Issues & Solutions**

### **CORS Issues**
- Ensure backend allows frontend origin
- Check preflight OPTIONS requests

### **File Upload Issues**
- Verify FormData field names match backend
- Check file size limits
- Ensure proper MIME types

### **Authentication Issues**
- Verify token format and validity
- Check Authorization header format
- Ensure proper token storage

### **Response Parsing Issues**
- Check response structure matches expectations
- Verify JSON parsing
- Handle undefined/null values

## 📊 **Performance Testing**

### **Metrics to Monitor**
1. **Upload Time**: Time to upload and process files
2. **Response Time**: API response latency
3. **Memory Usage**: Browser memory during uploads
4. **Error Rate**: Percentage of failed operations

### **Load Testing Scenarios**
1. **Concurrent Uploads**: Multiple users uploading
2. **Large Files**: Maximum file size uploads
3. **Batch Operations**: Bulk upload with many files

## 🚀 **Deployment Testing**

### **Pre-deployment Checklist**
- [ ] All API endpoints reachable
- [ ] Error handling works in production
- [ ] File uploads work in production
- [ ] Authentication flows work
- [ ] Performance acceptable
- [ ] Security measures in place

### **Post-deployment Monitoring**
- Monitor API error rates
- Check upload success rates
- Monitor response times
- Track user feedback

---

**Note**: This testing guide should be used in conjunction with the backend API documentation to ensure comprehensive testing of all integration points.
