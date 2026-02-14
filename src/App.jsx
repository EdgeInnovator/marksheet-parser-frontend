import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './app/login/login'
import Signup from './app/signup/signup'
import Dashboard from './app/dashboard/dashboard'
import ProtectedRoute from './components/ProtectedRoute'
function App() {

  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    </Routes>
    </>
  )
}

export default App
