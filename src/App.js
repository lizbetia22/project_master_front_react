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
import Employers from "./pages/workshop/Employers";
import History from "./pages/workshop/History";
import GammeProduction from "./pages/workshop/GammeProduction";
import NavbarResponsible from "./components/navbar/NavbarResponsible";
import Machine from "./pages/workshop/Machine";
import PostManagement from "./pages/workshop/Posts";
import Operations from "./pages/workshop/Operation";

function App() {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                const jwtdecode = decodeToken(token);
                if (jwtdecode.exp <= Math.floor(Date.now() / 1000)) {
                    handleLogout();
                } else {
                    console.log("Le token est valide.");
                }
            }
        };
        checkToken();
        const interval = setInterval(checkToken, 60000);

        return () => clearInterval(interval);
    }, []);


    const handleLogin = async (data) => {
        setRole(data.role);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('id');
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
                ) : role === 'Responsible' ? (
                    <NavbarResponsible onLogout={handleLogout} />
                ) : (
                    <NavbarAdmin onLogout={handleLogout} />
                )}

                <Routes>
                    {role === null && <Route path="/login" element={<Login onLogin={handleLogin} />} />}
                    {role === null && <Route path="*" element={<Navigate to="/login" replace />} />}

                    {role === 'Workshop' && <Route path="/pieces" element={<Pieces />} />}
                    {role === 'Workshop' && <Route path="/piece-create" element={<PieceCreate/>} />}
                    {role === 'Workshop' && <Route path="/gammes" element={<Gamme />} />}
                    {role === 'Workshop' && <Route path="/workers" element={<Employers />} />}
                    {role === 'Workshop' && <Route path="/history" element={<History />} />}
                    {role === 'Workshop' && <Route path="/gamme-production/:gammeId" element={<GammeProduction />} />}


                    {role === 'Responsible' && <Route path="/pieces" element={<Pieces />} />}
                    {role === 'Responsible' && <Route path="/piece-create" element={<PieceCreate/>} />}
                    {role === 'Responsible' && <Route path="/gammes" element={<Gamme />} />}
                    {role === 'Responsible' && <Route path="/gamme-create" element={<GammeCreate />} />}
                    {role === 'Responsible' && <Route path="/workers" element={<Employers />} />}
                    {role === 'Responsible' && <Route path="/machine" element={<Machine />} />}
                    {role === 'Responsible' && <Route path="/posts" element={<PostManagement />} />}
                    {role === 'Responsible' && <Route path="/history" element={<History />} />}
                    {role === 'Responsible' && <Route path="/operations" element={<Operations />} />}
                    {role === 'Responsible' && <Route path="/gamme-production/:gammeId" element={<GammeProduction />} />}

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
                            ) : role === 'Responsible' ? (
                                <Navigate to="/pieces" replace />
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
// const response = await axios.get(`${API_URL}/post/all`, {
//     headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//     }
// });