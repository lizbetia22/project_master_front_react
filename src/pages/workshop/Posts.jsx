import React, {useEffect, useState} from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GrUserWorker } from "react-icons/gr";
import DeletePostModal from "../../components/modal/responsible/PostDeleteModal";
import axios from "axios";

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editPost, setEditPost] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [newPostName, setNewPostName] = useState("");
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
    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/post/all`);
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useState(() => {
        fetchPosts();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts
        .filter(post => post.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstPost, indexOfLastPost);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);

    const handleCreateModalOpen = () => {
        setShowCreateModal(true);
    };

    const handleEditModalOpen = (post) => {
        setEditPost(post);
        setShowEditModal(true);
    };

    const handleCreateModalClose = () => {
        setShowCreateModal(false);
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
    };

    const handleDeleteModalOpen = (post) => {
        setPostToDelete(post);
        setShowDeleteModal(true);
    };

    const handleCreatePoste = async () => {
        try {
            const requestBody = {
                name: newPostName
            };
                await axios.post(`${API_URL}/post/create`, requestBody);
                setShowCreateModal(false);
                setNewPostName("")
                fetchPosts();
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const handleUpdatePoste = async (id) => {
        try {
            const requestBody = {
                name: editPost.name
            };
            await axios.put(`${API_URL}/post/update/${id}`, requestBody);
            setShowEditModal(false);
            fetchPosts();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePoste = async (id) => {
        try {
            await axios.delete(`${API_URL}/post/delete/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    return (
        <>
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900 mt-5">Gestion des posts</h1>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2 mt-10">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher un post..."
                    type="search"
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>
            <div className="mt-2 flex justify-end">
                <button onClick={handleCreateModalOpen}
                        className="flex items-center bg-gray-900 text-white py-2 px-4 rounded-md mr-2">
                    <span className="mr-1">Ajouter un post</span>
                    <GrUserWorker className="h-5 w-5" />
                </button>
            </div>
            {/* Create post Modal */}
            {showCreateModal && (
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Créer un post</h3>
                                        <div className="mt-2">
                                            {/* Inputs for creating a machine */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                value={newPostName}
                                                onChange={(e) => setNewPostName(e.target.value)}
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={handleCreatePoste}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleCreateModalClose}
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
            {/* Edit post Modal */}
            {showEditModal && (
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
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Modifier le post</h3>
                                        <div className="mt-2">
                                            {/* Inputs for updating post */}
                                            <label htmlFor="name" className="mt-2 block text-sm font-medium text-gray-700">Nom</label>
                                            <input
                                                value={editPost.name}
                                                onChange={(e) => setEditPost({ ...editPost, name: e.target.value })}
                                                type="text"
                                                placeholder="Nom"
                                                id="name"
                                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full max-w-md mx-auto shadow-sm sm:text-sm border border-gray-400 rounded-md py-2 px-3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        onClick={() => handleUpdatePoste(editPost.id)}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Enregistrer
                                    </button>
                                    <button
                                        onClick={handleEditModalClose}
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
            {/* Delete Machine Modal */}
            <DeletePostModal
                showModal={showDeleteModal}
                setShowModal={setShowDeleteModal}
                handleDeletePoste={handleDeletePoste}
                postId={postToDelete ? postToDelete.id : null}
            />
            <div className="container mx-auto mt-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-800 text-gray-200 h-16">
                        <tr>
                            <th className="px-20 py-3 text-left font-medium">Id</th>
                            <th className="px-14 py-3 text-left font-medium">Nom</th>
                            <th className="px-10 py-3 text-left font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td className="px-20 py-3 font-medium">{post.id}</td>
                                <td className="px-14 py-3">{post.name}</td>
                                <td className="px-2 py-3">
                                    <button
                                        type="button"
                                        onClick={() => handleEditModalOpen(post)}
                                        className="ml-5 px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2"
                                    >
                                        <FaEdit className="h-5 w-5" />
                                    </button>
                                    {post.Machines.length === 0 && (
                                        <button
                                            onClick={() => handleDeleteModalOpen(post)}
                                            type="button"
                                            className="px-4 py-2 border border-gray-400 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 mt-2 ml-2"
                                        >
                                            <MdDelete className="h-5 w-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                >
                    Précédent
                </button>
                {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                            currentPage === index + 1 ? "" : "rounded-l"
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                >
                    Suivant
                </button>
            </div>
        </>
    );
};

export default PostManagement;
