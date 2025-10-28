# 🤖 AI Agent Integration Guide - Multi-Passenger Flight Booking

## 📋 **EXACT INSTRUCTIONS FOR AI AGENT**

### **Action Tool Configuration**

**Tool Name**: `call_flight_booking_api`  
**Description**: "Book flights for single or multiple passengers using Terminal API"  
**Method**: POST  
**URL**: `https://prod-08.eastus2.logic.azure.com:443/workflows/de658af63fcc43fc82077650b08f057f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GVY2p2TKBOyS4hJHAPVNQEHZ5E1tZIap4iU0aXfWM4M`

---

## 🎯 **AI AGENT SCENARIOS & EXACT PAYLOADS**

### **Scenario 1: Single Passenger (Original Method)**
**User Input**: "Book a flight from Dallas to Charlotte for 1 passenger"

**AI Agent Response Logic**:
```json
{
  "origin": "DFW",
  "destination": "CLT", 
  "passengerCount": 1,
  "fareClass": "Economy",
  "firstName": "CUSTOMER_PROVIDED_NAME",
  "lastName": "CUSTOMER_PROVIDED_LASTNAME",
  "phone": "CUSTOMER_PROVIDED_PHONE"
}
```

### **Scenario 2: Multiple Passengers (New Array Method)**
**User Input**: "Book a flight from DFW to LAX for 3 passengers: John Smith, Jane Doe, and Bob Johnson"

**AI Agent Response Logic**:
```json
{
  "origin": "DFW",
  "destination": "LAX",
  "passengerCount": 3,
  "fareClass": "Economy",
  "passengers": [
    {
      "firstName": "JOHN",
      "lastName": "SMITH",
      "gender": "M",
      "phone": "CUSTOMER_PROVIDED_PHONE"
    },
    {
      "firstName": "JANE", 
      "lastName": "DOE",
      "gender": "F"
    },
    {
      "firstName": "BOB",
      "lastName": "JOHNSON", 
      "gender": "M"
    }
  ]
}
```

### **Scenario 3: Business Class with Multiple Passengers**
**User Input**: "Book business class flights for my family - myself (John Smith), my wife (Mary Smith), and our son (Tim Smith)"

**AI Agent Response Logic**:
```json
{
  "origin": "USER_PROVIDED_ORIGIN",
  "destination": "USER_PROVIDED_DESTINATION",
  "passengerCount": 3,
  "fareClass": "Business", 
  "passengers": [
    {
      "firstName": "JOHN",
      "lastName": "SMITH",
      "gender": "M"
    },
    {
      "firstName": "MARY",
      "lastName": "SMITH", 
      "gender": "F"
    },
    {
      "firstName": "TIM",
      "lastName": "SMITH",
      "gender": "M"
    }
  ]
}
```

### **Scenario 4: Specific Airlines and Dates**
**User Input**: "Book a United flight on December 15th for 2 passengers with seat selection"

**AI Agent Response Logic**:
```json
{
  "origin": "USER_PROVIDED_ORIGIN",
  "destination": "USER_PROVIDED_DESTINATION",
  "passengerCount": 2,
  "fareClass": "Economy",
  "airlineCode": "UA",
  "departureDate": "15DEC",
  "ancillaries": ["SEAT"],
  "passengers": [
    {
      "firstName": "PASSENGER1_FIRSTNAME",
      "lastName": "PASSENGER1_LASTNAME"
    },
    {
      "firstName": "PASSENGER2_FIRSTNAME", 
      "lastName": "PASSENGER2_LASTNAME"
    }
  ]
}
```

---

## 🎨 **AI AGENT PROMPT ENGINEERING**

### **System Prompt for Azure AI Foundry**:
```
You are a test PNR creation assistant that helps QA teams and developers create test flight bookings using the Terminal API in the TSTS environment. 

You have access to a flight booking action tool that can handle both single and multiple passenger test bookings.

IMPORTANT RULES:
1. This is for TEST PNR creation only - all bookings are in the TSTS test environment
2. For single passenger: Use either firstName/lastName OR passengers array (not both)  
3. For multiple passengers: ALWAYS use passengers array and set passengerCount
4. ALWAYS ask for passenger names before booking
5. Convert all names to UPPERCASE
6. Default to Economy unless specified otherwise
7. Always include origin, destination, passengerCount, fareClass
8. Default departure date is tomorrow if not specified

SUPPORTED FARE CLASSES:
- "Economy" → Maps to Economy/Coach (Class Y)
- "Business" → Maps to Business Class (Class C)
- "First" → Maps to First Class

SUPPORTED AIRLINES (airlineCode):
- "AA" → American Airlines (default)
- "UA" → United Airlines  
- "DL" → Delta Airlines
- etc.

SUPPORTED ANCILLARIES:
- "SEAT" → Seat selection
- "BAGGAGE" → Extra baggage
- "MEAL" → Meal preferences

TEST ENVIRONMENT NOTES:
- All bookings use PSS.RevenueCashLongSell script
- Environment is set to TSTS (test environment)
- Agent ID defaults to 827335
- City defaults to DFW if not specified
```

### **Action Tool Schema**:
```json
{
  "name": "call_flight_booking_api",
  "description": "Book flights for single or multiple passengers",
  "parameters": {
    "type": "object",
    "properties": {
      "origin": {
        "type": "string",
        "description": "Origin airport code (e.g., DFW, LAX)"
      },
      "destination": {
        "type": "string", 
        "description": "Destination airport code"
      },
      "passengerCount": {
        "type": "integer",
        "description": "Total number of passengers"
      },
      "fareClass": {
        "type": "string",
        "enum": ["Economy", "Business", "First"],
        "description": "Fare class for the booking"
      },
      "passengers": {
        "type": "array",
        "description": "Array of passenger details (use for multiple passengers)",
        "items": {
          "type": "object",
          "properties": {
            "firstName": {"type": "string"},
            "lastName": {"type": "string"},
            "middleName": {"type": "string"},
            "gender": {"type": "string", "enum": ["M", "F"]},
            "dob": {"type": "string", "description": "Format: DDMMMYY"},
            "phone": {"type": "string"}
          },
          "required": ["firstName", "lastName"]
        }
      },
      "firstName": {
        "type": "string",
        "description": "Primary passenger first name (for single passenger)"
      },
      "lastName": {
        "type": "string", 
        "description": "Primary passenger last name (for single passenger)"
      },
      "phone": {"type": "string"},
      "departureDate": {"type": "string", "description": "Format: DDMMM"},
      "airlineCode": {"type": "string", "description": "AA, UA, DL, etc."},
      "ancillaries": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Services like SEAT, BAGGAGE, MEAL"
      }
    },
    "required": ["origin", "destination", "passengerCount", "fareClass"]
  }
}
```

---

## 🔄 **AI AGENT CONVERSATION FLOW**

### **Example 1: Multi-Passenger Conversation**
```
User: "Book a flight for my family of 4 from Dallas to Los Angeles"

AI: "I'd be happy to book a flight for your family! To proceed, I need:
1. What date would you like to travel?
2. What class of service? (Economy, Business, or First)
3. The names of all 4 passengers
4. Would you like any additional services like seat selection?"

User: "Economy class, tomorrow. John Smith, Mary Smith, Tim Smith age 12, and Lisa Smith age 8"

AI: "Perfect! Let me book an economy flight from Dallas (DFW) to Los Angeles (LAX) for tomorrow for your family."

[Calls API with passengers array]
```

### **Example 2: Business Class Single Passenger**
```
User: "I need a business class ticket to Chicago"

AI: "I can help you book a business class flight to Chicago! I need:
1. What city are you departing from?
2. What date?
3. Your full name for the booking
4. Contact phone number"

User: "From Dallas, December 15th, John Smith, 555-123-4567"

AI: "Booking your business class flight from Dallas to Chicago for December 15th."

[Calls API with single passenger format]
```

---

## ✅ **TESTING CHECKLIST FOR AI AGENT**

- [ ] Single passenger booking with firstName/lastName
- [ ] Multiple passenger booking with passengers array
- [ ] Business/First class upgrades
- [ ] Different airlines (UA, DL, etc.)
- [ ] Specific departure dates
- [ ] Ancillary services (seat selection)
- [ ] Error handling for invalid airports
- [ ] Passenger count validation

---

## 🚨 **ERROR HANDLING**

**Common Issues & AI Responses**:

1. **Missing passenger names**: "I need the full names of all passengers to complete the booking."

2. **Invalid airport codes**: "I don't recognize that airport code. Could you provide the 3-letter code or city name?"

3. **Date format issues**: "Please provide the date in format like '15DEC' or 'December 15th'."

4. **Passenger count mismatch**: "You mentioned X passengers but provided Y names. Could you clarify?"

**Expected Response Format**:
```json
{
  "success": true,
  "timestamp": "2025-10-25T14:00:00Z",
  "requestId": "ABC123",
  "data": {
    "ExecuteScriptResult": {}
  },
  "inputData": {
    "origin": "DFW",
    "destination": "CLT", 
    "passengerCount": 3,
    "fareClass": "ECONOMY",
    "departureDate": "26OCT",
    "passengers": [...]
  }
}
```

This guide provides everything needed to integrate the multi-passenger Logic App with an AI Agent!