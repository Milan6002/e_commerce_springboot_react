import { useEffect, useState, useRef } from "react";
import AdminServices from "../Services/AdminServices";
import axios from "axios";
import { motion } from "framer-motion";

// PrimeReact Imports
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { Dialog } from "primereact/dialog";

function AdminBulkOrders() {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [callingId, setCallingId] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem("bland_api_key") || "");
    const toast = useRef(null);

    useEffect(() => {
        loadInquiries();
    }, []);

    const saveApiKey = () => {
        localStorage.setItem("bland_api_key", apiKey);
        setShowSettings(false);
        toast.current?.show({ severity: 'success', summary: 'Saved', detail: 'API Key saved successfully.', life: 3000 });
    }

    const loadInquiries = async () => {
        setLoading(true);
        try {
            const response = await AdminServices.getAllBulkOrderInquiries();
            setInquiries(response.data);
        } catch (error) {
            console.error("Error fetching bulk order inquiries:", error);
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load inquiries', life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const sendWhatsAppMessage = (rowData) => {
        let phone = rowData.phone;
        if (!phone.startsWith("+") && !phone.startsWith("91")) {
            phone = "91" + phone;
        }
        
        // Remove spaces and special characters from phone
        phone = phone.replace(/\D/g, '');

        const message = `Hello ${rowData.firstName},\n\nI am reaching out from *Bombay Luggage*. We received your bulk order inquiry for *${rowData.quantity} units* of *${rowData.category}*.\n\nCould you please confirm your special requirements so we can proceed with a quotation?\n\nThank you!`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
        
        // Open WhatsApp in a new tab
        window.open(whatsappUrl, '_blank');
        
        toast.current?.show({ severity: 'success', summary: 'WhatsApp Opened', detail: 'Drafted message ready to send.', life: 3000 });
    };

    // --- Templates ---
    const dateTemplate = (rowData) => {
        if (!rowData.createdAt) return "-";
        return (
            <div className="flex align-items-center gap-2">
                <i className="pi pi-calendar text-500"></i>
                <span className="font-medium text-700">
                    {new Date(rowData.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    })}
                </span>
            </div>
        );
    };

    const customerTemplate = (rowData) => {
        return (
            <div className="flex flex-column gap-1">
                <span className="font-bold text-800 text-lg">{rowData.firstName} {rowData.lastName}</span>
                <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-2 py-1 border-round w-max">
                    <i className="pi pi-building text-xs mr-1"></i> {rowData.companyName || 'Individual'}
                </span>
            </div>
        );
    };

    const contactTemplate = (rowData) => {
        return (
            <div className="flex flex-column gap-2 text-sm text-700">
                <div className="flex align-items-center gap-2">
                    <div className="w-2rem h-2rem border-circle bg-blue-50 flex align-items-center justify-content-center text-blue-500">
                        <i className="pi pi-envelope"></i>
                    </div>
                    <span>{rowData.email}</span>
                </div>
                <div className="flex align-items-center gap-2">
                    <div className="w-2rem h-2rem border-circle bg-green-50 flex align-items-center justify-content-center text-green-500">
                        <i className="pi pi-phone"></i>
                    </div>
                    <span className="font-medium">{rowData.phone}</span>
                </div>
            </div>
        );
    };

    const productTemplate = (rowData) => {
        return (
            <div className="flex flex-column gap-2 align-items-start">
                <Tag value={rowData.category} severity="info" className="border-round-xl px-3" />
                <div className="bg-gray-100 border-round px-3 py-1 font-bold text-gray-800">
                    Qty: <span className="text-primary text-lg">{rowData.quantity}</span>
                </div>
            </div>
        );
    };

    const actionTemplate = (rowData) => {
        return (
            <div className="flex justify-content-center">
                <Button
                    label="WhatsApp"
                    icon="pi pi-whatsapp"
                    severity="success"
                    outlined
                    rounded
                    size="small"
                    onClick={() => sendWhatsAppMessage(rowData)}
                    className="shadow-1 font-bold transition-colors transition-duration-200 hover:bg-green-50 px-3"
                    tooltip="Message customer on WhatsApp"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 text-xl font-bold text-800">Bulk Inquiries</h4>
            <div className="flex align-items-center gap-2">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText 
                        type="search" 
                        onInput={(e) => setGlobalFilter(e.target.value)} 
                        placeholder="Search inquiries..." 
                        className="p-inputtext-sm border-round-3xl w-15rem" 
                    />
                </IconField>
                <Button icon="pi pi-refresh" rounded text severity="secondary" onClick={loadInquiries} loading={loading} />
                <Button icon="pi pi-cog" rounded outlined severity="help" onClick={() => setShowSettings(true)} tooltip="AI Voice Settings" tooltipOptions={{position: 'top'}} />
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-6 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
            <Toast ref={toast} />

            <Dialog header="AI Voice Settings" visible={showSettings} style={{ width: '400px' }} onHide={() => setShowSettings(false)}>
                <div className="flex flex-column gap-3 py-3">
                    <p className="m-0 text-600 text-sm">To make real phone calls, please enter your Bland AI API Key. You can get one by signing up at <a href="https://bland.ai" target="_blank" rel="noopener noreferrer">bland.ai</a>.</p>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="apiKey" className="font-bold">Bland AI API Key</label>
                        <InputText id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." />
                    </div>
                    <Button label="Save Key" icon="pi pi-save" onClick={saveApiKey} severity="success" className="mt-2" />
                </div>
            </Dialog>

            {/* Decorative background blur */}
            <div className="absolute border-circle bg-purple-400 opacity-10" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', filter: 'blur(80px)' }}></div>
            <div className="absolute border-circle bg-teal-400 opacity-10" style={{ width: '300px', height: '300px', bottom: '-50px', left: '-50px', filter: 'blur(60px)' }}></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-screen-2xl mx-auto relative z-1"
            >
                <div className="flex align-items-center gap-3 mb-5">
                    <div className="w-4rem h-4rem border-circle bg-white shadow-2 flex align-items-center justify-content-center text-purple-600">
                        <i className="pi pi-briefcase text-2xl"></i>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-900 m-0">B2B Orders</h1>
                        <p className="text-500 m-0 mt-1">Manage corporate and high-volume requests</p>
                    </div>
                </div>

                <Card className="shadow-4 border-round-2xl overflow-hidden p-0 border-none">
                    {loading ? (
                        <div className="p-4">
                            <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
                            <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
                            <Skeleton height="3rem" className="mb-2 border-round-xl"></Skeleton>
                            <Skeleton height="3rem" className="border-round-xl"></Skeleton>
                        </div>
                    ) : (
                        <DataTable 
                            value={inquiries} 
                            paginator 
                            rows={10} 
                            dataKey="id" 
                            globalFilter={globalFilter}
                            header={header}
                            emptyMessage="No bulk order inquiries found."
                            responsiveLayout="scroll"
                            stripedRows
                            hoverableRows
                            className="p-datatable-sm"
                            showGridlines={false}
                        >
                            <Column field="createdAt" header="Date" body={dateTemplate} sortable style={{ minWidth: '10rem' }} />
                            <Column header="Client" body={customerTemplate} sortable field="firstName" style={{ minWidth: '14rem' }} />
                            <Column header="Contact Info" body={contactTemplate} style={{ minWidth: '16rem' }} />
                            <Column header="Order Specs" body={productTemplate} style={{ minWidth: '12rem' }} />
                            <Column field="requirements" header="Notes" style={{ minWidth: '15rem' }} body={(rowData) => <div className="text-sm text-600 line-height-3 surface-100 p-2 border-round" style={{ maxWidth: '250px', maxHeight: '80px', overflowY: 'auto' }}>{rowData.requirements || 'No special requirements.'}</div>} />
                            <Column header="AI Agent" body={actionTemplate} align="center" style={{ minWidth: '10rem' }} />
                        </DataTable>
                    )}
                </Card>
            </motion.div>
        </div>
    );
}

export default AdminBulkOrders;
