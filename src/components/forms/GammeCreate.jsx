import React, {useEffect, useState} from 'react';
import { MdDeleteForever } from "react-icons/md";
import { LuCalendarRange } from "react-icons/lu";
import { IoMdSave } from "react-icons/io";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";

function GammeCreate() {
    const [name, setName] = useState('');
    const [piece, setPiece] = useState('');
    const [pieces, setPieces] = useState([]);
    const [posts, setPosts] = useState([]);
    const [machines, setMachines] = useState([]);
    const [operation, setOperation] = useState([]);
    const [users, setUsers] = useState([]);
    const [responsable, setResponsable] = useState('');
    const [components, setComponents] = useState([{ id: 1, name: '', post: '', machine: '', time: '' }]);
    const [operations, setOperations] = useState([{ id: 1, operation: '' }]);
    const [savedOperations, setSavedOperations] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;
    const [selectedPost, setSelectedPost] = useState('');
    const [filteredMachines, setFilteredMachines] = useState([]);

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/refresh/${localStorage.getItem('id')}`);
                localStorage.setItem('token', response.data.token);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        };
        if (selectedPost) {
            const post = posts.find(p => p.Post.name === selectedPost);
            if (post) {
                const filtered = machines.filter(machine => machine.id_post === post.Post.id);
                setFilteredMachines(filtered);
            } else {
                setFilteredMachines([]);
            }
        } else {
            setFilteredMachines([]);
        }
        refreshToken();
    }, [selectedPost, posts, machines, API_URL]);



    useState(() => {
        const fetchData = async () => {
            try {
                const responsePieces = await axios.get(`${API_URL}/piece/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setPieces(responsePieces.data);

                const storedId = localStorage.getItem('id');
                const responsePosts = await axios.get(`${API_URL}/user/posts/${storedId}`,
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

                const responseOperations = await axios.get(`${API_URL}/operation/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setOperation(responseOperations.data);

                const responseUsers = await axios.get(`${API_URL}/user/workshop`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setUsers(responseUsers.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [API_URL]);

    const createOperation = async (index) => {
        const comp = components[index];
        const post = posts.find((p) => p.Post.name === selectedPost);
        const machineObj = machines.find((m) => m.name === comp.machine);

        if (!post || !machineObj || !comp.name || !comp.time) {
            toast.error("Tous les champs sont requis.");
            return;
        }

        const operationData = {
            id_post: post.Post.id,
            id_machine: machineObj.id,
            name: comp.name,
            time: comp.time
        };

        try {
            const response = await axios.post(`${API_URL}/operation/create`, operationData);
            setSavedOperations([...savedOperations, response.data]);
            handleRemoveComponent(index);
            const responseOperations = await axios.get(`${API_URL}/operation/all`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setOperation(responseOperations.data);
            toast.success("Operation a été créée avec succès");
        } catch (error) {
            toast.error("Erreur lors de la creation d'operation");
            console.error('Error creating operation:', error);


        }
    };

    const createGamme = async () => {

        if (!piece || !responsable || !name) {
            toast.error("Tous les champs sont requis.");
            return;
        }


        const gammeData = {
            id_piece: pieces.find(p => p.name === piece).id,
            id_user: responsable,
            name: name,
            operations: operations.map(op => ({
                id_operation: operation.find(o => o.name === op.operation).id,
                time: operation.find(o => o.name === op.operation).time
            }))
        };
        try {
            await axios.post(`${API_URL}/gamme-operation/create/gamme`, gammeData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            toast.success("Gamme a été créée avec success")
            setName('');
            setPiece('');
            setResponsable('');
            setOperations([{ id: 1, operation: '' }]);

        } catch (error) {
            toast.error("Erreur lors de la creation d'une gamme")
            console.error('Error creating gamme:', error);
        }
};

    const handleSubmit = (e) => {
        e.preventDefault();
        createGamme();
    };

    const handleAddComponent = () => {
        setComponents([...components, { id: components.length + 1, component: '', quantity: '' }]);
    };

    const handleRemoveComponent = (index) => {
        const newComponents = components.filter((_, i) => i !== index);
        setComponents(newComponents);
    };

    const handleAddOperation = () => {
        setOperations([...operations, { id: components.length + 1, operation: '' }]);
    };

    const handleRemoveOperation = (index) => {
        const newOperations = operations.filter((_, i) => i !== index);
        setOperations(newOperations);
    };

    const handleOperationChange = (index, field, value) => {
        const newOperations = operations.slice();
        newOperations[index][field] = value;
        setOperations(newOperations);
    };

    const handleComponentChange = (index, field, value) => {
        const newComponents = components.slice();
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    return (
        <>
            <div className="mt-5 flex justify-center">
                <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 inline-flex items-center">
                    Créer une nouvelle gamme
                    <LuCalendarRange className="h-7 w-7 ml-2" />
                </h1>
            </div>
            <div className="flex justify-end">
            </div>
            <div className="mx-auto max-w-2xl space-y-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center">
                        <h1 className="mb-10 text-xl leading-none tracking-tight text-gray-700">
                            Remplissez le formulaire ci-dessous pour ajouter une nouvelle gamme
                        </h1>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom de la gamme
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                    placeholder="Entrez le nom de la gamme"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="piece" className="block text-sm font-medium text-gray-700">
                                    Piéce
                                </label>
                                <select
                                    id="piece"
                                    value={piece}
                                    onChange={(e) => setPiece(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                >
                                    <option value="">Sélectionnez une pièce</option>
                                    {pieces.map((pieceObj) => (
                                        <option key={pieceObj.id} value={pieceObj.name}>
                                            {pieceObj.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mt-4">
                                Responsable
                            </label>
                            <select
                                id="responsable"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                                className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                            >
                                <option value="">Sélectionner un responsable</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {components.map((comp, index) => (
                            <div key={index} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Opération {index + 1}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={comp.name}
                                        onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                                        type="text"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        placeholder="Nom"
                                    />
                                    <select
                                        id="post"
                                        value={selectedPost}
                                        onChange={(e) => setSelectedPost(e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez un poste</option>
                                        {posts.map((post) => (
                                            <option key={post.Post.id} value={post.Post.name}>
                                                {post.Post.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        value={comp.time}
                                        onChange={(e) => handleComponentChange(index, 'time', e.target.value)}
                                        type="text"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        placeholder="Temps"
                                    />
                                    <select
                                        value={comp.machine}
                                        onChange={(e) => handleComponentChange(index, 'machine', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez une machine</option>
                                        {filteredMachines.map(machine => (
                                            <option key={machine.id} value={machine.name}>{machine.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2 mr-2"
                                    onClick={() => createOperation(index)}
                                >
                                    <IoMdSave className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    onClick={() => handleRemoveComponent(index)}
                                >
                                    <MdDeleteForever className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                        {operations.map((comp, index) => (
                            <div key={index} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Opération exsitante {index + 1}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={comp.operation}
                                        onChange={(e) => handleOperationChange(index, 'operation', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez une opération</option>
                                        {operation.map((operationObj) => (
                                            <option key={operationObj.id} value={operationObj.name}>
                                                {operationObj.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    onClick={() => handleRemoveOperation(index)}
                                >
                                    <MdDeleteForever className="h-6 w-6" />
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-4">
                            <button
                                className="my-5 w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                onClick={handleAddComponent}
                                type="button"
                            >
                                Ajouter une nouvelle opération
                            </button>
                            <button
                                className="my-5 w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                onClick={handleAddOperation}
                                type="button"
                            >
                                Choisir une opération existante
                            </button>
                        </div>
                        <button
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit"
                        >
                            Créer la gamme
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default GammeCreate;
