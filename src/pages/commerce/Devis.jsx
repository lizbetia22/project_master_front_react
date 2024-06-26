import React, { useEffect, useState } from 'react';
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import axios from "axios";
import { MdOutlineDelete } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Devis() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [addDevisModalOpen, setAddDevisModalOpen] = useState(false);
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [devis, setDevis] = useState([]);
    const [users, setUsers] = useState([]);
    const [piecesOptions, setPiecesOptions] = useState([]);
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [newDevis, setNewDevis] = useState({
        id_user: '',
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
                    if (!devisMap[id_devis]) {
                        devisMap[id_devis] = {
                            id: id_devis,
                            date: new Date(item.Devi.date).toLocaleDateString('fr-CA'),
                            deadline: new Date(item.Devi.deadline).toLocaleDateString('fr-CA'),
                            user: item.Devi.User.name,
                            userId: item.Devi.User.id,
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
        }

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/commerce`,  {
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
    }, [API_URL, addDevisModalOpen]);

    const createDevis = async () => {
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
                id_user: '',
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
        const selectedPiecesData = selectedPieces.map(index => ({
            id_piece: piecesOptions.find(p => p.name === selectedQuotation.pieces[index]).id,
            quantity: selectedQuotation.quantity[index],
            price: parseFloat(selectedQuotation.price[index])
        }));

        const orderData = {
            id_user:  selectedQuotation.userId,
            id_devis: selectedQuotation.id,
            date_order: selectedQuotation.date,
            pieces: selectedPiecesData
        };
        try {
            await axios.post(`${API_URL}/order-piece/create-order`, orderData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Commande créée avec succès!');
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
        if (["piece", "quantity", "price"].includes(name)) {
            const pieces = [...newDevis.pieces];
            pieces[index][name] = value;
            setNewDevis({ ...newDevis, pieces });
        } else {
            setNewDevis({ ...newDevis, [name]: value });
        }
    };

    const handleAddDevisSubmit = (e) => {
        e.preventDefault();
        createDevis();
    };


    const handleCheckboxChange = (index) => {
        if (selectedPieces.includes(index)) {
            setSelectedPieces(selectedPieces.filter(i => i !== index));
        } else {
            setSelectedPieces([...selectedPieces, index]);
        }
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
                <button
                    className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2"
                    onClick={openAddDevisModal}
                >
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
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
            {/* Modal for converting quotation to invoice */}
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
                                {selectedQuotation.pieces.map((piece, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{piece}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{selectedQuotation.quantity[index]}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{selectedQuotation.price[index]}€</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-5 w-5 text-gray-600"
                                                checked={selectedPieces.includes(index)}
                                                onChange={() => handleCheckboxChange(index)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end mt-4">
                                <button className="mr-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                        onClick={(e) => convertDevisToOrder(e)}>
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
            {/* Modal for adding new devis */}
            {addDevisModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white p-8 rounded-lg w-1/2 max-h-full overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Ajouter un devis</h2>
                        <form onSubmit={handleAddDevisSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Utilisateur</label>
                                <select
                                    required
                                    name="user"
                                    value={newDevis.user}
                                    onChange={(e) => setNewDevis({ ...newDevis, id_user: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border rounded-md"
                                >
                                    <option value="">Sélectionner un utilisateur</option>
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
                                    required
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
            <ToastContainer />
        </div>
    );
}

export default Devis;
