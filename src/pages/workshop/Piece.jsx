import React, { useState, useEffect } from "react";
import axios from "axios";
import DropdownFilterPiece from "../../components/dropdown/DropDownPiece";
import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import PieceDetailModal from "../../components/modal/piece/PieceDetailModal";
import DeleteConfirmationModal from "../../components/modal/piece/PieceDeleteModal";
import UpdatePieceModal from "../../components/modal/piece/PieceUpdateModal";

function Pieces() {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("Tous les types");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPieceId, setSelectedPieceId] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const piecesPerPage = 6;
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchPieces = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece/all`);
                setPieces(response.data);
            } catch (error) {
                console.error("Error fetching pieces:", error);
            }
        };

        fetchPieces();
    }, [API_URL,updateModal,deleteModal]);

    const filteredPieces = pieces.filter((piece) =>
        selectedType === "Tous les types" ? true : piece.type === selectedType
    );

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    const handleDeletePiece = async () => {
        try {
            await axios.delete(`${API_URL}/piece/delete/${selectedPieceId}`);
            const response = await axios.get(`${API_URL}/piece/all`);
            setPieces(response.data);
            setDeleteModal(false);
        } catch (error) {
            console.error("Error deleting piece:", error);
        }
    };

    const handleDeleteModal = (pieceId) => {
        setSelectedPieceId(pieceId);
        setDeleteModal(true);
    };

    const searchedPieces = filteredPieces.filter((piece) =>
        piece.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastPiece = currentPage * piecesPerPage;
    const indexOfFirstPiece = indexOfLastPiece - piecesPerPage;
    const currentPieces = searchedPieces.slice(indexOfFirstPiece, indexOfLastPiece);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowModal = (pieceId) => {
        setSelectedPieceId(pieceId);
        setShowModal(true);
    };

    const handleUpdateModal = (pieceId) => {
        setSelectedPieceId(pieceId);
        setUpdateModal(true);
    };

    return (
        <>
            {/* GESTION DES PIECES */}
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">
                    Gestion des pièces
                </h1>
            </div>
            <div className="mt-2 flex justify-end">
                <Link to="/piece-create">
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="px-4 py-2 bg-transparent text-gray-900 border border-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                    Rechercher
                </button>
                <DropdownFilterPiece onOptionSelect={handleTypeSelect} />
            </div>
            <main className="container mx-auto py-8 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentPieces.map((piece) => (
                        <div key={piece.id} className="ml-2 mr-2 bg-white shadow-md rounded-md p-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">{piece.name}</h3>
                                <div className="text-right">
                                    <div className="text-gray-500 dark:text-gray-600">Référence: {piece.id}</div>
                                    <div className="text-gray-500 dark:text-gray-600">Type: {piece.type}</div>
                                    <div className="text-xl font-bold">{piece.price} €</div>
                                </div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <button
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2"
                                    onClick={() => handleUpdateModal(piece.id)}
                                >
                                    Modifier
                                </button>
                                <button
                                    className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2"
                                    onClick={() => handleShowModal(piece.id)}
                                >
                                    Composants
                                </button>
                                <button
                                    className="bg-gray-900 text-white py-2 px-4 rounded-md flex-grow ml-2"
                                    onClick={() => handleDeleteModal(piece.id)}
                                >
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
            <PieceDetailModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedPieceId={selectedPieceId}
            />
            <DeleteConfirmationModal
                showModal={deleteModal}
                setShowModal={setDeleteModal}
                onDelete={handleDeletePiece}
            />
            <UpdatePieceModal
                showModal={updateModal}
                setShowModal={setUpdateModal}
                pieceId={selectedPieceId}
                API_URL={API_URL}
            />
        </>
    );
}

export default Pieces;
