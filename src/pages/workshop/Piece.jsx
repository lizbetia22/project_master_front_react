import React, { useState } from "react";
import DropdownFilterPiece from "../../components/dropdown/DropDownPiece";
import {Link} from "react-router-dom";
import {FaTools} from "react-icons/fa";

function Pieces() {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("Tous les types");
    const [currentPage, setCurrentPage] = useState(1);
    const piecesPerPage = 6;
    const [pieces] = useState([
        {
            nom: "Pneu 205/55",
            reference: "2566",
            type: "matière première",
            prix: "89,99 €"
        },
        {
            nom: "Caoutchouc T85",
            reference: "75966",
            type: "matière première",
            prix: "12,50 €"
        },
        {
            nom: "Métal YU5",
            reference: "5556",
            type: "pièces livrables aux clients",
            prix: "59,99 €"
        },
        {
            nom: "Bois X8",
            reference: "5556",
            type: "pièce achetée",
            prix: "59,99 €"
        },
        {
            nom: "Bois X8",
            reference: "5556",
            type: "pièce achetée",
            prix: "59,99 €"
        },
        {
            nom: "Table GT8",
            reference: "5556",
            type: "pièce intermédiaire",
            prix: "59,99 €"
        },
        {
            nom: "Chase GT7",
            reference: "5556",
            type: "pièce intermédiaire",
            prix: "59,99 €"
        },
        {
            nom: "Pneu 205/55",
            reference: "5556",
            type: "pièces livrables aux clients",
            prix: "59,99 €"
        },
        {
            nom: "Pneu 205/55",
            reference: "5556",
            type: "pièces livrables aux clients",
            prix: "59,99 €"
        },
    ]);
    const filteredPieces = pieces.filter((piece) =>
        selectedType === "Tous les types" ? true : piece.type === selectedType
    );

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const searchedPieces = filteredPieces.filter((piece) =>
        piece.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPiece = currentPage * piecesPerPage;
    const indexOfFirstPiece = indexOfLastPiece - piecesPerPage;
    const currentPieces = searchedPieces.slice(indexOfFirstPiece, indexOfLastPiece);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            {/* GESTION DES PIECES */}
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">
                    Gestion des pièces
                </h1>
            </div>
            <div className="mt-2 flex justify-end">
                <Link to="/form-piece">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Ajouter une pièce</span>
                        <FaTools className="h-5 w-5" />
                    </button>
                </Link>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher une pièce..."
                    type="search"
                    value={searchTerm} // Associer la valeur de l'input à l'état searchTerm
                    onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour l'état searchTerm lorsqu'il y a un changement dans l'input
                />
                <button className="px-4 py-2 bg-transparent text-gray-900 border border-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                    Rechercher
                </button>
                <DropdownFilterPiece onOptionSelect={handleTypeSelect} />
            </div>
            <main className="container mx-auto py-8 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPieces.map((piece, index) => (
                        <div key={index} className="ml-2 mr-2 bg-white shadow-md rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">{piece.nom}</h3>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-600">Référence: {piece.reference}</div>
                                    <div className="text-gray-500 dark:text-gray-600">Type: {piece.type}</div>
                                    <div className="text-xl font-bold">{piece.prix}</div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2">
                                    Modifier
                                </button>
                                <button
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2"
                                    onClick={() => setShowModal(true)}
                                >
                                    Composants
                                </button>
                                <button className="bg-gray-900 text-white py-2 px-4 rounded-md flex-grow ml-2">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(searchedPieces.length / piecesPerPage) }).map(
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
                    disabled={currentPage === Math.ceil(searchedPieces.length / piecesPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
            {/* Modal */}
            {showModal && (
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
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-600">Caoutchouc T85: 4 pièces</p>
                                                    <p className="text-gray-700 dark:text-gray-600">Métal YU5: 10 pièces</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow  mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Pieces;
