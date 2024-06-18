import React, { useState } from 'react';
import 'react-dropdown/style.css';
import { IoIosArrowDown } from "react-icons/io";

const DropdownPosts = ({ handleSelectedPostType }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [options, setOptions] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchOptionsFromAPI = async () => {
        try {
            const response = await fetch(`${API_URL}/role/all`);
            if (!response.ok) {
               console.error('Failed to fetch data');
            }
            const data = await response.json();
            setOptions(data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchOptionsFromAPI();
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option.name);
        setIsOpen(false);
        handleSelectedPostType(option.name);
    };

    return (
        <div className="relative inline-block text-left">
            <div>
                <button onClick={toggleDropdown} className="flex items-center px-4 py-2 bg-transparent text-gray-900 border border-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                    <span className="mr-1">{selectedOption || 'Post de l\'employé'}</span>
                    <IoIosArrowDown className="h-4 w-4"/>
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                    <div className="py-1">
                        {options.map(option => (
                            <div key={option.id} onClick={() => handleOptionClick(option)} className="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-dark_1 hover:bg-gray-100">
                                {option.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DropdownPosts;
