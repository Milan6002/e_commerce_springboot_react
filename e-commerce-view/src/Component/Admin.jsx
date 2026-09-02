import { useNavigate } from "react-router-dom";
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { motion } from 'framer-motion';
import AiSalesInsights from './AiSalesInsights';
import AdminStats from './AdminStats';
import AdminDashboardChart from './AdminDashboardChart';
import AdminRecentOrders from './AdminRecentOrders';

function Admin() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("email")?.split("@")[0] || "Admin";

  const cardsData = [
    { title: "Categories", desc: "Manage product categories", path: "/Categories", icon: "pi pi-tags", color: "blue" },
    { title: "Products", desc: "Add, edit, and view products", path: "/Products", icon: "pi pi-box", color: "indigo" },
    { title: "Type", desc: "Manage product types", path: "/Type", icon: "pi pi-list", color: "purple" },
    { title: "Users", desc: "Manage registered users", path: "/admin/users", icon: "pi pi-users", color: "teal" },
    { title: "Purchase", desc: "Manage purchase orders", path: "/purchase", icon: "pi pi-shopping-bag", color: "green" },
    { title: "Sales", desc: "Manage sales orders & analytics", path: "/sales", icon: "pi pi-chart-line", color: "orange" },
    { title: "Invoice", desc: "Generate & view invoices", path: "/admin/invoices", icon: "pi pi-file-pdf", color: "red" },
    { title: "Feedback", desc: "Manage complaints & feedback", path: "/feedback", icon: "pi pi-comments", color: "cyan" },
    { title: "Payment", desc: "Manage payment methods", path: "/payment", icon: "pi pi-wallet", color: "pink" },
    { title: "Supplier", desc: "Manage suppliers and fulfillment", path: "/supplier", icon: "pi pi-truck", color: "bluegray" },
    { title: "Warehouse", desc: "Check stock & delivery", path: "/warehouse", icon: "pi pi-home", color: "yellow" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      
      {/* Animated Premium Header */}
      <div className="bg-primary-reverse p-6 md:p-8 mb-6 shadow-2" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-600))', color: 'white' }}>
        <div className="max-w-screen-2xl mx-auto flex flex-column md:flex-row align-items-center justify-content-between gap-4">
            <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.7 }}
            >
                <h1 className="text-3xl md:text-5xl font-bold m-0 mb-2">
                  Welcome back, {userName}! 👋
                </h1>
                <p className="text-xl m-0 opacity-80">Here is what's happening with your store today.</p>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex gap-3"
            >
                <Button label="View Store" icon="pi pi-external-link" className="p-button-outlined text-white border-white hover:bg-white-alpha-10" onClick={() => navigate('/')} />
            </motion.div>
        </div>
      </div>
      {/* Admin Quick Stats Component */}
      <AdminStats />

      {/* Chart and Recent Orders Grid */}
      <div className="grid px-4 md:px-6 max-w-screen-2xl mx-auto mb-6">
        <div className="col-12 lg:col-7 xl:col-8 p-2">
            <AdminDashboardChart />
        </div>
        <div className="col-12 lg:col-5 xl:col-4 p-2">
            <AdminRecentOrders />
        </div>
      </div>


      {/* AI Sales Insights Dashboard Component */}
      <AiSalesInsights />

      {/* Main Grid */}
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="grid px-4 md:px-6 max-w-screen-2xl mx-auto"
      >
        {cardsData.map((item, index) => (
          <motion.div variants={itemAnim} key={index} className="col-12 sm:col-6 lg:col-3 p-2">
            <Card className="h-full shadow-2 hover:shadow-6 transition-all transition-duration-300 border-round-2xl surface-0 flex flex-column cursor-pointer" onClick={() => navigate(item.path)}>
              <div className="flex-grow-1 flex flex-column align-items-center text-center p-3">
                <div className={`w-5rem h-5rem border-circle bg-${item.color}-100 text-${item.color}-600 flex align-items-center justify-content-center mb-4 shadow-1 transition-transform transition-duration-300 hover:scale-110`}>
                  <i className={`${item.icon} text-3xl`}></i>
                </div>
                <h2 className="text-xl font-bold text-900 m-0 mb-2">{item.title}</h2>
                <p className="text-600 m-0 line-height-3">{item.desc}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Admin;
