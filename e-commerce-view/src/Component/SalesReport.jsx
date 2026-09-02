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

function SalesReport() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  // Chart Data states
  const [revenueChartData, setRevenueChartData] = useState({});
  const [productPieData, setProductPieData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [pieOptions, setPieOptions] = useState({});

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/sales");
      const data = response.data || [];
      setSales(data);
      processChartData(data);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to fetch sales data', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    // 1. Revenue by Date (Line Chart)
    const revenueByDate = {};
    // 2. Sales by Product (Pie Chart)
    const salesByProduct = {};
    
    let totalRev = 0;

    data.forEach(order => {
        // Only count SUCCESS payments or FULFILLED/SHIPPED as confirmed revenue if needed.
        // For now, we plot all recorded sales amounts.
        totalRev += (order.totalAmount || 0);

        // Date processing
        const dateStr = order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-GB') : "Unknown";
        revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + (order.totalAmount || 0);

        // Product processing
        const prodName = order.productName || "Unknown";
        salesByProduct[prodName] = (salesByProduct[prodName] || 0) + (order.quantity || 1);
    });

    // Prepare Line Chart
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
        plugins: {
            legend: { labels: { color: '#495057' } }
        },
        scales: {
            x: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            },
            y: {
                ticks: { color: '#495057' },
                grid: { color: '#ebedef' }
            }
        }
    });

    // Prepare Pie Chart
    const pieLabels = Object.keys(salesByProduct);
    const pieData = Object.values(salesByProduct);

    // Generate random colors for pie chart
    const backgroundColors = pieLabels.map((_, i) => `hsl(${i * (360 / pieLabels.length)}, 70%, 60%)`);
    const hoverColors = pieLabels.map((_, i) => `hsl(${i * (360 / pieLabels.length)}, 70%, 50%)`);

    setProductPieData({
        labels: pieLabels,
        datasets: [
            {
                data: pieData,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverColors
            }
        ]
    });

    setPieOptions({
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#495057' }
            }
        }
    });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  // Templates
  const amountBodyTemplate = (rowData) => {
    return <span className="font-bold text-indigo-600">₹{rowData.totalAmount?.toLocaleString()}</span>;
  };

  const dateBodyTemplate = (rowData) => {
    return rowData.orderDate ? new Date(rowData.orderDate).toLocaleDateString('en-IN') : "-";
  };

  const statusTemplate = (rowData) => {
    const isSuccess = rowData.paymentStatus === 'SUCCESS';
    return (
        <Tag 
            value={rowData.paymentStatus || 'PENDING'} 
            severity={isSuccess ? 'success' : 'warning'} 
            className="border-round-xl"
        />
    );
  };

  // Calculate summaries
  const totalRevenue = sales.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalOrders = sales.length;
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />

      <div className="absolute border-circle bg-purple-400 opacity-10" style={{ width: '400px', height: '400px', top: '-100px', left: '-100px', filter: 'blur(80px)' }}></div>
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', right: '-50px', filter: 'blur(60px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex flex-column md:flex-row align-items-center justify-content-between mb-5 gap-3">
            <div className="flex align-items-center gap-3">
                <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-purple-600">
                    <i className="pi pi-chart-bar text-2xl"></i>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-900 m-0">Sales Analytics Report</h1>
                    <p className="text-500 m-0 mt-1">Comprehensive view of revenue and product performance</p>
                </div>
            </div>
            
            <Button 
                label="Export Report (CSV)" 
                icon="pi pi-file-export" 
                severity="help"
                className="font-bold shadow-2 border-round-xl" 
                onClick={exportCSV} 
            />
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
                    <div style={{ height: '350px' }}>
                        {revenueChartData.labels ? (
                            <Chart type="line" data={revenueChartData} options={chartOptions} style={{ width: '100%', height: '100%' }} />
                        ) : (
                            <div className="flex justify-content-center align-items-center h-full text-500"><i className="pi pi-spin pi-spinner text-3xl mr-2"></i> Loading chart...</div>
                        )}
                    </div>
                </Card>
            </div>
            <div className="col-12 xl:col-4">
                <Card title="Sales by Product (Qty)" className="shadow-3 border-round-2xl border-none h-full">
                    <div className="flex justify-content-center" style={{ height: '350px' }}>
                        {productPieData.labels ? (
                            <Chart type="pie" data={productPieData} options={pieOptions} style={{ width: '90%', height: '100%' }} />
                        ) : (
                            <div className="flex justify-content-center align-items-center h-full text-500"><i className="pi pi-spin pi-spinner text-3xl mr-2"></i> Loading chart...</div>
                        )}
                    </div>
                </Card>
            </div>
        </div>

        {/* Data Table Section */}
        <Card title="Raw Sales Data" className="shadow-4 border-round-2xl border-none p-0 overflow-hidden">
            <DataTable 
                ref={dt} 
                value={sales} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[10, 25, 50, 100]}
                loading={loading}
                emptyMessage="No sales data found."
                className="p-datatable-sm"
                stripedRows
                exportFilename="Complete_Sales_Report"
            >
                <Column field="id" header="Order ID" sortable />
                <Column field="orderDate" header="Date" body={dateBodyTemplate} sortable />
                <Column field="customerName" header="Customer" sortable />
                <Column field="productName" header="Product" sortable />
                <Column field="quantity" header="Qty" sortable align="center" />
                <Column field="totalAmount" header="Revenue" body={amountBodyTemplate} sortable align="right" />
                <Column field="paymentMethod" header="Payment Mode" />
                <Column field="paymentStatus" header="Status" body={statusTemplate} align="center" />
            </DataTable>
        </Card>

      </motion.div>
    </div>
  );
}

export default SalesReport;
