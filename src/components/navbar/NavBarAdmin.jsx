import React, { useState, useEffect } from 'react';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { GrUserAdmin } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

function NavbarAdmin({ onLogout }) {
    const [currentPage, setCurrentPage] = useState('admin');
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');


    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }
    }, []);

    useEffect(() => {
        const { pathname } = location;
        let page = pathname.split('/').pop();
        if (pathname === "/") {
            page = 'admin';
        }
        setCurrentPage(page);
    }, [location]);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <>
            <header className="bg-gray-900 text-white py-4 px-6">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Admin <GrUserAdmin className="h-7 w-7" />
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/admin" className="flex items-center gap-2">
                            <MdOutlineAdminPanelSettings className={`h-5 w-5 ${currentPage === 'admin' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'admin' ? 'text-blue-600' : ''}`}>Gestion des comptes</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <CgProfile className="h-6 w-6" />
                            <span>{userName || 'User'}</span>
                        </div>
                        <div>
                            <button onClick={handleLogout} className="cursor-pointer">
                                <LuLogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default NavbarAdmin;
