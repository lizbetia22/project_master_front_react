import React, { useState } from "react";
import axios from "axios";

const Posts = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState([]);
    const postsPerPage = 4;
    const API_URL = process.env.REACT_APP_API_URL;

    const fetchData = async () => {
        try {
            const [userPostsResponse, gammeResponse] = await Promise.all([
                axios.get(`${API_URL}/user-post/all`),
                axios.get(`${API_URL}/gamme/all`),
            ]);

            const userPosts = userPostsResponse.data;
            const gammes = gammeResponse.data;

            const userMap = new Map();

            userPosts.forEach(post => {
                const userName = post.User.name;
                const roleObject = gammes.find(gamme => gamme.User.name === userName)?.User.Role;

                if (roleObject) {
                    const role = roleObject.name;
                    const competence = post.Post.name;

                    if (userMap.has(userName)) {
                        const user = userMap.get(userName);
                        if (!user.competences.includes(competence)) {
                            user.competences.push(competence);
                        }
                    } else {
                        userMap.set(userName, {
                            post: role,
                            nom: userName,
                            competences: [competence],
                            responsabilites: [],
                        });
                    }
                }
            });

            gammes.forEach(gamme => {
                const userName = gamme.User.name;
                if (userMap.has(userName)) {
                    const user = userMap.get(userName);
                    user.responsabilites.push(gamme.name);
                }
            });

            const mappedPosts = Array.from(userMap.values());

            setPosts(mappedPosts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useState(() => {
        fetchData();
    }, []);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts
        .filter(post => post.nom.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <div className="container mx-auto mt-10 ">
                {posts.length === 0 ? (
                    <p className="text-center text-gray-600">Chargement en cours...</p>
                ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden ml-8 mr-8">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-800 text-gray-200 h-16">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Post</th>
                                <th className="px-4 py-3 text-left font-medium">Nom</th>
                                <th className="px-4 py-3 text-left font-medium">Compétences</th>
                                <th className="px-4 py-3 text-left font-medium">Responsabilités</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {currentPosts.map((post, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-3 font-medium">{post.post}</td>
                                    <td className="px-4 py-3">{post.nom}</td>
                                    <td className="px-4 py-3">
                                        <ul className="list-disc list-inside">
                                            {post.competences.map((competence, index) => (
                                                <li key={index}>{competence}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-3">
                                        <ul className="list-disc list-inside">
                                            {post.responsabilites.map((responsabilite, index) => (
                                                <li key={index}>{responsabilite}</li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
