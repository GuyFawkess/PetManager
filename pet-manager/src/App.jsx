import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './store/AuthContext'

import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Pets from './pages/Pets'
import MyCalendar from './pages/Calendar'
import SinglePet from './pages/SinglePet'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/calendar" element={<MyCalendar />} />
            <Route path="/singlepet/:id" element={<SinglePet />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  )
}

export default App