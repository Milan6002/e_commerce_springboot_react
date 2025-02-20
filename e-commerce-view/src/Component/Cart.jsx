import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminServices from "../Services/AdminServices";
import { jwtDecode } from "jwt-decode";
import authService from "../Services/authService";
import CartService from "../Services/CartService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../assets/Cart.css";

function Cart() {
  const [products, setProducts] = useState([]);
  const user_email = jwtDecode(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authService.ReadProfileByEmail(
          user_email.sub
        );
        const profileData = userResponse.data;

        if (profileData.id) {
          const cartResponse = await CartService.getCartID(profileData.id);
          const cartDetail = cartResponse.data;

          if (cartDetail.id) {
            const cartItemsResponse = await CartService.getCartItems(
              cartDetail.id
            );
            const cartItems = cartItemsResponse.data;

            const productPromises = cartItems.map(async (item) => {
              const productResponse = await AdminServices.getProductById(
                item.productId
              );
              return {
                ...productResponse.data,
                quantity: item.quantity,
                cartItemId: item.id,
              };
            });

            const productData = await Promise.all(productPromises);
            setProducts(productData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user_email.sub]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId
          ? { ...product, quantity: newQuantity }
          : product
      )
    );

    try {
      await CartService.updateCartItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleRemoveItem = async (e, productId) => {
    e.preventDefault();
    try {
      const response = await CartService.removeItem(productId);
      setProducts((prev) =>
        prev.filter((product) => product.product_id !== productId)
      );
      toast.success(response.data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <motion.div
      className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <ToastContainer />
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Your Cart
      </h1>

      {products.length === 0 ? (
        <motion.div
          className="text-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <p className="text-gray-600">Your cart is empty.</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => navigate("/ecommerce/shop")}
          >
            Shop Now
          </button>
        </motion.div>
      ) : (
        <div className="flex gap-6 cart-total">
          <div className="w-full">
            {products.map((item) => (
              <motion.div
                key={item.product_id}
                className="bg-white cart-inner-main rounded-lg shadow-md overflow-hidden flex p-4 gap-2.5 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="min-w-72">
                  <img
                    src={`data:image/jpeg;base64,${item.product_images[0]}`}
                    alt={item.product_name}
                    className="w-full h-64 cart-inner-img"
                  />
                </motion.div>
                <div className="p-4 w-full cart-product">
                  <p className="font-semibold text-gray-800">
                    {item.product_name}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.price} x {item.quantity}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.category_name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      className="bg-gray-300 px-3 py-1 rounded-md hover:cursor-pointer"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity - 1)
                      }
                    >
                      ➖
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      className="bg-gray-300 px-3 py-1 rounded-md hover:cursor-pointer"
                      onClick={() =>
                        updateQuantity(item.product_id, item.quantity + 1)
                      }
                    >
                      ➕
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-lg font-bold">
                      Total: ₹{item.price * item.quantity}
                    </p>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={(e) => handleRemoveItem(e, item.product_id)}
                      className="text-red-600 font-medium hover:underline hover:cursor-pointer"
                    >
                      Remove ❌
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="bg-white rounded-2xl w-96 h-76 shadow-lg p-4 cart-price"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-xl font-semibold border-b-2 pb-3 border-gray-300">
              Price Details
            </h1>

            <div className="mt-4">
              <p className="flex justify-between text-lg">
                Price ({products.length} Items)
                <span>
                  ₹
                  {products.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </span>
              </p>
            </div>

            <div className="mt-3 border-b-2 border-dashed border-gray-300 pb-3">
              <p className="flex justify-between text-lg">
                Delivery Charges <span className="text-green-600">Free</span>
              </p>
            </div>

            <div className="mt-3 border-b-2 border-dashed border-gray-300 pb-3">
              <p className="flex justify-between text-lg font-bold">
                Total Amount
                <span>
                  ₹
                  {products.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )}
                </span>
              </p>
            </div>

            <div className="mt-3">
              <button
                type="submit"
                className="p-2 bg-blue-700 text-white font-extrabold font-sans rounded-xl  uppercase px-3 text-lg hover:bg-blue-500 hover:cursor-pointer"
              >
                Check Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Cart;
