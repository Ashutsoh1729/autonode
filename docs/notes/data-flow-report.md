# Data Flow Report: AutoNode (n8n Clone)

## Overview
This document describes how data flows between nodes in the AutoNode workflow automation platform, which is a clone of n8n built with Next.js and TypeScript.

## Core Data Flow Architecture

### 1. Database Schema Foundation
The data flow begins with the database schema defined in `src/db/schema/workflows.ts`:

- **Workflows**: Containers for nodes and connections
- **Nodes**: Individual workflow components with types:
  - INITIAL: Starting point
  - MANUAL_TRIGGER: Manually triggered execution
  - CRON_TRIGGER: Scheduled execution
  - HTTP_REQUEST: Makes HTTP calls
  - AI: AI processing node
- **Connections**: Define data flow paths between nodes with:
  - `fromNodeId`: Source node
  - `toNodeId`: Destination node
  - `fromOutput`: Output port (default: "main")
  - `toInput`: Input port (default: "main")

### 2. Execution Engine
Workflow execution is handled by Inngest functions in `src/inngest/functions.ts`:

#### Execution Steps:
1. **Trigger**: Workflow execution initiated via `workflow/execute` event
2. **Workflow Retrieval**: Fetch workflow with nodes and connections
3. **Topological Sort**: Determine execution order based on node connections
4. **Node Processing**: Execute nodes in order, passing context between them
5. **Result Return**: Final context returned after all nodes execute

### 3. Node Execution Flow
Each node type has a specific executor registered in `src/lib/node-registery.ts`:

#### Context Flow Pattern:
```
Initial Context → [Node 1 Executor] → Updated Context → [Node 2 Executor] → Further Updated Context → ... → Final Context
```

#### Executor Responsibilities:
- **Manual/Cron Triggers**: 
  - Publish loading/success/error status via Inngest channels
  - Return context unchanged (add empty object)
  
- **HTTP Request Node** (`src/features/executors/lib/http.executor.ts`):
  - Publish loading status
  - Execute HTTP request using endpoint from node data
  - Apply Handlebars templating with current context
  - Store response in context under `variableName` key
  - Publish success/error status
  - Return updated context

- **AI Node**: (Referenced but not fully shown in current codebase)

### 4. Data Transformation Mechanisms

#### Handlebars Templating:
- Used in HTTP executor to substitute variables in:
  - Endpoint URLs
  - Request bodies
- Syntax: `{{variableName}}` replaced with values from current context

#### Context Evolution:
- Starts with `event.data.initialData` or empty object
- Each node can add/modify context properties
- Subsequent nodes access updated context via Handlebars templates
- Final context contains accumulated data from all executed nodes

### 5. Status Reporting & Monitoring
- Uses Inngest channels for real-time status updates:
  - Manual trigger channel
  - Cron trigger channel  
  - HTTP request channel
- Status values: "loading", "success", "error"
- Published before and after node execution

### 6. Error Handling
- **NonRetriableError**: For configuration errors (missing endpoint/variableName)
- **Regular Error**: For retryable failures (network issues, etc.)
- Status channel updated to "error" on failures

## Example Data Flow

### Simple Workflow: Manual Trigger → HTTP Request → AI Node
1. **Manual Trigger Executes**:
   - Input: `{}` (initial context)
   - Output: `{}` (unchanged)
   - Status: loading → success

2. **HTTP Request Executes**:
   - Input: `{}`
   - Processes: `https://api.example.com/data?user={{userId}}`
   - With context: `{ userId: "123" }` (from initial data)
   - Makes request to: `https://api.example.com/data?user=123`
   - Output: `{ userId: "123", httpResponse: { status: 200, data: {...} } }`
   - Status: loading → success

3. **AI Node Executes**:
   - Input: `{ userId: "123", httpResponse: { ... } }`
   - Processes AI prompt using context data
   - Output: `{ userId: "123", httpResponse: { ... }, aiResult: "Generated text" }`
   - Status: loading → success

## Key Technical Details

### State Management
- Context is immutable during node execution (executors return new context objects)
- Inngest `step.run()` ensures retriable operations
- Publish/subscribe pattern for status updates via Inngest channels

### Scalability Considerations
- Topological sort prevents circular dependencies
- Each node execution is independent and stateless
- Context size grows linearly with number of nodes
- Error isolation: failure in one node doesn't affect others (unless data-dependent)

### Security Aspects
- Handlebars templating prevents code injection
- Credentials stored separately in credentials table
- HTTP requests respect node-configured methods and headers
- User isolation via workflow.userId foreign key

## Conclusion
AutoNode implements a clean, extensible data flow model where:
1. Workflows define the structure (nodes + connections)
2. Execution follows dependency order (topological sort)
3. Data (context) flows sequentially through nodes
4. Each node transforms context and passes it forward
5. Status monitoring provides visibility into execution progress
6. Error handling distinguishes between configuration and runtime issues

This architecture closely mirrors n8n's approach while leveraging modern TypeScript, Next.js, and Inngest technologies.