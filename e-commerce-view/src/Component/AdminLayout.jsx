import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Toast } from 'primereact/toast';
import LogoBg from '../assets/Img/BL_Long_Logo.png';

function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const menuLeft = useRef(null);
    const toast = useRef(null);
    const [avatar, setAvatar] = useState(localStorage.getItem("avtar"));
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        localStorage.clear();
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
        return () => window.removeEventListener("avatarUpdated", handleAvatarUpdate);
    }, []);

    const handleGlobalSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            let targetPath = '/Products'; // Default fallback
            let sectionName = 'Products';

            if (query.includes('order') || query.includes('sale') || !isNaN(query)) {
                targetPath = '/sales';
                sectionName = 'Sales & Orders';
            } else if (query.includes('user') || query.includes('customer') || query.includes('client')) {
                targetPath = '/admin/users';
                sectionName = 'Users';
            } else if (query.includes('invoice') || query.includes('bill')) {
                targetPath = '/admin/invoices';
                sectionName = 'Invoices';
            } else if (query.includes('category') || query.includes('type')) {
                targetPath = '/Categories';
                sectionName = 'Categories';
            }

            toast.current.show({ 
                severity: 'info', 
                summary: 'Searching', 
                detail: `Searching for "${searchQuery}". Redirecting to ${sectionName}...`, 
                life: 3000 
            });
            
            setTimeout(() => {
                navigate(targetPath);
                setSearchQuery(''); // clear after search
            }, 800);
        }
    };

    const sidebarItems = [
        { label: 'Dashboard', icon: 'pi pi-home', path: '/admin' },
        { label: 'Products', icon: 'pi pi-box', path: '/Products' },
        { label: 'Categories', icon: 'pi pi-list', path: '/Categories' },
        { label: 'Types', icon: 'pi pi-tags', path: '/Type' },
        { label: 'B2B Orders', icon: 'pi pi-briefcase', path: '/admin/bulk-orders' },
        { label: 'Users', icon: 'pi pi-users', path: '/admin/users' },
        { label: 'Purchase', icon: 'pi pi-shopping-bag', path: '/purchase' },
        { label: 'Sales', icon: 'pi pi-chart-line', path: '/sales' },
        { label: 'Invoices', icon: 'pi pi-file-pdf', path: '/admin/invoices' },
        { label: 'Feedback', icon: 'pi pi-comments', path: '/admin/feedback' },
        { label: 'Payment', icon: 'pi pi-wallet', path: '/payment' },
        { label: 'Supplier', icon: 'pi pi-truck', path: '/supplier' },
        { label: 'Warehouse', icon: 'pi pi-building', path: '/warehouse' },
        { label: 'Reports', icon: 'pi pi-chart-bar', path: '/admin/reports' },
        { label: 'Storefront', icon: 'pi pi-external-link', path: '/' },
    ];

    const profileItems = [
        {
            template: () => (
                <div className="flex flex-column align-items-center p-3 border-bottom-1 surface-border">
                    <Avatar 
                        image={avatar ? `data:image/jpeg;base64,${avatar}` : null} 
                        icon={!avatar ? "pi pi-user" : null}
                        shape="circle" size="xlarge" className="mb-2 bg-primary-100 text-primary"
                    />
                    <span className="font-bold text-900">Admin User</span>
                    <span className="text-sm text-500">Administrator</span>
                </div>
            )
        },
        { label: 'Admin Profile', icon: 'pi pi-fw pi-user', command: () => navigate('/admin/profile') },
        { label: 'Settings', icon: 'pi pi-fw pi-cog', command: () => navigate('/admin/settings') },
        { separator: true },
        { label: 'Sign out', icon: 'pi pi-fw pi-power-off', command: handleLogout, className: 'text-red-500' }
    ];

    return (
        <div className="flex h-screen overflow-hidden surface-ground">
            <Toast ref={toast} />
            {/* Sidebar */}
            <div className="w-16rem surface-0 border-right-1 surface-border shadow-2 flex flex-column h-full z-2 relative">
                <div className="flex align-items-center justify-content-center p-4 border-bottom-1 surface-border bg-blue-50">
                    <span className="font-bold text-xl text-blue-800">Admin Menu</span>
                </div>
                <div className="flex-grow-1 overflow-y-auto p-3">
                    <span className="text-xs font-bold text-500 uppercase mb-3 block px-2">Menu</span>
                    <ul className="list-none p-0 m-0">
                        {sidebarItems.map((item, index) => {
                            const isActive = location.pathname === item.path || (item.path !== '/admin' && item.path !== '/' && location.pathname.startsWith(item.path));
                            return (
                                <li key={index} className="mb-2">
                                    <div 
                                        className={`p-3 border-round-lg cursor-pointer flex align-items-center transition-colors transition-duration-200 ${isActive ? 'shadow-2' : 'text-700 hover:surface-hover'}`}
                                        style={isActive ? { backgroundColor: '#3b82f6', color: '#ffffff' } : {}}
                                        onClick={() => navigate(item.path)}
                                    >
                                        <i className={`${item.icon} mr-3 text-lg`}></i>
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-column flex-grow-1 h-full overflow-hidden">
                {/* Top Header */}
                <div className="surface-0 border-bottom-1 surface-border shadow-1 h-5rem flex align-items-center justify-content-between px-5 z-1">
                    <div className="flex align-items-center gap-4 cursor-pointer" onClick={() => navigate('/admin')}>
                        <img src={LogoBg} alt="logo" className="h-3rem" style={{ objectFit: 'contain' }} />
                        <div className="hidden md:block border-left-1 surface-border pl-4">
                            <h2 className="m-0 text-xl font-bold text-800">Admin Portal</h2>
                        </div>
                    </div>
                    
                    {/* Global Search Bar */}
                    <div className="hidden lg:flex flex-grow-1 justify-content-center px-6">
                        <IconField iconPosition="left" className="w-full max-w-30rem">
                            <InputIcon className="pi pi-search text-500" />
                            <InputText 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleGlobalSearch}
                                placeholder="Search for orders, products, users... (Press Enter)" 
                                className="w-full border-round-3xl p-inputtext-sm bg-gray-50 border-gray-200 hover:border-blue-300 focus:border-blue-500" 
                            />
                        </IconField>
                    </div>

                    <div className="flex align-items-center gap-4">
                        <div className="cursor-pointer text-600 hover:text-800 transition-colors p-overlay-badge" onClick={() => navigate('/admin/invoices')}>
                            <i className="pi pi-bell text-xl"></i>
                            <Badge value="3" severity="danger"></Badge>
                        </div>
                        <div className="h-2rem border-left-1 surface-border hidden md:block"></div>
                        
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
                                shape="circle" className="border-circle shadow-1 bg-primary-100 text-primary"
                                style={{ width: '35px', height: '35px' }}
                            />
                            <div className="hidden md:flex flex-column align-items-start">
                                <span className="text-sm font-semibold text-800 line-height-1">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-grow-1 overflow-y-auto p-4 md:p-5 relative">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AdminLayout;
