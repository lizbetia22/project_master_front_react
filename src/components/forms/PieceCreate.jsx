import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaTools } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

function PieceCreate() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [price, setPrice] = useState('');
    const [allPieces, setAllPieces] = useState([]);
    const [components, setComponents] = useState([{ id: 1, component: '', quantity: '' }]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const options = [
        'Tous les types', 'Matière première', 'Pièces livrables aux clients', 'Pièce achetée', 'Pièce intermédiaire'
    ];
    const API_URL = process.env.REACT_APP_API_URL;

    const handleSubmit = (e) => {
        e.preventDefault();
        handleCreate();
    };

    const handleAddComponent = () => {
        setComponents([...components, { id: components.length + 1, component: '', quantity: '' }]);
    };

    const handleRemoveComponent = (index) => {
        const newComponents = components.filter((_, i) => i !== index);
        setComponents(newComponents);
    };

    const handleComponentChange = (index, field, value) => {
        const newComponents = components.slice();
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    const handleCreate = async () => {
        const piece = { name, type, price: parseFloat(price) };
        const componentsData = components
            .filter(comp => comp.component && comp.quantity)
            .map(comp => ({
                id_piece_component: parseInt(comp.component, 10),
                quantity: parseInt(comp.quantity, 10)
            }));

        const requestBody = { piece, components: componentsData };

        try {
            await axios.post(`${API_URL}/piece/create/ref`, requestBody);
            setAlertMessage("Pièce créée avec succès !");
            setAlertType("success");
            setName('');
            setType('');
            setPrice('');
            setComponents([{ id: 1, component: '', quantity: '' }]);
        } catch (error) {
            console.error("Erreur lors de la création de la pièce:", error);
            setAlertMessage("Une erreur est survenue lors de la création de la pièce.");
            setAlertType("error");
        }
        // Set timeout to clear alert after 5 seconds
        setTimeout(() => {
            setAlertMessage('');
            setAlertType('');
        }, 5000);
    }

    const fetchAllPieces = async () => {
        try {
            const response = await axios.get(`${API_URL}/piece/all`);
            setAllPieces(response.data);
        } catch (error) {
            console.error("Error fetching all pieces:", error);
        }
    };

    useState(() => {
        fetchAllPieces();
    }, []);

    return (
        <>
            <div className="mt-5 flex justify-center">
                <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 inline-flex items-center">
                    Créer une nouvelle pièce
                    <FaTools className="h-7 w-7 ml-2" />
                </h1>
            </div>
            <div className="flex justify-end">
                <Link to="/pieces">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Retour</span>
                        <RiArrowGoBackFill className="h-5 w-5" />
                    </button>
                </Link>
            </div>
            <div className="mx-auto max-w-2xl space-y-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center">
                        <h1 className="mb-10 text-xl leading-none tracking-tight text-gray-700">
                            Remplissez le formulaire ci-dessous pour ajouter une nouvelle pièce
                        </h1>
                    </div>
                    {alertMessage && (
                        <div className={`p-4 mb-4 text-sm rounded-lg ${alertType === 'success' ? 'text-green-800 bg-green-50 dark:bg-gray-800 dark:text-green-400' : 'text-red-800 bg-red-50 dark:bg-gray-800 dark:text-red-400'}`} role="alert">
                            <span className="font-medium">{alertType === 'success' ? '' : ''}</span> {alertMessage}
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom de la pièce
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                    placeholder="Entrez le nom de la pièce"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type de pièce
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                >
                                    <option value="">Sélectionnez un type</option>
                                    {options.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                                Prix
                            </label>
                            <input
                                id="price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                type="number"
                                className="border mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md py-2 px-3"
                                placeholder="Entrez le prix"
                            />
                        </div>
                        {components.map((comp, index) => (
                            <div key={comp.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Composants {index + 1}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={comp.component}
                                        onChange={(e) => handleComponentChange(index, 'component', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez un composant</option>
                                        {allPieces.map(piece => (
                                            <option key={piece.id} value={piece.id}>
                                                {piece.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        value={comp.quantity}
                                        onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                                        type="number"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        placeholder="Quantité"
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    onClick={() => handleRemoveComponent(index)}
                                >
                                    <MdDeleteForever className="h-6 w-6"/>
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-4">
                            <button
                                className="my-5 w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                onClick={handleAddComponent}
                                type="button"
                            >
                                Ajouter un composant
                            </button>
                        </div>
                        <button
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit"
                        >
                            Créer la pièce
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PieceCreate;
