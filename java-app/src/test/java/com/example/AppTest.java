package com.example;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Map;

/**
 * Unit tests for App class
 */
public class AppTest {
    
    @Test
    @DisplayName("Should create sample data with required fields")
    public void testCreateSampleData() {
        Map<String, Object> data = App.createSampleData();
        
        assertNotNull(data);
        assertTrue(data.containsKey("message"));
        assertTrue(data.containsKey("timestamp"));
        assertTrue(data.containsKey("status"));
        assertTrue(data.containsKey("version"));
        
        assertEquals("Hello from Java App", data.get("message"));
        assertEquals("active", data.get("status"));
        assertEquals("1.0.0", data.get("version"));
    }
    
    @Test
    @DisplayName("Should process input data correctly")
    public void testProcessData() {
        Map<String, Object> inputData = App.createSampleData();
        Map<String, Object> result = App.processData(inputData);
        
        assertNotNull(result);
        assertTrue(result.containsKey("original"));
        assertTrue(result.containsKey("processed"));
        assertTrue(result.containsKey("processedAt"));
        
        assertEquals(inputData, result.get("original"));
        assertEquals(true, result.get("processed"));
        assertNotNull(result.get("processedAt"));
    }
}