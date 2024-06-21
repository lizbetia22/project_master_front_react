import React, { useState } from "react";
import {MdDelete} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GiToolbox } from "react-icons/gi";
import DeleteMachineModal from "../../components/modal/responsible/MachineDeleteModal";

const Machine = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const machinesPerPage = 4;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMachine, setEditMachine] = useState({ nom: "", competences: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL;

    const machines = [
        {
            id: 1,
            nom: "Machine 1",
            competences: "Couper du bois",
        },
        {
            id: 2,
            nom: "Machine 2",
            competences: "Couper du bois",
        },
        {
            id: 3,
            nom: "Machine 3",
            competences: "Cut",
        },
    ];

    const indexOfLastMachine = currentPage * machinesPerPage;
    const indexOfFirstMachine = indexOfLastMachine - machinesPerPage;
    const currentMachines = machines
        .filter(post => post.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstMachine, indexOfLastMachine);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleCreateModalOpen = () => {
        setShowCreateModal(true);
    };

    const handleEditModalOpen = (machine) => {
        setEditMachine(machine);
        setShowEditModal(true);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleDeleteModalOpen = (machine) => {
        setMachineToDelete(machine);
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900 mt-5">Gestion des machines</h1>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2 mt-10">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher une machine..."
                    type="search"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="mt-2 flex justify-end">
                    <button onClick={handleCreateModalOpen}
                            className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Ajouter une machine</span>
                        <GiToolbox className="h-5 w-5" />
                    </button>
            </div>
            {/* Create Machine Modal */}
            {showCreateModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {/* Modal content */}
                                <div className="sm:flex sm:items-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Créer une machine</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                            <input
                                                type="text"
                                                placeholder="Post"
                                                id="post"
                                                className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleCreateModalClose}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCreateModalClose}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                            </div>
                    </div>
                </div>
            )}
            {/* Edit Machine Modal */}
            {showEditModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {/* Modal content */}
                                <div className="sm:flex sm:items-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier la machine</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                value={editMachine.nom}
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                            <input
                                                value={editMachine.competences}
                                                type="text"
                                                placeholder="Post"
                                                id="post"
                                                className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleEditModalClose}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleEditModalClose}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                            </div>
                    </div>
                </div>
            )}
            {/* Delete Machine Modal */}
            <DeleteMachineModal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                machine={machineToDelete}
            />
            <div className="container mx-auto mt-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-800 text-gray-200 h-16">
                        <tr>
                            <th className="px-8 py-3 text-left font-medium">Id</th>
                            <th className="px-6 py-3 text-left font-medium">Nom</th>
                            <th className="px-6 py-3 text-left font-medium">Post</th>
                            <th className="px-8 py-3 text-left font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentMachines.map((machine, index) => (
                            <tr key={index}>
                                <td className="px-8 py-3 font-medium">{machine.id}</td>
                                <td className="px-6 py-3">{machine.nom}</td>
                                <td className="px-6 py-3">{machine.competences}
                                </td>
                                <td className="px-2 py-3">
                                    <button
                                        type="button"
                                        onClick={handleEditModalOpen}
                                        className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModalOpen(machine)}
                                        type="button"
                                        className="px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2 ml-2"
                                    >
                                        <MdDelete className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(machines.length / machinesPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                            currentPage === index + 1 ? "" : "rounded-l"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(machines.length / machinesPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
        </>
    );
};

export default Machine;
