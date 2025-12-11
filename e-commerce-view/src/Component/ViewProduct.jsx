import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import CartService from "../Services/CartService";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const token = localStorage.getItem("token");
  const user_email = jwtDecode(token);
  const navigate = useNavigate();

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await AdminServices.getProductById(id);
        const productData = response.data;

        const category = await AdminServices.getCategoryById(
          productData.category_id
        );

        setProduct({
          ...productData,
          category_name: category.data.category_name,
        });

        setMainImage(productData.product_images[0]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product)
    return <p className="text-center text-lg pt-10">Loading Product…</p>;

  const whatsappMessage = `Hello, I am interested in your product: ${product.product_name}. Price: ₹${product.price}. Please share more details.`;
  const whatsappLink = `https://wa.me/+919512796272?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <motion.div
      className="p-4 md:p-10 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <ToastContainer />

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">

        {/* LEFT — IMAGE GALLERY */}
        <div className="w-full md:w-1/2">

          {/* Main Image */}
          <motion.img
            src={`data:image/jpeg;base64,${mainImage}`}
            alt={product.product_name}
            className="w-full max-h-[480px] rounded-xl shadow-md object-contain bg-gray-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          {/* Thumbnails */}
          <div className="flex mt-4 gap-4 flex-wrap">
            {product.product_images.map((img, index) => {
              const active = img === mainImage;
              return (
                <motion.img
                  key={index}
                  src={`data:image/jpeg;base64,${img}`}
                  alt="Thumbnail"
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-lg border-2 cursor-pointer object-cover transition ${
                    active ? "border-blue-700" : "border-gray-300"
                  }`}
                  whileHover={{ scale: 1.1 }}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT — PRODUCT DETAILS */}
        <div className="w-full md:w-1/2 flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">
            {product.product_name}
          </h1>

          <p className="text-gray-500 mt-1">{product.category_name}</p>

          <p className="text-gray-600 mt-2">
            <span className="font-bold">Brand:</span> {product.product_brand}
          </p>

          <p className="text-gray-600 mt-1">
            <span className="font-bold">Color:</span> {product.product_color}
          </p>

          {/* Price Section */}
          <div className="flex items-center gap-4 mt-4">
            <p className="text-3xl font-bold text-green-600">
              ₹{Math.round(product.price)}
            </p>

            <p className="text-gray-400 line-through text-lg">
              ₹
              {parseInt((product.price * product.discount) / 100) +
                product.price}
            </p>

            <p className="text-green-600 font-medium text-lg">
              {product.discount}% OFF
            </p>
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-700 leading-relaxed text-justify">
            {product.description}
          </p>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* Add to Cart */}
            <motion.button
              onClick={(e) =>
                CartService.addToCart(
                  user_email.sub,
                  product.product_id,
                  1
                ).then(() => toast.success("Added to Cart"))
              }
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-yellow-600"
              whileTap={{ scale: 0.9 }}
            >
              Add to Cart
            </motion.button>

            {/* WhatsApp */}
            <motion.a
              href={whatsappLink}
              target="_blank"
              className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-600 rounded-xl font-semibold hover:bg-green-600 hover:text-white"
              whileHover={{ scale: 1.05 }}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
              Chat on WhatsApp
            </motion.a>

            {/* Bulk Order */}
            <motion.button
              onClick={() => navigate("/BulkOrder")}
              className="px-6 py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800"
              whileHover={{ scale: 1.05 }}
            >
              Bulk / Custom Order
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ViewProduct;
