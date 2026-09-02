import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminServices from "../Services/AdminServices";
import { motion } from "framer-motion";

// PrimeReact Imports
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

function AdminInvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setLoading(true);
    AdminServices.getAllInvoices()
      .then(res => setInvoices(res.data || []))
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load invoices', life: 3000 });
      })
      .finally(() => setLoading(false));
  };

  const markPaid = (id) => {
    axios.put(`https://e-commerce-springboot-react-8i4i.onrender.com/api/sales/payment/${id}`)
      .then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Payment Done', life: 3000 });
        loadInvoices();
      })
      .catch(err => {
        console.error(err);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Payment update failed', life: 3000 });
      });
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchName = inv.customerName?.toLowerCase().includes(search.toLowerCase());
    const matchDate = date
      ? new Date(inv.invoiceDate).toISOString().slice(0, 10) === date
      : true;
    return matchName && matchDate;
  });

  const dateBodyTemplate = (rowData) => {
    if (!rowData.invoiceDate) return "-";
    const date = new Date(rowData.invoiceDate);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const amountBodyTemplate = (rowData) => {
    return <span className="font-bold text-green-600 text-lg">₹{rowData.totalAmount?.toLocaleString()}</span>;
  };

  const paymentStatusTemplate = (rowData) => {
    const status = rowData.paymentStatus || "PENDING";
    const isSuccess = status.toUpperCase() === "SUCCESS";
    return (
      <Tag 
        value={status.toUpperCase()} 
        severity={isSuccess ? "success" : "warning"} 
        className="px-3 py-1 text-sm font-bold border-round-xl"
        icon={isSuccess ? "pi pi-check" : "pi pi-clock"}
      />
    );
  };
  
  const paymentMethodTemplate = (rowData) => {
      return (
          <div className="flex align-items-center gap-2 justify-content-center">
              <i className={rowData.paymentMethod?.toLowerCase().includes('card') ? "pi pi-credit-card text-blue-500" : "pi pi-money-bill text-green-500"}></i>
              <span className="font-medium">{rowData.paymentMethod || "Cash"}</span>
          </div>
      );
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-content-center">
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          severity="info"
          aria-label="View"
          tooltip="View Invoice"
          tooltipOptions={{ position: 'top' }}
          onClick={() => navigate(`/admin/invoice/${rowData.id}`)}
          className="transition-colors transition-duration-200 hover:bg-blue-50"
        />
        {rowData.paymentStatus !== "SUCCESS" && (
          <Button
            icon="pi pi-check-circle"
            rounded
            outlined
            severity="success"
            aria-label="Mark Paid"
            tooltip="Mark as Paid"
            tooltipOptions={{ position: 'top' }}
            onClick={() => markPaid(rowData.orderId || rowData.id)}
            className="transition-colors transition-duration-200 hover:bg-green-50"
          />
        )}
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row gap-3 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">All Invoices</h4>
        <div className="flex flex-wrap gap-3 align-items-center">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Search by Customer"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-inputtext-sm border-round-3xl w-15rem"
                />
            </IconField>
            <InputText
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-inputtext-sm border-round-3xl w-12rem text-600"
            />
            <Button icon="pi pi-refresh" rounded text severity="secondary" onClick={loadInvoices} loading={loading} />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />

      {/* Decorative background blur */}
      <div className="absolute border-circle bg-teal-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-teal-600">
                <i className="pi pi-receipt text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Invoices</h1>
                <p className="text-500 m-0 mt-1">Manage and track customer payments</p>
            </div>
        </div>

        <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
          <DataTable 
            value={filteredInvoices} 
            paginator 
            rows={10} 
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={loading}
            emptyMessage="No invoices found."
            stripedRows
            hoverableRows
            responsiveLayout="scroll"
            className="p-datatable-sm"
            header={header}
            showGridlines={false}
          >
            <Column field="id" header="ID" sortable className="font-bold text-700" style={{ width: '5%' }} />
            <Column field="invoiceNumber" header="Invoice No" sortable className="font-semibold text-teal-700" />
            <Column field="customerName" header="Customer" sortable className="font-semibold text-800" />
            <Column header="Total" body={amountBodyTemplate} sortable field="totalAmount" align="right" />
            <Column header="Date" body={dateBodyTemplate} sortable field="invoiceDate" align="center" />
            <Column header="Pay Method" body={paymentMethodTemplate} field="paymentMethod" align="center" />
            <Column header="Pay Status" body={paymentStatusTemplate} align="center" />
            <Column header="Actions" body={actionBodyTemplate} align="center" style={{ minWidth: '8rem' }} />
          </DataTable>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminInvoiceList;