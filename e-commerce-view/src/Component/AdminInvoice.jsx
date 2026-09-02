import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminServices from "../Services/AdminServices";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

// PrimeReact Imports
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";

function AdminInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    AdminServices.getInvoiceById(id)
      .then(res => setInvoice(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    if (!invoice) return;
    
    const doc = new jsPDF();
    const date = new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text("INVOICE", 20, 20);

    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 20, 30);
    doc.text(`Date: ${date}`, 20, 36);

    // Company Info
    doc.text("Company: Bombay Luggage", 140, 30);
    doc.text("GST: 22AAAAA0000A1Z5", 140, 36);

    // Customer Info
    doc.text(`Bill To: ${invoice.customerName || "Customer"}`, 20, 50);

    // TABLE HEADER
    doc.line(20, 60, 190, 60);
    doc.text("Product", 20, 66);
    doc.text("Qty", 140, 66);
    doc.text("Total", 170, 66);
    doc.line(20, 70, 190, 70);

    // TABLE DATA with text wrapping
    const splitProductName = doc.splitTextToSize(invoice.productName || "Unknown Product", 110);
    doc.text(splitProductName, 20, 78);
    
    doc.text(String(invoice.quantity || 1), 140, 78);
    // Standard jsPDF fonts don't support Indian Rupee symbol well, use Rs.
    doc.text(`Rs. ${invoice.totalAmount}`, 170, 78);

    const dynamicY = 80 + (splitProductName.length * 5);

    // TOTAL
    doc.line(20, dynamicY, 190, dynamicY);
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs. ${invoice.totalAmount}`, 140, dynamicY + 10);

    // Payment Info
    doc.setFontSize(10);
    doc.text(`Payment Method: ${invoice.paymentMethod || 'N/A'}`, 20, dynamicY + 20);
    doc.text(`Payment Status: ${invoice.paymentStatus || 'PENDING'}`, 20, dynamicY + 26);

    doc.save(`${invoice.invoiceNumber}_Invoice.pdf`);
  };

  const InfoBlock = ({ label, value, icon }) => (
    <div className="flex align-items-center mb-3">
      <div className="w-2rem h-2rem border-circle bg-gray-100 flex align-items-center justify-content-center text-gray-600 mr-3">
        <i className={`pi ${icon}`}></i>
      </div>
      <div>
        <span className="text-500 block text-xs font-semibold uppercase tracking-wide mb-1">{label}</span>
        <span className="text-900 font-medium">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen flex justify-content-center align-items-start pt-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}>
      
      {/* Decorative background blur */}
      <div className="absolute border-circle bg-teal-400 opacity-10" style={{ width: '300px', height: '300px', top: '-50px', right: '-50px', filter: 'blur(60px)' }}></div>
      <div className="absolute border-circle bg-blue-400 opacity-10" style={{ width: '400px', height: '400px', bottom: '-100px', left: '-100px', filter: 'blur(80px)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-full max-w-4xl z-1"
      >
        <div className="flex justify-content-between align-items-center mb-4 hide-print">
            <Button 
                icon="pi pi-arrow-left" 
                label="Back to Invoices" 
                className="p-button-text p-button-secondary font-bold" 
                onClick={() => navigate(-1)} 
            />
            <Button 
                icon="pi pi-download" 
                label="Download PDF Invoice" 
                severity="info"
                rounded
                outlined
                className="shadow-1 font-bold"
                onClick={handlePrint} 
            />
        </div>

        <Card className="shadow-6 border-round-2xl overflow-hidden p-0 border-none relative print-card">
          {loading ? (
            <div className="p-5 space-y-4">
              <Skeleton height="3rem" className="mb-4" />
              <Skeleton height="2rem" width="50%" className="mb-3" />
              <Divider />
              <Skeleton height="2rem" className="mb-3" />
              <Skeleton height="2rem" className="mb-3" />
              <Skeleton height="4rem" className="mt-5" />
            </div>
          ) : !invoice ? (
            <div className="text-center p-6">
              <div className="w-6rem h-6rem border-circle bg-gray-100 flex align-items-center justify-content-center mx-auto mb-4">
                <i className="pi pi-exclamation-circle text-4xl text-gray-400"></i>
              </div>
              <h2 className="text-gray-800 m-0 mb-2">Invoice Not Found</h2>
              <p className="text-gray-500 m-0">The requested invoice could not be located.</p>
            </div>
          ) : (
            <div className="p-0">
              {/* Header Section */}
              <div className="p-5 md:p-6" style={{ background: 'linear-gradient(90deg, #115e59 0%, #14b8a6 100%)', color: 'white' }}>
                  <div className="flex flex-column md:flex-row justify-content-between align-items-md-center">
                      <div>
                          <h1 className="m-0 text-3xl font-bold mb-2">INVOICE</h1>
                          <p className="m-0 opacity-80 font-medium text-lg">#{invoice.invoiceNumber}</p>
                      </div>
                      <div className="mt-4 md:mt-0 text-left md:text-right">
                          <p className="m-0 opacity-80 text-sm mb-1 uppercase tracking-wide">Date of Issue</p>
                          <p className="m-0 font-semibold text-lg">{new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                  </div>
              </div>

              <div className="p-5 md:p-6">
                  {/* Status Banner */}
                  <div className="flex justify-content-between align-items-center p-4 surface-50 border-round-xl mb-5 border-1 surface-border">
                      <div className="flex align-items-center">
                          <i className="pi pi-info-circle text-gray-500 mr-2 text-xl"></i>
                          <span className="font-medium text-gray-700">Payment Status</span>
                      </div>
                      <Tag 
                        value={invoice.paymentStatus || 'PENDING'} 
                        severity={invoice.paymentStatus?.toUpperCase() === 'SUCCESS' ? 'success' : 'warning'} 
                        className="px-3 py-2 text-sm font-bold border-round-3xl"
                        icon={invoice.paymentStatus?.toUpperCase() === 'SUCCESS' ? 'pi pi-check-circle' : 'pi pi-clock'}
                      />
                  </div>

                  {/* Two Column Details */}
                  <div className="grid">
                      <div className="col-12 md:col-6 pr-md-4">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 border-bottom-1 surface-border pb-2">Customer Details</h3>
                          <InfoBlock icon="pi-user" label="Customer Name" value={invoice.customerName} />
                      </div>
                      <div className="col-12 md:col-6 pl-md-4 mt-4 md:mt-0">
                          <h3 className="text-lg font-bold text-gray-800 mb-4 border-bottom-1 surface-border pb-2">Order Summary</h3>
                          <InfoBlock icon="pi-box" label="Product" value={invoice.productName} />
                          <InfoBlock icon="pi-sort-numeric-up" label="Quantity" value={invoice.quantity} />
                          <InfoBlock icon="pi-wallet" label="Payment Method" value={invoice.paymentMethod || "Not specified"} />
                      </div>
                  </div>

                  {/* Total Section */}
                  <div className="mt-6 border-round-2xl overflow-hidden shadow-1">
                      <div className="flex justify-content-between align-items-center p-4 bg-gray-50 border-bottom-1 surface-border">
                          <span className="font-semibold text-gray-600">Subtotal</span>
                          <span className="font-semibold text-gray-900">₹{invoice.totalAmount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-content-between align-items-center p-4" style={{ background: 'linear-gradient(90deg, #f0fdfa 0%, #ccfbf1 100%)' }}>
                          <span className="text-xl font-bold text-teal-800">Total Amount</span>
                          <span className="text-3xl font-bold text-teal-600">₹{invoice.totalAmount?.toLocaleString()}</span>
                      </div>
                  </div>
                  
                  <div className="text-center mt-6 pt-4 border-top-1 surface-border opacity-60">
                      <p className="m-0 text-sm">Thank you for your business. For any queries regarding this invoice, please contact support.</p>
                      <p className="m-0 text-sm font-bold mt-1">Bombay Luggage</p>
                  </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
      
      {/* CSS for print mode */}
      <style>{`
        @media print {
            body { background: white !important; }
            .hide-print { display: none !important; }
            .print-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
        }
      `}</style>
    </div>
  );
}

export default AdminInvoice;