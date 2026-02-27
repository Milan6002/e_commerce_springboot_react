import { useState, useRef } from "react";
import { register } from "../Services/authService";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FloatLabel } from "primereact/floatlabel";

function Register() {

  const toast = useRef(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setUserData({
      ...userData,
      image: file,
    });

    const reader = new FileReader();

    reader.onload = () => setPreview(reader.result);

    reader.readAsDataURL(file);
  };

const handleSubmit = async () => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // NAME VALIDATION
  if (!userData.name.trim()) {

    toast.current.show({
      severity: "warn",
      summary: "Validation Error",
      detail: "Name is required",
    });

    return;
  }

  // EMAIL VALIDATION
  if (!userData.email.trim()) {

    toast.current.show({
      severity: "warn",
      summary: "Validation Error",
      detail: "Email is required",
    });

    return;
  }

  if (!emailRegex.test(userData.email)) {

    toast.current.show({
      severity: "warn",
      summary: "Validation Error",
      detail: "Enter valid email",
    });

    return;
  }

  // PASSWORD VALIDATION
  if (!userData.password) {

    toast.current.show({
      severity: "warn",
      summary: "Validation Error",
      detail: "Password is required",
    });

    return;
  }

  if (userData.password.length < 6) {

    toast.current.show({
      severity: "warn",
      summary: "Validation Error",
      detail: "Password must be at least 6 characters",
    });

    return;
  }

  // IMAGE REQUIRED VALIDATION
  // if (!userData.image) {

  //   toast.current.show({
  //     severity: "error",
  //     summary: "Image Required",
  //     detail: "Please upload profile image",
  //   });

  //   return;
  // }

  try {

    setLoading(true);

    const res = await register(userData);

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: res.data,
    });

    setTimeout(() => navigate("/login"), 1500);

  } catch {

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Registration failed",
    });

  } finally {

    setLoading(false);

  }

};

  return (

    <div
      className=" px-3"
      style={{
        minHeight: "100vh",
        display: "flex",  
        justifyContent: "center",
        alignItems: "center",
        background: "url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwYmFnc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60) no-repeat center center/cover",
      }}
    >

      <Toast ref={toast} />

      <Card
        className="shadow-8 border-round-3xl w-100 opacity-80"
    
      >

        {/* Header */}

        <div className="text-center ">

          <h1 className="font-bold mb-10 text-3xl">
            Create Account
          </h1>

       

        </div>


        {/* Profile Image */}

        {/* <div className="flex justify-content-center mb-4">

          <div style={{ position: "relative" }}>

            <div
              className="border-circle shadow-4"
              style={{
                width: "110px",
                height: "110px",
                overflow: "hidden",
                background: "#ffffff30",
                border: "3px solid white",
              }}
            >

              {preview ? (

                <img
                  src={preview}
                  alt="profile"
                  width="100%"
                  height="100%"
                  style={{ objectFit: "cover" }}
                />

              ) : (

                <i
                  className="pi pi-user text-white-alpha-70"
                  style={{
                    fontSize: "3rem",
                    lineHeight: "110px",
                    width: "100%",
                    textAlign: "center",
                  }}
                ></i>

              )}

            </div>

            <label
              htmlFor="imageUpload"
              className="shadow-3"
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                background: "white",
                borderRadius: "50%",
                padding: "8px",
                cursor: "pointer",
              }}
            >

              <i className="pi pi-camera text-indigo-500"></i>

            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImage}
            />

          </div>

        </div> */}


        {/* Name */}

        <div className="mb-9">

          <FloatLabel>

            <InputText
              id="name"
              name="name"
              value={userData.name}
              onChange={handleChange}
              className="w-full"
            />

            <label htmlFor="name">Full Name</label>

          </FloatLabel>

        </div>


        {/* Email */}

        <div className="mb-9">

          <FloatLabel>

            <InputText
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className="w-full"
            />

            <label htmlFor="email">Email</label>

          </FloatLabel>

        </div>


        {/* Password */}

        <div className="mb-9">

          <FloatLabel>

            <Password
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              // feedback={false}
              toggleMask
              className="w-full"
            />

            <label htmlFor="password">Password</label>

          </FloatLabel>

        </div>


        {/* Button */}

        <Button
          label="Create Account"
          icon="pi pi-user-plus"
          loading={loading}
          onClick={handleSubmit}
          className="w-full p-3 font-bold border-none"
          style={{
            background: "linear-gradient(135deg,#6366f1,#9333ea)",
          }}
        />


        {/* Login */}

        <div className="text-center mt-4 text-white">

          Already have account?

          <span
            className="ml-2 cursor-pointer font-bold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>

        </div>

      </Card>

    </div>

  );
}

export default Register;