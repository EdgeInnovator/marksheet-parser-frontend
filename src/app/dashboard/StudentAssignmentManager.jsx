import React, { useState, useEffect } from 'react';
import { api } from '../config/axiosSetup';
import { toast } from 'react-toastify';
import { Plus, Trash2, Users, UserCheck, UserX } from 'lucide-react';

export default function StudentAssignmentManager({ staffId }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_name: '',
    student_email: '',
    enrollment_no: '',
    seat_no: '',
    examination: '',
    semester: '',
    course: ''
  });

  useEffect(() => {
    if (staffId) {
      fetchAssignments();
    }
  }, [staffId]);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/marksheet/teacher/assignments/${staffId}`);
      if (response.data?.assignments) {
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load student assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignStudent = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        teacher_id: staffId,
        ...newStudent
      };

      const response = await api.post('/marksheet/teacher/assign-student', payload);
      toast.success(response.data?.message || 'Student assigned successfully');
      setShowAddModal(false);
      setNewStudent({
        student_name: '',
        student_email: '',
        enrollment_no: '',
        seat_no: '',
        examination: '',
        semester: '',
        course: ''
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error assigning student:', error);
      toast.error(error.response?.data?.detail || 'Failed to assign student');
    }
  };

  const handleUnassignStudent = async (assignmentId) => {
    if (!confirm('Are you sure you want to unassign this student?')) return;
    
    try {
      const response = await api.delete(`/marksheet/teacher/unassign-student/${assignmentId}`);
      toast.success(response.data?.message || 'Student unassigned successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Error unassigning student:', error);
      toast.error(error.response?.data?.detail || 'Failed to unassign student');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading loading-spinner loading-lg text-[#b9f36a]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Users size={24} />
          Student Assignments
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-black text-[#b9f36a] px-4 py-2 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors flex items-center gap-2"
        >
          <Plus size={18} />
          Assign Student
        </button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-50" />
          <p>No students assigned yet.</p>
          <p className="text-sm mt-2">Click "Assign Student" to add students to your class.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div
              key={assignment.assignment_id}
              className="flex justify-between items-center p-4 border-[2px] border-black bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {assignment.student_id ? (
                  <UserCheck size={24} className="text-green-600" />
                ) : (
                  <UserX size={24} className="text-orange-500" />
                )}
                <div>
                  <div className="font-bold">{assignment.student_name}</div>
                  {assignment.student_email && (
                    <div className="text-sm text-gray-600">{assignment.student_email}</div>
                  )}
                  {assignment.enrollment_no && (
                    <div className="text-xs text-gray-500">Enrollment: {assignment.enrollment_no}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Assigned: {new Date(assignment.assigned_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleUnassignStudent(assignment.assignment_id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 transition-colors"
                title="Unassign student"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white border-[3px] border-black p-6 max-w-lg w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-bold mb-4">Assign New Student</h3>
            <form onSubmit={handleAssignStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Student Name *</label>
                <input
                  type="text"
                  value={newStudent.student_name}
                  onChange={(e) => setNewStudent({ ...newStudent, student_name: e.target.value })}
                  className="w-full p-2 border-[2px] border-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.student_email}
                  onChange={(e) => setNewStudent({ ...newStudent, student_email: e.target.value })}
                  className="w-full p-2 border-[2px] border-black"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Enrollment No</label>
                  <input
                    type="text"
                    value={newStudent.enrollment_no}
                    onChange={(e) => setNewStudent({ ...newStudent, enrollment_no: e.target.value })}
                    className="w-full p-2 border-[2px] border-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Seat No</label>
                  <input
                    type="text"
                    value={newStudent.seat_no}
                    onChange={(e) => setNewStudent({ ...newStudent, seat_no: e.target.value })}
                    className="w-full p-2 border-[2px] border-black"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Examination</label>
                <input
                  type="text"
                  value={newStudent.examination}
                  onChange={(e) => setNewStudent({ ...newStudent, examination: e.target.value })}
                  className="w-full p-2 border-[2px] border-black"
                  placeholder="e.g., WINTER 2024"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Semester</label>
                  <input
                    type="text"
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                    className="w-full p-2 border-[2px] border-black"
                    placeholder="e.g., THIRD SEMESTER"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Course</label>
                  <input
                    type="text"
                    value={newStudent.course}
                    onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    className="w-full p-2 border-[2px] border-black"
                    placeholder="e.g., COMPUTER ENGINEERING"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-black text-[#b9f36a] px-4 py-3 font-bold border-[2px] border-black hover:bg-[#b9f36a] hover:text-black transition-colors"
                >
                  Assign Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-white text-black px-4 py-3 font-bold border-[2px] border-black hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
