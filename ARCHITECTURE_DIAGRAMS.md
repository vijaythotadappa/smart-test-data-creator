# 🏗️ Multi-Passenger Flight Booking System - Architecture Diagrams

## 📊 **1. HIGH-LEVEL DESIGN (HLD)**

```mermaid
graph TB
    %% User Interface Layer
    subgraph "User Interface Layer"
        AI[AI Agent/Copilot]
        USER[User Input]
    end
    
    %% Integration Layer
    subgraph "Integration Layer"
        LA[Azure Logic App<br/>CallTerminalAPINew]
        AUTH[OAuth 2.0<br/>Token Service]
    end
    
    %% Business Logic Layer
    subgraph "Business Logic Layer"
        PP[Process_Passengers<br/>Action]
        CTR[Compose_Terminal_API_Request<br/>Action]
        HAR[Handle_API_Response<br/>Action]
    end
    
    %% External Services
    subgraph "External Services"
        TAPI[Terminal API<br/>PSS.RevenueCashLongSell]
        PSS[PSS System<br/>Passenger Service System]
    end
    
    %% Data Flow
    USER --> AI
    AI --> |HTTP POST Request<br/>Multi-Passenger Data| LA
    LA --> |Client Credentials| AUTH
    AUTH --> |Access Token| LA
    LA --> PP
    PP --> |Passenger Array Processing| CTR
    CTR --> |Terminal API Request| TAPI
    TAPI --> |Execute Script| PSS
    PSS --> |PNR Creation Result| TAPI
    TAPI --> |Response| HAR
    HAR --> |JSON Response| AI
    AI --> |Booking Confirmation| USER
    
    %% Styling
    classDef userLayer fill:#e1f5fe
    classDef integrationLayer fill:#f3e5f5
    classDef businessLayer fill:#e8f5e8
    classDef externalLayer fill:#fff3e0
    
    class AI,USER userLayer
    class LA,AUTH integrationLayer
    class PP,CTR,HAR businessLayer
    class TAPI,PSS externalLayer
```

## 🔄 **2. SEQUENCE DIAGRAM**

```mermaid
sequenceDiagram
    participant User
    participant AI as AI Agent
    participant LA as Logic App
    participant AUTH as OAuth Service
    participant PP as Process_Passengers
    participant CTR as Compose_Terminal_API_Request
    participant TAPI as Terminal API
    participant PSS as PSS System
    participant HAR as Handle_API_Response
    
    %% User Interaction
    User->>AI: "Book flight for John Doe and Jane Doe from DFW to LAX"
    AI->>AI: Parse multi-passenger request
    
    %% Logic App Invocation
    AI->>LA: POST /triggers/manual/paths/invoke<br/>{passengers: [{firstName: "John", lastName: "Doe"}, {firstName: "Jane", lastName: "Doe"}]}
    
    %% Authentication Flow
    LA->>AUTH: POST /token<br/>grant_type=client_credentials
    AUTH-->>LA: {access_token: "...", expires_in: 3600}
    
    %% Passenger Processing
    LA->>PP: Execute Process_Passengers Action
    PP->>PP: if(passengers array exists)<br/>  use passengers array<br/>else<br/>  create from firstName/lastName
    PP-->>LA: {primaryPassenger: {...}, allPassengers: [{...}, {...}], passengerCount: 2}
    
    %% Terminal API Request Composition
    LA->>CTR: Execute Compose_Terminal_API_Request Action
    CTR->>CTR: Build static groups:<br/>- Connection (Environment, Suffix, etc.)<br/>- Flight (Origin, Destination, etc.)<br/>- Options (FareType, Ticketed, etc.)
    CTR->>CTR: Build dynamic passenger groups:<br/>- Passenger (allPassengers[0])<br/>- Passenger2 (if allPassengers[1] exists)
    CTR-->>LA: {Parameters: {group: [Connection, Flight, Options, Passenger, Passenger2, ...]}}
    
    %% Terminal API Call
    LA->>TAPI: POST /api/terminalapi/api/ExecuteScript<br/>Authorization: Bearer {token}<br/>Body: {Parameters: {...}, ScriptName: "PSS.RevenueCashLongSell"}
    TAPI->>PSS: Execute PSS.RevenueCashLongSell script<br/>with multi-passenger data
    PSS->>PSS: Create PNR with:<br/>- JOHN DOE (Passenger)<br/>- JANE DOE (Passenger2)
    PSS-->>TAPI: {ExecuteScriptResult: {name: "Response", group: [...]}}
    TAPI-->>LA: Terminal API Response
    
    %% Response Handling
    LA->>HAR: Execute Handle_API_Response Action
    alt Success (Status 200-299)
        HAR->>HAR: Build success response with:<br/>- Original input data<br/>- Terminal API response<br/>- Request metadata
        HAR-->>AI: {success: true, data: {...}, inputData: {...}}
    else Failure (Status >= 300)
        HAR->>HAR: Build error response with:<br/>- Error details<br/>- Original input data
        HAR-->>AI: {success: false, error: {...}, inputData: {...}}
    end
    
    %% AI Response
    AI->>AI: Parse response and extract PNR details
    AI-->>User: "Flight booked successfully!<br/>PNR: ABC123<br/>Passengers: John Doe, Jane Doe<br/>Flight: DFW → LAX"
```

## 🔧 **3. LOW-LEVEL DESIGN (LLD)**

### **3.1 Logic App Action Breakdown**

```mermaid
graph TB
    subgraph "Trigger: When_a_HTTP_request_is_received"
        T1[HTTP Request Schema Validation]
        T2[Extract: origin, destination, passengerCount, fareClass]
        T3[Optional: passengers array, firstName, lastName]
    end
    
    subgraph "Action 1: Get_OAuth_Token"
        A1[POST to OAuth endpoint]
        A2[Send client_credentials grant]
        A3[Receive access_token]
    end
    
    subgraph "Action 2: Parse_Token_Response"
        B1[Parse JSON response]
        B2[Extract access_token field]
        B3[Store for API authorization]
    end
    
    subgraph "Action 3: Process_Passengers"
        C1{Check if passengers array exists}
        C2[Use passengers array]
        C3[Create array from firstName/lastName]
        C4[Set primaryPassenger = first passenger]
        C5[Set allPassengers = full array]
        C6[Set passengerCount = array length]
    end
    
    subgraph "Action 4: Compose_Terminal_API_Request"
        D1[Build Connection Group]
        D2[Build Flight Group]
        D3[Build Options Group]
        D4[Build Passenger Group from allPassengers first item]
        D5{Check if allPassengers length > 1}
        D6[Build Passenger2 Group from allPassengers second item]
        D7[Skip Passenger2 - set empty values]
        D8[Build @@includeCollection Group]
        D9[Build @@exception Group]
        D10[Combine all groups into Parameters]
    end
    
    subgraph "Action 5: Call_Terminal_API"
        E1[POST to Terminal API endpoint]
        E2[Add Bearer token authorization]
        E3[Send composed request body]
        E4[Receive Terminal API response]
    end
    
    subgraph "Action 6: Handle_API_Response"
        F1{Check response status code}
        F2[Build success response]
        F3[Build error response]
        F4[Include original input data]
        F5[Return JSON response to caller]
    end
    
    %% Flow connections
    T1 --> T2 --> T3
    T3 --> A1 --> A2 --> A3
    A3 --> B1 --> B2 --> B3
    B3 --> C1
    C1 -->|Yes| C2
    C1 -->|No| C3
    C2 --> C4 --> C5 --> C6
    C3 --> C4
    C6 --> D1 --> D2 --> D3 --> D4 --> D5
    D5 -->|Yes| D6
    D5 -->|No| D7
    D6 --> D8
    D7 --> D8
    D8 --> D9 --> D10
    D10 --> E1 --> E2 --> E3 --> E4
    E4 --> F1
    F1 -->|Success| F2
    F1 -->|Error| F3
    F2 --> F4 --> F5
    F3 --> F4
```

### **3.2 Data Transformation Flow**

```mermaid
graph LR
    subgraph "Input Data Structure"
        I1["{<br/>  origin: 'DFW',<br/>  destination: 'LAX',<br/>  passengerCount: 2,<br/>  fareClass: 'Economy',<br/>  passengers: [<br/>    {firstName: 'John', lastName: 'Doe'},<br/>    {firstName: 'Jane', lastName: 'Doe'}<br/>  ]<br/>}"]
    end
    
    subgraph "Process_Passengers Output"
        P1["{<br/>  primaryPassenger: {firstName: 'John', lastName: 'Doe'},<br/>  allPassengers: [<br/>    {firstName: 'John', lastName: 'Doe'},<br/>    {firstName: 'Jane', lastName: 'Doe'}<br/>  ],<br/>  passengerCount: 2<br/>}"]
    end
    
    subgraph "Terminal API Request Structure"
        T1["{<br/>  Parameters: {<br/>    group: [<br/>      {name: 'Connection', property: [...]},<br/>      {name: 'Flight', property: [...]},<br/>      {name: 'Options', property: [...]},<br/>      {name: 'Passenger', property: [<br/>        {name: 'FirstName', value: 'JOHN'},<br/>        {name: 'LastName', value: 'DOE'}<br/>      ]},<br/>      {name: 'Passenger2', property: [<br/>        {name: 'FirstName', value: 'JANE'},<br/>        {name: 'LastName', value: 'DOE'}<br/>      ]}<br/>    ]<br/>  },<br/>  ScriptName: 'PSS.RevenueCashLongSell'<br/>}"]
    end
    
    subgraph "Terminal API Response"
        R1["{<br/>  ExecuteScriptResult: {<br/>    name: 'Response',<br/>    group: [<br/>      {name: 'PNR', property: [...]},<br/>      {name: 'Passengers', property: [...]}<br/>    ]<br/>  }<br/>}"]
    end
    
    subgraph "Final Response to AI Agent"
        F1["{<br/>  success: true,<br/>  timestamp: '2025-10-28T14:00:00Z',<br/>  requestId: 'run-id-123',<br/>  data: {ExecuteScriptResult: {...}},<br/>  inputData: {<br/>    origin: 'DFW',<br/>    destination: 'LAX',<br/>    passengerCount: 2,<br/>    passengers: [...]<br/>  }<br/>}"]
    end
    
    I1 --> P1
    P1 --> T1
    T1 --> R1
    R1 --> F1
```

### **3.3 Expression Logic Details**

```mermaid
graph TB
    subgraph "Dynamic Passenger Logic"
        L1[if greater than 1 passenger exists]
        L2[Create Passenger2 with allPassengers second item data]
        L3[Create Passenger2 with empty values]
        L4[All expressions evaluated at runtime]
    end
    
    subgraph "Expression Examples"
        E1["Expression 1: toUpper allPassengers firstName"]
        E2["Expression 2: Conditional Passenger2 firstName"]
        E3["Expression 3: coalesce suffix with default AAO"]
        E4["Expression 4: formatDateTime tomorrow ddMMM"]
    end
    
    subgraph "Runtime Evaluation"
        R1[Expression Engine processes @ syntax]
        R2[Functions like toUpper coalesce if executed]
        R3[Dynamic values inserted into JSON structure]
    end
    
    L1 -->|True| L2
    L1 -->|False| L3
    L2 --> L4
    L3 --> L4
    L4 --> E1
    E1 --> E2
    E2 --> E3
    E3 --> E4
    E4 --> R1
    R1 --> R2
    R2 --> R3
```

## 🎯 **4. Component Interaction Matrix**

| Component | Input | Processing | Output |
|-----------|-------|------------|--------|
| **AI Agent** | User natural language | Parse intent, extract entities | Structured JSON API call |
| **HTTP Trigger** | JSON request | Schema validation | Validated request data |
| **Get_OAuth_Token** | Client credentials | OAuth 2.0 flow | Access token |
| **Process_Passengers** | Request data | Array processing logic | Normalized passenger data |
| **Compose_Terminal_API_Request** | Passenger data + request params | Dynamic JSON composition | Terminal API request |
| **Call_Terminal_API** | Composed request + token | HTTP POST with auth | Terminal API response |
| **Handle_API_Response** | API response | Conditional logic | Formatted response |

## 🔒 **5. Security & Error Handling**

```mermaid
graph TB
    subgraph "Security Measures"
        S1[OAuth 2.0 Client Credentials]
        S2[Bearer Token Authorization]
        S3[HTTPS Encryption]
        S4[Azure Logic Apps Security]
    end
    
    subgraph "Error Handling"
        E1[Schema Validation Errors]
        E2[OAuth Token Failures]
        E3[Terminal API Errors]
        E4[Expression Evaluation Errors]
        E5[Network/Timeout Errors]
    end
    
    subgraph "Response Patterns"
        R1[Success: 200 with data]
        R2[Client Error: 400 with validation details]
        R3[Auth Error: 401 with token issue]
        R4[Server Error: 500 with error details]
    end
    
    S1 --> S2 --> S3 --> S4
    E1 --> R2
    E2 --> R3
    E3 --> R4
    E4 --> R4
    E5 --> R4
```

---

## 📝 **Summary**

This architecture provides:

✅ **Scalable Design**: Handles 1-N passengers dynamically  
✅ **Robust Error Handling**: Comprehensive error responses  
✅ **Security**: OAuth 2.0 + HTTPS encryption  
✅ **Maintainability**: Clear separation of concerns  
✅ **Integration Ready**: Standard REST API interface  
✅ **Monitoring**: Built-in logging and tracing  

The system transforms natural language requests into PSS Terminal API calls while maintaining data integrity and providing detailed response information for AI Agent processing.