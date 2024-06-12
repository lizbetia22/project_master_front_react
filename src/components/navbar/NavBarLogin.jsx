import React from 'react';
import { SiFramework } from "react-icons/si";
function NavbarLogin() {
    return (
        <>
            <header className="bg-gray-900 text-white py-4 px-6">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Atelier <SiFramework className="h-6 w-6" />
                    </h1>
                    <div className="flex items-center gap-4">
                        <div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default NavbarLogin;
