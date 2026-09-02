
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Admin from "./Component/Admin";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Categories from "./Component/Categories";
import AddCategory from "./Component/AddCategory";
import UpdateCategory from "./Component/UpdateCategory";
import Products from "./Component/Products";
import AddProductForm from "./Component/AddProductForm";
import UpdateProductForm from "./Component/UpdateProductForm";
import Login from "./Component/Login";
import Register from "./Component/Register";
import UpdateProfile from "./Component/UpdateProfile";
import ProtectedRoute from "./Component/ProtectedRoute";
import Profile from "./Component/Profile";
import NotFound from "./Component/NotFound";
import Shop from "./Component/Shop";
import ViewProduct from "./Component/ViewProduct";
import Cart from "./Component/Cart";
import BulkOrder from "./Component/BulkOrder";
import Footer from "./Component/Footer";
import Brands from "./Component/Brands";
import Luggage from "./Component/Luggage";
import Backpack from "./Component/Backpack";
import AddType from "./Component/AddType";
import Type from "./Component/Type";
import UpdateType from "./Component/UpdateType";
import Duffle from "./Component/Duffle";
import AdminUsers from "./Component/AdminUsers";
import Purchase from "./Component/Purchase";
import Sales from "./Component/Sales";
import Checkout from "./Component/Checkout";
import Invoice from "./Component/Invoice";
import AdminInvoice from "./Component/AdminInvoice";
import AdminInvoiceList from "./Component/AdmininvoiceList";
import AdminSettings from "./Component/AdminSettings";
import AdminProfile from "./Component/AdminProfile";
import AdminLayout from "./Component/AdminLayout";
import AdminBulkOrders from "./Component/AdminBulkOrders";
import ForgotPassword from "./Component/otp"; // path check karo
import Supplier from "./Component/Supplier";
import Warehouse from "./Component/Warehouse";
import Payment from "./Component/Payment";
import Feedback from "./Component/Feedback";
import AiChatbot from "./Component/AiChatbot";
import SalesReport from "./Component/SalesReport";

function App() {
  const user_role = localStorage.getItem("role");

  return (
    <>
      <HashRouter>
        <Navbar />

        <Routes>
          <Route index path="/" element={<Home />} />

          {user_role == "ROLE_ADMIN" ? (
            <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route
                path="/Admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/AddType"
                element={
                  <ProtectedRoute>
                    <AddType />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Type"
                element={
                  <ProtectedRoute>
                    <Type />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/UpdateType/:id"
                element={
                  <ProtectedRoute>
                    <UpdateType />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/AddCategory"
                element={
                  <ProtectedRoute>
                    <AddCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/UpdateCategory/:id"
                element={
                  <ProtectedRoute>
                    <UpdateCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/Products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/AddProduct"
                element={
                  <ProtectedRoute>
                    <AddProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/UpdateProduct/:id"
                element={
                  <ProtectedRoute>
                    <UpdateProductForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/purchase" element={<Purchase />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/supplier" element={<Supplier />} />
              <Route path="/warehouse" element={<Warehouse />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/admin/invoices" element={<AdminInvoiceList />} />
              <Route path="/admin/invoice/:id" element={<AdminInvoice />} />
              <Route path="/admin/reports" element={<SalesReport />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
              <Route path="/admin/bulk-orders" element={<AdminBulkOrders />} />
                            <Route path="/admin/feedback" element={<Feedback />} />
            </Route>
          ) : (
            <Route path="/Admin" element={<Navigate to="/" />} />
          )}

          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/register" element={<Register />} />

          <Route path="/updateprofile/:id" element={<UpdateProfile />} />

          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Duffle"
            element={
              <ProtectedRoute>
                <Duffle />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/BulkOrder"
            element={
              <ProtectedRoute>
                <BulkOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewproduct/:id"
            element={
              <ProtectedRoute>
                <ViewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Brands"
            element={
              <ProtectedRoute>
                <Brands />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Luggage"
            element={
              <ProtectedRoute>
                <Luggage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Backpack"
            element={
              <ProtectedRoute>
                <Backpack />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout" element={<ProtectedRoute>
            <Checkout />
          </ProtectedRoute>} />
          <Route path="/invoice" element={<ProtectedRoute>
            <Invoice />
          </ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute>
            <Feedback />
          </ProtectedRoute>} />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <AiChatbot />
        <Footer />
      </HashRouter>
    </>
  );
}

export default App;
