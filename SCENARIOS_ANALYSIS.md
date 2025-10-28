# 🚀 Terminal API Scenarios Analysis & AI Agent Integration Guide

## ✅ **CURRENTLY SUPPORTED SCENARIOS** (Working Now)

### 1. **Basic One-Way Flight Booking** ✅ WORKING
**Complexity**: Easy  
**Current Status**: ✅ Fully implemented and tested  
**AI Agent Instruction**: "Book a one-way flight from {origin} to {destination} for {passengerCount} passengers in {fareClass}"

**Example Request**:
```json
{
  "origin": "DFW",
  "destination": "CLT", 
  "passengerCount": 1,
  "fareClass": "Economy",
  "firstName": "VIJI",
  "lastName": "RAMA",
  "phone": "6023004759"
}
```

---

## 🔧 **EASILY IMPLEMENTABLE SCENARIOS** (Minor Logic App Updates)

### 2. **Multiple Passengers** 🟡 NEEDS ARRAY SUPPORT
**Complexity**: Medium  
**Current Limitation**: Only handles single passenger  
**Required Changes**: Add passenger array support in Logic App  
**Estimated Effort**: 2-3 hours  

**AI Agent Instruction**: "Book a flight for multiple passengers: {passengerDetails}"
```json
{
  "origin": "DFW",
  "destination": "CLT",
  "passengerCount": 3,
  "passengers": [
    {"firstName": "VIJI", "lastName": "RAMA", "gender": "F", "dob": "01JAN80"},
    {"firstName": "JOHN", "lastName": "SMITH", "gender": "M", "dob": "15MAR85"},
    {"firstName": "JANE", "lastName": "DOE", "gender": "F", "dob": "22JUL90"}
  ],
  "fareClass": "Economy"
}
```

### 3. **Business/First Class Bookings** ✅ SUPPORTED
**Complexity**: Easy  
**Current Status**: ✅ Already implemented  
**Logic**: `fareClass: "Business"` maps to `ClassOfService: "C"`  

**AI Agent Instruction**: "Book a business class flight from {origin} to {destination}"
```json
{
  "origin": "DFW",
  "destination": "LAX",
  "passengerCount": 1,
  "fareClass": "Business",
  "firstName": "VIJI",
  "lastName": "RAMA"
}
```

### 4. **Ancillary Services** 🟡 PARTIALLY SUPPORTED
**Complexity**: Easy  
**Current Support**: Seat assignment detection  
**Expandable To**: Meals, baggage, priority boarding  

**AI Agent Instruction**: "Book a flight with seat selection and extra baggage"
```json
{
  "origin": "DFW",
  "destination": "LAX",
  "passengerCount": 1,
  "fareClass": "Economy",
  "ancillaries": ["SEAT", "BAGGAGE", "MEAL"],
  "firstName": "VIJI",
  "lastName": "RAMA"
}
```

### 5. **Different Airlines** ✅ SUPPORTED
**Complexity**: Easy  
**Current Status**: ✅ Ready (defaults to AA)  

**AI Agent Instruction**: "Book a United flight from {origin} to {destination}"
```json
{
  "origin": "DFW",
  "destination": "LAX",
  "passengerCount": 1,
  "fareClass": "Economy",
  "airlineCode": "UA",
  "firstName": "VIJI",
  "lastName": "RAMA"
}
```

### 6. **Specific Departure Dates** ✅ SUPPORTED
**Complexity**: Easy  
**Current Status**: ✅ Ready (defaults to tomorrow)  

**AI Agent Instruction**: "Book a flight on December 15th"
```json
{
  "origin": "DFW",
  "destination": "LAX",
  "departureDate": "15DEC",
  "passengerCount": 1,
  "fareClass": "Economy",
  "firstName": "VIJI",
  "lastName": "RAMA"
}
```

---

## 🔨 **COMPLEX SCENARIOS** (Major Development Required)

### 7. **Round-Trip Flights** 🔴 MAJOR CHANGE NEEDED
**Complexity**: High  
**Current Limitation**: PSS.RevenueCashLongSell script is one-way only  
**Required Changes**: 
- New Terminal API script (possibly PSS.RevenueCashRoundTrip)
- Dual flight booking logic
- Return date handling
**Estimated Effort**: 1-2 weeks  

**Would Need**: Different scriptName parameter
```json
{
  "scriptName": "PSS.RevenueCashRoundTrip",
  "origin": "DFW",
  "destination": "LAX",
  "departureDate": "15DEC",
  "returnDate": "22DEC",
  "passengerCount": 1,
  "fareClass": "Economy"
}
```

### 8. **Multi-City/Multi-Segment** 🔴 MAJOR CHANGE NEEDED
**Complexity**: Very High  
**Current Limitation**: Single segment only  
**Required Changes**: 
- New Terminal API script
- Complex itinerary handling
- Multiple flight coordination
**Estimated Effort**: 3-4 weeks  

### 9. **Flight Changes/Cancellations** 🔴 DIFFERENT SCRIPT NEEDED
**Complexity**: High  
**Current Limitation**: Booking only, no modification  
**Required Changes**: 
- Different Terminal API scripts for modifications
- PNR lookup capability
- Change fee calculation
**Estimated Effort**: 2-3 weeks  

---

## 🎯 **AI AGENT CONTEXT & INSTRUCTIONS**

### **Available Parameters for AI Agent**:
```json
{
  // Required
  "origin": "string (airport code)",
  "destination": "string (airport code)", 
  "passengerCount": "integer",
  "fareClass": "Economy|Business|First",
  
  // Passenger Info (at least firstName/lastName required)
  "firstName": "string (UPPERCASE preferred)",
  "lastName": "string (UPPERCASE preferred)",
  "phone": "string",
  "middleName": "string (optional)",
  "gender": "M|F (optional)",
  "dob": "string (format: DDMMMYY, optional)",
  
  // Flight Options (optional)
  "departureDate": "string (format: DDMMM, defaults to tomorrow)",
  "airlineCode": "string (defaults to AA)",
  "ancillaries": "array (e.g., ['SEAT', 'BAGGAGE'])",
  
  // Advanced Options (optional)
  "environment": "TSTS|CERT|PROD (defaults to TSTS)",
  "fareType": "string (defaults to WP)",
  "ticketed": "TRUE|FALSE (defaults to TRUE)"
}
```

### **AI Agent Capability Matrix**:

| Scenario | Status | AI Instruction Template |
|----------|--------|------------------------|
| One-way flight | ✅ Ready | "Book {fareClass} flight from {origin} to {destination} for {count} passengers" |
| Business/First class | ✅ Ready | "Book business class flight..." |
| Multiple airlines | ✅ Ready | "Book {airline} flight..." |
| Specific dates | ✅ Ready | "Book flight on {date}..." |
| Seat selection | ✅ Ready | "Book flight with seat selection..." |
| Multi-passenger | 🟡 Needs update | "Book flight for {passengers}..." |
| Round-trip | 🔴 Not possible | N/A - Would need new script |
| Multi-city | 🔴 Not possible | N/A - Would need new script |

---

## 🚀 **IMMEDIATE NEXT STEPS**

### **Priority 1: Multi-Passenger Support** (Recommended)
- Update Logic App to handle passenger arrays
- Most requested feature for real-world use
- Relatively easy implementation

### **Priority 2: Enhanced Ancillaries**
- Expand ancillary service detection
- Add meal preferences, baggage options
- Good for upselling scenarios

### **Priority 3: Validation & Error Handling**
- Add airport code validation
- Date format validation
- Better error messages for AI Agent

Would you like me to implement **Priority 1 (Multi-Passenger Support)** first? It's the most practical next enhancement that would significantly expand the AI Agent's capabilities while staying within the current Terminal API script limitations.