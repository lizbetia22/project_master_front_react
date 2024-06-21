import React, { useState } from "react";
import {MdDelete} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import DeleteOperationModal from "../../components/modal/responsible/OperationDeleteModal";

const Operations = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const operationsPerPage = 4;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editOperation, setEditOperation] = useState({ nom: ""});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [operationToDelete, setOperationToDelete] = useState(null);

    const operations = [
        {
            id: 1,
            nom: "Operation  1",
            post: 'Post 1',
            machine: 'Machine 1',
            temps: 25
        },
        {
            id: 2,
            nom: "Operation  2",
            post: 'Post 2',
            machine: 'Machine 2',
            temps: 22
        },
        {
            id: 1,
            nom: "Operation  3",
            post: 'Post 3',
            machine: 'Machine 3',
            temps: 27
        },
    ];

    const indexOfLastOperation = currentPage * operationsPerPage;
    const indexOfFirsOperation = indexOfLastOperation - operationsPerPage;
    const currentOperations = operations
        .filter(post => post.nom.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirsOperation, indexOfLastOperation);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleCreateModalOpen = () => {
        setShowCreateModal(true);
    };

    const handleEditModalOpen = (machine) => {
        setEditOperation(machine);
        setShowEditModal(true);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleDeleteModalOpen = (machine) => {
        setOperationToDelete(machine);
        setShowDeleteModal(true);
    };

    return (
        <>
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900 mt-5">Gestion d'opérations</h1>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2 mt-10">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher une opération..."
                    type="search"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="mt-2 flex justify-end">
                <button onClick={handleCreateModalOpen}
                        className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                    <span className="mr-1">Ajouter une opération</span>
                    <BsFillFileEarmarkPostFill className="h-5 w-5" />
                </button>
            </div>
            {/* Create post Modal */}
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Créer une opération</h3>
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
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="machine" className="mt-2 block text-sm font-medium text-gray-700">Machine</label>
                                            <input
                                                type="text"
                                                placeholder="Machine"
                                                id="machine"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="time" className="mt-2 block text-sm font-medium text-gray-700">Temps</label>
                                            <input
                                                type="number"
                                                placeholder="Temps"
                                                id="time"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
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
            {/* Edit post Modal */}
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier l'opération</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                value={editOperation.nom}
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                            <input
                                                value={editOperation.post}
                                                type="text"
                                                placeholder="Post"
                                                id="post"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="machine" className="mt-2 block text-sm font-medium text-gray-700">Machine</label>
                                            <input
                                                type="text"
                                                placeholder="Machine"
                                                id="machine"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="time" className="mt-2 block text-sm font-medium text-gray-700">Temps</label>
                                            <input
                                                type="number"
                                                placeholder="Temps"
                                                id="time"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
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
            <DeleteOperationModal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                machine={operationToDelete}
            />
            <div className="container mx-auto mt-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-800 text-gray-200 h-16">
                        <tr>
                            <th className="px-20 py-3 text-left font-medium">Id</th>
                            <th className="px-14 py-3 text-left font-medium">Nom</th>
                            <th className="px-14 py-3 text-left font-medium">Post</th>
                            <th className="px-14 py-3 text-left font-medium">Machine</th>
                            <th className="px-10 py-3 text-left font-medium">Temps</th>
                            <th className="px-10 py-3 text-left font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentOperations.map((post, index) => (
                            <tr key={index}>
                                <td className="px-20 py-3 font-medium">{post.id}</td>
                                <td className="px-14 py-3">{post.nom}</td>
                                <td className="px-14 py-3">{post.post}</td>
                                <td className="px-14 py-3">{post.machine}</td>
                                <td className="px-14 py-3">{post.temps}</td>
                                <td className="px-2 py-3">
                                    <button
                                        type="button"
                                        onClick={handleEditModalOpen}
                                        className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModalOpen(post)}
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
                {Array.from({ length: Math.ceil(operations.length / operationsPerPage) }).map((_, index) => (
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
                    disabled={currentPage === Math.ceil(operations.length / operationsPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
        </>
    );
};

export default Operations;
