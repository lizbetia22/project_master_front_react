// DropdownFilterPieces.jsx
import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";

const DropdownFilterPieces = ({ onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("Tous les types"); // Modifier la valeur initiale

    const options = [
        'Tous les types', 'Matière première', 'Pièces livrables aux clients', 'Pièce achetée', 'Pièce intermédiaire'
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        onOptionSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button onClick={toggleDropdown} className="flex items-center px-4 py-2 bg-transparent text-gray-900 border border-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                    <span className="mr-1">{selectedOption}</span>
                    <IoIosArrowDown className="h-4 w-4"/>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                    <div className="py-1">
                        {options.map(option => (
                            <div key={option} onClick={() => handleOptionClick(option)} className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-dark_1 hover:bg-gray-100">
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownFilterPieces;
