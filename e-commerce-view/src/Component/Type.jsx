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
                // If your data is nested like response.data.data, use that instead
                const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
                setTypeData(data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch categories. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDeleteType = async (e, id) => {
        e.preventDefault();
        try {
            await AdminServices.deleteType(id);
            setTypeData((prev) => prev.filter((type) => type.type_id !== id));
        } catch (err) {
            console.error("Failed to delete type:", err);
            setError("Failed to delete type. Please try again.");
        }
    };

    const handleUpdateType = (e, id) => {
        e.preventDefault();
        navigate(`/UpdateType/${id}`);
    };

    const handleAddtype = () => {
        navigate("/addType");
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <button
                onClick={handleAddtype}
                className="mb-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
                Add Type
            </button>

            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 font-semibold">{error}</div>
            ) : typeData.length > 0 ? (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Sr no.
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Category Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {typeData.map((data, index) => (
                                <tr key={data.type_id} className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {data.type_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <button
                                            onClick={(e) => handleUpdateType(e, data.type_id)}
                                            className="mr-2 bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteType(e, data.type_id)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500 font-medium">
                    No categories available.
                </div>
            )}
        </div>
    );
}

export default Type;
