import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import { InputNumber } from "primereact/inputnumber";

export default function Purchase() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);

  const [form, setForm] = useState({
    productName: "",
    quantity: null,
    price: null,
    supplierName: ""
  });

  // Fetch data
  const fetchData = () => {
    setLoading(true);
    axios.get("http://localhost:8081/api/purchase")
      .then(res => setData(res.data || []))
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load purchase orders', life: 3000 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productName || !form.quantity || !form.price || !form.supplierName) {
      toast.current?.show({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all fields', life: 3000 });
      return;
    }

    axios.post("http://localhost:8081/api/purchase", form)
      .then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Purchase added successfully', life: 3000 });
        fetchData();
        setForm({
          productName: "",
          quantity: null,
          price: null,
          supplierName: ""
        });
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to add purchase', life: 3000 });
      });
  };

  // Delete
  const handleDelete = (id) => {
    axios.delete(`http://localhost:8081/api/purchase/${id}`)
      .then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Purchase deleted successfully', life: 3000 });
        fetchData();
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete purchase', life: 3000 });
      });
  };

  const priceBodyTemplate = (rowData) => {
    return <span className="font-bold text-orange-600 text-lg">₹{rowData.price?.toLocaleString()}</span>;
  };
  
  const totalBodyTemplate = (rowData) => {
    const total = rowData.quantity * rowData.price;
    return <span className="font-bold text-green-600 text-lg">₹{total?.toLocaleString()}</span>;
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        outlined
        aria-label="Delete"
        tooltip="Delete Purchase"
        tooltipOptions={{ position: 'top' }}
        onClick={() => handleDelete(rowData.id)}
        className="transition-colors transition-duration-200 hover:bg-red-50"
      />
    );
  };

  const supplierBodyTemplate = (rowData) => {
      return (
          <div className="flex align-items-center gap-2">
              <i className="pi pi-building text-blue-500"></i>
              <span className="font-medium">{rowData.supplierName}</span>
          </div>
      );
  }

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">Inventory Purchases</h4>
        <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText 
                type="search" 
                onInput={(e) => setGlobalFilter(e.target.value)} 
                placeholder="Search inventory..." 
                className="p-inputtext-sm border-round-3xl w-15rem" 
            />
        </IconField>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />
      
      {/* Decorative background blur */}
      <div className="absolute border-circle bg-orange-400 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-orange-600">
                <i className="pi pi-box text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Purchase Management</h1>
                <p className="text-500 m-0 mt-1">Manage supplier orders and inventory intake</p>
            </div>
        </div>

        <div className="grid">
          {/* FORM CARD */}
          <div className="col-12 xl:col-4 mb-4 xl:mb-0">
            <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
              <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                  <i className="pi pi-plus-circle text-xl text-primary mr-2"></i>
                  <h2 className="m-0 text-xl font-bold text-800">Add New Purchase</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-fluid">
                <div className="field mb-4">
                  <label htmlFor="productName" className="font-semibold text-700">Product Name</label>
                  <IconField iconPosition="left">
                      <InputIcon className="pi pi-tag text-500" />
                      <InputText
                        id="productName"
                        value={form.productName}
                        onChange={e => setForm({...form, productName: e.target.value})}
                        placeholder="e.g. VIP Trolley Bag"
                        className="p-inputtext-lg"
                      />
                  </IconField>
                </div>

                <div className="grid">
                    <div className="col-12 md:col-6 field mb-4">
                      <label htmlFor="quantity" className="font-semibold text-700">Quantity</label>
                      <InputNumber
                        id="quantity"
                        value={form.quantity}
                        onValueChange={e => setForm({...form, quantity: e.value})}
                        showButtons
                        min={1}
                        placeholder="0"
                        className="p-inputtext-lg"
                      />
                    </div>

                    <div className="col-12 md:col-6 field mb-4">
                      <label htmlFor="price" className="font-semibold text-700">Unit Price</label>
                      <InputNumber
                        id="price"
                        value={form.price}
                        onValueChange={e => setForm({...form, price: e.value})}
                        mode="currency" 
                        currency="INR" 
                        locale="en-IN"
                        placeholder="₹0.00"
                        className="p-inputtext-lg"
                      />
                    </div>
                </div>

                <div className="field mb-5">
                  <label htmlFor="supplierName" className="font-semibold text-700">Supplier Name</label>
                  <IconField iconPosition="left">
                      <InputIcon className="pi pi-building text-500" />
                      <InputText
                        id="supplierName"
                        value={form.supplierName}
                        onChange={e => setForm({...form, supplierName: e.target.value})}
                        placeholder="e.g. Safari Industries Ltd."
                        className="p-inputtext-lg"
                      />
                  </IconField>
                </div>

                <Button 
                    type="submit" 
                    label="Record Purchase" 
                    icon="pi pi-check" 
                    className="w-full p-3 font-bold border-round-xl shadow-2" 
                />
              </form>
            </Card>
          </div>

          {/* TABLE CARD */}
          <div className="col-12 xl:col-8">
            <Card className="shadow-4 border-round-2xl h-full border-none p-0 overflow-hidden">
              <DataTable 
                value={data} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25]}
                loading={loading}
                emptyMessage="No purchases recorded yet."
                responsiveLayout="scroll"
                stripedRows
                hoverableRows
                className="p-datatable-sm"
                globalFilter={globalFilter}
                header={header}
              >
                <Column field="id" header="ID" sortable className="font-bold text-primary-700" style={{ width: '5%' }} />
                <Column field="productName" header="Product" sortable className="font-semibold text-700" style={{ minWidth: '12rem' }} />
                <Column field="supplierName" header="Supplier" body={supplierBodyTemplate} sortable style={{ minWidth: '12rem' }} />
                <Column field="quantity" header="Qty" sortable align="center" />
                <Column header="Unit Price" body={priceBodyTemplate} sortable field="price" align="right" />
                <Column header="Total" body={totalBodyTemplate} align="right" />
                <Column header="Actions" body={actionBodyTemplate} align="center" />
              </DataTable>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}