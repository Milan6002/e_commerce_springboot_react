import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../Services/authService";
import { jwtDecode } from "jwt-decode";
import { Toast } from "primereact/toast";

// PrimeReact Imports
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';

function UpdateProfile() {

  const navigate = useNavigate();
  const { id } = useParams();
  const toast = useRef(null);

  const [user, setUser] = useState({
    id: id,
    firstname: "",
    lastname: "",
    email: "",
    img: null,
    mobile: "",
    gender: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const decodeToken = jwtDecode(localStorage.getItem("token"));

  useEffect(() => {

    const fetchData = async () => {
      try {

        const response = await authService.ReadProfileByEmail(decodeToken.sub);
        setUser(response.data);

        if (response.data.img) {
          setPreviewImage(`data:image/jpeg;base64,${response.data.img}`);
        }

      } catch (error) {

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Failed to load profile data",
        });

      }
    };

    fetchData();

  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setUser({ ...user, image: file });
      };

      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {

    if (!user.firstname || !user.lastname) {

      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "First name and Last name required",
      });

      return false;
    }

    const mobilePattern = /^[0-9]{10}$/;

    if (user.mobile && !mobilePattern.test(user.mobile)) {

      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "Mobile must be 10 digits",
      });

      return false;
    }

    const pinPattern = /^[0-9]{6}$/;

    if (user.pincode && !pinPattern.test(user.pincode)) {

      toast.current.show({
        severity: "warn",
        summary: "Validation",
        detail: "Pincode must be 6 digits",
      });

      return false;
    }

    return true;
  };

  const handleUpdateUser = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {

      await authService.Updateprofile(id, user);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Profile Updated Successfully",
      });

      setTimeout(() => {
        navigate("/profile");
      }, 1500);

    } catch (err) {

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to update profile",
      });

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gray-50 flex justify-content-center align-items-center p-4">

      <Toast ref={toast} />

      <div className="w-full max-w-30rem">
        <Card className="shadow-4 border-round-2xl">

          <h1 className="text-3xl font-bold text-center mb-5 text-gray-800 m-0">
            Update Profile
          </h1>

          <form onSubmit={handleUpdateUser} className="flex flex-column gap-3">

            <div className="flex flex-column gap-2">
              <label htmlFor="firstname" className="font-semibold text-gray-700">First Name</label>
              <InputText
                id="firstname"
                name="firstname"
                value={user.firstname}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="lastname" className="font-semibold text-gray-700">Last Name</label>
              <InputText
                id="lastname"
                name="lastname"
                value={user.lastname}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
              <InputText
                id="email"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full"
                required
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="mobile" className="font-semibold text-gray-700">Mobile</label>
              <InputText
                id="mobile"
                type="text"
                name="mobile"
                value={user.mobile}
                onChange={handleChange}
                className="w-full"
                keyfilter="int"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="city" className="font-semibold text-gray-700">City</label>
              <InputText
                id="city"
                type="text"
                name="city"
                value={user.city}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="state" className="font-semibold text-gray-700">State</label>
              <InputText
                id="state"
                type="text"
                name="state"
                value={user.state}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-column gap-2">
              <label htmlFor="pincode" className="font-semibold text-gray-700">Pincode</label>
              <InputText
                id="pincode"
                type="text"
                name="pincode"
                value={user.pincode}
                onChange={handleChange}
                className="w-full"
                keyfilter="int"
              />
            </div>

            <div className="flex flex-column align-items-center mt-3">

              <label className="mb-2 font-semibold text-gray-700">Profile Image</label>

              {previewImage ? (
                <img
                  src={previewImage}
                  alt="preview"
                  className="w-8rem h-8rem border-circle border-3 border-primary shadow-2 mb-3 object-cover"
                />
              ) : (
                <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="w-8rem h-8rem text-5xl bg-primary-100 text-primary mb-3 border-2 border-primary" />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary hover:file:bg-primary-100 border-round transition-colors"
              />

            </div>

            <div className="flex gap-3 mt-4">
              <Button
                type="button"
                label="Cancel"
                icon="pi pi-times"
                severity="secondary"
                outlined
                className="w-full"
                onClick={() => navigate('/profile')}
              />
              <Button
                type="submit"
                label={loading ? "Updating..." : "Update Profile"}
                icon={loading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                className="w-full"
                disabled={loading}
              />
            </div>

          </form>

        </Card>
      </div>
    </div>
  );
}

export default UpdateProfile;