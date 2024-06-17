import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PieceDetailModal({ showModal, setShowModal, selectedPieceId }) {
    const [composants, setComposants] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPieces = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece_ref/components/${selectedPieceId}`);
                setComposants(response.data);
            } catch (error) {
                console.error('Error fetching pieces:', error);
            }
        };

        if (selectedPieceId) {
            fetchPieces();
        }
    }, [selectedPieceId, API_URL, showModal]);

    if (!showModal) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-headline"
                >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                    Composants
                                </h3>
                                <div className="mt-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        {composants.length === 0 ? (
                                            <p>Aucun composant trouvé</p>
                                        ) : (
                                            composants.map((composant, index) => (
                                                <div key={index}>
                                                    <p className="text-gray-800">
                                                        <span className="font-bold">{composant.ComponentPiece.name}:</span> {composant.quantity} pièces
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="button"
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-2"
                            onClick={() => setShowModal(false)}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PieceDetailModal;
