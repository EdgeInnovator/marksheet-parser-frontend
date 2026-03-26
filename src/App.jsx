import { Route, Routes } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './App.css'
import Login from './app/login/login'
import Signup from './app/signup/signup'
import Dashboard from './app/dashboard/dashboard'
import Logout from './app/logout/logout'
import About from './app/about/About'
import StudentChartsPage from './app/dashboard/StudentChartsPage'
import TeacherAnalyticsPage from './app/dashboard/TeacherAnalyticsPage'
import StatCardsDemoPage from './app/dashboard/StatCardsDemo'
import ProtectedRoute from './components/ProtectedRoute'
import { getCokie } from './app/utils/utils'

function App() {
  const [userRole, setUserRole] = useState('student');

  // Get user data from ACTIVE_USER cookie
  const getUserRole = () => {
    const activeUser = getCokie('ACTIVE_USER');
    if (activeUser) {
      try {
        const userData = JSON.parse(activeUser);
        return userData.role || 'student'; // Default to student if role not found
      } catch (error) {
        console.error('Error parsing ACTIVE_USER cookie:', error);
        return 'student';
      }
    }
    return 'student'; // Default role
  };

  // Update user role when component mounts or when cookies change
  useEffect(() => {
    const updateUserRole = () => {
      const role = getUserRole();
      setUserRole(role);
    };

    updateUserRole();
    
    // Listen for storage changes (in case of logout/login in other tabs)
    const handleStorageChange = () => {
      updateUserRole();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Dashboard userRole={userRole} />
      </ProtectedRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard userRole={userRole} />
      </ProtectedRoute>
    } />
    <Route path="/about-us" element={
      <ProtectedRoute>
        <About />
      </ProtectedRoute>
    } />
    <Route path="/student-charts" element={
      <ProtectedRoute>
        <StudentChartsPage />
      </ProtectedRoute>
    } />
    <Route path="/teacher-analytics" element={
      <ProtectedRoute>
        <TeacherAnalyticsPage />
      </ProtectedRoute>
    } />
    <Route path="/stat-cards-demo" element={
      <ProtectedRoute>
        <StatCardsDemoPage />
      </ProtectedRoute>
    } />
    <Route path="/logout" element={<Logout />} />
    </Routes>
    </>
  )
}

export default App
