import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";

function Type() {
    const navigate = useNavigate();
    const [typeData, setTypeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await AdminServices.getAllTypes();
                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.data || [];
                setTypeData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch types. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteType = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this type?");
        if (!confirmDelete) return;

        try {
            await AdminServices.deleteType(id);
            setTypeData((prev) => prev.filter((type) => type.type_id !== id));
        } catch (err) {
            console.error("Failed to delete type:", err);
            setError("Failed to delete type. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Manage Types
                    </h1>

                    <button
                        onClick={() => navigate("/addType")}
                        className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                    >
                        + Add Type
                    </button>
                </div>

                {/* Loader */}
                {loading && (
                    <div className="flex justify-center py-10">
                        <div className="h-12 w-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center text-red-500 font-semibold py-4">
                        {error}
                    </div>
                )}

                {/* Table */}
                {!loading && !error && typeData.length > 0 && (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <tr>
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Type Name</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {typeData.map((data, index) => (
                                    <tr
                                        key={data.type_id}
                                        className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            {data.type_name}
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/UpdateType/${data.type_id}`)}
                                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition"
                                            >
                                                Update
                                            </button>

                                            <button
                                                onClick={() => handleDeleteType(data.type_id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && typeData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">📂</div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No Types Available
                        </p>
                        <button
                            onClick={() => navigate("/addType")}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >
                            Add Your First Type
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Type;
