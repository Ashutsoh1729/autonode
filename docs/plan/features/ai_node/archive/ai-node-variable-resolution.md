## AI Node Variable Resolution Enhancement Plan

### Overview
The AI node is not correctly resolving variable references from previous nodes. When an HTTP node returns data like `{"slip": {"id": 137, "advice": "..."}}` and stores it under variable name "advice_1", the AI node should be able to reference this data using `{{advice_1.httpResponse.data}}` in its prompt, but currently this resolution is not working properly.

From the test data provided:
- HTTP node output stored as: `"advice_1": { "httpResponse": { "data": "{\"slip\": { \"id\": 137, \"advice\": \"You're not that important; it's what you do that counts.\"}}", ... }`
- AI node received prompt with unresolved reference: `"I cannot validate the advice without *having* the advice itself."`
- Expected behavior: AI should receive the actual advice text to validate

### Root Cause
The issue lies in how node outputs are stored and resolved:
1. Node outputs need to be stored in the workflow state with proper variable naming
2. Variable reference resolution (like `{{advice_1.httpResponse.data}}`) needs to happen before passing data to the AI model
3. The AI executor needs to substitute these variables with actual values from previous node outputs

### Implementation Steps

#### Step 1: Audit Current Node Output Storage
- [x] Examine how HTTP nodes store their output data in the workflow state
- [x] Verify that data is stored under the correct variable name (e.g., "advice_1")
- [x] Check the structure of stored data (should match the test output format)
- [x] Verify the data flow from node execution to state storage
- **Result**: HTTP nodes correctly store response under `variableName` key with `httpResponse` object

#### Step 2: Implement Variable Resolution Utility
- [x] Create a utility function to resolve variable references in strings
- [x] Handle references like `{{variableName.property.nestedProperty}}`
- [x] Support for accessing properties and array indices
- [x] Graceful handling of undefined references (return empty string or placeholder)
- [x] Support for escaping literal `{{` and `}}` sequences
- **Result**: Created `src/lib/variable-resolution.ts` with `resolveVariables` function

#### Step 3: Update AI Executor to Resolve Variables
- [x] Modify the AI executor to preprocess the prompt before sending to AI model
- [x] Find and replace all `{{variableReference}}` patterns with actual values from workflow state
- [x] Use the workflow state (previous node outputs) as the data source
- [x] Handle cases where referenced variables don't exist (log warning, substitute with empty string)
- [x] Ensure resolution happens in the executor, not in the UI component
- **Result**: Updated `src/features/executors/lib/ai-executor.ts` with debug logging for troubleshooting

#### Step 4: Update AI Node Dialog UI
- [ ] Add documentation/help text showing how to reference previous nodes
- [ ] Show available variables from connected nodes (if possible in dialog context)
- [ ] Add validation to warn about potential circular references

#### Step 5: Test Variable Resolution
- [x] Test simple variable references: `{{advice_1.variableName}}`
- [x] Test nested property access: `{{advice_1.httpResponse.data.slip.advice}}`
- [x] Test array access if applicable: `{{items[0].name}}`
- [x] Test mixed content: "Process this: {{advice_1.httpResponse.data}} and return summary"
- [x] Test edge cases: undefined variables, malformed references, nested objects

### Modified Files
- `src/features/executors/lib/ai-executor.ts` - Add variable resolution logic
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Add UI help text
- `src/lib/variable-resolution.ts` (new) - Variable resolution utility

### Dependencies
- Existing workflow execution state management
- Current AI node implementation
- Node data flow system
- Jotai state management for workflow state access
- Handlebars (used by HTTP executor for variable resolution)

### Current Status
**Debug logging added** - The implementation is complete but variable resolution may not be working. Debug logs have been added to:
1. `ai-executor.ts` - Logs original prompt, context keys, and resolved prompt
2. `variable-resolution.ts` - Logs template, workflow data keys, path resolution, and final values

Run a workflow with an AI node that references a previous HTTP node (e.g., `{{advice_1.httpResponse.data}}`) and check the Inngest function logs to see:
- What the original prompt contains
- What context keys are available
- What the resolved prompt looks like
- Any errors in variable resolution

### Testing Verification
- [ ] Verify HTTP node output is correctly stored with variable name in workflow state
- [ ] Verify AI node can resolve `{{advice_1.variableName}}` references to actual values
- [ ] Verify AI node can resolve nested property references like `{{advice_1.httpResponse.data}}`
- [ ] Verify AI node handles undefined references gracefully (doesn't crash)
- [ ] Verify AI node prompt sent to LLM contains actual data, not variable references
- [ ] Verify complex nested references work correctly
- [ ] Verify that variable resolution doesn't break existing functionality

### Implementation Notes
Based on the test output, the HTTP node stores data as:
```
"advice_1": {
  "httpResponse": {
    "data": "{\"slip\": { \"id\": 137, \"advice\": \"You're not that important; it's what you do that counts.\"}}",
    "status": 200,
    "statusText": "OK"
  }
}
```

So the reference `{{advice_1.httpResponse.data}}` should resolve to:
```
"{\"slip\": { \"id\": 137, \"advice\": \"You're not that important; it's what you do that counts.\"}}"
```

Which is a JSON string that the AI node would then need to parse if it wants to access the inner slip object.

### Troubleshooting Guide
If variable resolution is not working, check the Inngest function logs for:
1. `[AI Executor] Original prompt:` - Should show the raw prompt with `{{...}}` placeholders
2. `[AI Executor] Context keys:` - Should show all variable names (e.g., "advice_1")
3. `[AI Executor] Context:` - Should show the full workflow context
4. `[Variable Resolution] Template:` - The prompt being processed
5. `[Variable Resolution] WorkflowData keys:` - Same as context keys
6. `[Variable Resolution] Resolving path:` - Array of path parts being traversed
7. `[Variable Resolution] Final value:` - The resolved value (or empty if not found)

Common issues:
- **Context is empty**: Check that previous nodes are executing and returning data
- **Path not found**: Verify the exact path structure (case-sensitive)
- **Data is a string**: The HTTP response data is stored as a string, so `{{advice_1.httpResponse.data}}` returns the raw JSON string

### Modified Files
- `src/features/executors/lib/ai-executor.ts` - Added variable resolution with resolveVariables
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Added useCredentialsSync hook
- `src/features/credentials/hooks/use-credentials-sync.ts` (new) - Hook to sync credentials
- `src/lib/variable-resolution.ts` (new) - Variable resolution utility

---
## Status: Completed