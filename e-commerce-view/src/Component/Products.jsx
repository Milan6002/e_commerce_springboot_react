import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import "../assets/shop.css";
import { motion } from "framer-motion";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedBrand = queryParams.get("Brand");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productRes = await AdminService.getAllProducts();
        const categoryRes = await AdminService.getAllCategories();

        const categoryMap = {};
        categoryRes.data.forEach(
          (c) => (categoryMap[c.category_id] = c.category_name)
        );

        const updated = productRes.data.map((p) => ({
          ...p,
          category_name: categoryMap[p.category_id],
          product_brand: p.product_brand || "",
        }));

        setProducts(updated);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Reset category if brand filter is active
  useEffect(() => {
    if (selectedBrand) setSelectedCategory("");
  }, [selectedBrand]);

  // FILTERED PRODUCTS
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // CATEGORY FILTER
    if (selectedCategory) {
      result = result.filter(
        (p) => String(p.category_id) === String(selectedCategory)
      );
    }

    // BRAND FILTER
    if (selectedBrand) {
      result = result.filter(
        (p) =>
          p.product_brand &&
          p.product_brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // SEARCH FILTER
    if (searchText.trim() !== "") {
      const query = searchText.toLowerCase();

      result = result.filter(
        (p) =>
          p.product_name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.product_brand?.toLowerCase().includes(query) ||
          p.category_name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, selectedCategory, selectedBrand, searchText]);

  // ACTION HANDLERS
  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      await AdminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.product_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = (e, id) => {
    e.preventDefault();
    navigate(`/UpdateProduct/${id}`);
  };

  const handleView = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* ADMIN ADD PRODUCT BUTTON */}
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

      {/* CATEGORY DROPDOWN + SEARCH */}
      <div className="mb-6 flex justify-between items-center w-full">
        <div className="mb-5">
          <Dropdown
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.value)}
            options={categories.map((c) => ({
              label: c.category_name,
              value: c.category_id,
            }))}
            placeholder="All Categories"
            className="w-96 p-2"
            showClear
            panelStyle={{ backgroundColor: "black", color: "white" }}
          />
        </div>

        <div className="mb-6 justify-end">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search products..."
            className="w-96 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      {!loading ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.product_id}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-200"
              >
                {/* PRODUCT IMAGE */}
                <div className="relative w-full h-56 bg-gray-100 overflow-hidden flex items-center justify-center">
                  <img
                    src={`data:image/jpeg;base64,${product.product_images[0]}`}
                    alt={product.product_name}
                    className="h-full w-auto object-contain transition-transform duration-300"
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="p-4">
                  {/* CATEGORY + BRAND */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-semibold">
                      {product.category_name}
                    </span>

                    {product.product_brand && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md font-semibold">
                        {product.product_brand}
                      </span>
                    )}
                  </div>

                  {/* NAME */}
                  <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">
                    {product.product_name}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-gray-500 line-clamp-2 h-10">
                    {product.description}
                  </p>

                  {/* PRICE + DISCOUNT */}
                  <div className="mt-3">
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-indigo-600">
                        ₹{Math.round(product.price)}
                      </p>

                      <p className="text-sm text-gray-400 line-through">
                        ₹
                        {Math.round(
                          product.price +
                            (product.price * product.discount) / 100
                        )}
                      </p>

                      {product.discount > 0 && (
                        <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-md">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="mt-4">
                    {localStorage.getItem("role") === "ROLE_ADMIN" ? (
                      <div className="flex justify-between">
                        <Button
                          label="Edit"
                          className="p-button-info p-button-sm"
                          onClick={(e) => handleUpdate(e, product.product_id)}
                        />
                        <Button
                          label="Delete"
                          className="p-button-danger p-button-sm"
                          onClick={(e) => handleDelete(e, product.product_id)}
                        />
                      </div>
                    ) : (
                      <Button
                        icon="pi pi-eye"
                        label="View"
                        className="p-button-info w-full p-button-sm"
                        onClick={(e) => handleView(e, product.product_id)}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No products found.
            </p>
          )}
        </motion.div>
      ) : (
        <p className="text-center text-gray-600 text-lg">Loading products...</p>
      )}
    </div>
  );
}

export default Products;
