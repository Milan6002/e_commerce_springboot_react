import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LogoBg from "../assets/Img/LogoRemovedBg.png";

function NavbarAdmin() {
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

    navigate("/ecommerce/login");
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
  return (
    <nav className=" bg-black">
      <div className="  px-2 sm:px-6 lg:px-8">
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
            <div className="flex shrink-0 items-center">
              <img className="h-8 w-auto" src={LogoBg} alt="Your Company" />
              <a
                className="text-xl font-extrabold font-monospace tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white"
                onClick={() => navigate("/ecommerce/Home")}
              >
                iseOnix
              </a>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <a
                  onClick={() => navigate("/ecommerce")}
                  className="hover:cursor-pointer rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  aria-current="page"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Shop
                </a>
                <a
                  onClick={() => navigate("/ecommerce/Categories")}
                  className="hover:cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Categories
                </a>
                <a
                  onClick={() => navigate("/ecommerce/Products")}
                  className="hover:cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Products
                </a>
                <a
                  onClick={() => navigate("/ecommerce/admin")}
                  className="hover:cursor-pointer rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Admin Pannel
                </a>
              </div>
            </div>
          </div>

          {/* Notifications and profile dropdown */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>

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
                    onClick={() => navigate("/ecommerce/profile")}
                    className="hover:cursor-pointer block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  {!localStorage.getItem("token") && (
                    <a
                      onClick={() => navigate("/ecommerce/login")}
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
              onClick={() => navigate("/ecommerce")}
              className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              aria-current="page"
            >
              Home
            </a>
            <a
              onClick={() => navigate("/ecommerce/shop")}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Shop
            </a>
            <a
              onClick={() => navigate("/ecommerce/Categories")}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Categories
            </a>
            <a
              onClick={() => navigate("/ecommerce/Products")}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Products
            </a>
            <a
              onClick={() => navigate("/ecommerce/admin")}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Admin Pannel
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavbarAdmin;
