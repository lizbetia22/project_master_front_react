import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";

const UpdatePieceModal = ({ showModal, setShowModal, pieceId, API_URL }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");
    const [composants, setComposants] = useState([]);
    const [showAddComponent, setShowAddComponent] = useState(false);
    const [componentId, setComponentId] = useState(null);
    const [componentName, setComponentName] = useState("");
    const [componentQuantity, setComponentQuantity] = useState("");
    const [allPieces, setAllPieces] = useState([]);

    const [errors, setErrors] = useState({
        name: "",
        type: "",
        price: ""
    });

    useEffect(() => {
        const fetchPieceDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece/${pieceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                const { name, type, price } = response.data;
                setName(name);
                setType(type);
                setPrice(price);
            } catch (error) {
                console.error("Error fetching piece details:", error);
            }
        };

        const fetchComponents = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece_ref/components/${pieceId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setComposants(response.data);
            } catch (error) {
                console.error("Error fetching components:", error);
            }
        };

        const fetchAllPieces = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                setAllPieces(response.data);
            } catch (error) {
                console.error("Error fetching all pieces:", error);
            }
        };

        if (showModal && pieceId) {
            fetchPieceDetails();
            fetchComponents();
            fetchAllPieces();
        }
    }, [showModal, pieceId, API_URL]);

    const validateInputs = () => {
        const errors = {};
        if (!name.trim()) {
            errors.name = "Le nom ne peut pas être vide";
        } else if (/[^a-zA-Z0-9\s]/.test(name)) {
            errors.name = "Le nom ne peut pas contenir de symboles (*, /, !, etc.)";
        }

        if (!type.trim()) {
            errors.type = "Le type ne peut pas être vide";
        }

        if (!price.trim()) {
            errors.price = "Le prix ne peut pas être vide";
        } else if (isNaN(price) || parseFloat(price) <= 0) {
            errors.price = "Le prix doit être un nombre positif";
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdatePiece = async () => {
        if (!validateInputs()) {
            return;
        }
        try {
            const requestBody = {
                piece: {
                    name: name,
                    type: type,
                    price: parseFloat(price)
                },
                components: composants.map(composant => ({
                    id_piece_component: composant.ComponentPiece.id,
                    quantity: composant.quantity
                }))
            };
            await axios.put(`${API_URL}/piece/update/ref/${pieceId}`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setShowModal(false);
        } catch (error) {
            console.error("Error updating piece:", error);
        }
    };



    const handleComponentChange = (index, field, value) => {
        const newComposants = [...composants];
        newComposants[index][field] = value;
        setComposants(newComposants);
    };

    const handleAddComponent = () => {
        setShowAddComponent(true);
    };

    const handleCancelAddComponent = () => {
        setShowAddComponent(false);
        setComponentId(null);
        setComponentName("");
        setComponentQuantity("");
    };

    const handleSaveComponent = () => {
        const newComponent = {name: componentName, quantity: componentQuantity, ComponentPiece: {id: componentId, name: componentName}};
        setComposants([...composants, newComponent]);
        setShowAddComponent(false);
        setComponentId(null);
        setComponentName("");
        setComponentQuantity("");
    };

    const handleRemoveComponent = (index) => {
        const newComposants = composants.filter((_, i) => i !== index);
        setComposants(newComposants);
    };

    return (
        <>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                            role="dialog" aria-modal="true" aria-labelledby="modal-headline"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Modifier la pièce
                                        </h3>
                                        <div className="mt-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                                            <input
                                                type="text"
                                                name="type"
                                                id="type"
                                                value={type}
                                                onChange={(e) => setType(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="text-lg font-medium text-gray-900">Composants</h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {composants.length === 0 && !showAddComponent && (
                                                    <div>
                                                        <p>Aucun composant trouvé</p>
                                                        <button
                                                            onClick={handleAddComponent}
                                                            className="mt-3 w-full inline-flex justify-center bg-gray-800 rounded-md border border-gray-300 shadow-sm px-4 py-2  text-base font-medium text-gray-100 hover:bg-gray-700 sm:w-auto sm:text-sm"
                                                        >
                                                            Ajouter
                                                        </button>
                                                    </div>
                                                )}

                                                {showAddComponent && (
                                                    <div className="flex flex-wrap items-center">
                                                        <div className="mb-4 w-full">
                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-sm font-medium text-gray-700 mt-2">
                                                                        Nom du composant
                                                                    </label>
                                                                    <select
                                                                        value={componentName}
                                                                        onChange={(e) => {
                                                                            const selectedPieceId = e.target.options[e.target.selectedIndex].getAttribute("data-piece-id");
                                                                            setComponentId(selectedPieceId);
                                                                            setComponentName(e.target.value);
                                                                        }}
                                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                                    >
                                                                        <option value="">Sélectionner un composant</option>
                                                                        {allPieces.map((piece) => (
                                                                            <option key={piece.id} value={piece.name} data-piece-id={piece.id}>{piece.name}</option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mt-2">
                                                                        Quantité
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        value={componentQuantity}
                                                                        onChange={(e) => setComponentQuantity(e.target.value)}
                                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                                        placeholder="Quantité"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between mt-3">
                                                                <button
                                                                    onClick={handleSaveComponent}
                                                                    className="w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-100 hover:bg-gray-700 sm:text-sm"
                                                                >
                                                                    Enregistrer
                                                                </button>
                                                                <button
                                                                    onClick={handleCancelAddComponent}
                                                                    className="w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
                                                                >
                                                                    Annuler
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {composants.map((composant, index) => (
                                                    <div key={index} className="flex space-x-4 items-center mt-2">
                                                        <div className="w-2/3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Nom du composant
                                                            </label>
                                                            <select
                                                                value={composant.ComponentPiece.name}
                                                                onChange={(e) =>
                                                                    handleComponentChange(index, 'name', e.target.value)
                                                                }
                                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                            >
                                                                {allPieces.map((piece) => (
                                                                    <option key={piece.id} value={piece.name}>
                                                                        {piece.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="w-1/3">
                                                            <label className="block text-sm font-medium text-gray-700">
                                                                Quantité
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={composant.quantity}
                                                                onChange={(e) =>
                                                                    handleComponentChange(index, 'quantity', e.target.value)
                                                                }
                                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-6"
                                                            onClick={() => handleRemoveComponent(index)}
                                                        >
                                                            <MdDeleteForever className="h-5 w-5"/>
                                                        </button>
                                                    </div>
                                                ))}

                                                {composants.length > 0 && (
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <button
                                                            className="w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                                            onClick={handleAddComponent}
                                                            type="button"
                                                        >
                                                            Ajouter un composant
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleUpdatePiece}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center bg-gray-800 rounded-md border border-gray-300 shadow-sm px-4 py-2  text-base font-medium text-gray-100 hover:bg-gray-700 sm:w-auto sm:text-sm ml-5"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdatePieceModal;
