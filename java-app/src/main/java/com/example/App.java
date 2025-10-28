package com.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;

/**
 * Hello World Java Application
 * This application can be integrated with Azure Logic Apps for data processing
 */
public class App {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    public static void main(String[] args) {
        System.out.println("Hello World from Java Application!");
        
        // Create sample data that could be sent to Logic Apps
        Map<String, Object> data = createSampleData();
        
        try {
            String json = objectMapper.writeValueAsString(data);
            System.out.println("Sample data for Logic Apps: " + json);
        } catch (Exception e) {
            System.err.println("Error creating JSON: " + e.getMessage());
        }
    }
    
    /**
     * Creates sample data that can be sent to Azure Logic Apps
     * @return Map containing sample data
     */
    public static Map<String, Object> createSampleData() {
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Hello from Java App");
        data.put("timestamp", System.currentTimeMillis());
        data.put("status", "active");
        data.put("version", "1.0.0");
        
        return data;
    }
    
    /**
     * Processes data received from Logic Apps
     * @param inputData Input data map
     * @return Processed data map
     */
    public static Map<String, Object> processData(Map<String, Object> inputData) {
        Map<String, Object> result = new HashMap<>();
        result.put("original", inputData);
        result.put("processed", true);
        result.put("processedAt", System.currentTimeMillis());
        
        return result;
    }
}