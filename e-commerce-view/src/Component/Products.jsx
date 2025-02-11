import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import '../assets/shop.css';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await AdminService.getAllProducts();
        const productList = response.data;

        //Below code is used to display category name from category id
        const updatedProducts = await Promise.all(
          productList.map(async (product) => {
            const categoryResponse = await AdminService.getCategoryById(
              product.category_id
            );
            return {
              ...product,
              category_name: categoryResponse.data.category_name,
            };
          })
        );

        setProducts(updatedProducts);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await AdminService.getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchCategory();
    fetchData();
  }, []);

  const handleDelete = async (e, productId) => {
    e.preventDefault();
    try {
      await AdminService.deleteProduct(productId);
      setProducts((prev) =>
        prev.filter((product) => product.product_id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = (e, productId) => {
    e.preventDefault();
    navigate(`/UpdateProduct/${productId}`);
  };

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter(
      (product) => String(product.category_id) === String(selectedCategory)
    );
  }, [selectedCategory, products]);

  const handleViewProduct = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {localStorage.getItem("role") === "ROLE_ADMIN" && (
        <button
          onClick={() => navigate("/AddProduct")}
          className="mb-5 p-3 px-4 mt-5 text-blue-600 font-bold text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-transform transform hover:scale-105"
        >
          Add Product
        </button>
      )}

      <div className=" flex main">
        {/* Sorting Controls */}
        <div className="mb-5 ">
          <form className="cart-form ">
            {/* <label className="me-6 text-lg" htmlFor="sortbyCategory ">
              Sort By Category:
            </label> */}
            <select
              id="sortbyCategory"
              className="bg-white p-2 me-6 rounded-2xl"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>
          </form>
        </div>

        {/* Product Display */}
        {!loading ? (
          <div className="w-full">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.product_id}
                  className=" flex p-4 gap-2.5 mb-4 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  
                  <div className="min-w-70 inner-img">
                    <img
                      src={`data:image/jpeg;base64,${product.product_image}`}
                      alt={product.product_name}
                      className="w-full h-64"
                    />
                  </div>
                  <div className="p-4 inner-product">
                    {/* <h2 className="text-xl font-bold text-gray-800">
                      {product.product_name}
                    </h2> */}
                    <p className="font-bold text-gray-800">
                       {product.product_name}
                    </p>
                    <p className="text-gray-600 cart-description">
                      {product.description}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Price: ₹{product.price}
                    </p>
                    {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={(e) => handleUpdate(e, product.product_id)}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, product.product_id)}
                          className="text-red-600 font-medium hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <button
                          onClick={(e) =>
                            handleViewProduct(e, product.product_id)
                          }
                          className="bg-blue-600 p-2 px-4 text-white rounded-lg hover:bg-blue-500 hover:cursor-pointer"
                        >
                          View Product
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No products available.
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default Products;