# 🏗️ Azure Logic App Multi-Passenger System - Mermaid Diagrams

## 📊 High-Level Design (HLD)
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

## 🔄 Sequence Diagram
```mermaid
sequenceDiagram
    participant User as User/AI Agent
    participant LogicApp as Azure Logic App
    participant OAuth as OAuth Service
    participant TerminalAPI as Terminal API
    participant PSS as PSS System
    
    User->>LogicApp: POST /workflows/CallTerminalAPINew/triggers/manual/invoke
    Note over User,LogicApp: Multi-passenger booking request with JSON payload
    
    LogicApp->>OAuth: Request access token
    Note over LogicApp,OAuth: Client credentials flow
    OAuth-->>LogicApp: Return access token
    
    LogicApp->>LogicApp: Process_Passengers Action
    Note over LogicApp: Normalize passenger array structure
    
    LogicApp->>LogicApp: Compose_Terminal_API_Request
    Note over LogicApp: Create dynamic Passenger and Passenger2 groups
    
    LogicApp->>TerminalAPI: POST /api/terminal
    Note over LogicApp,TerminalAPI: Send formatted request with auth token
    
    TerminalAPI->>PSS: Execute PSS.RevenueCashLongSell script
    Note over TerminalAPI,PSS: Process booking with passenger groups
    
    PSS-->>TerminalAPI: Return booking result
    Note over PSS,TerminalAPI: PNR creation confirmation or error
    
    TerminalAPI-->>LogicApp: HTTP 200 response
    Note over TerminalAPI,LogicApp: Booking confirmation with details
    
    LogicApp->>LogicApp: Handle_API_Response
    Note over LogicApp: Format success/error response
    
    LogicApp-->>User: Return formatted response
    Note over LogicApp,User: Success confirmation or error details
```

## ⚙️ Logic App Action Flow (LLD)
```mermaid
flowchart TD
    Start([Workflow Trigger]) --> Auth[Get OAuth Token]
    Auth --> ProcessPass[Process_Passengers Action]
    
    ProcessPass --> CheckArray{Is passengers<br/>an array?}
    CheckArray -->|Yes| NormalizeArray[Keep as array]
    CheckArray -->|No| WrapArray[Wrap in array]
    
    NormalizeArray --> ComposeReq[Compose_Terminal_API_Request]
    WrapArray --> ComposeReq
    
    ComposeReq --> CheckCount{Passenger count?}
    CheckCount -->|1 passenger| SingleGroup[Create Passenger group only]
    CheckCount -->|2+ passengers| MultiGroup[Create Passenger + Passenger2 groups]
    
    SingleGroup --> CallAPI[Call Terminal API]
    MultiGroup --> CallAPI
    
    CallAPI --> CheckResponse{API Response?}
    CheckResponse -->|Success| HandleSuccess[Handle_API_Response Success]
    CheckResponse -->|Error| HandleError[Handle_API_Response Error]
    
    HandleSuccess --> FormatSuccess[Format success response]
    HandleError --> FormatError[Format error response]
    
    FormatSuccess --> End([Return Response])
    FormatError --> End
    
    %% Styling
    classDef startEnd fill:#e1f5fe
    classDef process fill:#e8f5e8
    classDef decision fill:#fff3e0
    classDef error fill:#ffebee
    
    class Start,End startEnd
    class Auth,ProcessPass,ComposeReq,CallAPI,HandleSuccess,HandleError,FormatSuccess,FormatError process
    class CheckArray,CheckCount,CheckResponse decision
```

## 📊 Data Transformation Flow
```mermaid
graph LR
    subgraph "Input Data"
        Input["{<br/>  'passengers': [<br/>    {<br/>      'firstName': 'John',<br/>      'lastName': 'Doe',<br/>      'gender': 'M'<br/>    },<br/>    {<br/>      'firstName': 'Jane',<br/>      'lastName': 'Smith',<br/>      'gender': 'F'<br/>    }<br/>  ]<br/>}"]
    end
    
    subgraph "Processing"
        Normalize[Normalize Array<br/>Process_Passengers]
        Transform[Transform Structure<br/>Compose_Terminal_API_Request]
    end
    
    subgraph "Output Data"
        Output["{<br/>  'Passenger': {<br/>    'FirstName': 'John',<br/>    'LastName': 'Doe',<br/>    'Gender': 'M'<br/>  },<br/>  'Passenger2': {<br/>    'FirstName': 'Jane',<br/>    'LastName': 'Smith',<br/>    'Gender': 'F'<br/>  }<br/>}"]
    end
    
    Input --> Normalize
    Normalize --> Transform
    Transform --> Output
    
    %% Styling
    classDef inputStyle fill:#e3f2fd
    classDef processStyle fill:#e8f5e8
    classDef outputStyle fill:#fff3e0
    
    class Input inputStyle
    class Normalize,Transform processStyle
    class Output outputStyle
```

## 🔧 Expression Logic Details
```mermaid
graph TD
    subgraph "Dynamic Passenger Assignment Logic"
        Start[Start: Passenger Array] --> CheckFirst{First Passenger<br/>Exists?}
        CheckFirst -->|Yes| AssignP1["Passenger = {<br/>  FirstName: @{items('Apply_to_each')?['firstName']}<br/>  LastName: @{items('Apply_to_each')?['lastName']}<br/>  Gender: @{items('Apply_to_each')?['gender']}<br/>}"]
        
        CheckFirst -->|No| Skip1[Skip Passenger Assignment]
        
        AssignP1 --> CheckSecond{Second Passenger<br/>Exists?}
        CheckSecond -->|Yes| AssignP2["Passenger2 = {<br/>  FirstName: @{body('Process_Passengers')[1]['firstName']}<br/>  LastName: @{body('Process_Passengers')[1]['lastName']}<br/>  Gender: @{body('Process_Passengers')[1]['gender']}<br/>}"]
        
        CheckSecond -->|No| Skip2[Skip Passenger2 Assignment]
        
        AssignP2 --> Complete[Complete Request Object]
        Skip1 --> Complete
        Skip2 --> Complete
    end
    
    subgraph "Expression Evaluation"
        Complete --> Eval1[["@{items('Apply_to_each')?['firstName']}"<br/>Evaluates to actual value]]
        Complete --> Eval2[["@{body('Process_Passengers')[1]['lastName']}"<br/>Evaluates to actual value]]
    end
    
    %% Styling
    classDef logic fill:#e8f5e8
    classDef assign fill:#e3f2fd
    classDef eval fill:#fff3e0
    
    class Start,CheckFirst,CheckSecond logic
    class AssignP1,AssignP2,Skip1,Skip2 assign
    class Complete,Eval1,Eval2 eval
```

---

## 📁 Individual Diagram Files

For CLI usage or separate rendering:
- `diagrams/hld.mmd` - High-Level Design
- `diagrams/sequence.mmd` - Sequence Diagram
- `diagrams/lld.mmd` - Logic App Action Flow
- `diagrams/data-flow.mmd` - Data Transformation
- `diagrams/expressions.mmd` - Expression Logic

## 🎯 GitHub Presentation Tips

1. **Direct Link**: Share the GitHub link to this file for live diagram viewing
2. **Full Screen**: Click diagrams to view in full screen on GitHub
3. **Mobile Friendly**: Diagrams render well on mobile devices
4. **Interactive**: GitHub allows zooming and panning of complex diagrams
5. **Always Updated**: Any changes pushed to Git automatically update the diagrams

**Perfect for Innovation Day presentations!** 🚀✨