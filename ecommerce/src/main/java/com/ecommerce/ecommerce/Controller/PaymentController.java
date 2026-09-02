package com.ecommerce.ecommerce.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.ecommerce.Entity.PaymentEntity;
import com.ecommerce.ecommerce.Repository.PaymentRepo;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentRepo paymentRepo;

    @PostMapping
    public PaymentEntity createPayment(@RequestBody PaymentEntity payment) {
        if (payment.getStatus() == null || payment.getStatus().isBlank()) {
            payment.setStatus("PENDING");
        }
        return paymentRepo.save(payment);
    }

    @GetMapping
    public List<PaymentEntity> getAllPayments() {
        return paymentRepo.findAll();
    }

    @GetMapping("/user/{email}")
    public List<PaymentEntity> getPaymentsByUser(@PathVariable String email) {
        return paymentRepo.findByUserEmailIgnoreCase(email);
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<String> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        PaymentEntity payment = paymentRepo.findById(id).orElse(null);
        if (payment == null) {
            return ResponseEntity.badRequest().body("Payment not found");
        }
        payment.setStatus(status);
        paymentRepo.save(payment);
        return ResponseEntity.ok("Payment status updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable Long id) {
        if (!paymentRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Payment not found");
        }
        paymentRepo.deleteById(id);
        return ResponseEntity.ok("Payment deleted");
    }
}
