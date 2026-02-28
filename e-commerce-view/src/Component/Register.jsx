import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

import axios from "axios";

export default function Register() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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

  const registerUser = async () => {
    try {
      if (formData.password !== formData.confirmPassword) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Passwords do not match",
        });
        return;
      }

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
    <div className="w-full  justify-content-center align-items-center min-h-screen p-3">
      <Toast ref={toast} />

      <Card className="p-1">
        <h1 className="text-center text-3xl font-bold mb-4 border-1">Create Account</h1>

        {/* Personal Info */}

        <h3 className="text-lg font-semibold text-center ">Personal Information</h3>
        <div className="grid border-1 border-round-xl p-3">
          <div className="col-12 md:col-6">
            <label>First Name</label>
            <InputText
              className="w-full"
              value={formData.firstName}
              onChange={(e) => handleChange(e, "firstName")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Last Name</label>
            <InputText
              className="w-full"
              value={formData.lastName}
              onChange={(e) => handleChange(e, "lastName")}
            />
          </div>

          <div className="col-12">
            <label>Email</label>
            <InputText
              className="w-full"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
            />
          </div>

          <div className="col-12">
            <label>Mobile</label>
            <InputText
              className="w-full"
              value={formData.mobile}
              onChange={(e) => handleChange(e, "mobile")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Password</label>
            <Password
              className="w-full"
              value={formData.password}
              onChange={(e) => handleChange(e, "password")}
              toggleMask
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Confirm Password</label>
            <Password
              className="w-full"
              value={formData.confirmPassword}
              onChange={(e) => handleChange(e, "confirmPassword")}
              toggleMask
            />
          </div>
        </div>

        {/* Address */}

        <h3 className="text-lg font-semibold mt-2 text-center ">Address Information</h3>
        <div className="grid border-1 border-round-xl p-3 ">
          <div className="col-12">
            <label>Address Line 1</label>
            <InputText
              className="w-full"
              value={formData.addressLine1}
              onChange={(e) => handleChange(e, "addressLine1")}
            />
          </div>

          <div className="col-12">
            <label>Address Line 2</label>
            <InputText
              className="w-full"
              value={formData.addressLine2}
              onChange={(e) => handleChange(e, "addressLine2")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>City</label>
            <InputText
              className="w-full"
              value={formData.city}
              onChange={(e) => handleChange(e, "city")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>State</label>
            <InputText
              className="w-full"
              value={formData.state}
              onChange={(e) => handleChange(e, "state")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Pincode</label>
            <InputText
              className="w-full"
              value={formData.pincode}
              onChange={(e) => handleChange(e, "pincode")}
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Country</label>
            <InputText
              className="w-full"
              value={formData.country}
              onChange={(e) => handleChange(e, "country")}
            />
          </div>
        </div>

        {/* Profile */}
        <h3 className=" text-lg font-semibold mt-2 text-center ">Profile Info</h3>

        <div className="grid border-1 border-round-xl p-3 mb-4">
          <div className="col-12 md:col-6">
            <label>Gender</label>
            <Dropdown
              className="w-full"
              value={formData.gender}
              options={genderOptions}
              onChange={(e) => handleChange(e, "gender")}
              placeholder="Select Gender"
            />
          </div>

          <div className="col-12 md:col-6">
            <label>Date of Birth</label>
            <Calendar
              className="w-full"
              value={formData.dob}
              onChange={(e) => handleChange(e, "dob")}
              showIcon
            />
          </div>

          <div className="col-12">
            <label>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <Button
          label="Register"
          icon="pi pi-user-plus"
          className="w-full mt-3"
          onClick={registerUser}
        />

      </Card>
    </div>
  );
}