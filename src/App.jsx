import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './app/login/login'
import Signup from './app/signup/signup'
import Dashboard from './app/dashboard/dashboard'
function App() {

  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App
