import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoBg from "../assets/Img/BL_Long_Logo.png";
import NavbarAdmin from "./NavbarAdmin";
import "../assets/Navbar.css";

const Navbar = () => {
  const user_role = localStorage.getItem("role");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("avtar")); // Initialize state with localStorage value

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("avtar");
    localStorage.removeItem("role");
    setAvatar(null); // Clear avatar state

    navigate("/login");
  };

  const handleAvatarUpdate = (event) => {
    const newAvatar = event.detail; // Get new avatar
    localStorage.setItem("avtar", newAvatar); // Save new avatar in localStorage
    setAvatar(newAvatar); // Update state
  };

  useEffect(() => {
    // Listen for avatar updates
    window.addEventListener("avatarUpdated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  return user_role === "ROLE_ADMIN" ? (
    <NavbarAdmin />
  ) : (
    <>
      <nav className=" bg-black">
        <div className="bg-black pt-4">
          <img
            className="h-32 w-auto mx-auto  rounded-lg" 
            src={LogoBg}
            alt="Bombay Luggage"
          />
        </div>

        <div className="px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Mobile menu button */}
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <svg
                    className="block w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Logo and desktop menu */}
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex gap-24 ">

                  <div className="relative group ">
                    <div
                      onClick={() => navigate("/")}
                      className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-white hover:bg-gray-700 hover:text-white"
                    >
                      Brands
                    </div>
                    <div className="absolute hidden bg-white text-black rounded-md shadow-lg group-hover:block w-48 z-20">
                      <ul>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          VIP
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          SKY BAG
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          BOMBAY LUGGAGE
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          FB
                        </li>
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                          HRX
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="relative group">
                    <div
                      onClick={() => navigate("/")}
                      className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-white hover:bg-gray-700 hover:text-white"
                    >
                      Luggage
                    </div>
                    <div className="absolute hidden bg-white text-black rounded-md shadow-lg group-hover:block z-20 ">
                      <div className="flex ">
                        <div className="w-60">
                          <h1
                            className="text-xl ms-2 uppercase  font-bold"
                            style={{ color: "#ed1c24", letterSpacing: "1px" }}
                          >
                            Categories
                          </h1>
                          <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              New Arrivals
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Bestsellers
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Soft Side Luggage
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Hard Side Luggage
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Cabin Luggage
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Check-in Luggage
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Light Weight Luggage
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Luggage Set
                            </li>
                          </ul>
                        </div>
                        <div className="w-60">
                          <h1
                            className="text-xl uppercase ms-2 font-bold"
                            style={{ color: "#ed1c24", letterSpacing: "1px" }}
                          >
                            Trip Duration
                          </h1>
                          <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Business Trips
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Short Getaways
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Long Getaways
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Weekend Trips
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Wedding Special
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Smart Ranges
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Strong Ranges
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Luggage Set
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative group">
                    <div
                      onClick={() => navigate("/")}
                      className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-white hover:bg-gray-700 hover:text-white"
                    >
                      Backpack
                    </div>
                    <div className="absolute hidden bg-white text-black rounded-md shadow-lg group-hover:block z-20">
                      <div className="flex ">

                        <div className="w-44">
                          <h1
                            className="text-xl ms-2 uppercase  font-bold"
                            style={{ color: "#ed1c24", letterSpacing: "1px" }}
                          >
                            Type
                          </h1>
                          <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              School
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              College
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Professional
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Outdoor
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Daypack
                            </li>
                          </ul>
                        </div>

                        <div className="w-44">
                          <h1
                            className="text-xl uppercase ms-2 font-bold"
                            style={{ color: "#ed1c24", letterSpacing: "1px" }}
                          >
                            Occasion
                          </h1>
                          <ul>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Adventure
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Students
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Day Trips
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    onClick={() => navigate("/shop")}
                    className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Duffle
                  </a>

                  <a
                    onClick={() => navigate("/BulkOrder")}
                    className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Bulk Order
                  </a>

                  <a
                    onClick={() => navigate("/cart")}
                    className="hover:cursor-pointer rounded-md px-3 py-2 text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Cart
                  </a>
                </div>
              </div>
            </div>

            {/* Notifications and profile dropdown */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3">
                <button
                  type="button"
                  className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      avatar
                        ? `data:image/jpeg;base64,${avatar}`
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    alt="User Avatar"
                  />
                </button>
                {dropdownOpen && (
                  <div
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <a
                      onClick={() => navigate("/profile")}
                      className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                    >
                      Your Profile
                    </a>
                    {!localStorage.getItem("token") && (
                      <a
                        onClick={() => navigate("/login")}
                        className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700"
                        role="menuitem"
                      >
                        Login
                      </a>
                    )}
                    <a
                      className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      Sign out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <a
                onClick={() => navigate("/")}
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
                aria-current="page"
              >
                Home
              </a>
              <a
                onClick={() => navigate("/shop")}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Shop
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Bulk Order
              </a>
              <a
                onClick={() => navigate("/cart")}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Cart
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
