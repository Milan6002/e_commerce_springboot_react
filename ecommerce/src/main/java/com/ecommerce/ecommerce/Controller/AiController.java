package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.Services.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate-description")
    public ResponseEntity<?> generateDescription(@RequestBody Map<String, String> request) {
        try {
            String description = aiService.generateProductDescription(request);
            Map<String, String> response = new HashMap<>();
            response.put("description", description);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating AI content: " + e.getMessage());
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> request) {
        try {
            String aiResponse = aiService.generateChatResponse(request);
            Map<String, String> response = new HashMap<>();
            response.put("reply", aiResponse);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating AI chat: " + e.getMessage());
        }
    }

    @PostMapping("/smart-search")
    public ResponseEntity<?> smartSearch(@RequestBody Map<String, String> request) {
        try {
            String route = aiService.analyzeSearchQuery(request);
            Map<String, String> response = new HashMap<>();
            response.put("route", route);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error analyzing search query: " + e.getMessage());
        }
    }

    @GetMapping("/sales-insights")
    public ResponseEntity<?> getSalesInsights() {
        try {
            String insights = aiService.generateSalesInsights();
            Map<String, String> response = new HashMap<>();
            response.put("insights", insights);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error generating sales insights: " + e.getMessage());
        }
    }

    @Autowired
    private com.ecommerce.ecommerce.Repository.FeedbackRepo feedbackRepo;

    @GetMapping("/analyze-feedback")
    public ResponseEntity<?> analyzeFeedback() {
        try {
            java.util.List<com.ecommerce.ecommerce.Entity.FeedbackEntity> feedbacks = feedbackRepo.findAll();
            String summary = aiService.analyzeFeedback(feedbacks);
            Map<String, String> response = new HashMap<>();
            response.put("summary", summary);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error analyzing feedback: " + e.getMessage());
        }
    }
}