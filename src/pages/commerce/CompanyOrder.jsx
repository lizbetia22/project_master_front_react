import React, {useEffect, useState} from 'react';
import { BiPurchaseTag } from "react-icons/bi";
import { GrDocumentCsv } from "react-icons/gr";
import axios from "axios";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {MdDelete, MdOutlineDelete} from "react-icons/md";
import { FaUserGear } from "react-icons/fa6";
import Papa from 'papaparse';
import {FaEdit} from "react-icons/fa";

function CompanyOrder() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSupplier, setModalSupplier] = useState(false);
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
    const [newSupplierName, setNewSupplierName] = useState("");
    const [newSupplierEmail, setNewSupplierEmail] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const [selectedMonths, setSelectedMonths] = useState([]);
    const [modalUpdate, setModalUpdate] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [modalDelete, setModalDelete] = useState(false);

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

    const processOrders = (data) => {

        if (!data || !Array.isArray(data)) {
            return [];
        }

        const ordersMap = {};

        data.forEach(item => {
            const { id_order, Company_order, Piece, quantity, price } = item;
            const { date, planned_delivery_date, actual_delivery_date, Supplier } = Company_order;
            const supplier = Supplier.name;
            const email = Supplier.email;
            const id_supplier = Supplier.id;

            if (!ordersMap[id_order]) {
                ordersMap[id_order] = {
                    id: id_order,
                    date: new Date(date).toLocaleDateString('fr-CA'),
                    user: supplier,
                    email: email,
                    id_supplier: id_supplier,
                    pieces: [],
                    quantities: [],
                    prices: [],
                    piece_ids: [],
                    planned_delivery_date: new Date(planned_delivery_date).toLocaleDateString('fr-CA'),
                    actual_delivery_date: actual_delivery_date ? new Date(actual_delivery_date).toLocaleDateString('fr-CA') : null,
                };
            }

            ordersMap[id_order].pieces.push(Piece.name);
            ordersMap[id_order].piece_ids.push(Piece.id);
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

    const modalUpdateOpen = (id) => {
        const selectedCompanyOrder = companyOrders.find(order => order.id === id); // Use find instead of filter to directly get the object
        console.log(selectedCompanyOrder);

        if (selectedCompanyOrder) {
            const { id_supplier, date, planned_delivery_date, actual_delivery_date, pieces, quantities, prices, piece_ids } = selectedCompanyOrder;

            setSelectedId(id);
            setSelectedSupplier(id_supplier);
            setSelectedDate(date);
            setPlannedDeliveryDate(planned_delivery_date);
            setActualDeliveryDate(actual_delivery_date);

            const pieceInputs = pieces.map((piece, index) => ({
                id_piece: piece_ids[index],
                quantity: quantities[index],
                price: prices[index]
            }));

            setPieceInputs(pieceInputs);

            setModalUpdate(true);
        } else {
            console.error(`Company order with id ${id} not found in companyOrders.`);
        }
    };



    const modalDeleteOpen = (id) => {
        setSelectedId(id);
        setModalDelete(true);
    };

    const modalUpdateClose =  () => {
        setModalUpdate(false)
    }

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
        if (!selectedSupplier || !selectedDate || !plannedDeliveryDate) {
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
            const selectedPiece = pieces.find(piece => piece.id === Number(value));
            newState[index].id_piece = value;
            newState[index].price = selectedPiece ? selectedPiece.price : ''; // Set price based on selected piece
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

    const handleCreateSupplierClose = () => {
        setModalSupplier(false);
    };

    const handleCreateSupplierOpen = () => {
        setModalSupplier(true);
    };
    const handleCreateSupplier = async () => {
        if (!newSupplierName.trim()) {
            toast.error('Le nom de fournisseur est requis.');
            return;
        }

        if (!newSupplierEmail.trim()) {
            toast.error('Le email de fournisseur est requis.');
            return;
        }
        try {
            const requestBody = {
                name: newSupplierName,
                email:newSupplierEmail
            };
            await axios.post(`${API_URL}/supplier/create`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setModalSupplier(false);
            setNewSupplierName("")
            setNewSupplierEmail("");
            await fetchSuppliers();
            toast.success('Fournisseur créé avec succès!');
        } catch (error) {
            toast.error('Erreur lors de la création de fournisseur.');
            console.error('Error creating post:', error);
        }
    };
    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonths(prevState =>
            prevState.includes(month) ? prevState.filter(m => m !== month) : [...prevState, month]
        );
    };
    const filterData = () => {
        const selectedMonthIndices = selectedMonths.map(month => months.indexOf(month));
        return companyOrders.filter(order => {
            const orderDate = new Date(order.date);
            const orderYear = orderDate.getFullYear();
            const orderMonthIndex = orderDate.getMonth();
            return selectedYear === orderYear && selectedMonthIndices.includes(orderMonthIndex);
        });
    };

    const generateCSV = () => {
        const filteredData = filterData();

        if (filteredData.length === 0) {
           toast.error('Pas de data')
            return '';
        }

        const calculateTotal = (quantities, prices) => {
            if (!quantities || !prices || quantities.length !== prices.length) return 'N/A';
            let total = 0;
            for (let i = 0; i < quantities.length; i++) {
                total += parseFloat(quantities[i]) * parseFloat(prices[i]);
            }
            return total.toFixed(2); // Format to 2 decimal places
        };

        const csvData = filteredData.map(order => {
            const pieces = Array.isArray(order.pieces) ? order.pieces.join('; ') : order.pieces || 'N/A';
            const quantities = Array.isArray(order.quantities) ? order.quantities.join('; ') : order.quantities || 'N/A';
            const prices = Array.isArray(order.prices) ? order.prices.join('; ') : order.prices || 'N/A';

            return {
                'Order ID': order.id,
                'Order Date': new Date(order.date).toLocaleDateString('fr-CA'),
                'Supplier Name': order.user || 'N/A',
                'Pieces': pieces,
                'Quantities': quantities,
                'Prices': prices,
                'Total': calculateTotal(order.quantities, order.prices) + ' euro',
                'Planned Delivery Date': new Date(order.planned_delivery_date).toLocaleDateString('fr-CA') || 'N/A',
                'Actual Delivery Date': new Date(order.actual_delivery_date).toLocaleDateString('fr-CA') || 'N/A'
            };
        });

        const totalSum = filteredData.reduce((sum, order) => {
            return sum + parseFloat(calculateTotal(order.quantities, order.prices));
        }, 0).toFixed(2);

        const headers = [
            'Order ID',
            'Order Date',
            'Supplier Name',
            'Pieces',
            'Quantities',
            'Prices',
            'Total',
            'Planned Delivery Date',
            'Actual Delivery Date'
        ];

        const csvContent = Papa.unparse({
            fields: headers,
            data: csvData
        });

        const csvWithTotal = `${csvContent}\nTOTAL,,,,,,,,${totalSum} euro`;

        return csvWithTotal;
    };


    const downloadCSV = () => {
        const csv = generateCSV();
        if (!csv) return;
        const monthString = Array.isArray(selectedMonths)
            ? selectedMonths.join('_')
            : selectedMonths || 'AllMonths';
        const filename = `orders_${selectedYear}_${monthString}.csv`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setSelectedMonths([]);
    };

    const updateCompanyOrder = async () => {
        if (!selectedId) return;

        const requestBody = {
            id_supplier: parseInt(selectedSupplier),
            date: new Date(selectedDate).toISOString(),
            planned_delivery_date: new Date(plannedDeliveryDate).toISOString(),
            actual_delivery_date: actualDeliveryDate ? new Date(actualDeliveryDate).toISOString() : null,
            pieces: pieceInputs.map(piece => ({
                id_piece: parseInt(piece.id_piece),
                quantity: parseInt(piece.quantity),
                price: parseFloat(piece.price)
            }))
        };

        if (!requestBody.id_supplier || !requestBody.date || !requestBody.planned_delivery_date || !requestBody.pieces.length ||
            requestBody.pieces.some(piece => !piece.id_piece || !piece.quantity || !piece.price)) {
            toast.error('Tout le chaps sont requis');
            return;
        }

        try {
            await axios.put(`${API_URL}/company-order-piece/update/${selectedId}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success('Acahat modifié avec success!');
            await fetchOrders();
            setModalUpdate(false);
        } catch (error) {
            toast.error('Erreur de modification');
            console.error("Error updating order:", error);
        }
    };

    const deleteCompanyOrder = async () => {
        console.log(selectedId)
        if (!selectedId) {
            toast.error('Achat not found');
            return;
        }
        try {
            await axios.delete(`${API_URL}/company-order-piece/delete/${selectedId}`,  {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success('Acahat supprimé avec success!');
            await fetchOrders();
            setModalDelete(false);
        } catch (error) {
            toast.error('Erreur de la suppression');
            console.error("Error updating order:", error);
        }
    };



    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste des achats</h1>
            </div>
            <div className="flex justify-end mt-5">
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={() => setModalAdd(true)}
                >
                    <span className="mr-1">Ajouter un achat</span>
                    <BiPurchaseTag className="h-5 w-5" />
                </button>
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={handleCreateSupplierOpen}
                >
                    <span className="mr-1">Ajouter un fournisseur</span>
                    <FaUserGear className="h-5 w-5" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFilteredData.length > 0 ? paginatedFilteredData.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
                            <td className="px-12 py-4 whitespace-nowrap">{row.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <ul>
                                    <li>
                                        {row.user}
                                    </li>
                                    <li>
                                        {row.email}
                                    </li>
                                </ul>

                            </td>
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
                            <td className="px-6 py-4 whitespace-nowrap">
                                {row.actual_delivery_date ? row.actual_delivery_date : 'Les achats ne sont pas encore livrés'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {!row.actual_delivery_date && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => modalUpdateOpen(row.id)}
                                            className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2">
                                            <FaEdit className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => modalDeleteOpen(row.id)}
                                            className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2">
                                            <MdDelete className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </td>
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
                                    <input
                                        type="checkbox"
                                        value={month}
                                        onChange={handleMonthChange}
                                        className="form-checkbox h-6 w-6"
                                    />
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
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => {
                                    downloadCSV();
                                    setModalOpen(false);  // Optionally close the modal
                                }}
                            >
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
            {/*Add supplier modal*/}
            {modalSupplier && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {/* Modal content */}
                                <div className="sm:flex sm:items-center">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Créer un fournisseur</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                onChange={(e) => setNewSupplierName(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                            <label htmlFor="email" className="mt-2 block text-sm font-medium text-gray-700">Email</label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="Email"
                                                id="email"
                                                onChange={(e) => setNewSupplierEmail(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleCreateSupplier}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCreateSupplierClose}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/*Modal update*/}
            {modalUpdate && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg max-h-full overflow-auto">
                        <h2 className="text-lg font-bold mb-4">Mettre à jour l'achat</h2>
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
                                onClick={modalUpdateClose}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={updateCompanyOrder}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/*Delete modal*/}
            {modalDelete && (
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
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Supprimer l'achat
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Êtes-vous sûr de vouloir supprimer cette achat ? Cette action est irréversible.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                   onClick={deleteCompanyOrder}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Supprimer
                                </button>
                                <button
                                    onClick={() => setModalDelete(false)}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50  sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default CompanyOrder;
