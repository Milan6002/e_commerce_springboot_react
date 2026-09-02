import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Divider } from "primereact/divider";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import axios from "axios";

const isJwtToken = (value) => {
  if (typeof value !== "string") return false;
  const parts = value.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

export default function Register() {

  const toast = useRef(null);
  const navigate = useNavigate();

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    gender: "",
    dob: null,
  });

  const [image, setImage] = useState(null);

  const handleChange = (e, name) => {
    const value = e.target ? e.target.value : e.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const processToken = (data) => {
      const token = data.token || data;

      if (!token || !isJwtToken(token)) {
        const backendMessage = typeof data === "string" ? data : data?.message || "Registration failed";
        toast.current?.show({ severity: 'error', summary: 'Error', detail: backendMessage, life: 3000 });
        return;
      }

      localStorage.setItem("token", token);
      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch (err) {
        localStorage.removeItem("token");
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Invalid token', life: 3000 });
        return;
      }

      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Login Successful', life: 3000 });
      setTimeout(() => {
        if (decoded.role === "ROLE_ADMIN") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 1200);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post("http://localhost:8081/api/auth/google", {
        token: credentialResponse.credential
      });
      const data = response.data;
      if (!data || data === "Invalid Google Token" || (typeof data === 'string' && data.startsWith("Error"))) {
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google signin failed', life: 3000 });
          return;
      }
      if (data === "Your account is not approved by admin") {
          toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Your account is not approved by admin', life: 3000 });
          return;
      }
      processToken(data);
    } catch (err) {
      console.log(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google signin failed', life: 3000 });
    }
  };

  const handleGoogleError = () => {
    toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Google Signin was unsuccessful', life: 3000 });
  };

  const validateForm = () => {

    if (!formData.firstname || !formData.lastname) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "First & Last name required" });
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Enter valid email" });
      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(formData.mobile)) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Mobile must be 10 digits" });
      return false;
    }

    if (formData.password.length < 6) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Password minimum 6 characters" });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.current.show({ severity: "error", summary: "Error", detail: "Passwords do not match" });
      return false;
    }

    const pinPattern = /^[0-9]{6}$/;
    if (formData.pincode && !pinPattern.test(formData.pincode)) {
      toast.current.show({ severity: "warn", summary: "Validation", detail: "Pincode must be 6 digits" });
      return false;
    }

    return true;
  };

  const registerUser = async () => {

    if (!validateForm()) return;

    try {

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });

      if (image) {
        data.append("image", image);
      }

      await axios.post("http://localhost:8081/api/auth/register", data);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration Successful",
      });

      setTimeout(() => navigate("/login"), 1500);

    } catch (error) {

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Registration Failed",
      });

    }
  };

  return (
    <div className="w-full justify-content-center align-items-center min-h-screen p-3">

      <Toast ref={toast} />

      <Card className="p-4 ">

        <h1 className="text-center text-3xl font-bold mb-4">
          Create Account
        </h1>

        {/* Personal Info */}

        <h3 className="text-lg font-semibold text-center">
          Personal Information
        </h3>

        <div className="grid border-1 border-round-xl p-3">

          <div className="col-12 md:col-6">
            <label>First Name</label>
            <InputText className="w-full"
              value={formData.firstname}
              onChange={(e) => handleChange(e, "firstname")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Last Name</label>
            <InputText className="w-full"
              value={formData.lastname}
              onChange={(e) => handleChange(e, "lastname")}
            />
          </div>

          <div className="col-12">
            <label>Email</label>
            <InputText className="w-full"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </div>

          <div className="col-12">
            <label>Mobile</label>
            <InputText className="w-full"
              value={formData.mobile}
              onChange={(e) => handleChange(e, "mobile")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Password</label>
            <Password className="w-full"
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
              toggleMask
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Confirm Password</label>
            <Password className="w-full"
              value={formData.confirmPassword}
              onChange={(e) => handleChange(e, "confirmPassword")}
              toggleMask
            />
          </div>

        </div>

        {/* Address */}

        <h3 className="text-lg font-semibold mt-4 text-center">
          Address Information
        </h3>

        <div className="grid border-1 border-round-xl p-3">

          <div className="col-12">
            <label>Address Line 1</label>
            <InputText className="w-full"
              value={formData.addressLine1}
              onChange={(e) => handleChange(e, "addressLine1")}
            />
          </div>

          <div className="col-12">
            <label>Address Line 2</label>
            <InputText className="w-full"
              value={formData.addressLine2}
              onChange={(e) => handleChange(e, "addressLine2")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>City</label>
            <InputText className="w-full"
              value={formData.city}
              onChange={(e) => handleChange(e, "city")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>State</label>
            <InputText className="w-full"
              value={formData.state}
              onChange={(e) => handleChange(e, "state")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Pincode</label>
            <InputText className="w-full"
              value={formData.pincode}
              onChange={(e) => handleChange(e, "pincode")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Country</label>
            <InputText className="w-full"
              value={formData.country}
              onChange={(e) => handleChange(e, "country")}
            />
          </div>

        </div>

        {/* Profile */}

        <h3 className="text-lg font-semibold mt-4 text-center">
          Profile Info
        </h3>

        <div className="grid border-1 border-round-xl p-3">

          <div className="col-12 md:col-6">
            <label>Gender</label>
            <Dropdown className="w-full"
              value={formData.gender}
              options={genderOptions}
              onChange={(e) => handleChange(e, "gender")}
              placeholder="Select Gender"
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Date of Birth</label>
            <Calendar className="w-full"
              value={formData.dob}
              onChange={(e) => handleChange(e, "dob")}
              showIcon
            />
          </div>

          <div className="col-12">
            <label>Profile Image</label>
            <input type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

        </div>

        <Button
          label="Register"
          icon="pi pi-user-plus"
          className="w-full mt-4"
          onClick={registerUser}
        />
        
        <Divider align="center" className="my-6">
            Or Register with
        </Divider>

        <div className="flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="pill"
          />
        </div>

      </Card>

    </div>
  );
}