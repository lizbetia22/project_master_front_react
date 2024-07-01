import React, { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { FaUserTie } from "react-icons/fa6";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

function Devis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPieceIds, setSelectedPieceIds] = useState(new Set());
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [addDevisModalOpen, setAddDevisModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [devis, setDevis] = useState([]);
    const [users, setUsers] = useState([]);
    const [newClientName, setNewClientName] = useState("");
    const [showCreateClientModal, setShowCreateClientModal] = useState(false);
    const [piecesOptions, setPiecesOptions] = useState([]);
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [idClient, setIdClient] = useState({ id_client: '' });
    const [clientsPiece, setClientsPiece] = useState([]);
    const [editDevisModalOpen, setEditDevisModalOpen] = useState(false);
    const [selectedDevis, setSelectedDevis] = useState(null);
    const [newDevis, setNewDevis] = useState({
        id_client: '',
        date: '',
        deadline: '',
        pieces: [{ piece: '', quantity: '', price: '' }],
    });

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
                    const deadline = item.Devi.deadline
                        ? new Date(item.Devi.deadline).toLocaleDateString('fr-CA')
                        : 'pas de deadline';
                    if (!devisMap[id_devis]) {
                        devisMap[id_devis] = {
                            id: id_devis,
                            date: new Date(item.Devi.date).toLocaleDateString('fr-CA'),
                            deadline: deadline,
                            user: item.Devi.Client.name,
                            userId: item.Devi.Client.id,
                            pieces: [],
                            quantity: [],
                            price: []
                        };
                    }
                    devisMap[id_devis].pieces.push(item.Piece.name);
                    devisMap[id_devis].quantity.push(item.quantity);
                    devisMap[id_devis].price.push(item.price);
                });

                setDevis(Object.values(devisMap));
            } catch (error) {
                console.error("Error fetching devis:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/client/all`,  {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
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
                setPiecesOptions(response.data);
            } catch (error) {
                console.error("Error fetching pieces:", error);
            }
        };

        fetchDevis();
        fetchUsers();
        fetchPieces();
    }, [API_URL, addDevisModalOpen, showCreateClientModal]);

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
                const deadline = item.Devi.deadline
                    ? new Date(item.Devi.deadline).toLocaleDateString('fr-CA')
                    : 'pas de deadline';
                if (!devisMap[id_devis]) {
                    devisMap[id_devis] = {
                        id: id_devis,
                        date: new Date(item.Devi.date).toLocaleDateString('fr-CA'),
                        deadline: deadline,
                        user: item.Devi.Client.name,
                        userId: item.Devi.Client.id,
                        pieces: [],
                        quantity: [],
                        price: []
                    };
                }
                devisMap[id_devis].pieces.push(item.Piece.name);
                devisMap[id_devis].quantity.push(item.quantity);
                devisMap[id_devis].price.push(item.price);
            });

            // Update state with fetched data
            setDevis(Object.values(devisMap));
        } catch (error) {
            console.error("Error fetching devis:", error);
        }
    };



    useEffect(() => {
        const fetchDevisByClient = async () => {
            try {
                console.log(idClient);
                const response = await axios.get(`${API_URL}/devis-piece/piece/${idClient.id_client}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setClientsPiece(response.data);
            } catch (error) {
                setClientsPiece([]);
                console.error("Error fetching pieces:", error);
            }
        };

        if (idClient.id_client) {
            fetchDevisByClient();
        }
    }, [API_URL, idClient, idClient.id_client]);


    const handleClientChange = (e) => {
        setIdClient({ id_client: parseInt(e.target.value) });
    };



    const createDevis = async () => {
        if (!newDevis.id_client || !newDevis.date || !newDevis.deadline) {
            toast.error('Tous les champs sont requis.');
            return;
        }

        const emptyPiece = newDevis.pieces.some(piece => !piece.piece || !piece.quantity || !piece.price);
        if (emptyPiece) {
            toast.error('Tous les champs de la pièce sont requis.');
            return;
        }
        const preparedDevis = {
            ...newDevis,
            pieces: newDevis.pieces.map(piece => ({
                id_piece: piecesOptions.find(p => p.name === piece.piece)?.id,
                quantity: parseFloat(piece.quantity),
                price: parseFloat(piece.price),
            }))
        };
        try {
             await axios.post(`${API_URL}/devis-piece/create-devis`, preparedDevis, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Devis créé avec succès!');
            setAddDevisModalOpen(false);
            setNewDevis({
                id_client: '',
                date: '',
                deadline: '',
                pieces: [{ piece: '', quantity: '', price: '' }],
        })
        } catch (error) {
            toast.error('Erreur lors de la création de devis.');
            console.error("Error creating devis:", error);
        }
    };

    const convertDevisToOrder = async (e) => {
        e.preventDefault();

        if (!idClient.id_client || selectedPieces.length === 0) {
            toast.error('Veuillez sélectionner un client et au moins une pièce.');
            return;
        }

        const selectedPiecesData = selectedPieces.map(index => {
            const selectedPiece = clientsPiece[index];
            return {
                id_piece: selectedPiece.id_piece,
                quantity: selectedPiece.quantity,
                price: parseFloat(selectedPiece.price)
            };
        });
        const orderData = {
            id_client: idClient.id_client,
            date_order: new Date().toISOString(),
            pieces: selectedPiecesData
        };

        try {
            await axios.post(`${API_URL}/order-piece/create-order`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Fcature créée avec succès!');
            setModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la création de la commande.');
            console.error("Error creating order:", error);
        }
    };


    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const handlePageChange = pageNumber => setCurrentPage(pageNumber);

    const openModal = (quotation) => {
        setSelectedQuotation(quotation);
        setSelectedPieces([]);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedQuotation(null);
    };

    const handleCloseModal = () => {
        setIdClient({ id_client: '' });
        setClientsPiece([]);
        setSelectedPieces([]);
        setSelectedPieceIds(new Set());
        closeModal();
    };

    const openAddDevisModal = () => {
        setAddDevisModalOpen(true);
    };

    const closeAddDevisModal = () => {
        setAddDevisModalOpen(false);
    };

    const addPieceField = () => {
        setNewDevis({
            ...newDevis,
            pieces: [...newDevis.pieces, { piece: '', quantity: '', price: '' }]
        });
    };

    const removePieceField = (index) => {
        const pieces = [...newDevis.pieces];
        pieces.splice(index, 1);
        setNewDevis({ ...newDevis, pieces });
    };

    const handleNewDevisChange = (e, index) => {
        const { name, value } = e.target;
        const pieces = [...newDevis.pieces];

        if (name === "piece") {
            const selectedPiece = piecesOptions.find(option => option.name === value);
            pieces[index][name] = value;
            pieces[index].price = selectedPiece ? selectedPiece.price : '';
        } else if (name === "quantity" || name === "price") {
            pieces[index][name] = value;
        } else {
            setNewDevis({ ...newDevis, [name]: value });
            return;
        }

        setNewDevis({ ...newDevis, pieces });
    };


    const handleAddDevisSubmit = (e) => {
        e.preventDefault();
        createDevis();
    };


    const handleCreateClientClose = () => {
        setShowCreateClientModal(false);
    };

    const handleCreateClient = async () => {
        if (!newClientName.trim()) {
            toast.error('Le nom du client est requis.');
            return;
        }
        try {
            const requestBody = {
                name: newClientName
            };
            await axios.post(`${API_URL}/client/create`, requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setShowCreateClientModal(false);
            setNewClientName("")
            toast.success('Client créé avec succès!');
        } catch (error) {
            toast.error('Erreur lors de la création du client.');
            console.error('Error creating post:', error);
        }
    };

    const handleUpdateDevisSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDevis.id_client || !selectedDevis.date) {
            toast.error('Tous les champs sont requis.');
            return;
        }

        const emptyPiece = selectedDevis.pieces.some(piece => !piece.piece || !piece.quantity || !piece.price);
        if (emptyPiece) {
            toast.error('Tous les champs  de la pièece sont requis.');
            return;
        }

        const updatedPieces = selectedDevis.pieces.map(piece => ({
            ...piece,
            price: parseFloat(piece.price),
        }));
        const deadline = selectedDevis.deadline === "pas de deadline" ? null : selectedDevis.deadline;

        const requestBody = {
            id_client: selectedDevis.id_client,
            date: selectedDevis.date,
            deadline: deadline,
            pieces: updatedPieces
        };

        try {
            await axios.put(`${API_URL}/devis-piece/update/${selectedDevis.id}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            await fetchDevis();
            toast.success('Devis modifié avec succès!');
            setEditDevisModalOpen(false);
        } catch (error) {
            toast.error('Erreur lors de la modification du devis.');
            console.error('Error updating devis:', error);
        }
    };

    const handlePieceChange = (e, index) => {
        const selectedPieceId = parseInt(e.target.value);
        const selectedPiece = piecesOptions.find(option => option.id === selectedPieceId);

        const updatedPieces = [...selectedDevis.pieces];
        updatedPieces[index] = {
            ...updatedPieces[index],
            id_piece: selectedPieceId,
            price: selectedPiece ? selectedPiece.price : 0
        };

        setSelectedDevis({ ...selectedDevis, pieces: updatedPieces });
    };

    const handlePieceQuantityChange = (e, index) => {
        const updatedPieces = [...selectedDevis.pieces];
        updatedPieces[index] = { ...updatedPieces[index], quantity: parseInt(e.target.value) };
        setSelectedDevis({ ...selectedDevis, pieces: updatedPieces });
    };

    const handlePiecePriceChange = (e, index) => {
        const updatedPieces = [...selectedDevis.pieces];
        updatedPieces[index] = { ...updatedPieces[index], price: parseFloat(e.target.value) };
        setSelectedDevis({ ...selectedDevis, pieces: updatedPieces });
    };

    const handleCreatelientModalOpen = () => {
        setShowCreateClientModal(true);
    };

    const filteredData = devis.filter(row => {
        const value = String(row[filterBy]).toLowerCase();
        if (filterBy === 'pieces') {
            return row.pieces.some(piece => piece.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return value.includes(searchTerm.toLowerCase());
    });

    const paginatedFilteredData = paginate(filteredData, quotationsPerPage, currentPage);
    const handleCheckboxChange = (index) => {
        const selectedPiece = clientsPiece[index];
        const pieceId = selectedPiece.id_piece;

        const newSelectedPieces = [...selectedPieces];
        if (newSelectedPieces.includes(index)) {
            newSelectedPieces.splice(newSelectedPieces.indexOf(index), 1);
            setSelectedPieceIds(prevIds => {
                const newIds = new Set(prevIds);
                newIds.delete(pieceId);
                return newIds;
            });
        } else {
            newSelectedPieces.push(index);
            setSelectedPieceIds(prevIds => new Set(prevIds).add(pieceId));
        }
        setSelectedPieces(newSelectedPieces);
    };
    const handleEditClick = (devis) => {
        const transformedPieces = devis.pieces.map((pieceName, index) => ({
            id_piece: index + 1,
            quantity: devis.quantity[index],
            price: devis.price[index]
        }));

        const transformedDevis = {
            ...devis,
            pieces: transformedPieces,
            id_client: devis.userId,
            deadline: devis.deadline || ''
        };

        setSelectedDevis(transformedDevis);
        setEditDevisModalOpen(true);
    };


    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste des devis</h1>
            </div>
            <div className="mt-2 flex justify-end">
                <div className="px-6  whitespace-nowrap">
                    <button
                        className="mb-7 flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        onClick={() => openModal(1)}
                    >
                        <span className="mr-1">Convertir en facture</span>
                        <FaFileInvoiceDollar className="h-5 w-5"/>
                    </button>
                </div>
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={openAddDevisModal}
                >
                    <span className="mr-1">Ajouter un devis</span>
                    <HiOutlineClipboardDocumentList className="h-5 w-5" />
                </button>

                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={handleCreatelientModalOpen}
                >
                    <span className="mr-1">Ajouter un client</span>
                    <FaUserTie className="h-5 w-5" />
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Pièces</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedFilteredData.map((row) => (
                        <tr key={row.id}>
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
                                {row.deadline === 'pas de deadline' && (
                                    <button
                                        type="button"
                                        onClick={() => handleEditClick(row)}
                                        className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                )}
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
            {/* Modal for converting quotation to invoice */}
            {modalOpen && selectedQuotation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-1/2 max-h-full overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Passer en facture</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Client</label>
                            <select
                                required
                                name="client"
                                value={idClient.id_client}
                                onChange={handleClientChange}
                                className="w-full px-4 py-2 border rounded-md"
                            >
                                <option value="">Sélectionner un client</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Conditionally render the table and message */}
                        {clientsPiece.length > 0 && (
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
                                {clientsPiece.map((piece, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{piece.Piece.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{piece.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{piece.price}€</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                required
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-gray-600"
                                                checked={selectedPieces.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                                disabled={selectedPieceIds.has(piece.id_piece) && !selectedPieces.includes(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}

                        {idClient.id_client && clientsPiece.length === 0 && (
                            <p>Client n'a pas de devis</p>
                        )}

                        <div className="flex justify-end mt-4">
                            <button className="mr-3 bg-gray-300 hover:bg-green-200 border border-green-600 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={(e) => convertDevisToOrder(e)}>
                                Passer en facture
                            </button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                    onClick={handleCloseModal}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/*Add client modal*/}
            {showCreateClientModal && (
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Créer un client</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Nom du client"
                                                id="name"
                                                onChange={(e) => setNewClientName(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleCreateClient}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCreateClientClose}
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
            {/* Modal for adding new devis */}
            {addDevisModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-1/2 max-h-full overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Ajouter un devis</h2>
                        <form onSubmit={handleAddDevisSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Client</label>
                                <select
                                    required
                                    name="user"
                                    value={newDevis.user}
                                    onChange={(e) => setNewDevis({ ...newDevis, id_client: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-md"
                                >
                                    <option value="">Sélectionner un client</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Date</label>
                                <input
                                    required
                                    type="date"
                                    name="date"
                                    value={newDevis.date}
                                    onChange={handleNewDevisChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={newDevis.deadline}
                                    onChange={handleNewDevisChange}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            {newDevis.pieces.map((piece, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-gray-700">Pièce</label>
                                    <select
                                        required
                                        name="piece"
                                        value={piece.piece}
                                        onChange={(e) => handleNewDevisChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    >
                                        <option value="">Sélectionner une pièce</option>
                                        {piecesOptions.map(option => (
                                            <option key={option.id} value={option.name}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="block text-gray-700">Quantité</label>
                                    <input
                                        required
                                        type="number"
                                        name="quantity"
                                        value={piece.quantity}
                                        onChange={(e) => handleNewDevisChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    <label className="block text-gray-700">Prix</label>
                                    <input
                                        required
                                        type="number"
                                        name="price"
                                        value={piece.price}
                                        onChange={(e) => handleNewDevisChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePieceField(index)}
                                        className="mt-2 bg-red-300 hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded"
                                    >
                                        <MdOutlineDelete className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addPieceField}
                                className="mb-7 flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
                            >
                                Ajouter une pièce
                            </button>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="mr-3 bg-gray-700 text-white hover:bg-gray-600 py-2 px-4 rounded"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={closeAddDevisModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Fermer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/*Modal for update devis*/}
            {editDevisModalOpen && selectedDevis && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-1/2 max-h-full overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Modifier un devis</h2>
                        <form onSubmit={handleUpdateDevisSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Client</label>
                                <select
                                    required
                                    name="id_client"
                                    value={selectedDevis.id_client}
                                    onChange={(e) => setSelectedDevis({ ...selectedDevis, id_client: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-md"
                                >
                                    <option value="">Sélectionner un client</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Date</label>
                                <input
                                    required
                                    type="date"
                                    name="date"
                                    value={selectedDevis.date}
                                    onChange={(e) => setSelectedDevis({ ...selectedDevis, date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={selectedDevis.deadline || ''}
                                    onChange={(e) => setSelectedDevis({ ...selectedDevis, deadline: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            {selectedDevis.pieces.map((piece, index) => (
                                <div key={index} className="mb-4">
                                    <label className="block text-gray-700">Pièce</label>
                                    <select
                                        required
                                        name={`piece-${index}`}
                                        value={piece.id_piece}
                                        onChange={(e) => handlePieceChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    >
                                        <option value="">Sélectionner une pièce</option>
                                        {piecesOptions.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label className="block text-gray-700">Quantité</label>
                                    <input
                                        required
                                        type="number"
                                        name={`quantity-${index}`}
                                        value={piece.quantity}
                                        onChange={(e) => handlePieceQuantityChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    <label className="block text-gray-700">Prix</label>
                                    <input
                                        required
                                        type="number"
                                        name={`price-${index}`}
                                        value={piece.price}
                                        onChange={(e) => handlePiecePriceChange(e, index)}
                                        className="w-full px-4 py-2 border rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updatedPieces = selectedDevis.pieces.filter((_, i) => i !== index);
                                            setSelectedDevis({ ...selectedDevis, pieces: updatedPieces });
                                        }}
                                        className="mt-2 bg-red-300 hover:bg-red-400 text-red-800 font-bold py-2 px-4 rounded"
                                    >
                                        <MdOutlineDelete className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDevis({
                                        ...selectedDevis,
                                        pieces: [...selectedDevis.pieces, { id_piece: '', quantity: 0, price: 0 }]
                                    });
                                }}
                                className="mb-7 flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md mr-2"
                            >
                                Ajouter une pièce
                            </button>
                            <div className="flex justify-end mt-4">
                                <button
                                    type="submit"
                                    className="mr-3 bg-gray-700 text-white hover:bg-gray-600 py-2 px-4 rounded"
                                >
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditDevisModalOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Fermer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default Devis;
