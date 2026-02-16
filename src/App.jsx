import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './app/login/login'
import Signup from './app/signup/signup'
import Dashboard from './app/dashboard/dashboard'
import Logout from './app/logout/logout'
import About from './app/about/About'
import ProtectedRoute from './components/ProtectedRoute'
import { getCokie } from './app/utils/utils'
function App() {
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

  const userRole = getUserRole();

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
    <Route path="/logout" element={<Logout />} />
    </Routes>
    </>
  )
}

export default App
