import { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { motion } from "framer-motion";
import PaymentService from "../Services/PaymentService";
import { jwtDecode } from "jwt-decode";

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Failed', value: 'FAILED' }
];

const paymentMethodOptions = [
  { label: 'Cash on Delivery (COD)', value: 'COD' },
  { label: 'Credit/Debit Card', value: 'CARD' },
  { label: 'UPI (GPay/PhonePe)', value: 'UPI' },
  { label: 'Net Banking', value: 'NET_BANKING' }
];

function Payment() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "ROLE_ADMIN";
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const toast = useRef(null);
  
  const [form, setForm] = useState({
    orderId: null,
    amount: null,
    paymentMethod: "COD",
    status: "PENDING",
  });

  const loadPayments = async () => {
    setLoading(true);
    try {
      let response;
      if (isAdmin) {
        response = await PaymentService.getAllPayments();
      } else if (token) {
        const decoded = jwtDecode(token);
        const email = decoded?.email || decoded?.sub;
        response = await PaymentService.getPaymentsByUser(email);
      } else {
        response = { data: [] };
      }
      setPayments(response.data || []);
    } catch (error) {
      console.error(error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load payments', life: 3000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [isAdmin, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      orderId: Number(form.orderId),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      status: form.status,
    };

    if (!payload.orderId || !payload.amount) {
      toast.current?.show({ severity: 'warn', summary: 'Validation Required', detail: 'Order ID and Amount are required.', life: 3000 });
      return;
    }

    try {
      await PaymentService.createPayment(payload);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Payment recorded successfully', life: 3000 });
      setForm({ orderId: null, amount: null, paymentMethod: "COD", status: "PENDING" });
      loadPayments();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Failed to add payment", life: 3000 });
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await PaymentService.updatePaymentStatus(id, status);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: `Payment marked as ${status}`, life: 3000 });
      loadPayments();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Status update failed", life: 3000 });
    }
  };

  const handleDelete = async (id) => {
    try {
      await PaymentService.deletePayment(id);
      toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Payment record deleted', life: 3000 });
      loadPayments();
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: error?.response?.data || "Delete failed", life: 3000 });
    }
  };

  // --- Templates ---
  
  const amountBodyTemplate = (rowData) => {
    return <span className="font-bold text-lg text-indigo-600">₹{rowData.amount?.toLocaleString()}</span>;
  };

  const statusBodyTemplate = (rowData) => {
    const status = rowData.status?.toUpperCase();
    let severity = 'info';
    let icon = 'pi pi-info-circle';
    
    if (status === 'SUCCESS') { severity = 'success'; icon = 'pi pi-check-circle'; }
    else if (status === 'FAILED') { severity = 'danger'; icon = 'pi pi-times-circle'; }
    else if (status === 'PENDING') { severity = 'warning'; icon = 'pi pi-clock'; }

    return (
      <Tag 
        value={status} 
        severity={severity} 
        icon={icon}
        className="px-3 py-1 text-sm font-bold border-round-xl"
      />
    );
  };
  
  const paymentMethodTemplate = (rowData) => {
      let icon = "pi pi-money-bill text-green-500";
      if (rowData.paymentMethod === 'CARD') icon = "pi pi-credit-card text-blue-500";
      if (rowData.paymentMethod === 'UPI') icon = "pi pi-mobile text-purple-500";
      if (rowData.paymentMethod === 'NET_BANKING') icon = "pi pi-building text-orange-500";
      
      return (
          <div className="flex align-items-center gap-2">
              <i className={icon}></i>
              <span className="font-medium text-700">{rowData.paymentMethod}</span>
          </div>
      );
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="flex gap-2 justify-content-center">
        {rowData.status !== "SUCCESS" && (
            <Button
              icon="pi pi-check"
              rounded
              outlined
              severity="success"
              aria-label="Mark Success"
              tooltip="Mark Success"
              tooltipOptions={{ position: 'top' }}
              onClick={() => handleStatusUpdate(rowData.id, "SUCCESS")}
              className="hover:bg-green-50"
            />
        )}
        {rowData.status !== "FAILED" && (
            <Button
              icon="pi pi-times"
              rounded
              outlined
              severity="danger"
              aria-label="Mark Failed"
              tooltip="Mark Failed"
              tooltipOptions={{ position: 'top' }}
              onClick={() => handleStatusUpdate(rowData.id, "FAILED")}
              className="hover:bg-red-50"
            />
        )}
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="secondary"
          aria-label="Delete"
          tooltip="Delete Record"
          tooltipOptions={{ position: 'top' }}
          onClick={() => handleDelete(rowData.id)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        <h4 className="m-0 text-xl font-bold text-800">{isAdmin ? "All Transactions" : "Transaction History"}</h4>
        <div className="flex align-items-center gap-2">
            <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText 
                    type="search" 
                    onInput={(e) => setGlobalFilter(e.target.value)} 
                    placeholder="Search payments..." 
                    className="p-inputtext-sm border-round-3xl w-15rem" 
                />
            </IconField>
            <Button icon="pi pi-refresh" rounded text severity="secondary" onClick={loadPayments} loading={loading} />
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      <Toast ref={toast} />
      
      {/* Decorative background blur */}
      <div className="absolute border-circle bg-indigo-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', right: '-50px', filter: 'blur(60px)' }}></div>
      <div className="absolute border-circle bg-purple-400 opacity-10" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', filter: 'blur(80px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto relative z-1"
      >
        <div className="flex align-items-center gap-3 mb-5">
            <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-indigo-600">
                <i className="pi pi-wallet text-2xl"></i>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-900 m-0">Payments Center</h1>
                <p className="text-500 m-0 mt-1">
                    {isAdmin
                        ? "Track payment entries and update transaction statuses."
                        : "View and manage your payment history securely."}
                </p>
            </div>
        </div>

        <div className="grid">
          {isAdmin && (
              <div className="col-12 xl:col-4 mb-4 xl:mb-0">
                  <Card className="shadow-4 border-round-2xl h-full border-none" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)' }}>
                    <div className="flex align-items-center mb-4 border-bottom-1 surface-border pb-3">
                        <i className="pi pi-plus-circle text-xl text-indigo-600 mr-2"></i>
                        <h2 className="m-0 text-xl font-bold text-800">Record Payment</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <div className="field mb-4">
                            <label htmlFor="orderId" className="font-semibold text-700">Order ID</label>
                            <InputNumber
                                id="orderId"
                                value={form.orderId}
                                onValueChange={(e) => setForm({ ...form, orderId: e.value })}
                                placeholder="Enter Order ID"
                                className="p-inputtext-lg"
                                useGrouping={false}
                            />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="amount" className="font-semibold text-700">Amount</label>
                            <InputNumber
                                id="amount"
                                value={form.amount}
                                onValueChange={(e) => setForm({ ...form, amount: e.value })}
                                mode="currency" 
                                currency="INR" 
                                locale="en-IN"
                                placeholder="₹0.00"
                                className="p-inputtext-lg"
                            />
                        </div>

                        <div className="field mb-4">
                            <label htmlFor="paymentMethod" className="font-semibold text-700">Payment Method</label>
                            <Dropdown
                                id="paymentMethod"
                                value={form.paymentMethod}
                                options={paymentMethodOptions}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.value })}
                                placeholder="Select Method"
                                className="p-inputtext-lg"
                            />
                        </div>

                        <div className="field mb-5">
                            <label htmlFor="status" className="font-semibold text-700">Status</label>
                            <Dropdown
                                id="status"
                                value={form.status}
                                options={statusOptions}
                                onChange={(e) => setForm({ ...form, status: e.value })}
                                placeholder="Select Status"
                                className="p-inputtext-lg"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            label="Save Payment" 
                            icon="pi pi-check" 
                            severity="help"
                            className="w-full p-3 font-bold border-round-xl shadow-2" 
                        />
                    </form>
                  </Card>
              </div>
          )}

          <div className={isAdmin ? "col-12 xl:col-8" : "col-12"}>
            <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none h-full">
              <DataTable 
                value={payments} 
                paginator 
                rows={10} 
                rowsPerPageOptions={[5, 10, 25, 50]}
                loading={loading}
                emptyMessage="No payment records found."
                stripedRows
                hoverableRows
                responsiveLayout="scroll"
                className="p-datatable-sm"
                globalFilter={globalFilter}
                header={header}
                showGridlines={false}
              >
                <Column field="id" header="ID" sortable className="font-bold text-700" style={{ width: '5%' }} />
                <Column field="orderId" header="Order ID" sortable className="font-semibold text-indigo-700" />
                
                {isAdmin && <Column field="userEmail" header="User Email" sortable />}
                
                <Column header="Amount" body={amountBodyTemplate} sortable field="amount" align="right" />
                <Column header="Method" body={paymentMethodTemplate} sortable field="paymentMethod" />
                <Column header="Status" body={statusBodyTemplate} sortable field="status" align="center" />
                
                {isAdmin && (
                    <Column header="Actions" body={actionBodyTemplate} align="center" style={{ minWidth: '12rem' }} />
                )}
              </DataTable>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Payment;
