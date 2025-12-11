import React, { useEffect, useState } from "react";
import AdminService from "../Services/AdminServices";
import { useNavigate } from "react-router-dom";

export default function Backpack() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await AdminService.getAllProducts();
        const productList = response.data;

        // Add category names to all products
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

        // Filter only Backpack category
        const backpack = updatedProducts.filter(
          (p) => p.category_name?.toLowerCase() === "backpack"
        );

        setProducts(backpack);
        setFilteredProducts(backpack);
      } catch (error) {
        console.error("Error loading products", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔍 Search filter (product name + brand)
  useEffect(() => {
    const filtered = products.filter((p) => {
      const term = searchTerm.toLowerCase();
      return (
        p.product_name.toLowerCase().includes(term) ||
        p.product_brand.toLowerCase().includes(term)
      );
    });

    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const handleViewProduct = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Backpack Products</h2>

      {/* 🔍 Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="border p-2 w-full rounded mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.product_id}
                className="border p-4 rounded shadow bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={`data:image/jpeg;base64,${product.product_images?.[0]}`}
                  alt={product.product_name}
                  className="rounded-lg h-80 mx-auto"
                />

                <h3 className="text-lg font-semibold h-9 overflow-hidden mt-2">
                  {product.product_name}
                </h3>

                <p className="text-sm font-bold mt-2">
                  Brand : {product.product_brand}
                </p>

                <div className="flex items-center space-x-3 mt-2">
                  <p className="text-2xl font-semibold text-green-600">
                    ₹{Math.round(product.price)}
                  </p>

                  <p className="text-gray-400 line-through">
                    ₹
                    {Math.round(
                      product.price +
                        (product.price * product.discount) / 100
                    )}
                  </p>

                  <p className="text-green-600 font-medium">
                    {product.discount}% off
                  </p>
                </div>

                <button
                  onClick={(e) => handleViewProduct(e, product.product_id)}
                  className="bg-blue-600 text-white py-2 px-4 mt-4 rounded hover:bg-blue-500 transition"
                >
                  View Product
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}
