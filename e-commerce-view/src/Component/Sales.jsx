import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

export default function Sales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  
  // Chart states
  const [revenueChartData, setRevenueChartData] = useState({});
  const [productPieData, setProductPieData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [pieOptions, setPieOptions] = useState({});
  
  const processChartData = (fetchedData) => {
    const revenueByDate = {};
    const salesByProduct = {};
    
    fetchedData.forEach(order => {
        const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : "Unknown";
        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + (order.totalAmount || 0);

        const prodName = order.productName || "Unknown";
        salesByProduct[prodName] = (salesByProduct[prodName] || 0) + (order.quantity || 1);
    });

    const lineLabels = Object.keys(revenueByDate);
    const lineData = Object.values(revenueByDate);

    setRevenueChartData({
        labels: lineLabels,
        datasets: [
            {
                label: 'Daily Revenue (₹)',
                data: lineData,
                fill: true,
                borderColor: '#6366f1',
                tension: 0.4,
                backgroundColor: 'rgba(99, 102, 241, 0.2)'
            }
        ]
    });

    setChartOptions({
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: { legend: { labels: { color: '#495057' } } },
        scales: {
            x: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } },
            y: { ticks: { color: '#495057' }, grid: { color: '#ebedef' } }
        }
    });

    const pieLabels = Object.keys(salesByProduct);
    const pieData = Object.values(salesByProduct);
    const backgroundColors = pieLabels.map((_, i) => `hsl(${i * (360 / pieLabels.length)}, 70%, 60%)`);

    setProductPieData({
        labels: pieLabels,
        datasets: [{ data: pieData, backgroundColor: backgroundColors }]
    });

    setPieOptions({
        plugins: { legend: { position: 'right', labels: { color: '#495057' } } }
    });
  };

  const fetchData = () => {
    setLoading(true);
    axios.get("http://localhost:8081/api/sales")
      .then(res => {
          const d = res.data || [];
          setData(d);
          processChartData(d);
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load sales data', life: 3000 });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:8081/api/sales/status/${id}?status=${status}`)
      .then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: `Order marked as ${status}`, life: 3000 });
        fetchData();
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to update order status', life: 3000 });
      });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // --- Templates ---
  
  const amountBodyTemplate = (rowData) => {
    return <span className="text-green-600 font-bold text-lg">₹{rowData.totalAmount?.toLocaleString()}</span>;
  };

  const dateBodyTemplate = (rowData) => {
    if (!rowData.orderDate) return "-";
    const date = new Date(rowData.orderDate);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  };

  const statusBodyTemplate = (rowData) => {
    const getSeverity = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'success';
            case 'pending': return 'warning';
            case 'cancelled': return 'danger';
            case 'shipped': return 'info';
            default: return 'info';
        }
    };
    return (
      <Tag 
        value={rowData.status?.toUpperCase() || 'UNKNOWN'} 
        severity={getSeverity(rowData.status)} 
        className="px-3 py-1 text-sm font-bold border-round-xl"
      />
    );
  };

  const paymentBodyTemplate = (rowData) => {
      return (
          <div className="flex align-items-center gap-2">
              <i className={rowData.paymentMethod?.toLowerCase().includes('card') ? "pi pi-credit-card text-blue-500" : "pi pi-money-bill text-green-500"}></i>
              <span className="font-medium text-700">{rowData.paymentMethod}</span>
          </div>
      );
  };

  const actionBodyTemplate = (rowData) => {
    return rowData.status !== "Delivered" ? (
      <Button
        label="Deliver"
        icon="pi pi-check-circle"
        severity="success"
        outlined
        rounded
        size="small"
        onClick={() => updateStatus(rowData.id, "Delivered")}
        className="shadow-1 transition-colors transition-duration-200 hover:bg-green-50"
      />
    ) : (
      <Button
        icon="pi pi-check"
        severity="success"
        rounded
        text
        disabled
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">Recent Transactions</h4>
        <div className="flex flex-wrap gap-2 align-items-center">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Search orders..." 
                    className="p-inputtext-sm border-round-3xl w-15rem" 
                />
            </IconField>
            <Button icon="pi pi-download" label="Export" rounded severity="secondary" outlined onClick={exportCSV} className="p-button-sm" />
            <Button icon="pi pi-refresh" rounded severity="info" text onClick={fetchData} loading={loading} />
        </div>
    </div>
  );

  // Calculate summaries
  const totalRevenue = data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalOrders = data.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />
      
      {/* Decorative background blur */}
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', right: '-50px', filter: 'blur(60px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-primary-600">
                <i className="pi pi-chart-bar text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Sales Dashboard</h1>
                <p className="text-500 m-0 mt-1">Analytics and Order Management</p>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid mb-5">
            <div className="col-12 md:col-4">
                <Card className="shadow-2 border-none border-round-2xl border-left-3 border-green-500">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Revenue</span>
                            <div className="text-900 font-bold text-2xl">₹{totalRevenue.toLocaleString()}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-wallet text-green-500 text-xl"></i>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-12 md:col-4">
                <Card className="shadow-2 border-none border-round-2xl border-left-3 border-blue-500">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total Orders</span>
                            <div className="text-900 font-bold text-2xl">{totalOrders}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                        </div>
                    </div>
                </Card>
            </div>
            <div className="col-12 md:col-4">
                <Card className="shadow-2 border-none border-round-2xl border-left-3 border-purple-500">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Avg Order Value</span>
                            <div className="text-900 font-bold text-2xl">₹{Number(avgOrderValue).toLocaleString()}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-chart-line text-purple-500 text-xl"></i>
                        </div>
                    </div>
                </Card>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid mb-5">
            <div className="col-12 xl:col-8">
                <Card title="Revenue Trend" className="shadow-3 border-round-2xl border-none h-full">
                    <div style={{ height: '300px' }}>
                        {revenueChartData.labels && revenueChartData.labels.length > 0 ? (
                            <Chart type="line" data={revenueChartData} options={chartOptions} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <div className="flex justify-content-center align-items-center h-full text-500">No chart data</div>
                        )}
                    </div>
                </Card>
            </div>
            <div className="col-12 xl:col-4">
                <Card title="Sales by Product" className="shadow-3 border-round-2xl border-none h-full">
                    <div className="flex justify-content-center" style={{ height: '300px' }}>
                        {productPieData.labels && productPieData.labels.length > 0 ? (
                            <Chart type="pie" data={productPieData} options={pieOptions} style={{ width: '90%', height: '100%' }} />
                        ) : (
                            <div className="flex justify-content-center align-items-center h-full text-500">No chart data</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>

        <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
          <DataTable 
            ref={dt}
            value={data} 
            paginator 
            rows={10} 
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={loading}
            emptyMessage="No sales orders found."
            stripedRows
            hoverableRows
            responsiveLayout="scroll"
            className="p-datatable-sm"
            globalFilter={globalFilter}
            header={header}
            rowHover
            showGridlines={false}
          >
            <Column field="id" header="Order ID" sortable className="font-bold text-primary-700" />
            <Column field="customerName" header="Customer" sortable className="font-semibold text-700" />
            <Column field="productName" header="Products" sortable style={{ minWidth: '15rem' }} />
            <Column field="quantity" header="Qty" sortable align="center" />
            <Column header="Total Amount" body={amountBodyTemplate} sortable field="totalAmount" align="right" />
            <Column header="Payment" body={paymentBodyTemplate} sortable field="paymentMethod" />
            <Column header="Order Date" body={dateBodyTemplate} sortable field="orderDate" />
            <Column header="Status" body={statusBodyTemplate} sortable field="status" align="center" />
            <Column header="Action" body={actionBodyTemplate} align="center" />
          </DataTable>
        </Card>
      </motion.div>
    </div>
  );
}