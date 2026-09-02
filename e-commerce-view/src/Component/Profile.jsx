import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import authService from "../Services/authService";
import { motion } from "framer-motion";
import '../assets/profile.css';

// PrimeReact Imports
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { Chip } from 'primereact/chip';

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
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

  const [loading, setLoading] = useState(true);

  // Safely decode token
  const token = localStorage.getItem("token");
  let decoded = null;
  if (token) {
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  useEffect(() => {
    if (!decoded?.sub) return;

    authService.ReadProfileByEmail(decoded.sub)
      .then((response) => {
        const data = response.data;
        localStorage.setItem("role", data.role);
        if (data.img) {
            localStorage.setItem("avtar", data.img);
        }

        setUser({
          id: data.id,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          img: data.img,
          mobile: data.mobile,
          gender: data.gender,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          pincode: data.pincode
        });
        
        // Notify navbar avatar
        window.dispatchEvent(
          new CustomEvent("avatarUpdated", { detail: data.img })
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [decoded?.sub]);

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex align-items-center p-3 surface-50 border-round-xl mb-3 shadow-1 transition-all hover:shadow-2" style={{ transition: '0.3s' }}>
      <div className="flex align-items-center justify-content-center bg-white border-circle shadow-1 mr-3" style={{ width: '40px', height: '40px', color: 'var(--primary-color)' }}>
        <i className={`pi ${icon} text-xl`}></i>
      </div>
      <div className="flex flex-column flex-grow-1">
        <span className="text-500 text-sm mb-1 font-medium">{label}</span>
        <span className="text-900 font-semibold">{value || <span className="text-400 font-italic">Not provided</span>}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-content-center align-items-center py-6 px-4 relative overflow-hidden" 
         style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      
      {/* Decorative Background Elements */}
      <div className="absolute border-circle bg-primary opacity-10" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', filter: 'blur(50px)' }}></div>
      <div className="absolute border-circle bg-blue-500 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', right: '-50px', filter: 'blur(40px)' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-40rem z-1"
      >
        <Card className="shadow-6 border-round-2xl overflow-hidden p-0">
          
          {/* Banner Image */}
          <div className="w-full relative" style={{ height: '160px', background: 'linear-gradient(120deg, var(--primary-color) 0%, #818cf8 100%)' }}>
            <div className="absolute top-0 right-0 p-3">
               <Button
                  onClick={() => navigate(`/updateprofile/${user.id}`)}
                  label="Edit Profile"
                  icon="pi pi-user-edit"
                  className="p-button-rounded p-button-secondary bg-white text-primary border-none shadow-2"
                />
            </div>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-column align-items-center relative" style={{ marginTop: '-60px' }}>
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="p-1 surface-0 border-circle shadow-4"
            >
              {user.img ? (
                <img
                  src={`data:image/jpeg;base64,${user.img}`}
                  alt="User Avatar"
                  className="w-8rem h-8rem border-circle object-cover"
                />
              ) : (
                <Avatar icon="pi pi-user" size="xlarge" shape="circle" className="w-8rem h-8rem text-5xl bg-primary-100 text-primary" />
              )}
            </motion.div>

            <h1 className="text-3xl font-bold mt-3 mb-1 text-900">
              {loading ? "Loading..." : `${user.firstname} ${user.lastname}`}
            </h1>
            
            {user.role && (
                <Chip label={user.role.toUpperCase()} icon="pi pi-star-fill" className="bg-primary-50 text-primary-700 text-sm font-semibold mb-3 px-3" />
            )}
            
            <p className="text-600 m-0 flex align-items-center">
              <i className="pi pi-envelope mr-2"></i> {user.email}
            </p>
          </div>

          <Divider className="my-4" />

          {/* Details Grid */}
          <div className="px-4 pb-4">
            <h3 className="text-xl font-semibold text-800 mb-4 border-left-3 border-primary pl-2">Personal Information</h3>
            
            <div className="grid">
              <div className="col-12 md:col-6">
                <InfoItem icon="pi-phone" label="Mobile Number" value={user.mobile} />
              </div>
              <div className="col-12 md:col-6">
                <InfoItem icon="pi-users" label="Gender" value={user.gender} />
              </div>
              <div className="col-12 md:col-12">
                <InfoItem 
                    icon="pi-map-marker" 
                    label="Address" 
                    value={`${user.addressLine1} ${user.addressLine2 ? ', ' + user.addressLine2 : ''}`} 
                />
              </div>
              <div className="col-12 md:col-4">
                <InfoItem icon="pi-building" label="City" value={user.city} />
              </div>
              <div className="col-12 md:col-4">
                <InfoItem icon="pi-map" label="State" value={user.state} />
              </div>
              <div className="col-12 md:col-4">
                <InfoItem icon="pi-compass" label="Pincode" value={user.pincode} />
              </div>
            </div>
          </div>
          
        </Card>
      </motion.div>
    </div>
  );
}

export default Profile;
