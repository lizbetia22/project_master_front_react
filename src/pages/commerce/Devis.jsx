import React, {useEffect, useState} from 'react';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import axios from "axios";

function Devis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [devis, setDevis] = useState([]);
    const quotationsPerPage = 5;
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
        const fetchDevis = async () => {
            try {
                const response = await axios.get(`${API_URL}/devis-piece/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                const devisMap = {};
                response.data.forEach(item => {
                    const id_devis = item.id_devis;
                    if (!devisMap[id_devis]) {
                        devisMap[id_devis] = {
                            id:id_devis,
                            date: new Date(item.Devi.date).toLocaleDateString('fr-CA'),
                            deadline: new Date(item.Devi.deadline).toLocaleDateString('fr-CA'),
                            user: item.Devi.User.name,
                            pieces: [],
                            quantity: [],
                            price: []
                        };
                    }

                    devisMap[id_devis].pieces.push(item.Piece.name);
                    devisMap[id_devis].quantity.push(item.quantity);
                    devisMap[id_devis].price.push(item.price);
                });

                const mappedDevis = Object.values(devisMap);

                setDevis(mappedDevis);
            } catch (error) {
                console.error("Error fetching devis:", error);
            }
        };


        fetchDevis();
    }, [API_URL]);

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const handlePageChange = pageNumber => setCurrentPage(pageNumber);

    const openModal = (quotation) => {
        setSelectedQuotation(quotation);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedQuotation(null);
    };


    const filteredData = devis.filter(row => {
        const value = String(row[filterBy]).toLowerCase();
        if (filterBy === 'pieces') {
            return row.pieces.some(piece => piece.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return value.includes(searchTerm.toLowerCase());
    });


    const paginatedFilteredData = paginate(filteredData, quotationsPerPage, currentPage);

    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste des devis</h1>
            </div>
            <div className="mt-2 flex justify-end">
                <button className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                    <span className="mr-1">Ajouter un devis</span>
                    <HiOutlineClipboardDocumentList className="h-5 w-5" />
                </button>
            </div>
            <div className="border rounded-md overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <select
                            className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="date">Date</option>
                            <option value="deadline">Deadline</option>
                            <option value="user">Utilisateur</option>
                            <option value="pieces">Pièce</option>
                        </select>
                        <input
                            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder="Rechercher..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50 dark:bg-gray-300">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Utilisateur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pièces</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFilteredData.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.deadline}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.user}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ul>
                                    {row.pieces.map((piece, i) => (
                                        <li key={i}>{piece}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ul>
                                    {row.quantity.map((qty, i) => (
                                        <li key={i}>{qty}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ul>
                                    {row.price.map((price, i) => (
                                        <li key={i}>{price}€</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={() => openModal(row)}
                                >
                                    Convertir en facture
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(filteredData.length / quotationsPerPage) }).map(
                    (item, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                                currentPage === index + 1 ? "" : "rounded-l"
                            }`}
                        >
                            {index + 1}
                        </button>
                    )
                )}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredData.length / quotationsPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
            {/* Modal */}
            {modalOpen && selectedQuotation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-1/2">
                        <h2 className="text-xl font-bold mb-4">Passer en facture</h2>
                        <form>
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50 dark:bg-gray-300">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Produit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"></th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {selectedQuotation.pieces.map((piece, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4 whitespace-nowrap">{piece}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{selectedQuotation.quantity[i]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{selectedQuotation.price[i]}€</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input type="checkbox" className="form-checkbox h-5 w-5 text-gray-600" />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4">
                                <button className="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                    Valider
                                </button>
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={closeModal}>
                                    Fermer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}

export default Devis;
