import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import CartService from "../Services/CartService";
import { toast, ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  const token = localStorage.getItem("token");
  const user_email = jwtDecode(token);
  const navigate = useNavigate();
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

  if (!product) return <p className="text-center text-lg">Loading...</p>;

  const imageList = product.product_images;

  const handleAddToCart = (e, userEmail, productId, quantity) => {
    e.preventDefault();
    CartService.addToCart(userEmail, productId, quantity)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Item added To The Cart Successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const whatsappMessage = `Hello, I am interested in your product: ${product.product_name}.
Price: ₹${product.price}.
Please provide more details.`;
  const whatsappLink = `https://wa.me/+919512796272?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <motion.div
      className="p-5"
    // initial={{ opacity: 0 }}
    // animate={{ opacity: 1 }}
    // transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <motion.div
        className="bg-white w-full flex flex-col md:flex-row"
      // whileHover={{ scale: 1.02 }}
      >
        {/* Left - Image Section */}
        <div className="w-[40vw]">
          <motion.img
            src={`data:image/jpeg;base64,${mainImage}`}
            alt={product.product_name}
            className="mb-4 h-80 w-auto rounded-md shadow-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          <div className="flex mt-3 gap-3">
            {imageList.map((img, index) => {
              const isActive = img === mainImage;
              return (
                <motion.img
                  key={index}
                  src={`data:image/jpeg;base64,${img}`}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-16 h-16 rounded border-2 cursor-pointer transition duration-300 ${isActive ? "border-blue-700" : "border-gray-300"
                    }`}
                  whileHover={{ scale: 1.1 }}
                  onMouseEnter={() => setMainImage(img)}
                  onClick={() => setMainImage(img)}
                />
              );
            })}
          </div>
        </div>


        {/* Right - Product Details */}
        <div className="w-full pl-6 mt-4 md:mt-0">
          <h1 className="text-2xl font-bold text-gray-800">
            {product.product_name}
          </h1>
          <p className="text-gray-500 mt-2">{product.category_name}</p>
          <p className="text-gray-500 mt-2">
            <b>Brand :</b> {product.product_brand}
          </p>
          <p className="text-gray-500 mt-2">
            <b>Color :</b> {product.product_color}
          </p>

          <div className="flex items-center space-x-3 mt-2">
            <p className="text-2xl font-semibold text-green-600">
              ₹{Math.round(product.price)}
            </p>
            <p className="text-gray-400 line-through">
              ₹
              {parseInt((product.price * product.discount) / 100) +
                product.price}
            </p>
            <p className="text-green-600 font-medium">
              {product.discount}% off
            </p>
          </div>

          <p className="text-gray-600 mt-4 text-justify">{product.description}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <motion.button
              onClick={(e) =>
                handleAddToCart(e, user_email.sub, product.product_id, 1)
              }
              className="bg-yellow-500 hover:bg-yellow-600 hover:cursor-pointer text-white font-bold py-2 px-6 rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              Add to Cart
            </motion.button>

            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 text-green-600 border-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
            >
              <FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />
            </motion.a>

            <motion.button
              type="submit"
              onClick={() => navigate("/BulkOrder")}
              className="bg-blue-700 p-3 text-white font-bold border-2 rounded-lg hover:bg-transparent hover:cursor-pointer hover:border-blue-700 hover:text-blue-700 font-mono "
              whileHover={{ scale: 1.1 }}
            >
              Bulk Order Or Customize Prodcut
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ViewProduct;
