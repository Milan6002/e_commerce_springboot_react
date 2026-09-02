package com.ecommerce.ecommerce.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;
import com.ecommerce.ecommerce.Repository.SalesRepo;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Autowired
    private SalesRepo salesRepo;

    @Autowired
    private ProductRepository productRepository;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=";

    private String callGeminiApi(String systemPrompt, String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            String prompt = systemPrompt + "\n\nUser: " + userMessage;

            // Build request body manually to avoid creating many DTO classes
            Map<String, Object> requestBody = new HashMap<>();
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> contentPart = new HashMap<>();
            List<Map<String, String>> parts = new ArrayList<>();
            Map<String, String> textPart = new HashMap<>();
            
            textPart.put("text", prompt);
            parts.add(textPart);
            contentPart.put("parts", parts);
            contents.add(contentPart);
            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(GEMINI_API_URL + geminiApiKey, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> resParts = (List<Map<String, Object>>) content.get("parts");
                    if (resParts != null && !resParts.isEmpty()) {
                        return (String) resParts.get(0).get("text");
                    }
                }
            }
            return "Sorry, I am having trouble understanding that right now.";
        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            return "I apologize, but my AI brain is currently offline. Please try again later.";
        }
    }

    public String generateProductDescription(Map<String, String> request) {
        String name = request.getOrDefault("name", "");
        String category = request.getOrDefault("category", "");
        String brand = request.getOrDefault("brand", "");
        String type = request.getOrDefault("type", "");
        
        String systemPrompt = "You are an expert e-commerce copywriter for Bombay Luggage. Write a compelling, premium, and concise product description for the following product. Use markdown formatting (bolding, bullet points). Keep it under 4 sentences.";
        String userMessage = "Product: " + name + "\nCategory: " + category + "\nBrand: " + brand + "\nType: " + type;
        
        return callGeminiApi(systemPrompt, userMessage);
    }

    public String generateChatResponse(Map<String, String> request) {
        String message = request.getOrDefault("message", "").toLowerCase();
        
        String systemPrompt = "You are the Personal Shopping Assistant for Bombay Luggage. Your job is to help customers find the perfect bag. We sell Backpacks, Duffles, and Luggage (suitcases, trolleys). Our top brands include American Tourister, Safari, VIP, Skybags, Aristocrat. Be polite, friendly, and helpful. Keep responses short (1-3 sentences max). If they ask for a bag for a short trip, recommend Duffles. If they ask for college/laptop, recommend Backpacks. If they ask for a flight/long trip, recommend Luggage. You can speak Gujarati if the user speaks Gujarati.";
        
        return callGeminiApi(systemPrompt, message);
    }

    public String analyzeSearchQuery(Map<String, String> request) {
        String query = request.getOrDefault("query", "").toLowerCase();
        
        String systemPrompt = "Analyze the following user search query for an e-commerce bag store (Bombay Luggage). Determine which category page the user should be redirected to. ONLY reply with exactly one of these strings, nothing else: '/backpack', '/duffle', '/luggage', '/brands', or '/shop'. \n\nRules:\n- If they ask for college, school, laptop, office -> /backpack\n- If they ask for short trip, weekend, gym, sports -> /duffle\n- If they ask for flight, international, long trip, trolley -> /luggage\n- If they mention a brand name (Safari, VIP, American Tourister) -> /brands\n- Otherwise -> /shop";
        
        String response = callGeminiApi(systemPrompt, query).trim();
        
        // Safety check to ensure it returns a valid route
        if (response.equals("/backpack") || response.equals("/duffle") || response.equals("/luggage") || response.equals("/brands")) {
            return response;
        }
        return "/shop";
    }
    public String generateSalesInsights() {
        long totalProducts = productRepository.count();
        long totalSales = salesRepo.count();
        
        String systemPrompt = "You are a Business Intelligence Analyst for Bombay Luggage. Based on the following store statistics, provide 3-4 key bullet points of business insights and suggestions. Keep it short, encouraging, and use markdown formatting (like bolding numbers).";
        String userMessage = "Store Stats: \\nTotal Products in Catalog: " + totalProducts + "\\nTotal Sales Orders: " + totalSales;
        
        return callGeminiApi(systemPrompt, userMessage);
    }

    public String analyzeFeedback(List<com.ecommerce.ecommerce.Entity.FeedbackEntity> feedbacks) {
        if (feedbacks == null || feedbacks.isEmpty()) {
            return "No feedback available to analyze.";
        }
        
        StringBuilder userMessage = new StringBuilder("Here is the recent customer feedback:\n");
        for (com.ecommerce.ecommerce.Entity.FeedbackEntity f : feedbacks) {
            userMessage.append("- Rating: ").append(f.getRating()).append("/5 | Message: ").append(f.getMessage()).append("\n");
        }
        
        String systemPrompt = "You are a Customer Success Manager for Bombay Luggage. Analyze the following list of customer feedbacks. Provide a short, structured summary including:\n" +
                              "1. **Overall Sentiment** (Positive/Neutral/Negative)\n" +
                              "2. **Key Highlights** (What people love)\n" +
                              "3. **Areas for Improvement** (Common complaints, if any).\n" +
                              "Use markdown formatting. Keep it concise (under 150 words).";
                              
        return callGeminiApi(systemPrompt, userMessage.toString());
    }
}