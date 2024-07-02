import React, { useEffect, useState } from 'react';
import { MdOutlineManageAccounts } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import {MdDelete} from "react-icons/md";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";

function Admin() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('id');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        posts: [''],
        role: ''
    });
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${API_URL}/post/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${API_URL}/role/all`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setRoles(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchData();
        fetchPosts();
        fetchRoles();
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

    const openModal = (user) => {
        setSelectedUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            posts: user.User_posts.map(post => post.Post.name),
            role: user.Role.name,
            password: ''
    });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePostChange = (index, value) => {
        const updatedPosts = [...formData.posts];
        updatedPosts[index] = value;
        setFormData({ ...formData, posts: updatedPosts });
    };

    const handleAddPost = () => {
        setFormData({ ...formData, posts: [...formData.posts, ''] });
    };

    const handleRemovePost = (index) => {
        setFormData({ ...formData, posts: formData.posts.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/user/${selectedUser.id}`, {
                name: formData.name,
                email: formData.email,
                User_posts: formData.posts.map(post => ({ Post: { name: post } })),
                Role: { name: formData.role }
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            closeModal();
            const response = await axios.get(`${API_URL}/user/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const getRoleId = (roleName) => {
        const role = roles.find(role => role.name === roleName);
        return role ? role.id : null;
    };

    const getPostIds = (postNames) => {
        return postNames.map(postName => {
            const post = posts.find(post => post.name === postName);
            return post ? post.id : null;
        });
    };


    const handleUpdateUser = async () => {

        if (!formData.name || !formData.email || !formData.password || !formData.role ) {
            toast.error("Tous les champs sont requis.");
            return;
        }

        const roleId = getRoleId(formData.role);
        const postIds = getPostIds(formData.posts);

        const requestBody = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            id_role: roleId,
            posts: postIds.filter(id => id !== null)
        };
        console.log(JSON.stringify(requestBody) + 'body')

        try {
            await axios.put(`${API_URL}/user/update/${selectedUser.id}`, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Utilisateur a été modifié avec succès");
            closeModal();
            const response = await axios.get(`${API_URL}/user/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            toast.error("Erreur de la modification d'utilisateur");
            console.error("Error updating user:", error);
        }
    };

    const handleCreateUser = async () => {

        const requestBody = {

        };
        console.log(JSON.stringify(requestBody) + 'body')

        try {
            await axios.put(`${API_URL}/user/create-user`, requestBody, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            toast.success("Utilisateur a été créé avec succès");
            closeModal();
            const response = await axios.get(`${API_URL}/user/all`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            toast.error("Erreur de la creation d'utilisateur");
            console.error("Error creating user:", error);
        }
    };


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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
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
                                    <span>-</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{row.Role.name}</td>
                            <td className="px-1 py-4 whitespace-nowrap">
                                <button
                                    className="hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded"
                                    onClick={() => openModal(row)}
                                >
                                    <FiEdit className="w-6 h-6"/>
                                </button>
                                {row.Role.name !== 'Admin' && (
                                    <button
                                        className="ml-3 hover:bg-red-300 text-gray-700 font-bold py-2 px-4 rounded">
                                        <RiDeleteBinLine className="w-6 h-6"/>
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
                {Array.from({ length: Math.ceil(filteredData.length / usersPerPage) }).map(
                    (item, index) => (
                        <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${currentPage === index + 1 ? "bg-gray-400" : "rounded-l"}`}
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
            {/* Modal edit user */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
                    <div className="relative bg-white p-8 rounded-lg w-1/2 max-h-screen overflow-auto">
                        {/* Close Button */}
                        <button
                            className="absolute top-2 right-2 text-gray-500"
                            onClick={closeModal}
                        >
                            <MdClose className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold mb-4">Modifier utilisateur</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Name Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-400 rounded-md w-full"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-400 rounded-md w-full"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Mot de passe</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-400 rounded-md w-full"
                                    required
                                />
                            </div>

                            {/* Posts Section (Only for 'Workshop' Role) */}
                            {formData.role === 'Workshop' && (
                                <div className="mb-4">
                                    <label className="block text-gray-700">Posts</label>
                                    {formData.posts.map((post, index) => (
                                        <div key={index} className="flex items-center mb-2">
                                            <select
                                                value={post}
                                                onChange={(e) => handlePostChange(index, e.target.value)}
                                                className="p-2 border border-gray-400 rounded-md w-full"
                                            >
                                                <option value="">Select a post</option>
                                                {posts.map((p) => (
                                                    <option key={p.id} value={p.name}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePost(index)}
                                                className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                            >
                                                <MdDelete className="h-5 w-5" />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddPost}
                                        className="bg-gray-800 hover:bg-gray-400 text-gray-200 py-2 px-4 rounded"
                                    >
                                        Ajouter un post
                                    </button>
                                </div>
                            )}

                            {/* Role Input */}
                            <div className="mb-4">
                                <label className="block text-gray-700">Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border border-gray-400 rounded-md w-full"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-gray-800 hover:bg-gray-400 text-gray-200 py-2 px-4 rounded"
                                    onClick={handleUpdateUser}
                                >
                                    Enregistrer
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded ml-5"
                                >
                                    Annuler
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

export default Admin;
