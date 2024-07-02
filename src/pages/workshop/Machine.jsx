import React, {useEffect, useState} from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GiToolbox } from "react-icons/gi";
import DeleteMachineModal from "../../components/modal/responsible/MachineDeleteModal";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

const Machine = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const machinesPerPage = 4;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMachine, setEditMachine] = useState({ nom: "", competences: "", id: null, id_post: null });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [machineToDelete, setMachineToDelete] = useState(null);
    const [machines, setMachines] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newPostId, setNewPostId] = useState("");
    const [newMachineName, setNewMachineName] = useState("");
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
    const fetchMachines = async () => {
        try {
            const response = await axios.get(`${API_URL}/machine/all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setMachines(response.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/post/all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useState(() => {
        fetchMachines();
        fetchPosts();
    }, [API_URL]);

    const indexOfLastMachine = currentPage * machinesPerPage;
    const indexOfFirstMachine = indexOfLastMachine - machinesPerPage;
    const currentMachines = machines
        .filter(machine => machine.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
        const editMachineData = {
            nom: machine.name,
            competences: machine.Post ? machine.Post.id : '',
            id: machine.id,
            id_post: machine.Post ? machine.Post.id : null
        };
        setEditMachine(editMachineData);
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

    const handleCreateMachine = async () => {
        if (!newMachineName || !newPostId) {
            toast.error("Tous les champs sont requis.");
            return;
        }
        try {
            const requestBody = {
                name: newMachineName,
                id_post: newPostId
            };
            await axios.post(`${API_URL}/machine/create`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setShowCreateModal(false);
            toast.success("Machine a été créée avec success")
            setNewMachineName("");
            setNewPostId("");
            fetchMachines();
        } catch (error) {
            toast.error("Erreur lors de la creation d'une machine")
            console.error('Error creating machine:', error);
        }
    };


    const handleUpdateMachine = async () => {
        if (!editMachine.competences || !editMachine.nom) {
            toast.error("Tous les champs sont requis.");
            return;
        }
        try {
            const requestBody = {
                id_post: editMachine.competences,
                name: editMachine.nom,
            };
            await axios.put(`${API_URL}/machine/update/${editMachine.id}`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success("Machine a été modifié avec success")
            setShowEditModal(false);
            fetchMachines();
        } catch (error) {
            toast.error("Erreur lors de la modification d'une machine")
            console.error('Error updating machine:', error);
        }
    };

    const handleDeleteMachine = async (id) => {
        try {
            await axios.delete(`${API_URL}/machine/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setMachines(machines.filter(machine => machine.id !== id));
            toast.success("Machine a été supprimé avec success")
            setShowDeleteModal(false);
        } catch (error) {
            toast.error("Erreur lors de la suppresion d'une machine")
            console.error('Error deleting machine', error);
        }
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
                                                value={newMachineName}
                                                onChange={(e) => setNewMachineName(e.target.value)}
                                            />
                                            <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                            <select
                                                id="post"
                                                className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                value={newPostId}
                                                onChange={(e) => setNewPostId(e.target.value)}
                                            >
                                                <option value="">Sélectionner un post</option>
                                                {posts.map(post => (
                                                    <option key={post.id} value={post.id}>{post.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleCreateMachine}
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
                                            {/* Inputs for editing a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                value={editMachine.nom}
                                                onChange={(e) => setEditMachine({ ...editMachine, nom: e.target.value })}
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="post" className="mt-2 block text-sm font-medium text-gray-700">Post</label>
                                            <select
                                                value={editMachine.competences}
                                                id="post"
                                                className="mt-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                onChange={(e) => setEditMachine({ ...editMachine, competences: e.target.value })}
                                            >
                                                <option value="">Sélectionner un post</option>
                                                {posts.map(post => (
                                                    <option key={post.id} value={post.id}>{post.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={() => handleUpdateMachine()}
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
                handleDeleteMachine={handleDeleteMachine}
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
                                <td className="px-6 py-3">{machine.name}</td>
                                <td className="px-6 py-3">{machine.Post.name}</td>
                                <td className="px-2 py-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditModalOpen(machine)}
                                        className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    {machine.Operations.length === 0 && (
                                    <button
                                        onClick={() => handleDeleteModalOpen(machine)}
                                        type="button"
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
            <ToastContainer />
        </>
    );
};

export default Machine;
