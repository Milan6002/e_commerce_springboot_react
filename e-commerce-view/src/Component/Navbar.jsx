import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoBg from "../assets/Img/BL_Long_Logo.png";
import NavbarAdmin from "./NavbarAdmin";
import { jwtDecode } from "jwt-decode";
import authService from "../Services/authService";
import CartService from "../Services/CartService";
import axios from "axios";

// PrimeReact Imports
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { InputText } from 'primereact/inputtext';

const Navbar = () => {
  const user_role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [avatar, setAvatar] = useState(localStorage.getItem("avtar"));
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const menuLeft = useRef(null);

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    setAvatar(null);
    setCartCount(0);
    navigate("/login");
  };

  // Avatar update listener
  const handleAvatarUpdate = (event) => {
    const newAvatar = event.detail;
    localStorage.setItem("avtar", newAvatar);
    setAvatar(newAvatar);
  };

  useEffect(() => {
    window.addEventListener("avatarUpdated", handleAvatarUpdate);
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      if (!token || user_role === "ROLE_ADMIN") {
        setCartCount(0);
        return;
      }

      const decoded = jwtDecode(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) {
        setCartCount(0);
        return;
      }

      const userResponse = await authService.ReadProfileByEmail(email);
      const userId = userResponse?.data?.id;
      if (!userId) {
        setCartCount(0);
        return;
      }

      const cartResponse = await CartService.getCartID(userId);
      const cartId = cartResponse?.data?.id;
      if (!cartId) {
        setCartCount(0);
        return;
      }

      const itemsResponse = await CartService.getCartItems(cartId);
      const items = Array.isArray(itemsResponse?.data) ? itemsResponse.data : [];
      const totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Failed to load cart count", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();

    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [token, user_role]);

  const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      try {
          // Ask AI where to navigate based on the query
          const response = await axios.post("https://e-commerce-springboot-react-8i4i.onrender.com/api/ai/smart-search", { query: searchQuery });
          const route = response.data.route;
          setSearchQuery("");
          navigate(route);
      } catch (error) {
          console.error("Smart Search Error:", error);
          navigate("/shop");
      } finally {
          setIsSearching(false);
      }
  };


  if (user_role === "ROLE_ADMIN") {
    // If we are on an admin page that uses the new AdminLayout, don't show the old navbar
    const adminRoutes = ['/admin', '/Admin', '/Products', '/Categories', '/Type', '/AddType', '/AddCategory', '/AddProduct', '/Update', '/purchase', '/sales', '/supplier', '/warehouse', '/payment'];
    const isLayoutRoute = adminRoutes.some(route => location.pathname.startsWith(route));
    if (isLayoutRoute) {
        return null;
    }
    return <NavbarAdmin />;
  }


  const items = [
    { label: 'Home', icon: 'pi pi-fw pi-home', command: () => navigate('/') },
    { label: 'Shop', icon: 'pi pi-fw pi-shopping-bag', command: () => navigate('/shop') },
    { label: 'Brands', icon: 'pi pi-fw pi-tags', command: () => navigate('/brands') },
    { label: 'Luggage', icon: 'pi pi-fw pi-briefcase', command: () => navigate('/luggage') },
    { label: 'Backpack', icon: 'pi pi-fw pi-map', command: () => navigate('/backpack') },
    { label: 'Duffle', icon: 'pi pi-fw pi-box', command: () => navigate('/duffle') },
    { label: 'Bulk Order', icon: 'pi pi-fw pi-users', command: () => navigate('/bulkorder') },
    { label: 'Feedback', icon: 'pi pi-fw pi-comment', command: () => navigate('/feedback') }
  ];

  const profileItems = [
    { label: 'Profile', icon: 'pi pi-fw pi-user', command: () => navigate('/profile'), visible: !!token },
    { label: 'Login', icon: 'pi pi-fw pi-sign-in', command: () => navigate('/login'), visible: !token },
    { label: 'Logout', icon: 'pi pi-fw pi-power-off', command: handleLogout, visible: !!token }
  ];

  const start = (
    <img
      alt="logo"
      src={LogoBg}
      onClick={() => navigate("/")}
      className="h-3rem md:h-4rem mr-4 ml-2 cursor-pointer transition-transform transition-duration-200 hover:scale-105"
    />
  );

  const end = (
    <div className="flex align-items-center gap-2 md:gap-4 mr-2">
      
      {/* Smart AI Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:block relative">
        <span className="p-input-icon-left p-input-icon-right">
            <i className="pi pi-sparkles text-primary" />
            <InputText 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Ask AI (e.g. 'bag for college')" 
                className="border-round-3xl w-14rem lg:w-20rem p-inputtext-sm transition-all transition-duration-300 focus:w-22rem"
                disabled={isSearching}
            />
            {isSearching && <i className="pi pi-spin pi-spinner text-primary" />}
        </span>
      </form>

      {/* Cart Icon with Badge */}
      <Button 
        type="button" 
        icon="pi pi-shopping-cart" 
        className="p-button-text p-button-secondary relative p-2" 
        onClick={() => navigate("/cart")}
      >
        {cartCount > 0 && <Badge value={cartCount} severity="danger" className="absolute" style={{ top: '0', right: '0' }} />}
      </Button>

      {/* Avatar Menu */}
      <Menu model={profileItems} popup ref={menuLeft} id="popup_menu_left" />
      <Avatar 
        image={avatar ? `data:image/jpeg;base64,${avatar}` : null} 
        icon={!avatar ? "pi pi-user" : null}
        shape="circle" 
        size="large"
        className="cursor-pointer border-circle shadow-2 transition-transform transition-duration-200 hover:scale-105"
        onClick={(event) => menuLeft.current.toggle(event)} 
        aria-controls="popup_menu_left" 
        aria-haspopup
      />
    </div>
  );

  return (
    <div className="sticky top-0 z-50 w-full shadow-2">
      <Menubar model={items} start={start} end={end} className="border-none py-2 px-2 md:px-5 surface-0" />
      
      {/* Mobile AI Search */}
      <div className="md:hidden bg-white px-3 pb-3 border-bottom-1 surface-border">
          <form onSubmit={handleSearch} className="w-full">
            <span className="p-input-icon-left p-input-icon-right w-full">
                <i className="pi pi-sparkles text-primary" />
                <InputText 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Ask AI (e.g. 'bag for college')" 
                    className="border-round-3xl w-full p-inputtext-sm"
                    disabled={isSearching}
                />
                {isSearching && <i className="pi pi-spin pi-spinner text-primary" />}
            </span>
          </form>
      </div>
    </div>
  );
};

export default Navbar;
