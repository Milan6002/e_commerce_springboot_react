import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoBg from "../assets/Img/BL_Long_Logo.png";

// PrimeReact Imports
import { Menubar } from 'primereact/menubar';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';

function NavbarAdmin() {
  const [avatar, setAvatar] = useState(localStorage.getItem("avtar"));
  const navigate = useNavigate();
  const location = useLocation();
  const menuLeft = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("avtar");
    localStorage.removeItem("role");
    setAvatar(null);
    navigate("/login");
  };

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

  const items = [
    { 
        label: 'Dashboard', 
        icon: 'pi pi-fw pi-home', 
        command: () => navigate('/admin'),
        className: location.pathname === '/admin' ? 'bg-teal-50 text-teal-700 font-bold border-round-md' : ''
    },
    { 
        label: 'Products', 
        icon: 'pi pi-fw pi-box', 
        command: () => navigate('/Products'),
        className: location.pathname.includes('/Products') ? 'bg-teal-50 text-teal-700 font-bold border-round-md' : ''
    },
    { 
        label: 'Categories', 
        icon: 'pi pi-fw pi-list', 
        command: () => navigate('/Categories'),
        className: location.pathname.includes('/Categories') ? 'bg-teal-50 text-teal-700 font-bold border-round-md' : ''
    },
    { 
        label: 'Types', 
        icon: 'pi pi-fw pi-tags', 
        command: () => navigate('/Type'),
        className: location.pathname.includes('/Type') ? 'bg-teal-50 text-teal-700 font-bold border-round-md' : ''
    },
    { 
        label: 'B2B Orders', 
        icon: 'pi pi-fw pi-briefcase', 
        command: () => navigate('/admin/bulk-orders'),
        className: location.pathname.includes('/bulk-orders') ? 'bg-teal-50 text-teal-700 font-bold border-round-md' : ''
    },
    {
        label: 'Storefront',
        icon: 'pi pi-fw pi-external-link',
        command: () => navigate('/'),
        className: 'ml-2 text-primary font-semibold'
    }
  ];

  const profileItems = [
    {
      template: () => {
        return (
            <div className="flex flex-column align-items-center p-3 border-bottom-1 surface-border">
                <Avatar 
                    image={avatar ? `data:image/jpeg;base64,${avatar}` : null} 
                    icon={!avatar ? "pi pi-user" : null}
                    shape="circle" 
                    size="xlarge"
                    className="mb-2"
                />
                <span className="font-bold text-900">Admin User</span>
                <span className="text-sm text-500">Administrator</span>
            </div>
        )
      }
    },
    {
      label: 'Your Profile',
      icon: 'pi pi-fw pi-user',
      command: () => navigate('/profile')
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-cog',
      command: () => navigate('/admin/settings')
    },
    { separator: true },
    {
      label: 'Sign out',
      icon: 'pi pi-fw pi-power-off',
      command: handleLogout,
      className: 'text-red-500'
    }
  ];

  const start = (
    <div className="flex align-items-center gap-3 mr-4 pr-4 border-right-1 surface-border cursor-pointer" onClick={() => navigate("/admin")}>
        <img
            alt="logo"
            src={LogoBg}
            className="h-3rem"
            style={{ objectFit: 'contain' }}
        />
        <div className="hidden md:block">
            <span className="font-bold text-xl text-800 block">Admin Center</span>
            <span className="text-xs text-500 block">Management Portal</span>
        </div>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-4 pl-3">
        {/* Notification Icon */}
        <div className="cursor-pointer text-600 hover:text-800 transition-colors p-overlay-badge" onClick={() => navigate('/admin/invoices')}>
            <i className="pi pi-bell text-xl"></i>
            <Badge value="3" severity="danger"></Badge>
        </div>

        <div className="h-2rem border-left-1 surface-border hidden md:block"></div>

        {/* Profile Menu */}
        <Menu model={profileItems} popup ref={menuLeft} id="popup_menu_left_admin" className="w-15rem" />
        <div 
            className="flex align-items-center gap-2 cursor-pointer p-2 hover:surface-hover border-round transition-colors"
            onClick={(event) => menuLeft.current.toggle(event)} 
            aria-controls="popup_menu_left_admin" 
            aria-haspopup
        >
            <Avatar 
                image={avatar ? `data:image/jpeg;base64,${avatar}` : null} 
                icon={!avatar ? "pi pi-user" : null}
                shape="circle" 
                className="border-circle shadow-1"
                style={{ width: '35px', height: '35px' }}
            />
            <div className="hidden md:flex flex-column align-items-start">
                <span className="text-sm font-semibold text-800 line-height-1">Admin</span>
                <span className="text-xs text-500 line-height-1 mt-1">Options <i className="pi pi-angle-down text-xs ml-1"></i></span>
            </div>
        </div>
    </div>
  );

  return (
    <div className="sticky top-0 z-5" style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
      <Menubar 
        model={items} 
        start={start} 
        end={end} 
        className="border-none border-bottom-1 surface-border border-round-none px-4 py-2 bg-transparent" 
        style={{ minHeight: '70px' }}
      />
    </div>
  );
}

export default NavbarAdmin;
