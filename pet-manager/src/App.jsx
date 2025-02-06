import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './store/AuthContext'

import Header from './components/Header'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import MyCalendar from './pages/Calendar'
import Card from './components/Card'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path='/tarjeta' element={<Card />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<MyCalendar />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App