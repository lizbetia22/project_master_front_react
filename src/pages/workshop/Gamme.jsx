import React, { useState } from 'react';
import { LuCalendarRange } from 'react-icons/lu';
import { VscSymbolProperty } from "react-icons/vsc";
import { Link } from "react-router-dom";
import axios from 'axios';

function Gamme() {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [gammesData, setGammesData] = useState([]);
    const gammesPerPage = 8;
    const [showTooltip, setShowTooltip] = useState(null);
    const [modalGammeId, setModalGammeId] = useState(null);
    const [operationsData, setOperationsData] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useState(() => {
        axios.get(`${API_URL}/gamme/all`)
            .then(response => {
                setGammesData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the gammes data!", error);
            });
    }, [API_URL]);

    const fetchOperationsData = (gammeId) => {
        axios.get(`${API_URL}/gamme-operation/gamme/${gammeId}`)
            .then(response => {
                setOperationsData(response.data);
                console.log(response.data)
                setShowModal(true);
            })
            .catch(error => {
                console.error("Error fetching operations data for gamme:", error);
            });
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredGammes = gammesData.filter(gamme =>
        gamme.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastGamme = currentPage * gammesPerPage;
    const indexOfFirstGamme = indexOfLastGamme - gammesPerPage;
    const currentGammes = filteredGammes.slice(indexOfFirstGamme, indexOfLastGamme);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowModal = (id) => {
        setModalGammeId(id);
        fetchOperationsData(id); // Fetch operations data when modal is opened
    };

    return (
        <>
            {/* Gestion des gammes */}
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Gestion des gammes</h1>
            </div>
            <div className="mt-2 flex justify-end">
                <Link to="/gamme-create">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Ajouter une gamme</span>
                        <LuCalendarRange className="h-5 w-5" />
                    </button>
                </Link>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher une gamme par nom..."
                    type="search"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="px-4 py-2 bg-transparent text-gray-900 border border-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
                    Rechercher
                </button>
            </div>
            {/* La carte "Gamme de fabrication" */}
            <div className="flex flex-wrap justify-center mt-5">
                {currentGammes.map((gamme, index) => (
                    <div key={gamme.id} className="max-w-xl mx-auto mb-4">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="px-4 py-6 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">{gamme.name}</h3>
                                    <div className="relative inline-block">
                                        <Link to="/gamme-production">
                                            <VscSymbolProperty
                                                className="h-6 w-6 cursor-pointer"
                                                onMouseEnter={() => setShowTooltip(index)}
                                                onMouseLeave={() => setShowTooltip(null)}
                                            />
                                        </Link>
                                        {showTooltip === index && (
                                            <div className="text-xs absolute bg-gray-800 text-white p-2 rounded-md z-10 top-full left-1/2 transform -translate-x-1/2 mt-2">
                                                Produire une gamme
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600">Responsable: {gamme.User.name}</p>
                                <p className="text-gray-600">Pièce: {gamme.Piece.name}</p>
                                <div className="mt-4 flex gap-2">
                                    <div className="flex justify-between mt-2">
                                        <button
                                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2"
                                            onClick={() => handleShowModal(gamme.id)}
                                        >
                                            Détails
                                        </button>
                                        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow flex-grow mr-2">
                                            Modifier
                                        </button>
                                        <button className="bg-gray-900 text-white py-2 px-4 rounded-md flex-grow ml-2">
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-2 mb-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(filteredGammes.length / gammesPerPage) }).map(
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
                    disabled={currentPage === Math.ceil(filteredGammes.length / gammesPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
            {/* La modal */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Détails de la gamme de fabrication avec id: {modalGammeId}
                                        </h3>
                                        {operationsData.length === 0 ? (
                                            <p className="text-gray-700 dark:text-gray-600 mt-4">
                                                Gamme n'a pas encore d'opérations enregistrées.
                                            </p>
                                        ) : (
                                            <div className="flex flex-wrap">
                                                {operationsData.map((operation, index) => (
                                                    <div key={operation.id} className="w-full sm:w-1/2 lg:w-1/3 border rounded-lg p-3 m-2">
                                                        <h4 className="text-lg font-medium">Opération {index + 1}</h4>
                                                        <p className="text-gray-700 dark:text-gray-600">Nom: {operation.operation_name}</p>
                                                        <p className="text-gray-700 dark:text-gray-600">Poste: {operation.post_name}</p>
                                                        <p className="text-gray-700 dark:text-gray-600">Machine: {operation.machine_name}</p>
                                                        <p className="text-gray-700 dark:text-gray-600">Temps: {operation.time} min</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
            )}

        </>
    );
}

export default Gamme;
