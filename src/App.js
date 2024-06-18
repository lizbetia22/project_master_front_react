import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import NavbarLogin from './components/navbar/NavBarLogin';
import NavbarAdmin from './components/navbar/NavBarAdmin';
import NavbarCommerce from './components/navbar/NavBarCommerce';
import NavbarWorkShop from './components/navbar/NavBarWorkshop';
import Admin from './pages/admin/Accounts';
import Devis from './pages/commerce/Devis';
import Pieces from './pages/workshop/Piece';
import decodeToken from './utils/decodeToken';
import PieceCreate from "./components/forms/PieceCreate";
import Gamme from "./pages/workshop/Gamme";
import GammeCreate from "./components/forms/GammeCreate";
import Posts from "./pages/workshop/Posts";
import History from "./pages/workshop/History";
import GammeProduction from "./pages/workshop/GammeProduction";

function App() {
    const [role, setRole] = useState(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = decodeToken(token);
            if (decodedToken) {
                setRole(decodedToken.role);
            }
        }
    }, []);

    const handleLogin = async (data) => {
        localStorage.setItem('token', data.token);
        setRole(data.role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        setRole(null);
    };

    return (
        <>
            <Router>
                {role === null ? (
                    <NavbarLogin />
                ) : role === 'Workshop' ? (
                    <NavbarWorkShop onLogout={handleLogout} />
                ) : role === 'Commercial' ? (
                    <NavbarCommerce onLogout={handleLogout} />
                ) : (
                    <NavbarAdmin onLogout={handleLogout} />
                )}

                <Routes>
                    {role === null && <Route path="/login" element={<Login onLogin={handleLogin} />} />}
                    {role === null && <Route path="*" element={<Navigate to="/login" replace />} />}

                    {role === 'Workshop' && <Route path="/pieces" element={<Pieces />} />}
                    {role === 'Workshop' && <Route path="/piece-create" element={<PieceCreate/>} />}
                    {role === 'Workshop' && <Route path="/gammes" element={<Gamme />} />}
                    {role === 'Workshop' && <Route path="/gamme-create" element={<GammeCreate />} />}
                    {role === 'Workshop' && <Route path="/posts" element={<Posts />} />}
                    {role === 'Workshop' && <Route path="/history" element={<History />} />}
                    {role === 'Workshop' && <Route path="/gamme-production" element={<GammeProduction />} />}
                    {role === 'Commercial' && <Route path="/devis" element={<Devis />} />}
                    {role === 'Admin' && <Route path="/admin" element={<Admin />} />}

                    {/* Redirect to appropriate page for each role */}
                    <Route
                        path="*"
                        element={
                            role === null ? (
                                <Navigate to="/login" replace />
                            ) : role === 'Workshop' ? (
                                <Navigate to="/pieces" replace />
                            ) : role === 'Commercial' ? (
                                <Navigate to="/devis" replace />
                            ) : (
                                <Navigate to="/admin" replace />
                            )
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
