import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdatePieceModal = ({ showModal, setShowModal, pieceId, API_URL }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        // Fetch piece details when modal is opened
        const fetchPieceDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece/${pieceId}`);
                const { name, type, price } = response.data;
                setName(name);
                setType(type);
                setPrice(price);
            } catch (error) {
                console.error("Error fetching piece details:", error);
            }
        };

        if (showModal && pieceId) {
            fetchPieceDetails();
        }
    }, [showModal, pieceId, API_URL]);

    const handleUpdatePiece = async () => {
        try {
            await axios.put(`${API_URL}/piece/update/${pieceId}`, { name, type, price });
            setShowModal(false);
        } catch (error) {
            console.error("Error updating piece:", error);
        }
    };

    return (
        <>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center block sm:p-0">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleUpdatePiece}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Modifier
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
