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
    <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-xl text-gray-600">
          {localStorage.getItem("cart") ? "Loading cart..." : "Cart is empty"}
        </p>
      ) : (
        <div className="flex gap-6 ">
          <div className="">
            {products.map((item) => (
              <div key={item.product_id} className="bg-white rounded-lg shadow-md overflow-hidden flex p-4 gap-2.5 mb-4">
                <div className="min-w-60  ">
                  <img
                    src={`data:image/jpeg;base64,${item.product_image}`}
                    alt={item.product_name}
                    className="w-full"
                  />
                </div>
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
          <div className="bg-white rounded-2xl w-full h-75 ">
            <div className="border-b-2 border-b-red-100 p-3">
              <h1 className=" text-xl uppercase">Price details</h1>
            </div>
            <div className="p-3">
              <p>Price (1 item) <span className="ml-35">₹ 2,22,900</span> </p>
            </div>
            <div className="p-3">
              <p>Discount <span className="ml-44 text-green-600">- ₹9000</span></p>
            </div>
            <div className="p-3 border-b-2 border-dashed border-red-100 ">
              <p> Delivery Charges <span className="ml-33 text-green-600"> Free</span> </p>
            </div>
            <div className="p-3 border-b-2 border-dashed border-red-100">
              <p>Total Amount <span className="ml-35">₹ 2,31,400</span></p>
            </div>
            <div className="p-3">
              <p className="text-green-600">You will save ₹9000 on this order</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
