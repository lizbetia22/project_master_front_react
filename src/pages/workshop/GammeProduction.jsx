import React, { useEffect, useState } from 'react';
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function GammeProduction() {
    const { gammeId } = useParams();
    const [operations, setOperations] = useState([]);
    const [gamme, setGamme] = useState({});
    const [posts, setPosts] = useState([]);
    const [machines, setMachines] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const operationsPerPage = 10;
    const [selectedPost, setSelectedPost] = useState('');
    const [machineFilters, setMachineFilters] = useState({});
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
        if (selectedPost) {
            const post = posts.find(p => p.Post.name === selectedPost);
            if (post) {
                const filteredMachines = machines.filter(machine => machine.id_post === post.Post.id);
                setMachineFilters(prevFilters => ({
                    ...prevFilters,
                    [selectedPost]: filteredMachines
                }));
            } else {
                setMachineFilters(prevFilters => ({
                    ...prevFilters,
                    [selectedPost]: []
                }));
            }
        } else {
            setMachineFilters({});
        }
    }, [selectedPost, posts, machines]);

    const handlePostChange = (index, value) => {
        const newOperations = [...operations];
        newOperations[index] = {
            ...newOperations[index],
            post_name: value
        };
        setOperations(newOperations);
        setSelectedPost(value);
    };

    const handleMachineChange = (index, value) => {
        const newOperations = [...operations];
        newOperations[index] = {
            ...newOperations[index],
            machine_name: value
        };
        setOperations(newOperations);
    };

    const handleTimeChange = (index, value) => {
        const newOperations = [...operations];
        newOperations[index] = {
            ...newOperations[index],
            time: parseInt(value)
        };
        setOperations(newOperations);
    };

    const indexOfLastOperation = currentPage * operationsPerPage;
    const indexOfFirstOperation = indexOfLastOperation - operationsPerPage;
    const currentOperations = operations.slice(indexOfFirstOperation, indexOfLastOperation);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const fetchDataOperations = async (gammeId) => {
        try {
            const response = await axios.get(`${API_URL}/gamme-operation/gamme/${gammeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setOperations(response.data);
        } catch (error) {
            console.error("There was an error fetching the operations data!", error);
        }
    };

    const fetchDataGamme = async (gammeId) => {
        try {
            const response = await axios.get(`${API_URL}/gamme/${gammeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setGamme(response.data);
        } catch (error) {
            console.error("There was an error fetching the gamme data!", error);
        }
    };

    const fetchDataAllPosts = async () => {
        try {
            const responsePosts = await axios.get(`${API_URL}/user/posts/${localStorage.getItem('id')}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setPosts(responsePosts.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchDataAllMachines = async () => {
        try {
            const responseMachines = await axios.get(`${API_URL}/machine/all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setMachines(responseMachines.data);
        } catch (error) {
            console.error("Error fetching machines:", error);
        }
    };

    const createGammeProduction = async () => {
        try {
            const requests = operations.map(async (operation) => {
                const { id, post_name, machine_name, time } = operation;

                const postId = posts.find(post => post.Post.name === post_name)?.id;

                const payload = {
                    id_gamme_operation: id,
                    id_post: postId,
                    id_machine: machine_name.toString(),
                    name: operation.operation_name,
                    time: parseInt(time)
                };
                await axios.post(`${API_URL}/gamme-produce-operation/create`, payload,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
            });

            await Promise.all(requests);
            toast.success("Gamme production a été enregistrée avec succès");
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement de la production de gamme");
            console.error("Error creating gamme production:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchDataAllPosts();
                await fetchDataAllMachines();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (gammeId) {
            fetchDataOperations(gammeId);
            fetchDataGamme(gammeId);
        }
        fetchData();
    }, [gammeId]);

    return (
        <>
            <div className="mt-5 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900">
                    Modifier la production de {gamme.name}
                </h1>
            </div>
            <div className="mt-1 flex justify-center">
                <h1 className="text-xl leading-none tracking-tight text-gray-600">
                    Responsable: {gamme.User?.name}
                </h1>
            </div>
            <div className="mt-1 flex justify-center">
                <h1 className="text-xl leading-none tracking-tight text-gray-600">
                    Pièce: {gamme.Piece?.name}
                </h1>
            </div>
            <div className="mt-2 flex justify-end">
                <Link to="/gammes">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Retour</span>
                        <RiArrowGoBackFill className="h-5 w-5" />
                    </button>
                </Link>
            </div>
            <div className="container mx-auto py-8 px-4 md:px-6">
                <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex justify-center">
                    {operations.length === 0 ? (
                        <div className="text-center text-gray-600">
                            <p>Gamme n'a pas encore d'opérations enregistrées.</p>
                        </div>
                    ) : (
                        currentOperations.map((operation, index) => (
                            <div key={index} className="bg-white overflow-hidden shadow-md rounded-lg w-96">
                                <div className="px-4 py-5 font-bold text-gray-800 text-xl">
                                    Opération {index + 1} : {operation.operation_name}
                                </div>
                                <div className="px-4 py-4 space-y-4">
                                    <div>
                                        <label htmlFor={`post-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                            Post
                                        </label>
                                        <select
                                            value={operation.post_name}
                                            onChange={(e) => handlePostChange(index, e.target.value)}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                        >
                                            <option value="">Sélectionnez un post</option>
                                            {posts.map((post) => (
                                                <option key={post.Post.id} value={post.Post.name}>
                                                    {post.Post.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`machine-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                            Machine
                                        </label>
                                        <select
                                            value={operation.machine_name}
                                            onChange={(e) => handleMachineChange(index, e.target.value)}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                        >
                                            <option value="">Sélectionnez une machine</option>
                                            {(machineFilters[operation.post_name] || []).map(machine => (
                                                <option key={machine.id} value={machine.id}>{machine.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`time-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                            Temps requis
                                        </label>
                                        <input
                                            value={operation.time}
                                            id={`time-${index + 1}`}
                                            type="number"
                                            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900"
                                            onChange={(e) => handleTimeChange(index, e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-10 flex justify-center">
                    <button onClick={createGammeProduction} className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Enregistrer les modifications</span>
                        <FaRegSave className="h-5 w-5" />
                    </button>
                </div>
                {/* Pagination */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                    >
                        Précédent
                    </button>
                    {/* Affichage des numéros de page */}
                    {Array.from({ length: Math.ceil(operations.length / operationsPerPage) }).map(
                        (item, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4">
                                {index + 1}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(operations.length / operationsPerPage)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                    >
                        Suivant
                    </button>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default GammeProduction;
