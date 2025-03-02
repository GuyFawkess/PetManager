import React, {useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'
import { Menu, X } from 'lucide-react';


const Header = () => {
    const { user, logoutUser } = useAuth();

    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path ? "btn btn-warning uppercase" : "btn btn-ghost uppercase";


    return (
        <div className="flex justify-between px-4 border-b-2 border-black">
            <div>
                <Link id="header-logo" className='drop-shadow-[3px_3px_1.5px_orange]' to="/">PetManager</Link>
            </div>

            <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {user && (
                <div className={`absolute md:relative left-0 w-full md:w-auto bg-white md:bg-transparent flex flex-col md:flex-row gap-4 md:gap-6 items-center px-4 py-2 md:p-0 transition-all duration-300 ${menuOpen ? "block" : "hidden md:flex"} z-200`}>
                    <Link onClick={() => setMenuOpen(false)} to="/" className={`${isActive("/")}` }>Home</Link>
                    <Link onClick={() => setMenuOpen(false)} to="/pets" className={`${isActive("/pets")}`}>My Pets</Link>
                    <Link onClick={() => setMenuOpen(false)} to="/calendar" className={`${isActive("/calendar")}`}>Calendar</Link>

                    <button onClick={logoutUser} className="hover:cursor-pointer relative px-4 py-2 overflow-hidden font-medium text-gray-600 bg-gray-100 border border-gray-100 rounded-lg shadow-inner group">
                        <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                        <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                        <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                        <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">Logout</span>
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header
