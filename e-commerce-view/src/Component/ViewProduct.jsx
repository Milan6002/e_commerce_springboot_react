import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import CartService from "../Services/CartService";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { motion } from "framer-motion";
import { calculateDiscountPrice } from "../Utils/priceUtils";

// PrimeReact Imports
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';

function ViewProduct() {

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const toast = useRef(null);

  const navigate = useNavigate();

  // ✅ Fetch Product
  useEffect(() => {

    const fetchProduct = async () => {
      try {

        const response = await AdminServices.getProductById(id);
        const productData = response.data;

        const category = await AdminServices.getCategoryById(
          productData.category_id
        );

        const updatedProduct = {
          ...productData,
          category_name: category.data.category_name,
        };

        setProduct(updatedProduct);

        if (productData.product_images?.length > 0) {
          setMainImage(productData.product_images[0]);
        }

      } catch (error) {
        console.log(error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load product', life: 3000 });
      }
    };

    fetchProduct();

  }, [id]);

  // ✅ BUY NOW FUNCTION
  const handleBuyNow = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please login first to buy', life: 3000 });
        navigate("/login");
        return;
      }
      
      const item = {
          ...product,
          quantity: 1
      };
      navigate("/checkout", { state: [item] });
  };

  // ✅ ADD TO CART FUNCTION (FIXED)
  const handleAddToCart = async () => {
    try {

      const token = localStorage.getItem("token");

      // ❌ Not logged in
      if (!token) {
        toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please login first', life: 3000 });
        return;
      }

      const decoded = jwtDecode(token);

      // ✅ Flexible email extraction
      const userEmail = decoded?.email || decoded?.sub;

      if (!userEmail) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'User email not found', life: 3000 });
        return;
      }

      await CartService.addToCart(
        userEmail,
        product.product_id,
        1
      );

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Added to Cart 🛒', life: 3000 });
      window.dispatchEvent(new CustomEvent("cartUpdated"));

    } catch (error) {

      console.error("Cart Error:", error);

      if (error.response?.data) {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: error.response.data, life: 3000 });
      } else {
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
      }
    }
  };

  if (!product)
    return (
      <div className="p-4 md:p-10 bg-gray-100 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2">
            <Skeleton width="100%" height="30rem" className="mb-4"></Skeleton>
            <div className="flex gap-4">
              <Skeleton width="5rem" height="5rem"></Skeleton>
              <Skeleton width="5rem" height="5rem"></Skeleton>
              <Skeleton width="5rem" height="5rem"></Skeleton>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex flex-col">
            <Skeleton width="80%" height="3rem" className="mb-3"></Skeleton>
            <Skeleton width="40%" className="mb-2"></Skeleton>
            <Skeleton width="50%" className="mb-4"></Skeleton>
            <Skeleton width="30%" height="2rem" className="mb-4"></Skeleton>
            <Skeleton width="100%" height="10rem"></Skeleton>
          </div>
        </div>
      </div>
    );

  const discountPrice = calculateDiscountPrice(
    product.price,
    product.discount
  );

  // ✅ WhatsApp message
  const whatsappMessage = `Hello, I am interested in your product: ${product.product_name}. Price: ₹${Math.round(
    discountPrice
  )}. Please share more details.`;

  const whatsappLink = `https://wa.me/919512796272?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (

    <motion.div
      className="p-4 md:p-10 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <Toast ref={toast} />

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row gap-10">

        {/* LEFT IMAGE */}
        <div className="w-full md:w-1/2">

          <motion.img
            src={`data:image/jpeg;base64,${mainImage}`}
            alt={product.product_name}
            className="w-full max-h-[480px] rounded-xl shadow-md object-contain bg-gray-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />

          <div className="flex mt-4 gap-4 flex-wrap">
            {product.product_images?.map((img, index) => {

              const active = img === mainImage;

              return (
                <motion.img
                  key={index}
                  src={`data:image/jpeg;base64,${img}`}
                  alt="Thumbnail"
                  onClick={() => setMainImage(img)}
                  className={`w-20 h-20 rounded-lg border-2 cursor-pointer object-cover ${active ? "border-blue-700" : "border-gray-300"
                    }`}
                  whileHover={{ scale: 1.1 }}
                />
              );
            })}
          </div>

        </div>

        {/* RIGHT DETAILS */}
        <div className="w-full md:w-1/2 flex flex-col">

          <h1 className="text-3xl font-bold text-gray-800">
            {product.product_name}
          </h1>

          <p className="text-gray-500 mt-1">
            Category : {product.category_name}
          </p>

          <p className="text-gray-600 mt-2">
            <span className="font-bold">Brand:</span> {product.product_brand}
          </p>

          <p className="text-gray-600 mt-1">
            <span className="font-bold">Color:</span> {product.product_color}
          </p>

          {/* PRICE */}
          <div className="flex items-center gap-3 mt-2">
            <p className="text-xl font-semibold text-green-600">
              ₹{discountPrice}
            </p>
            <p className="text-gray-400 line-through">
              ₹{product.price}
            </p>
            <p className="text-green-600 font-medium">
              {product.discount}% OFF
            </p>
          </div>

          {/* DESCRIPTION */}
          <p className="mt-5 text-gray-700 leading-relaxed text-justify">
            {product.description}
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">

            {/* ✅ BUY NOW BUTTON */}
            <Button
              label="Buy Now"
              icon="pi pi-bolt"
              onClick={handleBuyNow}
              className="px-5 border-round-xl font-bold shadow-2 border-none"
              style={{ background: '#f97316' }} /* Orange-500 */
            />

            {/* ✅ FIXED ADD TO CART */}
            <Button
              label="Add to Cart"
              icon="pi pi-shopping-cart"
              onClick={handleAddToCart}
              className="p-button-warning text-white px-5 border-round-xl font-semibold shadow-2"
            />

            {/* WhatsApp */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Button
                label="Chat on WhatsApp"
                className="p-button-outlined p-button-success border-round-xl font-semibold px-5"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="mr-2 text-xl" />
              </Button>
            </a>

            {/* Bulk Order */}
            <Button
              label="Bulk / Custom Order"
              onClick={() => navigate("/BulkOrder", { state: { product } })}
              className="p-button-primary border-round-xl font-bold px-5"
            />

          </div>

        </div>

      </div>

    </motion.div>
  );
}

export default ViewProduct;