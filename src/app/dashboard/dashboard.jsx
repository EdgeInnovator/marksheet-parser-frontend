import React from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';

export default function Dashboard({ userRole = "student" }) {
  // Route to appropriate dashboard based on user role
  if (userRole === "student") {
    return <StudentDashboard />;
  } else if (userRole === "teacher" || userRole === "staff") {
    return <TeacherDashboard />;
  }
  
  // Fallback to student dashboard
  return <StudentDashboard />;
}
