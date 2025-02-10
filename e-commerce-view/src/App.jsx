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

function App() {
  const user_role = localStorage.getItem("role");

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route index path="/" element={<Home />} />

          {user_role == "ROLE_ADMIN" ? (
            <>
              <Route
                path="/Admin"
                element={
                  <ProtectedRoute>
                    <Admin />
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
            </>
          ) : (
            <Route path="/Admin" element={<Navigate to="/" />} />
          )}

          <Route path="/login" element={<Login />} />
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
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
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
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
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

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
