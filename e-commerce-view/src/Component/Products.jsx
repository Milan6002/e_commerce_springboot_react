import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminService from "../Services/AdminServices";
import "../assets/shop.css";
import { motion, useScroll } from "framer-motion";
import { Dropdown } from 'primereact/dropdown';
import { Card } from "primereact/card";
import { Button } from "primereact/button";
// import { motion } from "framer-motion";
// import "./ProductCard.css";


function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const selectedBrand = queryParams.get("Brand"); // ✅ FIX: Capital B

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
            const categoryResponse = await AdminService.getCategoryById(product.category_id);
            const fullProduct = {
              ...product,
              category_name: categoryResponse.data.category_name,
              product_brand: product.product_brand || "",
            };
            return fullProduct;
          })
        );

        setProducts(updatedProducts);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    const fetchCategory = async () => {
      try {
        const response = await AdminService.getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategory();
    fetchData();
  }, []);

  // ✅ Optional: Reset category when a brand is selected
  useEffect(() => {
    if (selectedBrand) {
      setSelectedCategory("");
    }
  }, [selectedBrand]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory) {
      result = result.filter(
        (product) => String(product.category_id) === String(selectedCategory)
      );
    }

    if (selectedBrand) {
      result = result.filter(
        (product) =>
          product.product_brand &&
          product.product_brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }
    return result;
  }, [selectedCategory, selectedBrand, products]);

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

  const handleViewProduct = (e, id) => {
    e.preventDefault();
    navigate(`/viewproduct/${id}`);
  };

  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
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

      <div className="main">
        <div className="mb-5">
          <div className="card flex justify-content-center ">
            <Dropdown value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} options={categories.map((cat) => ({ key: cat.category_id, value: cat.category_id, name: cat.category_name }))} optionLabel="name"
              placeholder="All Categories" className="w-96 p-2 border-2 rounded-md md:w-14rem " checkmark={true} highlightOnSelect={false} panelStyle={{ backgroundColor: 'black', color: 'white' }} // black background
            />
          </div>
        </div>

        {!loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            {products.length > 0 ? (
              products.map((product) => {
                const header = (
                  <img
                    alt={product.product_name}
                    src={`data:image/jpeg;base64,${product.product_images[0]}`}
                    className="product-image"
                  />
                );

                const footer =
                  localStorage.getItem("role") === "ROLE_ADMIN" ? (
                    <div className="flex justify-between mt-3">
                      <Button
                        label="Edit"
                        className="p-button-text p-button-info"
                        onClick={(e) => handleUpdate(e, product.product_id)}
                      />
                      <Button
                        label="Remove"
                        className="p-button-text p-button-danger"
                        onClick={(e) => handleDelete(e, product.product_id)}
                      />
                    </div>
                  ) : (
                    <Button
                      icon="pi pi-eye"
                      label="View Product"
                      className="p-button-info w-full mt-3"
                      onClick={(e) => handleViewProduct(e, product.product_id)}
                    />
                  );

                return (
                  <motion.div
                    key={product.product_id}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      header={header}
                      footer={footer}
                      className="animated-card"
                    >
                      <div className="text-xl font-bold mb-2">
                        {product.product_name}
                      </div>
                      <div className="text-500 h-12 overflow-hidden mb-2">
                        {product.description}
                      </div>
                      <div className="text-2xl font-semibold">
                        ₹{product.price}
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-center text-gray-600 col-span-full">
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
