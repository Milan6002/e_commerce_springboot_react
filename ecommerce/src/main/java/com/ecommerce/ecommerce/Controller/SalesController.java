package com.ecommerce.ecommerce.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.ecommerce.ecommerce.Entity.PaymentEntity;
import com.ecommerce.ecommerce.Entity.SalesOrder;
import com.ecommerce.ecommerce.Services.SalesService;
import com.ecommerce.ecommerce.Repository.InvoiceRepo;
import com.ecommerce.ecommerce.Repository.PaymentRepo;
import com.ecommerce.ecommerce.Repository.SalesRepo;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/sales")
@CrossOrigin("*")
public class SalesController {

    @Autowired
    private SalesService service;

    @Autowired
    private SalesRepo orderRepo; // ✅ ADD THIS

    @Autowired
    private InvoiceRepo invoiceRepo; // ✅ ADD THIS

    @Autowired
    private PaymentRepo paymentRepo;

    @PostMapping
    public SalesOrder add(@RequestBody SalesOrder s) {
        return service.save(s);
    }

    @GetMapping
    public List<SalesOrder> getAll() {
        return service.getAll();
    }

    @PutMapping("/status/{id}")
    public SalesOrder updateStatus(@PathVariable Long id, @RequestParam String status) {
        SalesOrder order = service.getById(id);
        order.setStatus(status);
        return orderRepo.save(order);
    }

    // ✅ FIXED METHOD
    @PostMapping("/placeOrder")
    public SalesOrder placeOrder(@RequestBody SalesOrder order) {

        // ✅ Set default payment method only if missing
        if (order.getPaymentMethod() == null || order.getPaymentMethod().isBlank()) {
            order.setPaymentMethod("COD");
        }
        
        // Realistic Payment Logic
        if (order.getPaymentMethod().equalsIgnoreCase("UPI") || order.getPaymentMethod().equalsIgnoreCase("Card")) {
            order.setPaymentStatus("SUCCESS");
        } else {
            order.setPaymentStatus("PENDING");
        }

        // 1. Save Order
        SalesOrder savedOrder = orderRepo.save(order);

        // 2. Create Invoice
        InvoiceEntity invoice = new InvoiceEntity();
        invoice.setOrderId(savedOrder.getId());
        invoice.setCustomerName(savedOrder.getCustomerName());
        invoice.setProductName(savedOrder.getProductName());
        invoice.setQuantity(savedOrder.getQuantity());
        invoice.setPrice(savedOrder.getPrice());
        invoice.setTotalAmount(savedOrder.getTotalAmount());
        invoice.setPaymentMethod(savedOrder.getPaymentMethod());
        invoice.setPaymentStatus(savedOrder.getPaymentStatus());

        invoice.setInvoiceNumber("INV-" + System.currentTimeMillis());
        invoice.setInvoiceDate(LocalDateTime.now());

        invoiceRepo.save(invoice);

        // 3. Create payment record for admin/user views
        PaymentEntity payment = new PaymentEntity();
        payment.setOrderId(savedOrder.getId());
        payment.setAmount(savedOrder.getTotalAmount());
        payment.setPaymentMethod(savedOrder.getPaymentMethod());
        payment.setStatus(savedOrder.getPaymentStatus());
        payment.setUserEmail(savedOrder.getCustomerEmail());
        paymentRepo.save(payment);

        return savedOrder;
    }

    @PutMapping("/payment/{id}")
    public SalesOrder markPaid(@PathVariable Long id) {

        // 1. Update Order (Graceful fallback)
        SalesOrder order = orderRepo.findById(id).orElse(null);
        if (order != null) {
            order.setPaymentStatus("SUCCESS");
            orderRepo.save(order);
        }

        // 2. Update Invoice
        InvoiceEntity invoice = invoiceRepo.findByOrderId(id);
        if (invoice == null) {
            invoice = invoiceRepo.findById(id).orElse(null); // Fallback
        }
        if (invoice != null) {
            invoice.setPaymentStatus("SUCCESS");
            invoiceRepo.save(invoice);
        }

        // 3. Update Payment
        PaymentEntity payment = paymentRepo.findByOrderId(id);
        if (payment == null) {
            payment = paymentRepo.findById(id).orElse(null); // Fallback
        }
        if (payment != null) {
            payment.setStatus("SUCCESS");
            paymentRepo.save(payment);
        }

        return order;
    }

    @PutMapping("/deliver/{id}")
    public SalesOrder markDelivered(@PathVariable Long id) {

        SalesOrder order = orderRepo.findById(id).get();
        order.setStatus("Delivered");
        
        // Auto-mark Cash/COD as SUCCESS upon delivery
        if (order.getPaymentMethod() != null && 
           (order.getPaymentMethod().equalsIgnoreCase("Cash") || order.getPaymentMethod().equalsIgnoreCase("COD") || order.getPaymentMethod().contains("Cash"))) {
            order.setPaymentStatus("SUCCESS");
            
            InvoiceEntity invoice = invoiceRepo.findByOrderId(id);
            if (invoice == null) invoice = invoiceRepo.findById(id).orElse(null);
            if (invoice != null) {
                invoice.setPaymentStatus("SUCCESS");
                invoiceRepo.save(invoice);
            }
            
            PaymentEntity payment = paymentRepo.findByOrderId(id);
            if (payment == null) payment = paymentRepo.findById(id).orElse(null);
            if (payment != null) {
                payment.setStatus("SUCCESS");
                paymentRepo.save(payment);
            }
        }

        return orderRepo.save(order);
    }
}