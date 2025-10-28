# 🚀 Smart Test Data Creator

**Conversational AI Agent for Enterprise PSS Test Data Generation**

[![Production Status](https://img.shields.io/badge/Status-Production%20Deployed-success)]()
[![Innovation Day](https://img.shields.io/badge/Innovation%20Day-2025-blue)]()
[![Azure Logic Apps](https://img.shields.io/badge/Azure-Logic%20Apps-blue)]()
[![AI Integration](https://img.shields.io/badge/AI-Azure%20Foundry-green)]()

## 💡 **The Innovation**

Transform complex Terminal API operations into natural conversation, enabling any team member to create sophisticated PSS test scenarios without technical expertise.

### **Problem Solved**
- Testing teams spend **45-90 minutes** creating complex multi-passenger test scenarios
- **25% error rate** from manual Terminal API operations
- **2-3 weeks training** required for Terminal API proficiency
- Bulk test data creation requires hours of repetitive work

### **Solution**
Conversational AI Agent with enterprise PSS integration that handles:
- Natural language processing for flight booking requests
- Multi-passenger logic with dynamic array processing
- OAuth 2.0 secure Terminal API integration
- Voice interface for hands-free operation
- Bulk test scenario generation

## 🎯 **Where This Shines**

- **Complex Multi-Passenger Scenarios**: Family bookings, group travel (90%+ time reduction)
- **Bulk Test Data Generation**: Create dozens of diverse PNRs through conversation
- **Zero Learning Curve**: No Terminal API training required
- **Error Prevention**: AI handles case sensitivity and business rules
- **Voice Enabled**: Hands-free test data creation

## 🛠️ **Technical Architecture**

```
Natural Language → Azure AI Agent → Logic Apps (431 lines) → Terminal API → PSS Test Data
```

### **Key Components**
- **Azure Logic App**: Production-deployed workflow with OAuth 2.0
- **Terminal API Integration**: PSS.RevenueCashLongSell script execution
- **Multi-Passenger Logic**: Dynamic array processing for group scenarios
- **Smart Parameter Handling**: Case conversion and validation
- **Voice Interface**: Speech-to-text integration
- **Error Resilience**: Comprehensive retry mechanisms

## 🎬 **Demo Scenarios**

### **Simple Request**
```
Input: "Book an economy flight from Dallas to Charlotte for John Smith"
Output: PNR created in under 1 minute
```

### **Complex Multi-Passenger**
```
Input: "Create business class round-trip bookings for platinum loyalty family of 4"
AI: "I need the passenger names for the family booking..."
User: "John, Mary, Tim, and Lisa Smith"
Output: 4-passenger PNR with loyalty benefits
```

### **Bulk Generation**
```
Voice: "Generate 20 diverse test scenarios for load testing"
Output: Multiple PNRs with varied routes, fare classes, passenger types
```

## 📁 **Project Structure**

```
├── logic-apps/                 # Azure Logic Apps workflows
│   ├── terminal-api-pnr-workflow/   # Main production workflow
│   └── workflow-designtime/         # Development configuration
├── java-app/                   # Java application components
├── presentation/               # Innovation Day presentation materials
├── AI_AGENT_INTEGRATION_GUIDE.md   # Complete integration documentation
├── updated-logic-app.json      # Production Logic App definition (431 lines)
└── test-ai-integration.js      # Test scenarios and validation
```

## 🚀 **Getting Started**

### **Prerequisites**
- Azure subscription with Logic Apps and AI Foundry access
- Terminal API OAuth 2.0 credentials
- TSTS environment access

### **Deployment**
1. Deploy the Logic App using `updated-logic-app.json`
2. Configure OAuth 2.0 credentials in Azure Key Vault
3. Set up Azure AI Foundry agent using `AI_AGENT_INTEGRATION_GUIDE.md`
4. Test with provided scenarios in `test-ai-integration.js`

### **Integration**
See `AI_AGENT_INTEGRATION_GUIDE.md` for complete setup instructions including:
- System prompts for Azure AI Foundry
- Action tool configuration
- Multi-passenger payload examples
- Error handling scenarios

## 📊 **Impact Metrics**

- **Complex Scenarios**: 45-90 minutes → 5-10 minutes
- **Bulk Operations**: Hours → Minutes through conversation
- **Error Rate**: 25% → <1% with AI validation
- **Training Time**: 2-3 weeks → 5-minute demo
- **Production Status**: Deployed and operational

## 🔮 **Future Vision**

### **Phase 2: Enhanced Intelligence**
- Smart analytics and pattern recognition
- Business intelligence for booking trends
- Predictive test scenario suggestions

### **Phase 3: Enterprise Expansion**
- T&R (Tickets & Receipts) integration
- Revenue Accounting automation
- Other enterprise teams using PSS

### **Phase 4: Universal Access**
- **MCP Server**: Model Context Protocol for any AI tool
- **Enterprise Integration**: VS Code Copilot, ChatGPT, Slack bots
- **Infrastructure Evolution**: From single agent to enterprise platform

## 🏆 **Innovation Day Achievement**

**Status**: ✅ **Production Deployed and Operational**

This isn't just a hackathon prototype - it's working production code that's already transforming how teams create PSS test data. Built for Innovation Day 2025 with focus on:
- **Creativity**: AI + Legacy API integration approach
- **Impact**: Immediate value for complex scenarios and bulk operations
- **Feasibility**: 431-line Logic App proves production readiness
- **Presentation**: Live demo with working system

## 📞 **Contact**

**Project Lead**: Vijay Thotadappa  
**Repository**: https://github.com/vijaythotadappa/smart-test-data-creator  
**Status**: Production deployed and ready for team adoption  

---

> *"This isn't just a hackathon project - it's the future of enterprise software interaction, proven and working today."*

**🎯 Smart Test Data Creator: Where Enterprise AI Meets Real Business Value**