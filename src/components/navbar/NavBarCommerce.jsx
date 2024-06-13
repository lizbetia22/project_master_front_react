import React, { useState, useEffect } from 'react';
// import { SiFramework } from "react-icons/si";
// import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuLogOut } from "react-icons/lu";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { IoDocumentTextOutline } from "react-icons/io5";
import { PiInvoice } from "react-icons/pi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdOutlineBorderAll } from "react-icons/md";

function NavbarCommerce({ onLogout }) {
    const [currentPage, setCurrentPage] = useState('pieces');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const { pathname } = location;
        let page = pathname.split('/').pop();
        if (pathname === "/") {
            page = 'devis';
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
                        Commercial <MdOutlineShoppingCart className="h-7 w-7" />
                    </h1>
                    <div className="flex items-center gap-4">
                        <Link to="/devis" className="flex items-center gap-2">
                            <IoDocumentTextOutline className={`h-5 w-5 ${currentPage === 'devis' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'devis' ? 'text-blue-600' : ''}`}>Gestion des devis</span>
                        </Link>
                        <Link to="/facture" className="flex items-center gap-2">
                            <PiInvoice className={`h-5 w-5 ${currentPage === 'facture' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'facture' ? 'text-blue-600' : ''}`}>Facturation</span>
                        </Link>
                        <Link to="/achats" className="flex items-center gap-2">
                            <MdOutlineBorderAll className={`h-5 w-5 ${currentPage === 'achats' ? 'text-blue-600' : ''}`} />
                            <span className={`${currentPage === 'achats' ? 'text-blue-600' : ''}`}>Gestion des achats</span>
                        </Link>
                        {/*<Link to="/admin" className="flex items-center gap-2">*/}
                        {/*    <MdOutlineAdminPanelSettings className={`h-5 w-5 ${currentPage === 'admin' ? 'text-blue-600' : ''}`} />*/}
                        {/*    <span className={`${currentPage === 'admin' ? 'text-blue-600' : ''}`}>Admin</span>*/}
                        {/*</Link>*/}

                        <div className="flex items-center gap-2">
                            <CgProfile className="h-6 w-6" />
                            <span>John Doe</span>
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

export default NavbarCommerce;
