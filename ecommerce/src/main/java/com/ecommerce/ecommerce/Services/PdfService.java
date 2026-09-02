package com.ecommerce.ecommerce.Services;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(InvoiceEntity invoice) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("INVOICE"));
            document.add(new Paragraph("Invoice No: " + invoice.getInvoiceNumber()));
            document.add(new Paragraph("Customer: " + invoice.getCustomerName()));
            document.add(new Paragraph("Product: " + invoice.getProductName()));
            document.add(new Paragraph("Qty: " + invoice.getQuantity()));
            document.add(new Paragraph("Price: ₹" + invoice.getPrice()));
            document.add(new Paragraph("Total: ₹" + invoice.getTotalAmount()));
            document.add(new Paragraph("Payment: " + invoice.getPaymentMethod()));

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}