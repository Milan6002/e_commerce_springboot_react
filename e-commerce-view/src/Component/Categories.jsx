import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";

function Categories() {
  const navigate = useNavigate();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await AdminServices.getAllCategories();
        setCategoryData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteCategory = async (e, id) => {
    e.preventDefault();
    try {
      await AdminServices.deleteCategory(id);
      setCategoryData((prev) =>
        prev.filter((category) => category.category_id !== id)
      );
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Failed to delete category. Please try again.");
    }
  };

  const handleUpdateCategory = (e, id) => {
    e.preventDefault();
    navigate(`/ecommerce/UpdateCategory/${id}`);
  };

  const handleAddCategory = () => {
    navigate("/ecommerce/AddCategory");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <button
        onClick={handleAddCategory}
        className="mb-6 bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 transition-colors duration-200"
      >
        Add Category
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 font-semibold">{error}</div>
      ) : categoryData.length > 0 ? (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Sr no.
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Category Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {categoryData.map((data, index) => (
                <tr
                  key={data.category_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                    {data.category_name}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={(e) => handleUpdateCategory(e, data.category_id)}
                      className="mr-2 bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => handleDeleteCategory(e, data.category_id)}
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

export default Categories;
