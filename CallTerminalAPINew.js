{
    "definition": {
        "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
            "contentVersion": "1.0.0.0",
                "triggers": {
            "When_a_HTTP_request_is_received": {
                "type": "Request",
                    "kind": "Http",
                        "inputs": {
                    "schema": {
                        "type": "object",
                            "properties": {
                            "origin": {
                                "type": "string",
                                    "description": "Origin airport code (e.g., DFW)"
                            },
                            "destination": {
                                "type": "string",
                                    "description": "Destination airport code (e.g., LAX)"
                            },
                            "passengerCount": {
                                "type": "integer",
                                    "description": "Number of passengers"
                            },
                            "fareClass": {
                                "type": "string",
                                    "description": "Fare class (e.g., Economy, Business, First)"
                            },
                            "passengers": {
                                "type": "array",
                                    "description": "Array of passenger objects for multi-passenger bookings",
                                        "items": [
                                            {
                                                "type": "object",
                                                "properties": {
                                                    "firstName": {
                                                        "type": "string",
                                                        "description": "Passenger first name"
                                                    },
                                                    "lastName": {
                                                        "type": "string",
                                                        "description": "Passenger last name"
                                                    },
                                                    "middleName": {
                                                        "type": "string",
                                                        "description": "Passenger middle name (optional)"
                                                    },
                                                    "gender": {
                                                        "type": "string",
                                                        "description": "M or F (optional)"
                                                    },
                                                    "dob": {
                                                        "type": "string",
                                                        "description": "Date of birth DDMMMYY format (optional)"
                                                    },
                                                    "phone": {
                                                        "type": "string",
                                                        "description": "Contact phone (optional)"
                                                    }
                                                },
                                                "required": [
                                                    "firstName",
                                                    "lastName"
                                                ]
                                            }
                                        ]
                            },
                            "firstName": {
                                "type": "string",
                                    "description": "Primary passenger first name (for single passenger or backward compatibility)"
                            },
                            "lastName": {
                                "type": "string",
                                    "description": "Primary passenger last name (for single passenger or backward compatibility)"
                            },
                            "phone": {
                                "type": "string",
                                    "description": "Contact phone number"
                            },
                            "departureDate": {
                                "type": "string",
                                    "description": "Departure date (optional)"
                            },
                            "environment": {
                                "type": "string",
                                    "description": "Environment (TSTS, CERT, PROD)"
                            }
                        },
                        "required": [
                            "origin",
                            "destination",
                            "passengerCount",
                            "fareClass"
                        ]
                    }
                }
            }
        },
        "actions": {
            "Get_OAuth_Token": {
                "runAfter": { },
                "type": "Http",
                    "inputs": {
                    "method": "POST",
                        "uri": "@parameters('terminal_api_token_url')",
                            "headers": {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    "body": "grant_type=client_credentials&client_id=@{parameters('terminal_api_client_id')}&client_secret=@{parameters('terminal_api_client_secret')}&scope="
                }
            },
            "Parse_Token_Response": {
                "runAfter": {
                    "Get_OAuth_Token": [
                        "Succeeded"
                    ]
                },
                "type": "ParseJson",
                    "inputs": {
                    "content": "@body('Get_OAuth_Token')",
                        "schema": {
                        "type": "object",
                            "properties": {
                            "access_token": {
                                "type": "string"
                            },
                            "token_type": {
                                "type": "string"
                            },
                            "expires_in": {
                                "type": "integer"
                            }
                        }
                    }
                }
            },
            "Process_Passengers": {
                "runAfter": {
                    "Parse_Token_Response": [
                        "Succeeded"
                    ]
                },
                "type": "Compose",
                    "inputs": {
                    "primaryPassenger": "@if(greater(length(coalesce(triggerBody()?['passengers'], json('[]'))), 0), first(triggerBody()?['passengers']), json(concat('{\"firstName\":\"', coalesce(triggerBody()?['firstName'], 'VIJI'), '\",\"lastName\":\"', coalesce(triggerBody()?['lastName'], 'RAMA'), '\",\"middleName\":\"', coalesce(triggerBody()?['middleName'], 'D'), '\",\"gender\":\"', coalesce(triggerBody()?['gender'], 'F'), '\",\"dob\":\"', coalesce(triggerBody()?['dob'], '01JAN80'), '\",\"phone\":\"', coalesce(triggerBody()?['phone'], '6023004759'), '\"}')))",
                        "allPassengers": "@if(greater(length(coalesce(triggerBody()?['passengers'], json('[]'))), 0), triggerBody()?['passengers'], createArray(json(concat('{\"firstName\":\"', coalesce(triggerBody()?['firstName'], 'VIJI'), '\",\"lastName\":\"', coalesce(triggerBody()?['lastName'], 'RAMA'), '\",\"middleName\":\"', coalesce(triggerBody()?['middleName'], 'D'), '\",\"gender\":\"', coalesce(triggerBody()?['gender'], 'F'), '\",\"dob\":\"', coalesce(triggerBody()?['dob'], '01JAN80'), '\",\"phone\":\"', coalesce(triggerBody()?['phone'], '6023004759'), '\"}'))))",
                            "passengerCount": "@if(greater(length(coalesce(triggerBody()?['passengers'], json('[]'))), 0), length(triggerBody()?['passengers']), coalesce(triggerBody()?['passengerCount'], 1))"
                }
            },
            "Compose_Terminal_API_Request": {
                "runAfter": {
                    "Process_Passengers": [
                        "Succeeded"
                    ]
                },
                "type": "Compose",
                    "inputs": {
                    "Parameters": {
                        "group": [
                            {
                                "name": "Connection",
                                "property": [
                                    {
                                        "name": "Environment",
                                        "value": "@{toUpper(coalesce(triggerBody()?['environment'], 'TSTS'))}"
                                    },
                                    {
                                        "name": "Suffix",
                                        "value": "@{coalesce(triggerBody()?['suffix'], 'AAO')}"
                                    },
                                    {
                                        "name": "DutyCode",
                                        "value": "@{coalesce(triggerBody()?['dutyCode'], '5')}"
                                    },
                                    {
                                        "name": "Id",
                                        "value": "@{coalesce(triggerBody()?['agentId'], '827335')}"
                                    },
                                    {
                                        "name": "CurrentPasscode",
                                        "value": "@{coalesce(triggerBody()?['passcode'], 'PHX12345')}"
                                    },
                                    {
                                        "name": "City",
                                        "value": "@{toUpper(coalesce(triggerBody()?['city'], 'DFW'))}"
                                    }
                                ]
                            },
                            {
                                "name": "Flight",
                                "property": [
                                    {
                                        "name": "AirlineCode",
                                        "value": "@{toUpper(coalesce(triggerBody()?['airlineCode'], 'AA'))}"
                                    },
                                    {
                                        "name": "DepartureDate",
                                        "value": "@{toUpper(coalesce(triggerBody()?['departureDate'], formatDateTime(addDays(utcNow(), 1), 'ddMMM')))}"
                                    },
                                    {
                                        "name": "Origin",
                                        "value": "@{toUpper(coalesce(triggerBody()?['origin'], 'DFW'))}"
                                    },
                                    {
                                        "name": "Destination",
                                        "value": "@{toUpper(coalesce(triggerBody()?['destination'], 'CLT'))}"
                                    },
                                    {
                                        "name": "Status",
                                        "value": "@{coalesce(triggerBody()?['status'], 'OB')}"
                                    },
                                    {
                                        "name": "ClassOfService",
                                        "value": "@{if(equals(toUpper(coalesce(triggerBody()?['fareClass'], 'ECONOMY')), 'BUSINESS'), 'C', 'Y')}"
                                    }
                                ]
                            },
                            {
                                "name": "Options",
                                "property": [
                                    {
                                        "name": "FareType",
                                        "value": "@{coalesce(triggerBody()?['fareType'], 'WP')}"
                                    },
                                    {
                                        "name": "Ticketed",
                                        "value": "@{coalesce(triggerBody()?['ticketed'], 'TRUE')}"
                                    },
                                    {
                                        "name": "AssignSeats",
                                        "value": "@{if(contains(string(triggerBody()?['ancillaries']), 'SEAT'), 'TRUE', 'FALSE')}"
                                    }
                                ]
                            },
                            {
                                "name": "Passenger",
                                "property": [
                                    {
                                        "name": "FirstName",
                                        "value": "@{toUpper(outputs('Process_Passengers')?['allPassengers'][0]?['firstName'])}"
                                    },
                                    {
                                        "name": "LastName",
                                        "value": "@{toUpper(outputs('Process_Passengers')?['allPassengers'][0]?['lastName'])}"
                                    },
                                    {
                                        "name": "MiddleName",
                                        "value": "@{toUpper(coalesce(outputs('Process_Passengers')?['allPassengers'][0]?['middleName'], 'D'))}"
                                    },
                                    {
                                        "name": "Gender",
                                        "value": "@{coalesce(outputs('Process_Passengers')?['allPassengers'][0]?['gender'], 'F')}"
                                    },
                                    {
                                        "name": "DOB",
                                        "value": "@{coalesce(outputs('Process_Passengers')?['allPassengers'][0]?['dob'], '01JAN80')}"
                                    },
                                    {
                                        "name": "ContactPhone",
                                        "value": "@{coalesce(outputs('Process_Passengers')?['allPassengers'][0]?['phone'], '6023004759')}"
                                    }
                                ]
                            },
                            {
                                "name": "Passenger2",
                                "property": [
                                    {
                                        "name": "FirstName",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), toUpper(outputs('Process_Passengers')?['allPassengers'][1]?['firstName']), '')}"
                                    },
                                    {
                                        "name": "LastName",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), toUpper(outputs('Process_Passengers')?['allPassengers'][1]?['lastName']), '')}"
                                    },
                                    {
                                        "name": "MiddleName",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), toUpper(coalesce(outputs('Process_Passengers')?['allPassengers'][1]?['middleName'], 'D')), '')}"
                                    },
                                    {
                                        "name": "Gender",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), coalesce(outputs('Process_Passengers')?['allPassengers'][1]?['gender'], 'F'), '')}"
                                    },
                                    {
                                        "name": "DOB",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), coalesce(outputs('Process_Passengers')?['allPassengers'][1]?['dob'], '01JAN80'), '')}"
                                    },
                                    {
                                        "name": "ContactPhone",
                                        "value": "@{if(greater(length(outputs('Process_Passengers')?['allPassengers']), 1), coalesce(outputs('Process_Passengers')?['allPassengers'][1]?['phone'], '6023004759'), '')}"
                                    }
                                ]
                            },
                            {
                                "name": "@@(includeCollection)",
                                "property": [
                                    {
                                        "name": "actionAdapterLog",
                                        "value": "true"
                                    },
                                    {
                                        "name": "variables",
                                        "value": "true"
                                    },
                                    {
                                        "name": "engineLog",
                                        "value": "true"
                                    },
                                    {
                                        "name": "actionAdapterLogSerialized",
                                        "value": "true"
                                    },
                                    {
                                        "name": "engineLogSerialized",
                                        "value": "true"
                                    },
                                    {
                                        "name": "systemVariables",
                                        "value": "false"
                                    }
                                ]
                            },
                            {
                                "name": "@@(exception)",
                                "property": [
                                    {
                                        "name": "stackTraceIsEnabled",
                                        "value": "true"
                                    },
                                    {
                                        "name": "innerExceptionIsEnabled",
                                        "value": "true"
                                    }
                                ]
                            }
                        ]
                    },
                    "ScriptName": "@{coalesce(triggerBody()?['scriptName'], 'PSS.RevenueCashLongSell')}"
                }
            },
            "Call_Terminal_API": {
                "runAfter": {
                    "Compose_Terminal_API_Request": [
                        "Succeeded"
                    ]
                },
                "type": "Http",
                    "inputs": {
                    "method": "POST",
                        "uri": "@{parameters('terminal_api_base_url')}/api/terminalapi/api/ExecuteScript",
                            "headers": {
                        "Content-Type": "application/json",
                            "Authorization": "Bearer @{body('Parse_Token_Response')?['access_token']}"
                    },
                    "body": "@outputs('Compose_Terminal_API_Request')"
                }
            },
            "Handle_API_Response": {
                "actions": {
                    "Success_Response": {
                        "type": "Response",
                            "inputs": {
                            "statusCode": "@outputs('Call_Terminal_API')['statusCode']",
                                "headers": {
                                "Content-Type": "application/json"
                            },
                            "body": {
                                "success": true,
                                    "timestamp": "@utcNow()",
                                        "requestId": "@workflow().run.name",
                                            "data": "@body('Call_Terminal_API')",
                                                "inputData": {
                                    "origin": "@toUpper(coalesce(triggerBody()?['origin'], 'DFW'))",
                                        "destination": "@toUpper(coalesce(triggerBody()?['destination'], 'CLT'))",
                                            "passengerCount": "@outputs('Process_Passengers')?['passengerCount']",
                                                "fareClass": "@toUpper(coalesce(triggerBody()?['fareClass'], 'ECONOMY'))",
                                                    "departureDate": "@toUpper(coalesce(triggerBody()?['departureDate'], formatDateTime(addDays(utcNow(), 1), 'ddMMM')))",
                                                        "passengers": "@outputs('Process_Passengers')?['allPassengers']"
                                }
                            }
                        }
                    }
                },
                "runAfter": {
                    "Call_Terminal_API": [
                        "Succeeded",
                        "Failed"
                    ]
                },
                "else": {
                    "actions": {
                        "Error_Response": {
                            "type": "Response",
                                "inputs": {
                                "statusCode": "@coalesce(outputs('Call_Terminal_API')['statusCode'], 500)",
                                    "headers": {
                                    "Content-Type": "application/json"
                                },
                                "body": {
                                    "success": false,
                                        "timestamp": "@utcNow()",
                                            "requestId": "@workflow().run.name",
                                                "error": {
                                        "code": "@coalesce(outputs('Call_Terminal_API')['statusCode'], 500)",
                                            "message": "Terminal API call failed",
                                                "details": "@body('Call_Terminal_API')"
                                    },
                                    "inputData": {
                                        "origin": "@toUpper(coalesce(triggerBody()?['origin'], 'DFW'))",
                                            "destination": "@toUpper(coalesce(triggerBody()?['destination'], 'CLT'))",
                                                "passengerCount": "@outputs('Process_Passengers')?['passengerCount']",
                                                    "fareClass": "@toUpper(coalesce(triggerBody()?['fareClass'], 'ECONOMY'))",
                                                        "departureDate": "@toUpper(coalesce(triggerBody()?['departureDate'], formatDateTime(addDays(utcNow(), 1), 'ddMMM')))",
                                                            "passengers": "@outputs('Process_Passengers')?['allPassengers']"
                                    }
                                }
                            }
                        }
                    }
                },
                "expression": {
                    "and": [
                        {
                            "greater": [
                                "@outputs('Call_Terminal_API')['statusCode']",
                                199
                            ]
                        },
                        {
                            "less": [
                                "@outputs('Call_Terminal_API')['statusCode']",
                                300
                            ]
                        }
                    ]
                },
                "type": "If"
            }
        },
        "outputs": { },
        "parameters": {
            "terminal_api_client_id": {
                "defaultValue": "jwzacAcoMd1GAmyosfWY0nbzFUITVNiv",
                    "type": "String"
            },
            "terminal_api_client_secret": {
                "defaultValue": "CAkJWiJviAldLB8y",
                    "type": "SecureString"
            },
            "terminal_api_token_url": {
                "defaultValue": "https://api.dev.aa.com/edgemicro-auth/token",
                    "type": "String"
            },
            "terminal_api_base_url": {
                "defaultValue": "https://ct-n-zeaus-adt-tm.trafficmanager.net",
                    "type": "String"
            },
            "$connections": {
                "type": "Object",
                    "defaultValue": { }
            }
        }
    },
    "parameters": {
        "terminal_api_client_secret": { },
        "$connections": {
            "type": "Object",
                "value": { }
        }
    }
}