import React, {useEffect, useState} from "react";
import {MdDelete} from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { BsFillFileEarmarkPostFill } from "react-icons/bs";
import DeleteOperationModal from "../../components/modal/responsible/OperationDeleteModal";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

const Operations = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const operationsPerPage = 4;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editOperation, setEditOperation] = useState({ id: "", name: "", id_post: "", id_machine: "", time: "" });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [operationToDelete, setOperationToDelete] = useState(null);
    const [operations, setOperations] = useState([]);
    const [posts, setPosts] = useState([]);
    const [machines, setMachines] = useState([]);
    const [gammesData, setGammeData] = useState([]);
    const [filteredMachines, setFilteredMachines] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

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

    useEffect(() => {
        const fetchOperations = async () => {
            try {
                const response = await fetch(`${API_URL}/operation/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                const data = await response.json();
                setOperations(data);

                const responsePosts = await axios.get(`${API_URL}/post/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setPosts(responsePosts.data);

                const responseMachines = await axios.get(`${API_URL}/machine/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setMachines(responseMachines.data);
            } catch (error) {
                console.error("Error fetching operations:", error);
            }
        };
        const fetchGammeofOperation = async () => {
            try {
                const response = await axios.get(`${API_URL}/gamme-operation/all`);
                setGammeData(response.data);
            } catch (error) {
                console.error('Failed to get data of operations gamme:', error);
            }
        };
        fetchGammeofOperation();
        fetchOperations();
    }, [API_URL, showCreateModal, showEditModal, showDeleteModal]);

    useEffect(() => {
        if (editOperation.id_post) {
            const filtered = machines.filter(machine => machine.id_post.toString() === editOperation.id_post);
            setFilteredMachines(filtered);
        } else {
            setFilteredMachines([]);
        }
    }, [editOperation.id_post, machines]);


    const indexOfLastOperation = currentPage * operationsPerPage;
    const indexOfFirstOperation = indexOfLastOperation - operationsPerPage;
    const currentOperations = operations
        .filter(operation => operation.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstOperation, indexOfLastOperation);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleCreateModalOpen = () => {
        setEditOperation({ id: "", name: "", id_post: "", id_machine: "", time: "" });
        setShowCreateModal(true);
    };

    const handleEditModalOpen = (operation) => {
        setEditOperation(operation);
        setShowEditModal(true);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleDeleteModalOpen = (operation) => {
        setOperationToDelete(operation);
        setShowDeleteModal(true);
    };

    const handleCreateOperation = async () => {
        if (!editOperation.id_post || !editOperation.id_machine || !editOperation.name || !editOperation.time) {
            toast.error("Tous les champs sont requis.");
            return;
        }
        try {
            const requestBody = {
                id_post: editOperation.id_post,
                id_machine: editOperation.id_machine,
                name: editOperation.name,
                time: editOperation.time,
            };
            await axios.post(`${API_URL}/operation/create`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success("Operation a été créée avec success")
            setShowCreateModal(false);
        } catch (error) {
            toast.error("Erreur lors de creation d'une operation")
            console.error('Error creating operation:', error);
        }
    };

    const handleUpdateOperation = async () => {
        if (!editOperation.id_post || !editOperation.id_machine || !editOperation.name || !editOperation.time) {
            toast.error("Tous les champs sont requis.");
            return;
        }
        try {
            const requestBody = {
                id_post: editOperation.id_post,
                id_machine: editOperation.id_machine,
                name: editOperation.name,
                time: editOperation.time,
            };
            await axios.put(`${API_URL}/operation/update/${editOperation.id}`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success("Operation a été modifié avec success")
            setShowEditModal(false);
        } catch (error) {
            toast.error("Erreur lors de modification d'une operation")
            console.error('Error updating operation:', error);
        }
    };

    const handleDeleteOperation = async () => {
        try {
            await axios.delete(`${API_URL}/operation/delete/${operationToDelete.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success("Operation a été supprimé avec success")
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Erreur lors de suppression d'une operation")
            console.error('Error deleting operation', error);
        }
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
        {/* Create operation Modal */}
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
                                        <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            id="name"
                                            value={editOperation.name}
                                            onChange={(e) => setEditOperation({ ...editOperation, name: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        />
                                        <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                        <select
                                            id="post"
                                            value={editOperation.id_post}
                                            onChange={(e) => setEditOperation({ ...editOperation, id_post: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        >
                                            <option value="">Sélectionner un post</option>
                                            {posts.map(post => (
                                                <option key={post.id} value={post.id}>{post.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="machine" className="mt-2 block text-sm font-medium text-gray-700">Machine</label>
                                        <select
                                            id="machine"
                                            value={editOperation.id_machine}
                                            onChange={(e) => setEditOperation({ ...editOperation, id_machine: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        >
                                            <option value="">Sélectionner une machine</option>
                                            {filteredMachines.map(machine => (
                                                <option key={machine.id} value={machine.id}>{machine.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="time" className="mt-2 block text-sm font-medium text-gray-700">Temps</label>
                                        <input
                                            type="number"
                                            placeholder="Temps"
                                            id="time"
                                            value={editOperation.time}
                                            onChange={(e) => setEditOperation({ ...editOperation, time: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={handleCreateOperation}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Créer
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateModalClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Edit operation Modal */}
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
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Éditer une opération</h3>
                                    <div className="mt-2">
                                        <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            id="name"
                                            value={editOperation.name}
                                            onChange={(e) => setEditOperation({ ...editOperation, name: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        />
                                        <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                        <select
                                            id="post"
                                            value={editOperation.id_post}
                                            onChange={(e) => setEditOperation({ ...editOperation, id_post: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        >
                                            <option value="">Sélectionner un post</option>
                                            {posts.map(post => (
                                                <option key={post.id} value={post.id}>{post.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="machine" className="mt-2 block text-sm font-medium text-gray-700">Machine</label>
                                        <select
                                            id="machine"
                                            value={editOperation.id_machine}
                                            onChange={(e) => setEditOperation({ ...editOperation, id_machine: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        >
                                            <option value="">Sélectionner une machine</option>
                                            {filteredMachines.map(machine => (
                                                <option key={machine.id} value={machine.id}>{machine.name}</option>
                                            ))}
                                        </select>
                                        <label htmlFor="time" className="mt-2 block text-sm font-medium text-gray-700">Temps</label>
                                        <input
                                            type="number"
                                            placeholder="Temps"
                                            id="time"
                                            value={editOperation.time}
                                            onChange={(e) => setEditOperation({ ...editOperation, time: e.target.value })}
                                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="button"
                                onClick={handleUpdateOperation}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Mettre à jour
                            </button>
                            <button
                                type="button"
                                onClick={handleEditModalClose}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Delete Machine Modal */}
        <DeleteOperationModal
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            operation={operationToDelete}
            handleDeleteOperation={handleDeleteOperation}
        />

        {/* Operations table */}
        <div className="container mx-auto mt-5">
            <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                <table className="w-full table-auto">
                    <thead className="bg-gray-800 text-gray-200 h-16">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium">Nom</th>
                        <th className="py-3 text-left font-medium">Post</th>
                        <th className="py-3 text-left font-medium">Machine</th>
                        <th className="py-3 text-left font-medium">Temps</th>
                        <th className="px-6 py-3 text-left font-medium"></th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {currentOperations.map(operation => (
                        <tr key={operation.id}>
                            <td className="px-6 py-3 font-medium">{operation.name}</td>
                            <td className="px-6 py-3">{posts.find(post => post.id === operation.id_post)?.name}</td>
                            <td className="px-6 py-3">{machines.find(machine => machine.id === operation.id_machine)?.name}</td>
                            <td className="px-6 py-3">{operation.time}</td>
                            <td className="px-6 py-3">
                                <button onClick={() => handleEditModalOpen(operation)} className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2">
                                    <FaEdit className="h-5 w-5" />
                                </button>
                                {!gammesData.some(item => item.id_operation === operation.id) && (
                                    <button
                                        onClick={() => handleDeleteModalOpen(operation)}
                                        className="px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2 ml-2"
                                    >
                                        <MdDelete className="h-5 w-5" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    <span>Previous</span>
                </button>
                {Array.from({ length: Math.ceil(operations.length / operationsPerPage) }, (_, index) => index + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => paginate(page)}
                        className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                            currentPage === page ? "" : "rounded-l"
                        }`}                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(operations.length / operationsPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    <span>Next</span>
                </button>
            </div>
        </div>
            <ToastContainer />
        </>
    );
};

export default Operations;
