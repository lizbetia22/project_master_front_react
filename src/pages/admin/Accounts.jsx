import React, {useEffect, useState} from 'react';
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";

function Admin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [users, setUsers] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data); // Set the fetched data to the users state
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchData();
    }, [API_URL]);

    const paginate = (array, page_size, page_number) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const handlePageChange = pageNumber => setCurrentPage(pageNumber);

    const filteredData = users.filter(row => {
        const value = String(row[filterBy]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
    });

    const paginatedFilteredData = paginate(filteredData, usersPerPage, currentPage);


    return (
        <div className="w-full max-w-full mx-auto py-8 px-4 md:px-6 h-full overflow-auto">
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Liste d'utilisateurs</h1>
            </div>
            <div className="mt-2 flex justify-end">
                <button className="mb-7 flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                    <span className="mr-1">Ajouter un compte</span>
                    <MdOutlineManageAccounts className="h-5 w-5" />
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
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="post">Post</option>
                            <option value="role">Role</option>
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Post</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-400">
                    {paginatedFilteredData.map((row, index) => (
                        <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">{row.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {row.User_posts.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {row.User_posts.map((post, i) => (
                                            <li key={i}>{post.Post.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>{row.Role.name}</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Role.name}</td>
                            <td className="px-1 py-4 whitespace-nowrap">
                                <button
                                        className="hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded">
                                    <FiEdit className="w-6 h-6"/>
                                </button>
                                <button
                                    className="ml-3 hover:bg-red-300 text-gray-700 font-bold py-2 px-4 rounded">
                                    <RiDeleteBinLine className="w-6 h-6"/>
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
                {Array.from({ length: Math.ceil(filteredData.length / usersPerPage) }).map(
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
                    disabled={currentPage === Math.ceil(filteredData.length / usersPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Admin;
