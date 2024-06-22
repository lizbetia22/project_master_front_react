import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";

const UpdateGammeModal = ({ updateModal, setShowModalUpdate, gammeId }) => {
    const [name, setName] = useState("");
    const [responsable, setResponsable] = useState("");
    const [piece, setPiece] = useState("");
    const [data, setData] = useState({ name: "", id_user: "", id_piece: "" });
    const [pieces, setPieces] = useState([]);
    const [users, setUsers] = useState([]);
    const [operations, setOperations] = useState([]);
    const [allOperations, setAllOperations] = useState([]);

    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (gammeId) {
                    const responseData = await axios.get(`${API_URL}/gamme/${gammeId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    setData(responseData.data);

                    const responsePieces = await axios.get(`${API_URL}/piece/all`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    setPieces(responsePieces.data);

                    const responseUsers = await axios.get(`${API_URL}/user/all`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    setUsers(responseUsers.data);

                    const responseOperations = await axios.get(`${API_URL}/gamme-operation/gamme/${gammeId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    setOperations(responseOperations.data);

                    const responseAllOperations = await axios.get(`${API_URL}/operation/all`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        });
                    setAllOperations(responseAllOperations.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [API_URL, gammeId]);

    const handleOperationChange = (index, newOperationId) => {
        const updatedOperations = operations.map((operation, i) =>
            i === index ? { ...operation, id_operation: newOperationId } : operation
        );
        setOperations(updatedOperations);
    };

    const handleTimeChange = (index, newTime) => {
        const updatedOperations = operations.map((operation, i) =>
            i === index ? { ...operation, time: newTime } : operation
        );
        setOperations(updatedOperations);
    };

    const handleAddOperation = () => {
        setOperations([...operations, { id_operation: "", time: "" }]);
    };

    const handleRemoveOperation = (index) => {
        const updatedOperations = operations.filter((_, i) => i !== index);
        setOperations(updatedOperations);
    };

    const handleSubmit = async () => {
        const updatedGamme = {
            id_piece: piece || data.id_piece,
            id_user: responsable || data.id_user,
            name: name || data.name,
            operations: operations.map(op => ({
                id_operation: op.id_operation,
                time: op.time
            }))
        };

        try {
            await axios.put(`${API_URL}/gamme-operation/update/gammeOperations/${gammeId}`, updatedGamme,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
            setShowModalUpdate(false);
        } catch (error) {
            console.error('Error updating gamme:', error);
        }
    };

    return (
        <>
            {updateModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                             role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Modifier la gamme
                                        </h3>
                                        <div className="mt-2">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                value={name || data.name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mt-4">
                                                Responsable
                                            </label>
                                            <select
                                                id="responsable"
                                                value={responsable || data.id_user}
                                                onChange={(e) => setResponsable(e.target.value)}
                                                className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            >
                                                <option value="">Sélectionner un responsable</option>
                                                {users.map((user) => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mt-2">
                                            <label htmlFor="piece" className="block text-sm font-medium text-gray-700">
                                                Pièce
                                            </label>
                                            <select
                                                id="piece"
                                                value={piece || data.id_piece}
                                                onChange={(e) => setPiece(e.target.value)}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                            >
                                                <option value="">Sélectionnez une pièce</option>
                                                {pieces.map((pieceObj) => (
                                                    <option key={pieceObj.id} value={pieceObj.id}>
                                                        {pieceObj.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mt-2">
                                            <label htmlFor="operations" className="block text-sm font-medium text-gray-700 mt-4">
                                                Operations
                                            </label>
                                            {operations.map((operation, index) => (
                                                <div key={index} className="flex items-center gap-4 mt-2">
                                                    <select
                                                        value={operation.id_operation}
                                                        onChange={(e) => handleOperationChange(index, e.target.value)}
                                                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                    >
                                                        <option value="">Sélectionner un operation</option>
                                                        {allOperations.map((op) => (
                                                            <option key={op.id} value={op.id}>
                                                                {op.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="number"
                                                        value={operation.time}
                                                        onChange={(e) => handleTimeChange(index, e.target.value)}
                                                        className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                                        placeholder="Time"
                                                    />
                                                    <button
                                                        onClick={() => handleRemoveOperation(index)}
                                                        className="bg-gray-800 text-white px-3 py-1 rounded"
                                                    ><MdDeleteForever className="h-5 w-5"/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-4 mt-4">
                                            <button
                                                className="w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                                onClick={handleAddOperation}
                                                type="button"
                                            >
                                                Ajouter un operation
                                            </button>
                                        </div>

                                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center bg-gray-800 rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-100 hover:bg-gray-700 sm:w-auto sm:text-sm ml-5"
                                                onClick={handleSubmit}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => setShowModalUpdate(false)}
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateGammeModal;
