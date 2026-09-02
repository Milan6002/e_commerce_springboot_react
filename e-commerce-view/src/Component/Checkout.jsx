import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import authService from "../Services/authService"; // path check karo

// PrimeReact Imports
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { motion } from "framer-motion";
import { Tag } from "primereact/tag";
import { RadioButton } from "primereact/radiobutton";
import { calculateDiscountPrice } from "../Utils/priceUtils";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useRef(null);

  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [payment, setPayment] = useState("UPI");
  const [loading, setLoading] = useState(false);

  // Fake Payment States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState(0); // 0: Enter Details, 1: Processing, 2: Success
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const paymentOptions = ["UPI", "Cash", "Card"];

  useEffect(() => {
    // ✅ USER FETCH (FIXED)
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token); // ✅ decode token

        authService.ReadProfileByEmail(decoded.sub)
          .then((response) => {
            const data = response.data;

            console.log("USER DATA:", data); // debug

            setUser({
              firstname: data.firstname || "",
              lastname: data.lastname || "",
              email: data.email || decoded.sub || "",
            });
          })
          .catch((err) => {
            console.error("User fetch error:", err);
          });

      } catch (error) {
        console.error("Token decode error:", error);
      }
    }

    // ✅ CART DATA
    const cartData = location.state || [];
    setCart(cartData);

    const totalAmount = cartData.reduce(
      (sum, item) => sum + calculateDiscountPrice(item.price, item.discount) * item.quantity,
      0
    );

    setTotal(totalAmount);

  }, [location.state]);

  // ✅ CHECKOUT
  const handleCheckout = async () => {
    if (payment !== "Cash") {
      setShowPaymentModal(true);
      setPaymentStep(0);
      return;
    }
    processFinalOrder();
  };

  const processPayment = () => {
    setPaymentStep(1); // Processing
    setTimeout(() => {
        setPaymentStep(2); // Success
        setTimeout(() => {
            setShowPaymentModal(false);
            processFinalOrder();
        }, 1500);
    }, 2000);
  };

  const processFinalOrder = async () => {
    setLoading(true);

    const order = {
      customerName: `${user.firstname} ${user.lastname}`.trim(),
      customerEmail: user.email,
      productName: cart.map(item => item.product_name).join(", "),
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      price: cart[0]?.price || 0,
      totalAmount: total,
      paymentMethod: payment
    };

    try {
      const response = await axios.post(
        "http://localhost:8081/api/sales/placeOrder",
        order
      );

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Order Placed Successfully ✅', life: 3000 });

      setTimeout(() => {
        navigate("/invoice", { state: response.data });
      }, 1500);

    } catch (error) {
      console.error("ERROR:", error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Something went wrong ❌', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  // MRP Calculation
  const totalMRP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = totalMRP - total; 
  const totalItems = cart.reduce((s,i) => s + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex justify-content-center mt-8">
        <Card className="text-center shadow-1 border-1 surface-border w-full max-w-30rem">
          <i className="pi pi-shopping-cart text-5xl text-500 mb-3"></i>
          <h2 className="text-xl font-bold m-0 mb-4 text-800">Your Checkout is empty</h2>
          <Button label="Continue Shopping" onClick={() => navigate('/shop')} className="p-button-warning p-button-outlined" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-8 pb-8 px-2 md:px-5 mt-5 font-sans">
      <Toast ref={toast} />

      {/* Simple Amazon style header */}
      <div className="max-w-7xl mx-auto mb-4 border-bottom-1 surface-border pb-3 flex align-items-center justify-content-between">
          <h1 className="text-3xl font-medium text-900 m-0">Checkout <span className="text-xl font-normal text-500">({totalItems} items)</span></h1>
          <i className="pi pi-lock text-500 text-2xl"></i>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5">
            
          {/* Left Column: Steps */}
          <div className="lg:col-span-8 flex flex-col">
            
            {/* Step 1: Delivery Address (Customer Details) */}
            <div className="flex gap-4 mb-4">
                <div className="text-xl font-bold text-900 w-2rem text-center">1</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-900 m-0 mb-2">Delivery address</h3>
                    <div className="text-800 line-height-3 text-sm">
                        {user.firstname} {user.lastname}<br/>
                        {user.email}<br/>
                        Gujarat, India
                    </div>
                </div>
                <div className="text-blue-600 cursor-pointer hover:underline text-sm font-medium">Change</div>
            </div>
            
            <Divider className="my-2" />

            {/* Step 2: Payment Method */}
            <div className="flex gap-4 mb-4">
                <div className="text-xl font-bold text-900 w-2rem text-center">2</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-900 m-0 mb-3">Payment method</h3>
                    
                    <div className="border-1 surface-border border-round p-3 bg-gray-50 flex flex-col gap-3">
                        {paymentOptions.map((opt) => (
                            <div key={opt} className="flex align-items-center">
                                <RadioButton 
                                    inputId={opt} 
                                    name="payment" 
                                    value={opt} 
                                    onChange={(e) => setPayment(e.value)} 
                                    checked={payment === opt} 
                                />
                                <label htmlFor={opt} className="ml-2 font-medium text-900 text-sm cursor-pointer">
                                    {opt === "UPI" && "Other UPI Apps"}
                                    {opt === "Card" && "Credit or debit card"}
                                    {opt === "Cash" && "Cash on Delivery/Pay on Delivery"}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Divider className="my-2" />

            {/* Step 3: Review items */}
            <div className="flex gap-4 mb-4">
                <div className="text-xl font-bold text-900 w-2rem text-center">3</div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-900 m-0 mb-3">Review items and delivery</h3>
                    
                    <div className="border-1 surface-border border-round p-4 bg-white flex flex-col gap-4">
                        {cart.map((item, index) => {
                            const discountedPrice = calculateDiscountPrice(item.price, item.discount);
                            return (
                                <div key={index} className="flex gap-4">
                                    <img
                                        src={`data:image/jpeg;base64,${item.product_images[0]}`}
                                        alt={item.product_name}
                                        className="w-5rem h-5rem object-contain"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-base text-900 m-0 mb-1 line-height-2">{item.product_name}</p>
                                        <div className="flex align-items-center gap-2 mb-1">
                                            <span className="font-bold text-red-700 text-lg">₹{discountedPrice}</span>
                                            {item.discount > 0 && <span className="text-500 line-through text-xs">₹{item.price}</span>}
                                        </div>
                                        <p className="text-sm text-700 m-0"><strong>Qty: {item.quantity}</strong></p>
                                        <p className="text-xs text-500 m-0 mt-1">Sold by: Bombay Luggage</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

          </div>

          {/* Right Column: Order Summary (Amazon Style) */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 border-1 surface-border border-round p-4 bg-white">
                
                {/* Yellow Amazon Button */}
                <Button
                    onClick={handleCheckout}
                    disabled={loading || !user.firstname}
                    label={loading ? "Processing..." : "Place your order"}
                    icon={loading ? "pi pi-spin pi-spinner" : ""}
                    className="w-full mb-3 text-900 font-medium text-sm py-2 shadow-1 border-400"
                    style={{ background: '#ffd814', borderColor: '#fcd200', borderRadius: '8px' }}
                />
                
                <p className="text-xs text-center text-600 line-height-2 m-0 mb-3">
                    By placing your order, you agree to Bombay Luggage's privacy notice and conditions of use.
                </p>
                
                <Divider />

                <h3 className="text-lg font-bold text-900 m-0 mb-3">Order Summary</h3>
                
                <div className="text-sm text-800 flex flex-col gap-2">
                    <div className="flex justify-content-between">
                        <span>Items:</span>
                        <span>₹{totalMRP}</span>
                    </div>
                    <div className="flex justify-content-between">
                        <span>Delivery:</span>
                        <span>₹0</span>
                    </div>
                    {totalDiscount > 0 && (
                        <div className="flex justify-content-between text-green-700">
                            <span>Promotion Applied:</span>
                            <span>-₹{totalDiscount}</span>
                        </div>
                    )}
                </div>

                <Divider />

                <div className="flex justify-content-between align-items-center mb-4">
                    <span className="text-lg font-bold text-red-700">Order Total:</span>
                    <span className="text-xl font-bold text-red-700">₹{total}</span>
                </div>

                {totalDiscount > 0 && (
                    <div className="bg-green-50 text-green-800 text-xs p-2 font-medium">
                        Your Savings: ₹{totalDiscount} ({Math.round((totalDiscount/totalMRP)*100)}%)
                    </div>
                )}
            </div>
          </div>

        </div>

      {/* Dummy Payment Gateway Modal */}
      <Dialog 
        header="Secure Payment Gateway" 
        visible={showPaymentModal} 
        style={{ width: '90vw', maxWidth: '450px' }} 
        onHide={() => { if(paymentStep === 0) setShowPaymentModal(false); }}
        draggable={false}
        className="payment-modal"
      >
        <div className="flex flex-column align-items-center justify-content-center p-3 text-center min-h-[300px]">
            {paymentStep === 0 && (
                <div className="w-full animation-fadein">
                    {payment === "UPI" ? (
                        <div>
                            <i className="pi pi-qrcode text-8xl text-900 mb-3 border-1 surface-border p-3 border-round-xl"></i>
                            <h3 className="m-0 mb-1 text-900">Scan to Pay ₹{total}</h3>
                            <p className="text-500 text-sm mb-4">Open any UPI app like GPay, PhonePe, or Paytm and scan the QR code.</p>
                            
                            <Divider align="center"><span className="text-500 text-sm">OR</span></Divider>
                            
                            <div className="p-inputgroup mt-4 mb-4">
                                <span className="p-inputgroup-addon"><i className="pi pi-mobile"></i></span>
                                <InputText placeholder="Enter UPI ID (e.g. 9876543210@ybl)" />
                            </div>
                            
                            <Button label="Pay Now" onClick={processPayment} severity="success" className="w-full font-bold border-none py-3 text-lg shadow-2 text-white" style={{ backgroundColor: "#4f46e5" }} />
                        </div>
                    ) : (
                        <div className="text-left">
                            <div className="flex justify-content-between align-items-center mb-4">
                                <h3 className="m-0 text-900">Card Details</h3>
                                <div className="flex gap-2">
                                    <i className="pi pi-credit-card text-2xl text-blue-600"></i>
                                </div>
                            </div>
                            <div className="flex flex-column gap-3 mb-4">
                                <div className="flex flex-column gap-1">
                                    <label className="text-sm font-semibold text-700">Card Number</label>
                                    <InputText placeholder="0000 0000 0000 0000" keyfilter="int" maxLength={16} />
                                </div>
                                <div className="flex flex-column gap-1">
                                    <label className="text-sm font-semibold text-700">Name on Card</label>
                                    <InputText placeholder="John Doe" />
                                </div>
                                <div className="grid">
                                    <div className="col-6 flex flex-column gap-1">
                                        <label className="text-sm font-semibold text-700">Expiry (MM/YY)</label>
                                        <InputText placeholder="MM/YY" maxLength={5} />
                                    </div>
                                    <div className="col-6 flex flex-column gap-1">
                                        <label className="text-sm font-semibold text-700">CVV</label>
                                        <InputText placeholder="123" keyfilter="int" maxLength={3} type="password" />
                                    </div>
                                </div>
                            </div>
                            <Button label={`Pay ₹${total}`} onClick={processPayment} severity="success" className="w-full font-bold border-none py-3 text-lg shadow-2 text-white" style={{ backgroundColor: "#2563eb" }} />
                        </div>
                    )}
                </div>
            )}

            {paymentStep === 1 && (
                <div className="flex flex-column align-items-center justify-content-center py-6 animation-fadein">
                    <i className="pi pi-spin pi-spinner text-6xl text-blue-500 mb-4"></i>
                    <h2 className="m-0 text-900 mb-2">Processing Payment</h2>
                    <p className="text-500 text-sm">Please do not close this window or press back.</p>
                </div>
            )}

            {paymentStep === 2 && (
                <div className="flex flex-column align-items-center justify-content-center py-6 animation-fadein">
                    <div className="w-6rem h-6rem border-circle bg-green-100 flex align-items-center justify-content-center mb-4 shadow-1">
                        <i className="pi pi-check text-5xl text-green-500"></i>
                    </div>
                    <h2 className="m-0 text-900 mb-2">Payment Successful!</h2>
                    <p className="text-500 text-sm">Redirecting to invoice...</p>
                </div>
            )}
        </div>
      </Dialog>
    </div>
  );
}

export default Checkout;

