package com.ecommerce.ecommerce.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.ecommerce.ecommerce.Repository.InvoiceRepo;

import java.util.List;

@RestController
@RequestMapping("/api/invoice")
@CrossOrigin("*")
public class InvoiceController {

    @Autowired
    private InvoiceRepo repo;

    // 📋 Get All Invoices (Admin)
    @GetMapping
    public List<InvoiceEntity> getAll(){
        return repo.findAll();
    }

    // 🔍 Get Single Invoice
    @GetMapping("/{id}")
    public InvoiceEntity getById(@PathVariable Long id){
        return repo.findById(id).orElseThrow();
    }
    
}