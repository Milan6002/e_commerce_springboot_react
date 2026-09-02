import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import AdminServices from "../Services/AdminServices";
import { jwtDecode } from "jwt-decode";
import authService from "../Services/authService";
import CartService from "../Services/CartService";
import { useNavigate } from "react-router-dom";
import "../assets/Cart.css";

// PrimeReact Imports
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { calculateDiscountPrice } from "../Utils/priceUtils";
import { InputNumber } from "primereact/inputnumber";

function Cart() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);
  const shippingCharge = 0;

  // ✅ Proper email extraction
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const email = decoded?.email || decoded?.sub;

  // ✅ Redirect fix (useEffect ma mukvu)
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // ✅ Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!email) {
          console.log("Email not found in token");
          return;
        }

        console.log("EMAIL:", email);

        const userResponse = await authService.ReadProfileByEmail(email);
        const profileData = userResponse.data;

        const cartResponse = await CartService.getCartID(profileData.id);
        const cartDetail = cartResponse.data;

        const cartItemsResponse = await CartService.getCartItems(cartDetail.id);
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

      } catch (error) {
        console.error("Cart Fetch Error:", error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load cart', life: 3000 });
      }
    };

    if (email) fetchData();

  }, [email]);

  // ✅ Update Quantity FIX
  const updateQuantity = async (productId, newQuantity) => {
    // Handling PrimeReact InputNumber event object or raw value
    let val = typeof newQuantity === 'object' ? newQuantity.value : newQuantity;
    if (val < 1 || val === null) return;

    try {
      const cartItem = products.find(p => p.product_id === productId);

      if (!cartItem) return;

      await CartService.updateCartItemQuantity(
        cartItem.cartItemId,
        val
      );

      // ✅ update after API success
      setProducts((prev) =>
        prev.map((product) =>
          product.product_id === productId
            ? { ...product, quantity: val }
            : product
        )
      );
      window.dispatchEvent(new CustomEvent("cartUpdated"));

    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update quantity', life: 3000 });
    }
  };

  // ✅ Remove Item
  const handleRemoveItem = async (e, cartItemId) => {
    e.preventDefault();

    try {
      const response = await CartService.removeItem(cartItemId);

      setProducts((prev) =>
        prev.filter((product) => product.cartItemId !== cartItemId)
      );
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      toast.current?.show({ severity: 'success', summary: 'Success', detail: response.data, life: 3000 });

    } catch (error) {
      console.error("Error removing item:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to remove item', life: 3000 });
    }
  };

  const totalItems = products.reduce((total, item) => total + item.quantity, 0);

  // MRP Total (Without Discount)
  const totalMRP = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Discounted Subtotal
  const subTotal = products.reduce(
    (total, item) => {
      const finalPrice = calculateDiscountPrice(item.price, item.discount);
      return total + finalPrice * item.quantity;
    },
    0
  );

  const totalDiscount = totalMRP - subTotal;
  const grandTotal = subTotal + shippingCharge;

  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-5">
      <Toast ref={toast} />

      <div className="max-w-7xl mx-auto">
        <div className="flex align-items-center justify-content-between mb-5">
            <div>
                <h1 className="text-4xl font-extrabold text-slate-800 m-0 tracking-tight">
                    Shopping Cart
                </h1>
                <p className="text-slate-500 mt-2 text-lg">
                    You have <span className="font-bold text-indigo-600">{totalItems} items</span> in your cart
                </p>
            </div>
            <Button icon="pi pi-shopping-bag" rounded text size="large" className="bg-indigo-50 text-indigo-600 w-4rem h-4rem" />
        </div>

        {products.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-content-center mt-8">
                <Card className="text-center shadow-4 border-round-3xl w-full max-w-lg p-5">
                <i className="pi pi-cart-minus text-6xl text-400 mb-4"></i>
                <h2 className="text-2xl text-700 font-bold mb-2">Your cart is empty</h2>
                <p className="text-500 mb-5">Looks like you haven't added anything yet.</p>
                <Button
                    onClick={() => navigate("/shop")}
                    label="Start Shopping"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    className="p-button-rounded p-button-indigo px-6 py-3 font-bold text-lg shadow-3"
                />
                </Card>
            </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              {products.map((item, index) => {
                const discountedPrice = calculateDiscountPrice(item.price, item.discount);
                const itemTotal = discountedPrice * item.quantity;

                return (
                  <motion.div
                    key={item.cartItemId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="shadow-2 hover:shadow-4 transition-all transition-duration-300 border-round-2xl border-none">
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        
                        {/* Product Image */}
                        <div className="relative">
                            <img
                            src={
                                item.product_images?.[0]
                                ? `data:image/jpeg;base64,${item.product_images[0]}`
                                : "https://via.placeholder.com/150"
                            }
                            alt={item.product_name}
                            className="w-32 h-32 object-cover border-round-2xl shadow-1"
                            />
                            {item.discount > 0 && (
                                <Tag severity="danger" value={`${item.discount}% OFF`} className="absolute top-0 left-0 border-round-br-2xl" />
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 w-full text-center sm:text-left">
                          <h3 className="text-xl font-bold text-800 m-0 mb-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => navigate(`/product/${item.product_id}`)}>
                            {item.product_name}
                          </h3>
                          <div className="flex align-items-center justify-content-center sm:justify-content-start gap-2 mb-3">
                              <span className="text-2xl font-bold text-indigo-600">₹{discountedPrice}</span>
                              {item.discount > 0 && (
                                  <span className="text-500 line-through text-sm">₹{item.price}</span>
                              )}
                          </div>
                          
                          <div className="flex align-items-center justify-content-between flex-wrap gap-4">
                            
                            {/* Quantity Control with PrimeReact InputNumber */}
                            <div className="w-9rem">
                                <InputNumber 
                                    value={item.quantity} 
                                    onValueChange={(e) => updateQuantity(item.product_id, e.value)} 
                                    showButtons 
                                    buttonLayout="horizontal" 
                                    step={1} 
                                    min={1}
                                    decrementButtonClassName="p-button-secondary p-button-text" 
                                    incrementButtonClassName="p-button-secondary p-button-text" 
                                    incrementButtonIcon="pi pi-plus" 
                                    decrementButtonIcon="pi pi-minus" 
                                    inputClassName="w-3rem text-center font-bold text-lg border-none bg-transparent"
                                    className="border-1 surface-border border-round-3xl shadow-1 bg-gray-50 flex align-items-center justify-content-between p-1"
                                />
                            </div>

                            <div className="flex align-items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <span className="text-sm text-500 block">Total</span>
                                    <span className="text-xl font-bold text-700">₹{itemTotal}</span>
                                </div>
                                <Button
                                icon="pi pi-trash"
                                rounded
                                text
                                severity="danger"
                                aria-label="Remove"
                                className="hover:bg-red-50 hover:text-red-600 transition-colors"
                                onClick={(e) => handleRemoveItem(e, item.cartItemId)}
                                tooltip="Remove Item"
                                tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="sticky top-20">
                    <Card className="shadow-4 border-round-3xl border-none p-2 bg-white">
                        <div className="p-3">
                            <h2 className="text-2xl font-bold text-800 m-0 mb-4 border-bottom-1 surface-border pb-3">Order Summary</h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-content-between text-700 text-lg">
                                    <span>Total MRP ({totalItems} items)</span>
                                    <span>₹{totalMRP}</span>
                                </div>
                                
                                {totalDiscount > 0 && (
                                    <div className="flex justify-content-between text-green-600 text-lg font-medium">
                                        <span>Discount on MRP</span>
                                        <span>- ₹{totalDiscount}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-content-between text-700 text-lg">
                                    <span>Delivery Charges</span>
                                    <span>{shippingCharge === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${shippingCharge}`}</span>
                                </div>
                            </div>

                            <Divider />

                            <div className="flex justify-content-between align-items-center my-4">
                                <span className="text-xl font-bold text-800">Grand Total</span>
                                <span className="text-3xl font-extrabold text-indigo-600">₹{grandTotal}</span>
                            </div>

                            {totalDiscount > 0 && (
                                <div className="bg-green-50 border-green-200 border-1 border-round-xl p-3 mb-4 text-center">
                                    <span className="text-green-700 font-bold">You will save ₹{totalDiscount} on this order 🎉</span>
                                </div>
                            )}

                            <Button
                                onClick={() => navigate("/checkout", { state: products })}
                                label="Proceed to Checkout"
                                icon="pi pi-check-circle"
                                className="w-full p-button-rounded p-button-indigo py-3 font-bold text-lg shadow-4 mb-3 border-none"
                                style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)' }}
                            />
                            
                            <Button
                                onClick={() => navigate("/shop")}
                                label="Continue Shopping"
                                icon="pi pi-arrow-left"
                                outlined
                                severity="secondary"
                                className="w-full p-button-rounded py-3 font-bold"
                            />
                        </div>
                    </Card>
                </motion.div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
