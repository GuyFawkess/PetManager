import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './store/AuthContext'

import Header from './components/Header'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Pets from './pages/Pets'
import MyCalendar from './pages/Calendar'
import CardSmall from './components/CardSmall'
import AddEventModal from './components/AddEventModal'

import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          {/* borar */}
          <Route path='/tarjeta' element={<CardSmall />} /> 
          <Route path='/events' element={<AddEventModal />} /> 
          {/* borrar above */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<MyCalendar />} />
          </Route>
        </Routes>
      </AuthProvider>
      <ToastContainer />
    </Router>
  )
}

export default App