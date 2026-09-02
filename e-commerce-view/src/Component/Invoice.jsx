import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

// PrimeReact Imports
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';

function Invoice() {
  const location = useLocation();
  const order = location.state;

  if (!order) return <div className="flex justify-content-center mt-8"><Card><h2 className="text-xl font-semibold m-0 text-gray-700">No Invoice Data</h2></Card></div>;

  const customerName =
    order.customerName && order.customerName.trim() !== ""
      ? order.customerName
      : "Guest User";

  // 🔥 Generate invoice number
  const invoiceNumber = "INV-" + Math.floor(Math.random() * 100000);

  const date = new Date().toLocaleDateString();

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("INVOICE", 20, 20);

    doc.setFontSize(10);
    doc.text(`Invoice No: ${invoiceNumber}`, 20, 30);
    doc.text(`Date: ${date}`, 20, 36);

    // 🏢 Company Info
    doc.text("Company: Bombay Luggage", 140, 30);
    doc.text("GST: 22AAAAA0000A1Z5", 140, 36);

    // 👤 Customer Info
    doc.text(`Bill To: ${customerName}`, 20, 50);

    // 📦 TABLE HEADER
    doc.line(20, 60, 190, 60);
    doc.text("Product", 20, 66);
    doc.text("Qty", 140, 66);
    doc.text("Total", 170, 66);
    doc.line(20, 70, 190, 70);

    // 📦 TABLE DATA with text wrapping
    // 110 is the max width for the product text before it hits the Qty column
    const splitProductName = doc.splitTextToSize(order.productName || "Unknown Product", 110);
    
    // Draw product name (could be multiple lines)
    doc.text(splitProductName, 20, 78);
    
    // Draw Qty and Total on the first line
    doc.text(String(order.quantity), 140, 78);
    // Standard jsPDF fonts don't support ₹, so use Rs.
    doc.text(`Rs. ${order.totalAmount}`, 170, 78);

    // Calculate dynamic Y position for the total line based on text height
    // Each line in splitProductName takes approx 5 units of height
    const dynamicY = 80 + (splitProductName.length * 5);

    // 💰 TOTAL
    doc.line(20, dynamicY, 190, dynamicY);
    doc.setFontSize(12);
    doc.text(`Grand Total: Rs. ${order.totalAmount}`, 140, dynamicY + 10);

    // 💳 Payment
    doc.setFontSize(10);
    doc.text(`Payment Method: ${order.paymentMethod}`, 20, dynamicY + 20);

    doc.save("BombayLuggage_Invoice.pdf");
  };

  const invoiceData = [
    {
      productName: order.productName,
      quantity: order.quantity,
      price: `₹${order.price}`,
      total: `₹${order.totalAmount}`
    }
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen flex justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
      
      <Card className="w-full max-w-3xl shadow-6 border-round-2xl p-4 md:p-6 bg-white relative overflow-hidden border-none">
        
        {/* Decorative corner */}
        <div className="absolute bg-green-500" style={{ width: '150px', height: '150px', top: '-75px', right: '-75px', transform: 'rotate(45deg)' }}></div>
        <i className="pi pi-check-circle text-white text-3xl absolute" style={{ top: '15px', right: '15px' }}></i>

        <div className="flex flex-column md:flex-row justify-content-between align-items-center mb-6 gap-4">
            <div>
                <h1 className="text-4xl font-extrabold m-0 text-gray-900 tracking-tight">INVOICE</h1>
                <p className="text-gray-500 mt-1 m-0">Thank you for your purchase!</p>
            </div>
            <Button
                onClick={downloadPDF}
                label="Download PDF"
                icon="pi pi-download"
                className="p-button-outlined p-button-secondary border-round-3xl font-bold"
            />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 border-round-xl border-1 surface-border">
            <div className="col-12 sm:col-6">
                <p className="text-gray-500 text-sm m-0 mb-1">Invoice Number</p>
                <p className="font-bold text-gray-900 text-lg m-0">{invoiceNumber}</p>
            </div>
            <div className="col-12 sm:col-6">
                <p className="text-gray-500 text-sm m-0 mb-1">Date of Issue</p>
                <p className="font-bold text-gray-900 text-lg m-0">{date}</p>
            </div>
            <div className="col-12 sm:col-6">
                <p className="text-gray-500 text-sm m-0 mb-1">Billed To</p>
                <p className="font-bold text-indigo-600 text-lg m-0">{customerName}</p>
            </div>
            <div className="col-12 sm:col-6">
                <p className="text-gray-500 text-sm m-0 mb-1">Issued By</p>
                <p className="font-bold text-gray-900 text-lg m-0">Bombay Luggage</p>
                <p className="text-gray-500 text-xs m-0">GST: 22AAAAA0000A1Z5</p>
            </div>
        </div>

        {/* Order Details */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 border-bottom-1 surface-border pb-2">Order Details</h3>
        
        <div className="mb-5">
            <div className="flex justify-content-between align-items-center p-3 surface-100 border-round-top font-bold text-gray-700">
                <div className="w-6">Product</div>
                <div className="w-2 text-center">Qty</div>
                <div className="w-4 text-right">Total</div>
            </div>
            <div className="flex justify-content-between align-items-center p-3 border-bottom-1 border-left-1 border-right-1 surface-border border-round-bottom bg-white">
                <div className="w-6 font-medium text-gray-800 pr-3">{order.productName}</div>
                <div className="w-2 text-center font-bold">{order.quantity}</div>
                <div className="w-4 text-right font-bold text-lg text-gray-900">₹{order.totalAmount}</div>
            </div>
        </div>

        {/* Footer Totals */}
        <div className="flex flex-column md:flex-row justify-content-between align-items-end gap-4 mt-4">
            <div className="bg-indigo-50 p-3 border-round-xl border-1 border-indigo-100 flex align-items-center gap-3 w-full md:w-auto">
                <div className="bg-white border-circle w-2rem h-2rem flex align-items-center justify-content-center shadow-1">
                    <i className="pi pi-credit-card text-indigo-500"></i>
                </div>
                <div>
                    <p className="text-indigo-900 text-sm m-0 font-medium">Payment Method</p>
                    <p className="text-indigo-700 font-bold m-0">{order.paymentMethod}</p>
                </div>
            </div>

            <div className="text-right w-full md:w-auto">
                <p className="text-gray-500 mb-1 text-sm m-0">Amount Paid</p>
                <p className="text-4xl font-extrabold text-green-600 m-0">
                  ₹{order.totalAmount}
                </p>
            </div>
        </div>

      </Card>
    </div>
  );
}

export default Invoice;
