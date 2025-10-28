// Test AI Agent Integration Locally
// This simulates how an AI agent would call your Logic App

const axios = require('axios');

// Your Logic App webhook URL
const logicAppUrl = "https://prod-08.eastus2.logic.azure.com:443/workflows/de658af63fcc43fc82077650b08f057f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=GVY2p2TKBOyS4hJHAPVNQEHZ5E1tZIap4iU0aXfWM4M";

// Simulate AI Agent Function Calling
async function callFlightBookingApi(params) {
    try {
        console.log("🤖 AI Agent calling flight booking API...");
        console.log("📝 Parameters:", JSON.stringify(params, null, 2));

        const response = await axios.post(logicAppUrl, params, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ Success! Response:");
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
        throw error;
    }
}

// Test Scenarios
async function testScenarios() {
    console.log("🧪 Testing AI Agent Integration...\n");

    // Test 1: Single Passenger
    console.log("=== Test 1: Single Passenger ===");
    await callFlightBookingApi({
        origin: "DFW",
        destination: "LAX",
        passengerCount: 1,
        fareClass: "Economy",
        firstName: "JOHN",
        lastName: "SMITH",
        phone: "555-123-4567"
    });

    console.log("\n");

    // Test 2: Multiple Passengers
    console.log("=== Test 2: Multiple Passengers ===");
    await callFlightBookingApi({
        origin: "DFW",
        destination: "NYC",
        passengerCount: 2,
        fareClass: "Business",
        passengers: [
            {
                firstName: "JANE",
                lastName: "DOE",
                gender: "F"
            },
            {
                firstName: "BOB",
                lastName: "JOHNSON",
                gender: "M"
            }
        ]
    });
}

// Run tests
testScenarios().catch(console.error);