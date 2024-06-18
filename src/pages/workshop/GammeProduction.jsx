import React, { useState } from 'react';
import { RiArrowGoBackFill } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { Link } from "react-router-dom";

function GammeProduction() {
    const [operations, setOperations] = useState([
        { machine: 'Machine 1', time: 60, name: 'Découpe du média', post:'Découpe' },
        { machine: 'Machine 2', time: 45, name: 'Pliage du boîtier', post:'Pliage' },
        { machine: 'Machine 3', time: 30, name: 'Peindre', post:'Peindre' },
        { machine: 'Machine 5', time: 60, name: 'Découpe du média', post:'Découpe' },
        { machine: 'Machine 6', time: 45, name: 'Pliage du boîtier', post:'Pliage' },
        { machine: 'Machine 7', time: 30, name: 'Peindre', post:'Peindre' },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const operationsPerPage = 3;

    const handleOperationChange = (index, key, value) => {
        const newOperations = [...operations];
        newOperations[index][key] = value;
        setOperations(newOperations);
    };

    // Calculer les opérations à afficher sur la page actuelle
    const indexOfLastOperation = currentPage * operationsPerPage;
    const indexOfFirstOperation = indexOfLastOperation - operationsPerPage;
    const currentOperations = operations.slice(indexOfFirstOperation, indexOfLastOperation);

    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="mt-5 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900">Modifier la production de gamme de fabrication A</h1>
            </div>
            {/* Autres éléments de votre interface */}
            <div className="mt-1 flex justify-center">
                <h1 className="text-xl leading-none tracking-tight text-gray-600">Responsable: John Doe</h1>
            </div>
            <div className="mt-1 flex justify-center">
                <h1 className="text-xl leading-none tracking-tight text-gray-600">Pièce: Création d'une table</h1>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentOperations.map((operation, index) => (
                        <div key={index} className="bg-white overflow-hidden shadow-md rounded-lg">
                            <div className="px-4 py-5 font-bold text-gray-800 text-xl">
                                Opération {index + 1} :  {operation.name}
                            </div>
                            <div className="px-4 py-4 space-y-4">
                                <div>
                                    <label htmlFor={`machine-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                        Machine
                                    </label>
                                    <select
                                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900"
                                        defaultValue={operation.machine}
                                        id={`machine-${index + 1}`}
                                        onChange={(e) => handleOperationChange(index, 'machine', e.target.value)}
                                    >
                                        <option value="Machine 1">Machine 1</option>
                                        <option value="Machine 2">Machine 2</option>
                                        <option value="Machine 3">Machine 3</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor={`post-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                        Post
                                    </label>
                                    <input
                                        value={operation.post} // Utilisation de 'value' au lieu de 'defaultValue'
                                        id={`post-${index + 1}`}
                                        type="text"
                                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900"
                                        onChange={(e) => handleOperationChange(index, 'post', parseInt(e.target.value))}
                                    />

                                </div>
                                <div>
                                    <label htmlFor={`time-${index + 1}`} className="block text-sm font-medium text-gray-700">
                                        Temps requis
                                    </label>
                                    <input
                                        defaultValue={operation.time}
                                        id={`time-${index + 1}`}
                                        type="number"
                                        className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-900"
                                        onChange={(e) => handleOperationChange(index, 'time', parseInt(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-10 flex justify-center">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
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
        </>
    );
}

export default GammeProduction;
