package com.ecommerce.ecommerce.Controller;

import com.ecommerce.ecommerce.Entity.BulkOrderInquiry;
import com.ecommerce.ecommerce.Repository.BulkOrderInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/bulk-order")
public class BulkOrderInquiryController {

    @Autowired
    private BulkOrderInquiryRepository bulkOrderInquiryRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitInquiry(@RequestBody BulkOrderInquiry inquiry) {
        try {
            BulkOrderInquiry savedInquiry = bulkOrderInquiryRepository.save(inquiry);
            return ResponseEntity.ok(savedInquiry);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving inquiry: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<BulkOrderInquiry>> getAllInquiries() {
        return ResponseEntity.ok(bulkOrderInquiryRepository.findAll());
    }

    @PostMapping("/ai-call-confirm/{id}")
    public ResponseEntity<?> initiateAICallConfirm(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String apiKey) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty() || apiKey.equals("Bearer null")) {
                return ResponseEntity.badRequest().body("Bland AI API Key is required.");
            }
            
            // Extract token if it starts with Bearer
            String token = apiKey.replace("Bearer ", "").trim();

            BulkOrderInquiry inquiry = bulkOrderInquiryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inquiry not found"));
            
            // Build the prompt for the AI Agent
            String prompt = String.format("Hello %s, I am calling from Bombay Luggage. " +
                "We received your bulk order inquiry for %d units of %s. " +
                "We just wanted to confirm if you placed this request and if you have any special requirements.", 
                inquiry.getFirstName(), inquiry.getQuantity(), inquiry.getCategory());
            
            String phoneNumber = inquiry.getPhone();
            if (phoneNumber != null && !phoneNumber.startsWith("+")) {
                phoneNumber = "+91" + phoneNumber; // Default to India country code
            }

            // Real API Call to Bland AI
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("authorization", token);

            // Construct JSON body
            String jsonBody = String.format("{\"phone_number\": \"%s\", \"task\": \"%s\", \"voice\": \"maya\", \"reduce_latency\": true}", 
                                             phoneNumber, prompt.replace("\"", "\\\""));
            
            org.springframework.http.HttpEntity<String> request = new org.springframework.http.HttpEntity<>(jsonBody, headers);
            
            String response = restTemplate.postForObject("https://api.bland.ai/v1/calls", request, String.class);

            System.out.println("Bland AI Response: " + response);

            return ResponseEntity.ok("AI Call initiated successfully to " + phoneNumber);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Bland AI Error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            return ResponseEntity.status(e.getStatusCode()).body("Failed to connect to Voice API. Check your API Key and credits. Details: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error initiating AI call: " + e.getMessage());
        }
    }
}
