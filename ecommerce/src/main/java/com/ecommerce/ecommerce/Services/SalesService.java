package com.ecommerce.ecommerce.Services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce.Entity.SalesOrder;
import com.ecommerce.ecommerce.Repository.SalesRepo;

@Service
public class SalesService {

    @Autowired
    private SalesRepo repo;

    // 🔥 ADD THIS
    @Autowired
    private InvoiceService invoiceService;

    public SalesOrder save(SalesOrder s) {

        // 🔥 AUTO FIX if frontend misses total
        if (s.getTotalAmount() == 0) {
            s.setTotalAmount(s.getPrice() * s.getQuantity());
        }
        s.setStatus("Pending");
        s.setOrderDate(LocalDateTime.now());

        // ✅ SAVE ORDER
        SalesOrder savedOrder = repo.save(s);

        System.out.println("Order Saved ✅");

        // 🔥 VERY IMPORTANT (Invoice Create)
        invoiceService.createInvoice(savedOrder);

        System.out.println("Invoice Created ✅");

        return savedOrder;
    }

    public List<SalesOrder> getAll() {
        return repo.findAll();
    }

    public SalesOrder getById(Long id) {
        return repo.findById(id).orElseThrow();
    }
}