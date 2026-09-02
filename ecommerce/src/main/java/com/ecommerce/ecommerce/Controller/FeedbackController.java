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

import com.ecommerce.ecommerce.Entity.FeedbackEntity;
import com.ecommerce.ecommerce.Repository.FeedbackRepo;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin("*")
public class FeedbackController {

    @Autowired
    private FeedbackRepo feedbackRepo;

    @PostMapping
    public FeedbackEntity addFeedback(@RequestBody FeedbackEntity feedback) {
        if (feedback.getStatus() == null || feedback.getStatus().isBlank()) {
            feedback.setStatus("NEW");
        }
        return feedbackRepo.save(feedback);
    }

    @GetMapping
    public List<FeedbackEntity> getAllFeedbacks() {
        return feedbackRepo.findAll();
    }

    @PutMapping("/status/{id}")
    public ResponseEntity<String> updateFeedbackStatus(@PathVariable Long id, @RequestParam String status) {
        FeedbackEntity feedback = feedbackRepo.findById(id).orElse(null);
        if (feedback == null) {
            return ResponseEntity.badRequest().body("Feedback not found");
        }
        feedback.setStatus(status);
        feedbackRepo.save(feedback);
        return ResponseEntity.ok("Feedback status updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        if (!feedbackRepo.existsById(id)) {
            return ResponseEntity.badRequest().body("Feedback not found");
        }
        feedbackRepo.deleteById(id);
        return ResponseEntity.ok("Feedback deleted");
    }
}
