import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { login } from "../Services/authService";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { FloatLabel } from "primereact/floatlabel";
import 'primereact/resources/themes/lara-light-blue/theme.css'; // or your chosen theme
import 'primereact/resources/primereact.min.css';



function Login() {
 const [loginData, setLoginData] = useState({ email: "", password: "" });
   const [error, setError] = useState("");
     const navigate = useNavigate();
 const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(loginData);
      if (response.data === "No Record Found") {
        toast.error(response.data + " Register First");
        setTimeout(() => {
          navigate("/register");
        }, 2500);
        return;
      } else if (response.data === "Invalid credentials") {
        toast.error(response.data);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
        return;
      }
      toast.success("Login Successfully");
      setTimeout(() => {
        localStorage.setItem("token", response.data);
        navigate("/profile");
      }, 2500);
    } catch (err) {
      console.log(err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4">
       <ToastContainer />
      <div className="flex w-full max-w-5xl shadow-2xl rounded-3xl overflow-hidden">
        {/* Left Section */}
        <div className="w-1/2 bg-blue-600 text-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-4">Simplify management With Our dashboard.</h1>
          <p className="mb-8 text-lg">Simplify your e-commerce management with our user-friendly admin dashboard.</p>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/coffee-shop-staff-5520513-4608771.png"
            alt="Characters"
            className="w-full h-auto"
          />
        </div>

        {/* Right Section */}
        <div className="w-1/2 bg-white p-10 flex flex-col">
          <div className="text-center mb-8">
            <span className="text-3xl font-semibold text-blue-600">Login Page</span>
          </div>
          <h2 className="text-3xl mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">Please login to your account</p>


          <div className="grid grid-cols-1 gap-9 px-4 md:px-10">
            <div className="card flex justify-center ">
              <FloatLabel className="w-full">
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleChange}
                  className="w-full"
                />
                <label htmlFor="email">Email</label>
              </FloatLabel>
            </div>

            <div className="card flex justify-center mb-3">
              <FloatLabel className="w-full">
                <InputText
                  id="password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleChange}
                  className="w-full"
                />
                <label htmlFor="password">password</label>
              </FloatLabel>
            </div>
          </div>


          <div className="text-right text-sm text-blue-600 mb-4 cursor-pointer hover:underline">Forgot Password?</div>

          <Button label="Login" onClick={handleSubmit} className="w-full bg-blue-600 border-none" />

          <Divider align="center" className="my-4">Or Login With</Divider>

          <div className="flex justify-between gap-3">
            <Button icon="pi pi-google" label="Google" className="w-1/2 border-gray-300 text-black" outlined />
            <Button icon="pi pi-facebook" label="Facebook" className="w-1/2 border-gray-300 text-black" outlined />
          </div>

          <p className="mt-6 text-sm text-center">
            Don’t have an account? <span  onClick={() => navigate("/register")} className="text-blue-600 cursor-pointer hover:underline">Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
