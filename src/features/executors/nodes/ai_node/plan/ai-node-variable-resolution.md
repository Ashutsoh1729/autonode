## AI Node Variable Resolution Enhancement Plan

### Overview
The AI node is not correctly resolving variable references from previous nodes. When an HTTP node returns data like `{"slip": {"id": 137, "advice": "..."}}` and stores it under variable name "advice_1", the AI node should be able to reference this data using `{{advice_1.httpResponse.data}}` in its prompt, but currently this resolution is not working properly.

### Root Cause
The issue lies in how node outputs are stored and resolved:
1. Node outputs need to be stored in the workflow state with proper variable naming
2. Variable reference resolution (like `{{advice_1.httpResponse.data}}`) needs to happen before passing data to the AI model
3. The AI executor needs to substitute these variables with actual values from previous node outputs

### Implementation Steps

#### Step 1: Audit Current Node Output Storage
- [ ] Examine how HTTP nodes store their output data in the workflow state
- [ ] Verify that data is stored under the correct variable name (e.g., "advice_1")
- [ ] Check the structure of stored data (should match the test output format)

#### Step 2: Implement Variable Resolution Utility
- [ ] Create a utility function to resolve variable references in strings
- [ ] Handle references like `{{variableName.property.nestedProperty}}`
- [ ] Support for accessing properties and array indices
- [ ] Graceful handling of undefined references

#### Step 3: Update AI Executor to Resolve Variables
- [ ] Modify the AI executor to preprocess the prompt
- [ ] Find and replace all `{{variableReference}}` patterns with actual values
- [ ] Use the workflow state (previous node outputs) as the data source
- [ ] Handle cases where referenced variables don't exist

#### Step 4: Update AI Node Dialog UI
- [ ] Add documentation/help text showing how to reference previous nodes
- [ ] Example: "To reference HTTP node output: {{advice_1.httpResponse.data}}"
- [ ] Show available variables from connected nodes (if possible)

#### Step 5: Test Variable Resolution
- [ ] Test simple variable references: `{{advice_1.variableName}}`
- [ ] Test nested property access: `{{advice_1.httpResponse.data.slip.advice}}`
- [ ] Test array access if applicable
- [ ] Test mixed content: "Process this: {{advice_1.httpResponse.data}}"

### Modified Files
- `src/features/executors/lib/ai-executor.ts` - Add variable resolution logic
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Add UI help text
- `src/lib/variable-resolution.ts` (new) - Variable resolution utility

### Dependencies
- Existing workflow execution state management
- Current AI node implementation
- Node data flow system

### Testing Verification
- [ ] Verify HTTP node output is correctly stored with variable name
- [ ] Verify AI node can resolve `{{advice_1.variableName}}` references
- [ ] Verify AI node can resolve nested property references
- [ ] Verify AI node handles undefined references gracefully
- [ ] Verify AI node prompt contains actual data, not variable references

---
## Status: Pending Implementation