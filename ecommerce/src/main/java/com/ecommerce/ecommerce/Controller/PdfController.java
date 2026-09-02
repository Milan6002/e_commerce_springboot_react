package com.ecommerce.ecommerce.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Entity.InvoiceEntity;
import com.ecommerce.ecommerce.Repository.InvoiceRepo;
import com.ecommerce.ecommerce.Services.EmailService;
import com.ecommerce.ecommerce.Services.PdfService;

@RestController
@RequestMapping("/api/pdf")
@CrossOrigin("*")
public class PdfController {

    @Autowired
    private InvoiceRepo repo;

    @Autowired
    private PdfService pdfService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/send/{id}")
    public String sendInvoice(@PathVariable Long id,
                             @RequestParam String email){

        InvoiceEntity invoice = repo.findById(id).orElseThrow();

        byte[] pdf = pdfService.generateInvoicePdf(invoice);

        emailService.sendInvoice(email, pdf);

        return "Invoice Sent Successfully ✅";
    }
}