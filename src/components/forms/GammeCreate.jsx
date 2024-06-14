import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { RiArrowGoBackFill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import {LuCalendarRange} from "react-icons/lu";
function GammeCreate() {
    const [name, setName] = useState('');
    const [piece, setPiece] = useState('');
    const [responsable, setResponsable] = useState('');
    const [components, setComponents] = useState([{ id: 1, name: '', post: '', machine: '', time: '' }]);
    const [operations, setOperations] = useState([{ id: 1, operation:'' }]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique de soumission du formulaire
    };

    const handleAddComponent = () => {
        setComponents([...components, { id: components.length + 1, component: '', quantity: '' }]);
    };

    const handleRemoveComponent = (index) => {
        const newComponents = components.filter((_, i) => i !== index);
        setComponents(newComponents);
    };

    const handleAddOperation = () => {
        setOperations([...operations, { id: components.length + 1, operation: '' }]);
    };

    const handleRemoveOperation = (index) => {
        const newOperations = operations.filter((_, i) => i !== index);
        setOperations(newOperations);
    };

    const handleOperationChange = (index, field, value) => {
        const newOperations = operations.slice();
        newOperations[index][field] = value;
        setOperations(newOperations);
    };

    const handleComponentChange = (index, field, value) => {
        const newComponents = components.slice();
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    return (
        <>
            <div className="mt-5 flex justify-center">
                <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 inline-flex items-center">
                    Créer une nouvelle gamme
                    <LuCalendarRange className="h-7 w-7 ml-2" />
                </h1>
            </div>
            <div className="flex justify-end">
                <Link to="/gammes">
                    <button className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                        <span className="mr-1">Retour</span>
                        <RiArrowGoBackFill className="h-5 w-5" />
                    </button>
                </Link>
            </div>
            <div className="mx-auto max-w-2xl space-y-4 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-center">
                        <h1 className="mb-10 text-xl leading-none tracking-tight text-gray-700">
                            Remplissez le formulaire ci-dessous pour ajouter une nouvelle gamme
                        </h1>
                    </div>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom de la gamme
                                </label>
                                <input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                    placeholder="Entrez le nom de la gamme"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="piece" className="block text-sm font-medium text-gray-700">
                                    Piéce
                                </label>
                                <select
                                    id="piece"
                                    value={piece}
                                    onChange={(e) => setPiece(e.target.value)}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                >
                                    <option value="">Sélectionnez une piéce</option>
                                    <option value="electronique">Table</option>
                                    <option value="mecanique">Chase</option>
                                    <option value="autre">Ping Pong</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700">
                                Responsable
                            </label>
                            <input
                                id="responsable"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                                type="text"
                                className="border mt-1 block w-full shadow-sm sm:text-sm border-gray-400 rounded-md py-2 px-3"
                                placeholder="Entrez le responsable"
                            />
                        </div>
                        {components.map((comp, index) => (
                            <div key={comp.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Opération {index + 1}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        value={comp.name}
                                        onChange={(e) => handleComponentChange(index, 'name', e.target.value)}
                                        type="text"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        placeholder="Nom"
                                    />
                                    <select
                                        value={comp.post}
                                        onChange={(e) => handleComponentChange(index, 'post', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez un post</option>
                                        <option value="resistor">Post 1</option>
                                        <option value="capacitor">Post 2</option>
                                        <option value="transistor">Post 3</option>
                                        <option value="diode">Post 4</option>
                                        <option value="microcontroller">Post 5</option>
                                    </select>
                                    <input
                                        value={comp.time}
                                        onChange={(e) => handleComponentChange(index, 'time', e.target.value)}
                                        type="text"
                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                        placeholder="Temps"
                                    />
                                    <select
                                        value={comp.machine}
                                        onChange={(e) => handleComponentChange(index, 'machine', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez une machine</option>
                                        <option value="resistor">Machine 1</option>
                                        <option value="capacitor">Machine 2</option>
                                        <option value="transistor">Machine 3</option>
                                        <option value="diode">Machine 4</option>
                                        <option value="microcontroller">Machine 5</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    onClick={() => handleRemoveComponent(index)}
                                >
                                    <MdDeleteForever className="h-6 w-6"/>
                                </button>
                            </div>
                        ))}
                        {operations.map((comp, index) => (
                            <div key={comp.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Opération exsitante{index + 1}
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        value={comp.operation}
                                        onChange={(e) => handleOperationChange(index, 'operation', e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm sm:text-sm"
                                    >
                                        <option value="">Sélectionnez une opération</option>
                                        <option value="resistor">Opération 1</option>
                                        <option value="capacitor">Opération 2</option>
                                        <option value="transistor">Opération 3</option>
                                        <option value="diode">Opération 4</option>
                                        <option value="microcontroller">Opération 5</option>
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    onClick={() => handleRemoveOperation(index)}
                                >
                                    <MdDeleteForever className="h-6 w-6"/>
                                </button>
                            </div>
                        ))}
                        <div className="flex items-center gap-4">
                            <button
                                className="my-5 w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                onClick={handleAddComponent}
                                type="button"
                            >
                                Ajouter une nouevelle opération
                            </button>
                            <button
                                className="my-5 w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                                onClick={handleAddOperation}
                                type="button"
                            >
                                Choisir une opération existante
                            </button>
                        </div>
                        <button
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="submit"
                        >
                            Créer la gamme
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default GammeCreate;
