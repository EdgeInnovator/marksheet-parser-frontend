import React, { useEffect, useState } from 'react';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import { getCokie } from '../utils/utils';

export default function Dashboard({ userRole = "student" }) {
  const [currentRole, setCurrentRole] = useState(userRole);

  // Update role when prop changes or when cookies change
  useEffect(() => {
    const updateRole = () => {
      const activeUser = getCokie('ACTIVE_USER');
      if (activeUser) {
        try {
          const userData = JSON.parse(activeUser);
          setCurrentRole(userData.role || 'student');
        } catch (error) {
          console.error('Error parsing ACTIVE_USER cookie:', error);
          setCurrentRole('student');
        }
      } else {
        setCurrentRole('student');
      }
    };

    updateRole();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      updateRole();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userRole]);

  // Route to appropriate dashboard based on user role
  // Only two roles supported: "student" and "staff"
  if (currentRole === "student") {
    return <StudentDashboard />;
  } else if (currentRole === "staff") {
    return <TeacherDashboard />;
  }
  
  // Fallback to student dashboard for any unknown role
  return <StudentDashboard />;
}
