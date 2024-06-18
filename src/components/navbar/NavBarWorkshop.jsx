import React, { useState, useEffect } from 'react';
import { SiFramework } from "react-icons/si";
import { GoPackage } from "react-icons/go";
import { IoLayersOutline } from "react-icons/io5";
import { FiBriefcase } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { FaHistory } from "react-icons/fa";

function NavbarWorkShop({ onLogout }) {
    const [currentPage, setCurrentPage] = useState('pieces');
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {

        const storedName = localStorage.getItem('name');
        if (storedName) {
            setUserName(storedName);
        }

        const { pathname } = location;
        let page = pathname.split('/').pop();
        if (pathname === "/") {
            page = 'pieces';
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
                        Atelier <SiFramework className="h-6 w-6" />
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/pieces" className="flex items-center gap-2">
                            <GoPackage className={`h-5 w-5 ${currentPage === 'pieces'|| currentPage === 'piece-create' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'pieces'|| currentPage === 'piece-create' ? 'text-blue-600' : ''}`}>Gestion des pièces</span>
                        </Link>
                        <Link to="/gammes" className="flex items-center gap-2">
                            <IoLayersOutline className={`h-5 w-5 ${currentPage === 'gammes' || currentPage === 'gamme-production' || currentPage === 'gamme-create' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'gammes' || currentPage === 'gamme-production' || currentPage === 'gamme-create' ? 'text-blue-600' : ''}`}>Gestion des gammes</span>
                        </Link>
                        <Link to="/posts" className="flex items-center gap-2">
                            <FiBriefcase className={`h-5 w-5 ${currentPage === 'posts' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'posts' ? 'text-blue-600' : ''}`}>Gestion des postes</span>
                        </Link>
                        <Link to="/history" className="flex items-center gap-2">
                            <FaHistory className={`h-5 w-5 ${currentPage === 'history' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'history' ? 'text-blue-600' : ''}`}>Historique</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <CgProfile className="h-6 w-6" />
                            <span>{userName || 'User'}</span>
                        </div>
                        <div>
                            <Link to="/login" onClick={handleLogout} className="cursor-pointer">
                                <LuLogOut className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default NavbarWorkShop;
