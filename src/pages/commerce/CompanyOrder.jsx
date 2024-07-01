import React, {useEffect, useState} from 'react';
import { BiPurchaseTag } from "react-icons/bi";
import { GrDocumentCsv } from "react-icons/gr";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {MdOutlineDelete} from "react-icons/md";

function CompanyOrder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [plannedDeliveryDate, setPlannedDeliveryDate] = useState('');
    const [actualDeliveryDate, setActualDeliveryDate] = useState('');
    const [pieceInputs, setPieceInputs] = useState([{ id_piece: '', quantity: '', price: '' }]);
    const [companyOrders, setCompanyOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [pieces, setPieces] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const achatsPerPage = 4;
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_URL}/company-order-piece/all`,{
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const processedOrders = processOrders(response.data);
                setCompanyOrders(processedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        const fetchSuppliers = async () => {
            try {
                const response = await axios.get(`${API_URL}/supplier/all`,  {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSuppliers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchPieces = async () => {
            try {
                const response = await axios.get(`${API_URL}/piece/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setPieces(response.data);
            } catch (error) {
                console.error("Error fetching pieces:", error);
            }
        };
        fetchSuppliers();
        fetchPieces();
        fetchOrders();
    }, [API_URL]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    const processOrders = (data) => {

        if (!data || !Array.isArray(data)) {
            return [];
        }

        const ordersMap = {};

        data.forEach(item => {
            const { id_order, Company_order, Piece, quantity, price } = item;
            const { date, planned_delivery_date, actual_delivery_date, Supplier } = Company_order;
            const supplier = Supplier.name;

            if (!ordersMap[id_order]) {
                ordersMap[id_order] = {
                    id: id_order,
                    date: new Date(date).toLocaleDateString('fr-CA'),
                    user: supplier,
                    pieces: [],
                    quantities: [],
                    prices: [],
                    planned_delivery_date: new Date(planned_delivery_date).toLocaleDateString('fr-CA'),
                    actual_delivery_date: new Date(actual_delivery_date).toLocaleDateString('fr-CA'),
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

    const filteredData = companyOrders.filter(row => {
        if (filterBy === 'pieces' || filterBy === 'quantities' || filterBy === 'prices') {
            return row[filterBy].some(item => String(item).toLowerCase().includes(searchTerm.toLowerCase()));
        }
        const value = String(row[filterBy]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
    });

    const paginatedFilteredData = paginate(filteredData, achatsPerPage, currentPage);

    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
        "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/company-order-piece/all`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const processedOrders = processOrders(response.data);
            setCompanyOrders(processedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const createCompanyOrder = async () => {
        if (!selectedSupplier || !selectedDate || !plannedDeliveryDate || !actualDeliveryDate) {
            toast.error('Tous les champs sont requis.');
            return;
        }

        const invalidPiece = pieceInputs.find(piece => !piece.id_piece || !piece.quantity || !piece.price);
        if (invalidPiece) {
            toast.error('Tous les champs de la pièce sont requis.');
            return;
        }
        const requestBody = {
            id_supplier: selectedSupplier,
            date: selectedDate,
            planned_delivery_date: plannedDeliveryDate,
            actual_delivery_date: actualDeliveryDate,
            pieces: pieceInputs.map(piece => ({
                id_piece: piece.id_piece,
                quantity: piece.quantity,
                price: piece.price
            }))
        };
        try {
            await axios.post(`${API_URL}/company-order-piece/create-order`, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchOrders();
            toast.success('Achat créé avec succès!');
            setSelectedSupplier('');
            setSelectedDate('');
            setPlannedDeliveryDate('');
            setActualDeliveryDate('');
            setPieceInputs([{ id_piece: '', quantity: '', price: '' }]);
            setModalAdd(false);
        } catch (error) {
            toast.error('Erreur lors de la création de l\'achat.');
            console.error("Error creating order:", error);
        }
    };

    const closeAddModal = () => {
        setModalAdd(false)
        setSelectedSupplier('');
        setSelectedDate('');
        setPlannedDeliveryDate('');
        setActualDeliveryDate('');
        setPieceInputs([{ id_piece: '', quantity: '', price: '' }]);
    }


    const addPieceInput = () => {
        setPieceInputs(prevState => [...prevState, { id_piece: '', quantity: '', price: '' }]);
    };

    const removePieceInput = (index) => {
        setPieceInputs(prevState => {
            const newState = [...prevState];
            newState.splice(index, 1);
            return newState;
        });
    };

    const handlePieceChange = (e, index) => {
        const { value } = e.target;
        setPieceInputs(prevState => {
            const newState = [...prevState];
            newState[index].id_piece = value;
            return newState;
        });
    };

    const handleQuantityChange = (e, index) => {
        const { value } = e.target;
        setPieceInputs(prevState => {
            const newState = [...prevState];
            newState[index].quantity = value;
            return newState;
        });
    };

    const handlePriceChange = (e, index) => {
        const { value } = e.target;
        setPieceInputs(prevState => {
            const newState = [...prevState];
            newState[index].price = value;
            return newState;
        });
    };


    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste des achats</h1>
            </div>
            <div className="flex justify-end">
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={() => setModalAdd(true)}
                >
                    <span className="mr-1">Ajouter un achat</span>
                    <BiPurchaseTag className="h-5 w-5" />
                </button>
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={() => setModalOpen(true)}
                >
                    <span className="mr-1">Télécharger des achats</span>
                    <GrDocumentCsv className="h-5 w-5" />
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
                            <option value="user">Fournisseur</option>
                            <option value="pieces">Pièces</option>
                            <option value="quantities">Quantité</option>
                            <option value="prices">Prix</option>
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
                        <th className="px-12 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fournisseur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pièces</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date de livrasion prévu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date de livrasion réelle</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFilteredData.length > 0 ? paginatedFilteredData.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
                            <td className="px-12 py-4 whitespace-nowrap">{row.date}</td>
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
                            <td className="px-8 py-4 whitespace-nowrap">{row.planned_delivery_date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.actual_delivery_date}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="px-6 py-4 text-center">Aucun résultat trouvé</td>
                        </tr>
                    )}
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
                {Array.from({ length: Math.ceil(filteredData.length / achatsPerPage) }).map(
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
                    disabled={currentPage === Math.ceil(filteredData.length / achatsPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg">
                        <h2 className="text-lg font-bold mb-4">Choisir un mois pour le fichier csv</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Année</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {months.map((month, index) => (
                                <label key={index} className="flex items-center space-x-2">
                                    <input type="checkbox" className="form-checkbox h-6 w-6" />
                                    <span>{month}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                                onClick={() => setModalOpen(false)}
                            >
                                Annuler
                            </button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/*Add order modal*/}
            {modalAdd && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg max-h-full overflow-auto">
                        <h2 className="text-lg font-bold mb-4">Ajouter un achat</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
                            <select
                                required
                                value={selectedSupplier}
                                onChange={(e) => setSelectedSupplier(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            >
                                <option value="">Sélectionner un fournisseur</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                required
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison prévue</label>
                            <input
                                required
                                type="date"
                                value={plannedDeliveryDate}
                                onChange={(e) => setPlannedDeliveryDate(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Date de livraison réelle</label>
                            <input
                                required
                                type="date"
                                value={actualDeliveryDate}
                                onChange={(e) => setActualDeliveryDate(e.target.value)}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            />
                        </div>
                        {pieceInputs.map((piece, index) => (
                            <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pièce</label>
                                    <select
                                        required
                                        value={piece.id_piece}
                                        onChange={(e) => handlePieceChange(e, index)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    >
                                        <option value="">Sélectionner une pièce</option>
                                        {pieces.map(piece => (
                                            <option key={piece.id} value={piece.id}>
                                                {piece.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Quantité</label>
                                    <input
                                        required
                                        type="number"
                                        value={piece.quantity}
                                        onChange={(e) => handleQuantityChange(e, index)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prix</label>
                                    <input
                                        required
                                        type="number"
                                        value={piece.price}
                                        onChange={(e) => handlePriceChange(e, index)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                                    />
                                </div>
                                <div>
                                {index > 0 && (
                                    <button
                                        className="mt-2 bg-red-300 hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded"
                                        onClick={() => removePieceInput(index)}
                                    >
                                        <MdOutlineDelete className="h-5 w-5" />
                                    </button>
                                )}
                                </div>
                            </div>
                        ))}
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            onClick={addPieceInput}
                        >
                            Ajouter une pièce
                        </button>
                        <div className="flex justify-end mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                              onClick={closeAddModal}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={createCompanyOrder}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default CompanyOrder;
