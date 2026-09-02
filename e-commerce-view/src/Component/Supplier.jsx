import { useEffect, useState, useRef } from "react";
import SupplierService from "../Services/SupplierService";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

function Supplier() {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const response = await SupplierService.getSuppliers();
      setSuppliers(response.data || []);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load suppliers', life: 3000 });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await SupplierService.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load orders', life: 3000 });
      console.error(error);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await SupplierService.createSupplier(supplierForm);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Supplier created successfully', life: 3000 });
      setSupplierForm({ name: "", email: "", password: "" });
      loadSuppliers();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Failed to create supplier", life: 3000 });
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      await SupplierService.deleteSupplier(id);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Supplier deleted', life: 3000 });
      loadSuppliers();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Failed to delete supplier", life: 3000 });
    }
  };

  const handleSupplierLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await SupplierService.login(loginForm);
      setCurrentSupplier(response.data?.supplier || null);
      toast.current?.show({ severity: 'success', summary: 'Welcome', detail: 'Supplier login successful', life: 3000 });
      loadOrders();
      setLoginForm({ email: "", password: "" });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Supplier login failed", life: 3000 });
    }
  };

  const handleOrderAction = async (action, orderId) => {
    try {
      if (action === "fulfill") {
        await SupplierService.fulfillOrder(orderId);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Order fulfilled', life: 3000 });
      } else if (action === "ship") {
        await SupplierService.shipOrder(orderId);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Order shipped', life: 3000 });
      } else if (action === "invoice") {
        await SupplierService.generateInvoice(orderId);
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Invoice generated', life: 3000 });
      }
      loadOrders();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Action failed", life: 3000 });
    }
  };

  // --- Templates ---
  
  const statusBodyTemplate = (rowData) => {
    let severity = 'warning';
    let icon = 'pi pi-clock';
    const status = rowData.status?.toUpperCase();

    if (status === 'SHIPPED') { severity = 'success'; icon = 'pi pi-send'; }
    else if (status === 'FULFILLED') { severity = 'info'; icon = 'pi pi-check-circle'; }

    return (
      <Tag 
        value={status || 'PENDING'} 
        severity={severity} 
        icon={icon}
        className="px-3 py-1 text-sm font-bold border-round-xl"
      />
    );
  };

  const orderActionTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-content-center flex-wrap">
        {rowData.status !== "FULFILLED" && rowData.status !== "SHIPPED" && (
            <Button
              icon="pi pi-check"
              label="Fulfill"
              rounded
              outlined
              size="small"
              onClick={() => handleOrderAction("fulfill", rowData.id)}
              className="hover:bg-blue-50"
            />
        )}
        {rowData.status !== "SHIPPED" && (
            <Button
              icon="pi pi-send"
              label="Ship"
              rounded
              outlined
              severity="secondary"
              size="small"
              onClick={() => handleOrderAction("ship", rowData.id)}
            />
        )}
        <Button
          icon="pi pi-file"
          label="Invoice"
          rounded
          outlined
          severity="success"
          size="small"
          onClick={() => handleOrderAction("invoice", rowData.id)}
          className="hover:bg-green-50"
        />
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />

      {/* Decorative background blur */}
      <div className="absolute border-circle bg-orange-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>
      <div className="absolute border-circle bg-pink-400 opacity-10" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px', filter: 'blur(80px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-orange-600">
                <i className="pi pi-users text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Supplier Portal</h1>
                <p className="text-500 m-0 mt-1">Manage supplier onboarding, authentication, and fulfillment</p>
            </div>
        </div>

        {!currentSupplier && (
            <div className="grid">
              {/* CREATE SUPPLIER CARD */}
              <div className="col-12 lg:col-6 mb-4">
                <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
                  <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                      <i className="pi pi-user-plus text-xl text-orange-500 mr-2"></i>
                      <h2 className="m-0 text-xl font-bold text-800">Register New Supplier</h2>
                  </div>
                  
                  <form onSubmit={handleCreateSupplier} className="p-fluid">
                    <div className="field mb-4">
                      <label htmlFor="supplierName" className="font-semibold text-700">Supplier Name</label>
                      <IconField iconPosition="left">
                          <InputIcon className="pi pi-building text-500" />
                          <InputText
                            id="supplierName"
                            value={supplierForm.name}
                            onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                            required
                            placeholder="Company Name"
                            className="p-inputtext-lg"
                          />
                      </IconField>
                    </div>

                    <div className="field mb-4">
                      <label htmlFor="supplierEmail" className="font-semibold text-700">Email Address</label>
                      <IconField iconPosition="left">
                          <InputIcon className="pi pi-envelope text-500" />
                          <InputText
                            id="supplierEmail"
                            type="email"
                            value={supplierForm.email}
                            onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                            required
                            placeholder="supplier@company.com"
                            className="p-inputtext-lg"
                          />
                      </IconField>
                    </div>

                    <div className="field mb-5">
                      <label htmlFor="supplierPassword" className="font-semibold text-700">Password</label>
                      <Password
                        id="supplierPassword"
                        value={supplierForm.password}
                        onChange={(e) => setSupplierForm({ ...supplierForm, password: e.target.value })}
                        required
                        toggleMask
                        feedback={true}
                        placeholder="Create a strong password"
                        inputClassName="w-full p-inputtext-lg"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      label="Register Supplier" 
                      icon="pi pi-check" 
                      severity="warning"
                      className="w-full p-3 font-bold border-round-xl shadow-2" 
                    />
                  </form>
                </Card>
              </div>

              {/* SUPPLIER LOGIN CARD */}
              <div className="col-12 lg:col-6 mb-4">
                <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
                  <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                      <i className="pi pi-sign-in text-xl text-indigo-500 mr-2"></i>
                      <h2 className="m-0 text-xl font-bold text-800">Supplier Portal Login</h2>
                  </div>
                  
                  <form onSubmit={handleSupplierLogin} className="p-fluid">
                    <div className="field mb-4">
                      <label htmlFor="loginEmail" className="font-semibold text-700">Supplier Email</label>
                      <IconField iconPosition="left">
                          <InputIcon className="pi pi-envelope text-500" />
                          <InputText
                            id="loginEmail"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                            placeholder="Enter your email"
                            className="p-inputtext-lg"
                          />
                      </IconField>
                    </div>

                    <div className="field mb-5">
                      <label htmlFor="loginPassword" className="font-semibold text-700">Password</label>
                      <Password
                        id="loginPassword"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        toggleMask
                        feedback={false}
                        placeholder="Enter your password"
                        inputClassName="w-full p-inputtext-lg"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      label="Secure Login" 
                      icon="pi pi-lock" 
                      severity="help"
                      className="w-full p-3 font-bold border-round-xl shadow-2 mt-4" 
                    />
                  </form>
                </Card>
              </div>
            </div>
        )}

        {/* ACTIVE SUPPLIER DASHBOARD */}
        {currentSupplier && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
                <Card className="shadow-4 border-round-2xl border-none bg-indigo-50 border-1 border-indigo-100">
                    <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
                        <div className="flex align-items-center gap-3">
                            <div className="w-4rem h-4rem border-circle bg-indigo-500 text-white flex align-items-center justify-content-center text-xl font-bold shadow-2">
                                {currentSupplier.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="m-0 text-indigo-900 text-2xl font-bold">Welcome, {currentSupplier.name}</h2>
                                <p className="m-0 mt-1 text-indigo-600 font-medium">Logged in as Supplier &bull; {currentSupplier.email}</p>
                            </div>
                        </div>
                        <Button
                          onClick={() => {
                            setCurrentSupplier(null);
                            setOrders([]);
                          }}
                          label="Logout"
                          icon="pi pi-sign-out"
                          severity="secondary"
                          rounded
                          className="font-bold shadow-1"
                        />
                    </div>
                </Card>

                <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none mt-5">
                    <div className="flex align-items-center p-4 bg-white border-bottom-1 surface-border">
                        <i className="pi pi-inbox text-xl text-primary mr-2"></i>
                        <h3 className="m-0 text-xl font-bold text-800">Orders to Fulfill</h3>
                    </div>
                    <DataTable
                        value={orders}
                        stripedRows
                        hoverableRows
                        paginator
                        rows={10}
                        emptyMessage="No pending orders available"
                        className="p-datatable-sm"
                    >
                        <Column field="id" header="Order ID" className="font-bold text-700" style={{ width: '8%' }} />
                        <Column field="customerName" header="Customer" className="font-medium text-800" />
                        <Column field="productName" header="Product" />
                        <Column field="quantity" header="Qty" align="center" />
                        <Column header="Amount" body={(rowData) => <span className="font-bold text-green-600">₹{rowData.totalAmount?.toLocaleString()}</span>} align="right" />
                        <Column header="Status" body={statusBodyTemplate} align="center" />
                        <Column header="Actions" body={orderActionTemplate} align="center" style={{ minWidth: '15rem' }} />
                    </DataTable>
                </Card>
            </motion.div>
        )}

        {/* ADMIN SUPPLIER LIST (Only visible if not logged in as a specific supplier) */}
        {!currentSupplier && (
            <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
                <div className="flex align-items-center p-4 bg-white border-bottom-1 surface-border">
                    <i className="pi pi-list text-xl text-orange-500 mr-2"></i>
                    <h3 className="m-0 text-xl font-bold text-800">Registered Suppliers</h3>
                </div>
                <DataTable
                    value={suppliers}
                    stripedRows
                    hoverableRows
                    paginator
                    rows={5}
                    loading={loading}
                    emptyMessage="No suppliers found in the system."
                    className="p-datatable-sm"
                >
                    <Column field="id" header="ID" className="font-bold text-700" style={{ width: '8%' }} />
                    <Column field="name" header="Supplier Name" className="font-semibold text-800" />
                    <Column field="email" header="Email Address" />
                    <Column
                        header="Actions"
                        align="center"
                        body={(rowData) => (
                            <Button
                                onClick={() => handleDeleteSupplier(rowData.id)}
                                icon="pi pi-trash"
                                severity="danger"
                                rounded
                                outlined
                                tooltip="Remove Supplier"
                                tooltipOptions={{ position: 'top' }}
                                className="hover:bg-red-50"
                            />
                        )}
                    />
                </DataTable>
            </Card>
        )}
      </motion.div>
    </div>
  );
}

export default Supplier;
