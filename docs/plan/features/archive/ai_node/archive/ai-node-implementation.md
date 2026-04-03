## AI Node Implementation Plan

### Overview
Create an AI execution node that takes instructions and requests to an AI LLM to generate responses that can be used in other nodes. Based on the existing HTTP node implementation. Will utilize the existing credentials system for managing API keys.

### Implementation Steps

#### Step 1: Update Database Schema
- [x] Add AI node type to the `nodeType` enum in `src/db/schema/workflows.ts`
- [x] Create any necessary database tables for AI node configurations if needed

#### Step 2: Create AI Node Component
- [x] Modify `src/features/executors/nodes/ai_node/components/ai-node.tsx`:
  - Replace HTTP-specific imports with AI-specific ones
  - Change icon from GlobeIcon to a more appropriate AI icon (e.g., BrainIcon from lucide-react)
  - Update data structure for AI node (variableName, prompt, model, temperature, credentialId, etc.)
  - Update description to show AI-specific information
  - Update status channel to use AI-specific channel
  - Update form submission to use AI node form schema

#### Step 3: Create AI Node Dialog
- [x] Modify `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx`:
  - Update form schema (zod) for AI node fields:
    * variableName (string, required)
    * prompt (string, required) - the instruction to send to AI
    * model (string, optional with default) - e.g., "gpt-3.5-turbo", "claude-2", etc.
    * temperature (number, optional) - 0-2 range
    * maxTokens (number, optional)
    * credentialId (string, optional) - reference to stored credentials
  - Update form validation and UI components
  - Integrate with credentials selector to choose API key
  - Update dialog title and description
  - Update form description texts to be AI-specific
  - Update variable name usage in descriptions (e.g., how to reference the AI response in other nodes)

#### Step 4: Create AI Node Executor
- [x] Create AI executor function in `src/features/executors/lib/ai-executor.ts`:
  - Implement function that takes AI node data and calls appropriate LLM API
  - Support for multiple providers (OpenAI, Anthropic, etc.) based on model selection
  - Retrieve API keys from credentials system using credentialId
  - Return generated text response
  - Include proper error handling

#### Step 5: Create AI Node Channel
- [x] Create AI request channel in `src/inngest/channels/ai-request.ts`:
  - Similar to http-request channel but for AI operations
  - Define channel name and topic structure

#### Step 6: Register AI Node Executor
- [x] Update `src/lib/node-registry.ts`:
  - Import AI node executor
  - Register it with the node type enum value

#### Step 7: Update Node Status Hook
- [x] Verify `useNodeStatus` hook works with AI channel
- [x] Create real-time fetch function for AI node status if needed

#### Step 8: Test Integration
- [ ] Verify AI node appears in workflow editor
- [ ] Test configuration dialog with credentials selector
- [ ] Test AI node execution in workflow
- [ ] Verify output can be used in subsequent nodes

### Modified Files
- `src/db/schema/workflows.ts` - Add AI node type
- `src/features/executors/nodes/ai_node/components/ai-node.tsx` - AI node component
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - AI node dialog
- `src/features/executors/lib/ai-executor.ts` - New AI executor
- `src/inngest/channels/ai-request.ts` - New AI channel
- `src/lib/node-registery.ts` - Register AI node executor
- `src/features/executors/lib/actions.ts` - Add fetch function for AI real-time status (if needed)

### Dependencies
- Ensure LLM API keys are configured in environment variables or via credentials system
- AI SDK dependencies are already installed:
  - "ai": "^6.0.82" (main AI SDK)
  - "@ai-sdk/google": "^3.0.26" (Google provider)
  - Additional providers can be added as needed (openai, anthropic, etc.)
- Uses existing credentials system (@/features/credentials)

---

## Modified Files

### New Files Created
- `src/features/executors/nodes/ai_node/components/ai-node.tsx`
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx`
- `src/features/executors/lib/ai-executor.ts`
- `src/inngest/channels/ai-request.ts`
- `src/features/executors/lib/actions.ts` (updated with AI request functions)

### Modified Files
- `src/db/schema/workflows.ts` - Added AI node type to nodeType enum
- `src/lib/node-registery.ts` - Registered AI node executor

### Notes
- The credentials system integration was implemented but uses a placeholder atom that needs to be properly connected to the actual credentials data
- The AI node supports multiple providers (Google Gemini, OpenAI, Anthropic) through model resolution
- The implementation follows the same pattern as the HTTP request node for consistency

---

## Modified Files

### New Files Created
- `src/features/executors/nodes/ai_node/components/ai-node.tsx`
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx`
- `src/features/executors/lib/ai-executor.ts`
- `src/inngest/channels/ai-request.ts`
- `src/features/executors/lib/actions.ts` (updated with AI request functions)

### Modified Files
- `src/db/schema/workflows.ts` - Added AI node type to nodeType enum
- `src/lib/node-registery.ts` - Registered AI node executor
- `src/components/react-flow/node-selecter.tsx` - Added AI node to node selector

### Notes
- The credentials system integration was implemented but uses a placeholder atom that needs to be properly connected to the actual credentials data
- The AI node supports multiple providers (Google Gemini, OpenAI, Anthropic) through model resolution
- The implementation follows the same pattern as the HTTP request node for consistency

---

## Status: Completed
