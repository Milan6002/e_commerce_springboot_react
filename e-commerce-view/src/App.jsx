import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Admin from "./Component/Admin";
import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Categories from "./Component/Categories";
import AddCategory from "./Component/AddCategory";
import UpdateCategory from "./Component/updateCategory";
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

function App() {
  const user_role = localStorage.getItem("role");

  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route index path="/ecommerce" element={<Home />} />

          {user_role == "ROLE_ADMIN" ? (
            <>
              <Route
                path="ecommerce/Admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/Categories"
                element={
                  <ProtectedRoute>
                    <Categories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/AddCategory"
                element={
                  <ProtectedRoute>
                    <AddCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/UpdateCategory/:id"
                element={
                  <ProtectedRoute>
                    <UpdateCategory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/Products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/AddProduct"
                element={
                  <ProtectedRoute>
                    <AddProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ecommerce/UpdateProduct/:id"
                element={
                  <ProtectedRoute>
                    <UpdateProductForm />
                  </ProtectedRoute>
                }
              />
            </>
          ) : (
            <Route path="ecommerce/Admin" element={<Navigate to="/ecommerce" />} />
          )}

          <Route path="ecommerce/login" element={<Login />} />

          <Route path="ecommerce/register" element={<Register />} />

          <Route path="ecommerce/updateprofile/:id" element={<UpdateProfile />} />

          <Route
            path="ecommerce/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="ecommerce/shop"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />
          <Route
            path="ecommerce/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="ecommerce/BulkOrder"
            element={
              <ProtectedRoute>
                <BulkOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="ecommerce/viewproduct/:id"
            element={
              <ProtectedRoute>
                <ViewProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="ecommerce/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ecoomerce"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
