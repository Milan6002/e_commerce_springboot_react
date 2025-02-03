import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import AdminServices from "../Services/AdminServices";

function Cart() {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart)); // Parse and set cart only if it exists
    }
  }, [setCart]);

  // Save cart to localStorage only when cart is not empty
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const fetchProductDetails = async (uniqueCartItems) => {
      const updatedProducts = [];

      for (const item of uniqueCartItems) {
        try {
          const response = await AdminServices.getProductById(item.productId);
          const productData = response.data;

          const category = await AdminServices.getCategoryById(
            productData.category_id
          );

          updatedProducts.push({
            ...productData,
            category_name: category.data.category_name,
            quantity: item.quantity, // Include quantity of each product
          });
        } catch (error) {
          console.log(error);
        }
      }

      setProducts(updatedProducts);
    };

    // Group products by productId and accumulate quantity
    const groupedCartItems = cart.reduce((acc, currentItem) => {
      const existingItem = acc.find((item) => item.productId === currentItem.productId);
      if (existingItem) {
        existingItem.quantity += currentItem.quantity;
      } else {
        acc.push({ ...currentItem, quantity: currentItem.quantity });
      }
      return acc;
    }, []);

    if (groupedCartItems.length > 0) {
      fetchProductDetails(groupedCartItems);
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          {localStorage.getItem("cart") ? "Loading cart..." : "Cart is empty"}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.product_id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={`data:image/jpeg;base64,${item.product_image}`}
                alt={item.product_name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{item.product_name}</h2>
                <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    ₹{item.price} x {item.quantity}
                  </span>
                  <span className="text-sm text-gray-500">{item.category_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;
