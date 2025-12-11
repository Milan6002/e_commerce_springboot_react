import React, { useEffect, useState } from "react";
import AdminService from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Duffle() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        // Filter only "Duffle" category
        const duffleProducts = updatedProducts.filter(
          (product) =>
            product.category_name &&
            product.category_name.toLowerCase() === "duffle"
        );

        setProducts(duffleProducts);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleViewProduct = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 bg-gray-100 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
        Duffle Bags
      </h2>

      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <motion.div
                key={product.product_id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 cursor-pointer"
              >
                {/* Product Image */}
                <img
                  src={`data:image/jpeg;base64,${product.product_images[0]}`}
                  alt={product.product_name}
                  className="w-full h-64 object-cover rounded-lg"
                />

                {/* Product Name */}
                <h3 className="text-lg font-semibold mt-3 h-12 overflow-hidden">
                  {product.product_name}
                </h3>

                {/* Brand */}
                <p className="text-sm font-medium text-gray-600 mt-1">
                  Brand: <span className="font-bold">{product.product_brand}</span>
                </p>

                {/* Price Section */}
                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{Math.round(product.price)}
                  </p>

                  <p className="text-gray-400 line-through">
                    ₹
                    {parseInt((product.price * product.discount) / 100) +
                      product.price}
                  </p>

                  <p className="text-green-600 font-semibold text-sm">
                    {product.discount}% OFF
                  </p>
                </div>

                {/* View Product Button */}
                <button
                  onClick={(e) => handleViewProduct(e, product.product_id)}
                  className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg 
                  hover:bg-blue-700 transition font-semibold"
                >
                  View Product
                </button>
              </motion.div>
            ))
          ) : (
            <p className="text-lg text-gray-600">No Duffle products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
