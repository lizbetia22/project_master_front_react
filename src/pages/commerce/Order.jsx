import React, { useState, useEffect } from 'react';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Order() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [orders, setOrders] = useState([]);
    const facturesPerPage = 5;
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/order-piece/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const processedOrders = processOrders(response.data);
                setOrders(processedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [API_URL]);

    const downloadPdf = async (id) => {
        try {
            const response = await axios.get(`${API_URL}/order-piece/pdf/${id}`, {
                responseType: 'blob',  // Ensure response is treated as a blob
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `Facture_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            toast.success('Facture est télécharger avec success!');
        } catch (error) {
            toast.error('Une erreur est servenue lors du telechargment de la facture!');
            console.error("Error fetching PDF:", error);
        }
    };


    const processOrders = (data) => {
        const ordersMap = {};

        data.forEach(item => {
            const { id_order, Order, Piece, quantity, price } = item;
            const { date_order, Client } = Order;
            const user = Client.name;

            if (!ordersMap[id_order]) {
                ordersMap[id_order] = {
                    id: id_order,
                    date: new Date(date_order).toLocaleDateString('fr-CA'),
                    user: user,
                    pieces: [],
                    quantities: [],
                    prices: [],
                    action: "Télécharger une facture"
                };
            }

            ordersMap[id_order].pieces.push(Piece.name);
            ordersMap[id_order].quantities.push(quantity);
            ordersMap[id_order].prices.push(price);
        });

        return Object.values(ordersMap);
    };

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const handlePageChange = pageNumber => setCurrentPage(pageNumber);

    const filteredData = orders.filter(row => {
        if (filterBy === 'pieces') {
            return row.pieces.some(piece => piece.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        const value = String(row[filterBy]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
    });

    const paginatedFilteredData = paginate(filteredData, facturesPerPage, currentPage);

    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste des factures</h1>
            </div>
            <div className="mt-7 border rounded-md overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <select
                            className="w-32 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            value={filterBy}
                            onChange={(e) => setFilterBy(e.target.value)}
                        >
                            <option value="id">ID</option>
                            <option value="date">Date</option>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
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
                                    {row.quantities.map((qty, i) => (
                                        <li key={i}>{qty}</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ul>
                                    {row.prices.map((price, i) => (
                                        <li key={i}>{price}€</li>
                                    ))}
                                </ul>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        onClick={() => downloadPdf(row.id)}>
                                    {row.action}
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
                {Array.from({ length: Math.ceil(filteredData.length / facturesPerPage) }).map(
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
                    disabled={currentPage === Math.ceil(filteredData.length / facturesPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Order;
