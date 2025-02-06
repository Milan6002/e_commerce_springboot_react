import { useEffect, useState } from "react";
import AdminServices from "../Services/AdminServices";
import { jwtDecode } from "jwt-decode";
import authService from "../Services/authService";
import CartService from "../Services/CartService";

function Cart() {
  const [products, setProducts] = useState([]);
  const user_email = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await authService.ReadProfileByEmail(user_email.sub);
        const profileData = userResponse.data;

        if (profileData.id) {
          const cartResponse = await CartService.getCartID(profileData.id);
          const cartDetail = cartResponse.data;

          if (cartDetail.id) {
            const cartItemsResponse = await CartService.getCartItems(cartDetail.id);
            const cartItems = cartItemsResponse.data;

            // Fetch all product details and include quantity
            const productPromises = cartItems.map(async (item) => {
              const productResponse = await AdminServices.getProductById(item.productId);
              return { ...productResponse.data, quantity: item.quantity, cartItemId: item.id }; // Include cart item ID for updates
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

  // Handle quantity update
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.product_id === productId ? { ...product, quantity: newQuantity } : product
      )
    );

    // Call API to update quantity in the backend
    try {
      await CartService.updateCartItemQuantity(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Cart</h1>
      <div className="flex gap-6">
        {/* Left Side - Product List */}
        <div className="w-full">
          {products.length > 0 ? (
            products.map((item) => (
              <div
                key={item.product_id}
                className="bg-white rounded-lg shadow-md overflow-hidden flex p-4 gap-2.5 mb-4"
              >
                <div className="min-w-72">
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt={item.product_name}
                    className="w-full h-64"
                  />
                </div>
                <div className="p-4 w-full">
                  <h2 className="text-xl font-semibold text-gray-800">{item.product_name}</h2>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.price} x {item.quantity}
                    </span>
                    <span className="text-sm text-gray-500">{item.category_name}</span>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="mt-2 flex items-center gap-3">
                    <button
                      className="bg-gray-300 px-3 py-1 rounded-md"
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                    >
                      ➖
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      className="bg-gray-300 px-3 py-1 rounded-md"
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                    >
                      ➕
                    </button>
                  </div>

                  <div className="mt-2">
                    <p className="text-lg font-bold">Total: ₹{item.price * item.quantity}</p>
                  </div>

                  <div className="mt-2">
                    <button className="text-red-600 font-medium hover:underline">
                      Remove ❌
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          )}
        </div>

        {/* Right Side - Price Summary */}
        <div className="bg-white min-w-96 rounded-2xl h-75 shadow-lg p-4">
          <h1 className="text-xl font-semibold border-b-2 pb-3 border-gray-300">Price Details</h1>

          <div className="mt-4">
            <p className="flex justify-between text-lg">
              Price ({products.length} Items)
              <span>
                ₹{products.reduce((total, item) => total + item.price * item.quantity, 0)}
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
                ₹{products.reduce((total, item) => total + item.price * item.quantity, 0)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
