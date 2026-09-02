package com.ecommerce.ecommerce.Controller;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.ecommerce.ecommerce.Entity.SalesOrder;
import com.ecommerce.ecommerce.Entity.Supplier;
import com.ecommerce.ecommerce.Repository.InvoiceRepo;
import com.ecommerce.ecommerce.Repository.SalesRepo;
import com.ecommerce.ecommerce.Repository.SupplierRepo;

@RestController
@RequestMapping("/api/supplier")
@CrossOrigin("*")
public class supplierController {

    @Autowired
    private SupplierRepo supplierRepo;

    @Autowired
    private SalesRepo orderRepo;

    @Autowired
    private InvoiceRepo invoiceRepo;

    // Create Supplier
    @PostMapping
    public ResponseEntity<?> createSupplier(@RequestBody Supplier supplier) {
        if (supplierRepo.findByEmail(supplier.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Supplier email already exists");
        }
        return ResponseEntity.ok(supplierRepo.save(supplier));
    }

    // Get all Suppliers
    @GetMapping
    public List<Supplier> getSuppliers() {
        return supplierRepo.findAll();
    }

    // Delete Supplier
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable Long id) {
        if (!supplierRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Supplier Not Found");
        }
        supplierRepo.deleteById(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }

    // Supplier Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Supplier loginPayload) {
        String email = loginPayload.getEmail();
        String password = loginPayload.getPassword();

        Supplier supplier = supplierRepo.findByEmail(email);

        if (supplier == null)
            return ResponseEntity.badRequest().body("Supplier Not Found");

        if (!supplier.getPassword().equals(password))
            return ResponseEntity.badRequest().body("Invalid Password");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login Success");
        response.put("supplier", supplier);
        return ResponseEntity.ok(response);
    }

    // Supplier sees all orders to process
    @GetMapping("/orders")
    public List<SalesOrder> getOrders() {
        return orderRepo.findAll();
    }

    // Fulfill Order
    @PutMapping("/fulfill/{id}")
    public String fulfillOrder(@PathVariable Long id) {

        SalesOrder order = orderRepo.findById(id).orElse(null);

        if (order == null)
            return "Order Not Found";

        order.setStatus("FULFILLED");
        orderRepo.save(order);

        return "Order Fulfilled";
    }

    // Ship Order
    @PutMapping("/ship/{id}")
    public String shipOrder(@PathVariable Long id) {

        SalesOrder order = orderRepo.findById(id).orElse(null);

        if (order == null)
            return "Order Not Found";

        order.setStatus("SHIPPED");
        orderRepo.save(order);

        return "Order Shipped";
    }

    // Generate invoice from order
    @PostMapping("/invoice/{orderId}")
    public ResponseEntity<?> generateInvoice(@PathVariable Long orderId) {
        SalesOrder order = orderRepo.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.badRequest().body("Order Not Found");
        }

        InvoiceEntity invoice = new InvoiceEntity();
        invoice.setOrderId(order.getId());
        invoice.setCustomerName(order.getCustomerName());
        invoice.setProductName(order.getProductName());
        invoice.setQuantity(order.getQuantity());
        invoice.setPrice(order.getPrice());
        invoice.setTotalAmount(order.getTotalAmount());
        invoice.setPaymentMethod(order.getPaymentMethod());
        invoice.setPaymentStatus(order.getPaymentStatus());
        invoice.setInvoiceDate(LocalDateTime.now());
        invoice.setInvoiceNumber("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return ResponseEntity.ok(invoiceRepo.save(invoice));
    }
}
