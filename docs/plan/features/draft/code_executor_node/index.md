# Code Executor Node

## Overview

Add a code execution node to the workflow editor that allows users to write custom JavaScript/TypeScript code to transform data, perform calculations, or implement custom logic.

## Questions / TODOs

- [ ] What language should the code run in? (JavaScript/TypeScript)
- [ ] Should code run in a sandboxed environment? If so, which one?
- [ ] What inputs should the node accept?
- [ ] What outputs should be produced?
- [ ] Should we support external npm packages?
- [ ] How should we handle errors/timeouts?
- [ ] Should we support environment variables / secrets?

## Expected Functionality (Draft)

1. User writes custom code in a code editor (Monaco/CodeMirror)
2. Node receives input from previous nodes via `context`
3. Node executes code and produces output
4. Output is added to `context` for downstream nodes

## Example Use Cases

- Data transformation / mapping
- Math calculations
- String manipulation
- Conditional logic
- API calls to services not covered by HTTP node

## Technical Considerations

- Execution environment: Node.js (via Inngest step.run)?
- Sandboxing: Need isolation for user code
- Editor: Use existing editor component?
- Security: Prevent access to secrets, file system

---

## Status: Draft
