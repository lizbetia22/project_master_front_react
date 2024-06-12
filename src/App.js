import NavbarLogin from "./components/navbar/NavBarLogin";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
    return (
        <>
            <Router>
                <NavbarLogin />
                <Routes>
                    <Route path="*" element={<Login />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
