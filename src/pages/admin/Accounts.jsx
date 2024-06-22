import React, {useEffect, useState} from 'react';
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

function Admin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    const adminData = [
        {
            id: 1,
            name: "John Doe",
            post: "Manager",
            role: "Responsable"
        },
        {
            id: 2,
            name: "John Tom",
            post: "Expert Technique",
            role: "Ouvrier"
        },
        {
            id: 4,
            name: "Ben Rom",
            post: "Directeur",
            role: "Admin"
        },
        {
            id: 5,
            name: "John Doe",
            post: "Manager",
            role: "Responsable"
        },
    ];

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const handlePageChange = pageNumber => setCurrentPage(pageNumber);

    // Fonction de filtrage
    const filteredData = adminData.filter(row => {
        const value = String(row[filterBy]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
    });

    const paginatedFilteredData = paginate(filteredData, usersPerPage, currentPage);

    const handleEditClick = (row) => {
        setSelectedRow(row);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedRow(null);
        setShowModal(false);
    };

    const handleSaveChanges = () => {
        // Implement logic to save changes
        handleCloseModal();
    };

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/refresh/${localStorage.getItem('id')}`);
                localStorage.setItem('token', response.data.token);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        };

        refreshToken();
    }, [API_URL]);

    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste d'utilisateurs</h1>
            </div>
            <div className="mt-2 flex justify-end">
                <button className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                    <span className="mr-1">Ajouter un compte</span>
                    <MdOutlineManageAccounts className="h-5 w-5" />
                </button>
            </div>
            <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <select
                            className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="name">Name</option>
                            <option value="post">Post</option>
                            <option value="role">Role</option>
                        </select>
                        <input
                            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Rechercher..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Post</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-400">
                    {paginatedFilteredData.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.post}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.role}</td>
                            <td className="px-1 py-4 whitespace-nowrap">
                                <button onClick={() => handleEditClick(row)}
                                        className=" hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
                                    <FiEdit className="w-6 h-6"/>
                                </button>
                                <button
                                    className="ml-3 hover:bg-red-300 text-gray-700 font-bold py-2 px-4 rounded">
                                    <RiDeleteBinLine className="w-6 h-6"/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Modal */}
            {showModal && selectedRow && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
                    <div className="relative w-auto my-6 mx-auto max-w-3xl">
                        {/* Modal content */}
                        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            {/* Header */}
                            <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                <h3 className="text-xl font-semibold">
                                    Modifier l'utilisateur
                                </h3>
                                <button
                                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                    onClick={handleCloseModal}
                                >
                        <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                            ×
                        </span>
                                </button>
                            </div>
                            {/* Body */}
                            <div className="relative p-6 flex-auto">
                                {/* Form */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={selectedRow.name}
                                        onChange={(e) => setSelectedRow({ ...selectedRow, name: e.target.value })}
                                        className="w-96 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm rounded-md py-2 px-3 border-gray-600 border"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mt-4">Post</label>
                                    <input
                                        type="text"
                                        value={selectedRow.post}
                                        onChange={(e) => setSelectedRow({ ...selectedRow, post: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border-gray-600 border"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mt-4">Role</label>
                                    <input
                                        type="text"
                                        value={selectedRow.role}
                                        onChange={(e) => setSelectedRow({ ...selectedRow, role: e.target.value })}
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border-gray-600 border"
                                    />
                                    <label className="block text-sm font-medium text-gray-700 mt-4">Mot de pass</label>
                                    <input
                                        type="text"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border-gray-600 border"
                                    />
                                </div>
                            </div>
                            {/* Footer */}
                            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                <button
                                    className="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-all duration-150 ease-in-out"
                                    type="button"
                                    onClick={handleSaveChanges}
                                >
                                    Valider
                                </button>
                                <button
                                    className="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-all duration-150 ease-in-out"
                                    type="button"
                                    onClick={handleCloseModal}
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(filteredData.length / usersPerPage) }).map(
                    (item, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                                currentPage === index + 1 ? "" : "rounded-l"
                            }`}
                        >
                            {index + 1}
                        </button>
                    )
                )}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Admin;
