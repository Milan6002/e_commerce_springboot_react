import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import WarehouseService from "../Services/WarehouseService";

function Warehouse() {
  const [stocks, setStocks] = useState([]);
  const [checkProductId, setCheckProductId] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [actionForm, setActionForm] = useState({
    productId: null,
    quantity: null,
  });

  const loadStocks = async () => {
    setLoading(true);
    try {
      const response = await WarehouseService.getAllStocks();
      setStocks(response.data || []);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load warehouse stocks', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const handleCheckStock = async (e) => {
    e.preventDefault();
    if (!checkProductId) {
      toast.current?.show({ severity: 'warn', summary: 'Required', detail: 'Please enter a valid Product ID', life: 3000 });
      return;
    }

    try {
      const response = await WarehouseService.getStockByProductId(checkProductId);
      setSelectedStock(response.data);
      toast.current?.show({ severity: 'success', summary: 'Found', detail: 'Stock details fetched successfully', life: 3000 });
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Not Found', detail: error?.response?.data || "Unable to fetch stock for this ID", life: 3000 });
      setSelectedStock(null);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    const productId = Number(actionForm.productId);
    const quantity = Number(actionForm.quantity);
    if (!productId || !quantity || quantity <= 0) {
      toast.current?.show({ severity: 'warn', summary: 'Invalid Input', detail: 'Valid Product ID and Quantity (> 0) required', life: 3000 });
      return;
    }

    try {
      await WarehouseService.updateStock(productId, quantity);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Stock added to warehouse', life: 3000 });
      setActionForm({ productId: null, quantity: null });
      loadStocks();
      
      // Auto-refresh the selected stock view if it matches the updated product
      if (selectedStock && Number(selectedStock.productId) === productId) {
          const response = await WarehouseService.getStockByProductId(productId);
          setSelectedStock(response.data);
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Stock update failed", life: 3000 });
    }
  };

  const handleDeliverStock = async (productId, quantity) => {
    try {
      await WarehouseService.deliverStock(productId, quantity);
      toast.current?.show({ severity: 'success', summary: 'Dispatched', detail: 'Stock successfully delivered out of warehouse', life: 3000 });
      loadStocks();
      if (selectedStock && Number(selectedStock.productId) === Number(productId)) {
        const response = await WarehouseService.getStockByProductId(productId);
        setSelectedStock(response.data);
      }
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Stock delivery failed", life: 3000 });
    }
  };

  // --- Templates ---
  
  const statusBodyTemplate = (rowData) => {
    const isOut = rowData.stockStatus === 'OUT_OF_STOCK' || rowData.availableStock <= 0;
    return (
      <Tag 
        value={isOut ? 'OUT OF STOCK' : 'IN STOCK'} 
        severity={isOut ? 'danger' : 'success'} 
        icon={isOut ? 'pi pi-times-circle' : 'pi pi-check-circle'}
        className="px-3 py-1 text-sm font-bold border-round-xl"
      />
    );
  };

  const stockBodyTemplate = (rowData) => {
      const isLow = rowData.availableStock > 0 && rowData.availableStock < 10;
      return (
          <span className={`font-bold text-xl ${isLow ? 'text-orange-500' : (rowData.availableStock <= 0 ? 'text-red-500' : 'text-green-600')}`}>
              {rowData.availableStock}
          </span>
      );
  }

  const actionBodyTemplate = (rowData) => {
    const disabled = !rowData.availableStock || rowData.availableStock < 1;
    return (
      <Button
        label="Deliver 1"
        icon="pi pi-send"
        rounded
        outlined
        severity="info"
        disabled={disabled}
        onClick={() => handleDeliverStock(rowData.productId, 1)}
        className={disabled ? "" : "hover:bg-blue-50 font-bold"}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">Current Inventory</h4>
        <div className="flex align-items-center gap-2">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Search inventory..." 
                    className="p-inputtext-sm border-round-3xl w-15rem" 
                />
            </IconField>
            <Button icon="pi pi-refresh" rounded text severity="secondary" onClick={loadStocks} loading={loading} />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />

      {/* Decorative background blur */}
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>
      <div className="absolute border-circle bg-cyan-400 opacity-10" style={{ width: '400px', height: '400px', bottom: '-100px', right: '-100px', filter: 'blur(80px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-blue-600">
                <i className="pi pi-warehouse text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Warehouse Management</h1>
                <p className="text-500 m-0 mt-1">Check current capacity, receive supplier stocks, and deliver items.</p>
            </div>
        </div>

        <div className="grid">
          {/* CHECK STOCK CARD */}
          <div className="col-12 lg:col-6 xl:col-4 mb-4">
            <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
              <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                  <i className="pi pi-search text-xl text-blue-500 mr-2"></i>
                  <h2 className="m-0 text-xl font-bold text-800">Quick Stock Lookup</h2>
              </div>
              
              <form onSubmit={handleCheckStock} className="p-fluid mb-4">
                <div className="field">
                  <label htmlFor="checkProductId" className="font-semibold text-700">Product ID</label>
                  <InputNumber
                    id="checkProductId"
                    value={checkProductId}
                    onValueChange={(e) => setCheckProductId(e.value)}
                    placeholder="Enter ID to search"
                    useGrouping={false}
                    className="p-inputtext-lg"
                  />
                </div>
                <Button type="submit" label="Check Availability" icon="pi pi-search" className="w-full p-3 font-bold border-round-xl shadow-2" />
              </form>

              {selectedStock && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 p-4 border-round-xl bg-blue-50 border-1 border-blue-100">
                  <div className="flex justify-content-between align-items-center mb-3">
                      <span className="font-bold text-blue-900 text-lg">{selectedStock.productName}</span>
                      <Tag value={`ID: ${selectedStock.productId}`} severity="info" />
                  </div>
                  <div className="flex align-items-center mb-2">
                      <i className="pi pi-tag text-blue-500 mr-2"></i>
                      <span className="text-700">Brand: <span className="font-semibold text-900">{selectedStock.brand || "N/A"}</span></span>
                  </div>
                  <div className="flex align-items-center justify-content-between mt-4 p-3 bg-white border-round shadow-1">
                      <div>
                          <span className="block text-sm text-500 font-semibold mb-1">Available Quantity</span>
                          {stockBodyTemplate(selectedStock)}
                      </div>
                      {statusBodyTemplate(selectedStock)}
                  </div>
                </motion.div>
              )}
            </Card>
          </div>

          {/* UPDATE STOCK CARD */}
          <div className="col-12 lg:col-6 xl:col-4 mb-4">
            <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
              <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                  <i className="pi pi-box text-xl text-cyan-500 mr-2"></i>
                  <h2 className="m-0 text-xl font-bold text-800">Receive Stock Inward</h2>
              </div>
              
              <form onSubmit={handleUpdateStock} className="p-fluid">
                <div className="field mb-4">
                  <label htmlFor="updateProductId" className="font-semibold text-700">Product ID</label>
                  <InputNumber
                    id="updateProductId"
                    value={actionForm.productId}
                    onValueChange={(e) => setActionForm({ ...actionForm, productId: e.value })}
                    placeholder="Select Product ID"
                    useGrouping={false}
                    className="p-inputtext-lg"
                  />
                </div>

                <div className="field mb-5">
                  <label htmlFor="updateQty" className="font-semibold text-700">Quantity To Add</label>
                  <InputNumber
                    id="updateQty"
                    value={actionForm.quantity}
                    onValueChange={(e) => setActionForm({ ...actionForm, quantity: e.value })}
                    placeholder="Enter quantity received"
                    showButtons
                    min={1}
                    className="p-inputtext-lg"
                  />
                </div>

                <Button
                  type="submit"
                  label="Update Inventory"
                  icon="pi pi-check"
                  severity="success"
                  className="w-full p-3 font-bold border-round-xl shadow-2 mt-4"
                />
              </form>
            </Card>
          </div>

          {/* INVENTORY TABLE CARD */}
          <div className="col-12 xl:col-12">
            <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
              <DataTable 
                value={stocks} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                loading={loading}
                emptyMessage="No stock data available in warehouse."
                stripedRows
                hoverableRows
                globalFilter={globalFilter}
                responsiveLayout="scroll"
                className="p-datatable-sm"
                header={header}
                showGridlines={false}
              >
                <Column field="productId" header="ID" sortable className="font-bold text-700" style={{ width: '5%' }} />
                <Column field="productName" header="Product Name" sortable className="font-semibold text-900" />
                <Column field="brand" header="Brand" sortable />
                <Column header="Available Stock" body={stockBodyTemplate} sortable field="availableStock" align="center" />
                <Column header="Status" body={statusBodyTemplate} align="center" />
                <Column header="Outward Action" body={actionBodyTemplate} align="center" style={{ minWidth: '10rem' }} />
              </DataTable>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Warehouse;
