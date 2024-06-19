import React, { useState } from "react";
import axios from "axios";

const Posts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const postsPerPage = 4;
    const API_URL = process.env.REACT_APP_API_URL;

    useState(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/user-post/posts/gammes`);
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [API_URL]);

    // Calculate pagination
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts
        .filter(post => post.userName.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(indexOfFirstPost, indexOfLastPost);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <>
            <div className="mt-1 flex justify-center">
                <h1 className="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-3xl dark:text-gray-900">Gestion des posts</h1>
            </div>
            {/* Search bar */}
            <div className="flex items-center justify-center space-x-2 mt-10">
                <input
                    className="w-96 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    placeholder="Rechercher un(e) employé..."
                    type="search"
                    onChange={handleSearch}
                />
            </div>

            <div className="container mx-auto mt-5">
                <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-800 text-gray-200 h-16">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Role</th>
                            <th className="px-4 py-3 text-left font-medium">Nom</th>
                            <th className="px-4 py-3 text-left font-medium">Compétences</th>
                            <th className="px-4 py-3 text-left font-medium">Responsabilités</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {currentPosts.map((post, index) => (
                            <tr key={index}>
                                <td className="px-4 py-3 font-medium">
                                    {post.roleName === "Workshop" ? "Ouvrier" : post.roleName}
                                    {post.gammeName.length > 0 && "/Responsable"}
                                </td>
                                <td className="px-4 py-3">{post.userName}</td>
                                <td className="px-4 py-3">
                                    <ul className="list-disc list-inside">
                                        {post.postName.map((competence, index) => (
                                            <li key={index}>{competence}</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-4 py-3">
                                    {post.gammeName.length > 0 ? (
                                        <ul className="list-disc list-inside">
                                            {post.gammeName.map((responsabilite, index) => (
                                                <li key={index}>{responsabilite}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>N'est pas responsable de gamme</span>
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
                {Array.from({ length: Math.ceil(posts.length / postsPerPage) }).map(
                    (item, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ${
                                currentPage === index + 1 ? "" : "rounded-l"
                            }`}
                        >
                            {index + 1}
                        </button>
                    )
                )}
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

export default Posts;
