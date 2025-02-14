import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminService from "../Services/AdminServices";
// import "../assets/shop.css";
import { motion, useScroll } from "framer-motion";

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

  const { scrollYProgress } = useScroll();
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="bg-red-600 w-full h-1 top-0 fixed left-0 origin-left"
      ></motion.div>
      {localStorage.getItem("role") === "ROLE_ADMIN" && (
        <motion.button
          onClick={() => navigate("/AddProduct")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mb-5 p-3 px-4 mt-5 text-blue-600 font-bold text-lg rounded-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all"
        >
          Add Product
        </motion.button>
      )}

      <div className=" main">
        <div className="mb-5">
          <form className="cart-form">
            <select
              id="sortbyCategory"
              className="bg-white p-3 me-6 rounded-2xl border border-gray-300 hover:border-blue-500 transition"
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

        {!loading ? (
          <motion.div
            className="w-full grid grid-cols-1 md:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.product_id}
                  className="p-4 gap-2.5 mb-4 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow bg-white"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="min-w-70 min-h-96 overflow-hidden inner-img p-8"
                    whileHover={{ scale: 1.2  }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${product.product_images[0]}`}
                      alt={product.product_name}
                      className="w-full rounded-lg object-cover"
                    />
                  </motion.div>

                  <div className="p-4 inner-product w-full">
                    <p className="font-bold text-gray-800 h-5 overflow-hidden mb-3">
                      {product.product_name}
                    </p>
                    <p className="text-gray-600 cart-description h-12 overflow-hidden mb-3">
                      {product.description}
                    </p>
                    <p className="text-gray-800 font-semibold mb-3">
                      Price: ₹{product.price}
                    </p>
                    {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                      <div className="mt-4 flex justify-between">
                        <motion.button
                          onClick={(e) => handleUpdate(e, product.product_id)}
                          className="text-blue-600 font-medium hover:underline"
                          whileHover={{ scale: 1.1 }}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={(e) => handleDelete(e, product.product_id)}
                          className="text-red-600 font-medium hover:underline"
                          whileHover={{ scale: 1.1 }}
                        >
                          Remove
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={(e) =>
                          handleViewProduct(e, product.product_id)
                        }
                        className="bg-blue-600 p-2 px-4 text-white rounded-lg hover:bg-blue-500 transition"
                        whileHover={{ scale: 1.1 }}
                      >
                        View Product
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No products available.
              </p>
            )}
          </motion.div>
        ) : (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
      </div>
    </div>
  );
}

export default Products;
