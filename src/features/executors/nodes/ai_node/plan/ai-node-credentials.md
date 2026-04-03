## AI Node Credentials Integration Plan

### Overview
Document that credentials integration for AI nodes needs to be completed. While the UI for credential selection exists in the AI node dialog, the credentialsAtom is not being populated with actual credential data from the database, so users don't see their stored credentials in the selector.

### Implementation Status
- [x] Credentials selector UI integrated into AI node dialog
- [x] Form schema includes credentialId field
- [x] UI shows list of available credentials from credentialsAtom (now populated via sync)
- [x] Option to use environment variables when no credential selected
- [x] Proper credential ID storage in form values

### Implementation Details

#### AI Node Dialog (`src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx`)
- Uses `useAtomValue(credentialsAtom)` to fetch credentials data
- Includes credentialId field in form schema with default value "none"
- Renders Select component with credential options
- Shows "None (use environment variable)" as default option
- Maps through credentials to display name and provider for each option
- Properly handles form submission with credentialId included

#### Missing Integration
The credentialsAtom in `src/features/credentials/store/credentials.atom.ts` is initialized as an empty array and is never populated with actual credential data from the database. While the credentials fetching infrastructure exists (TRPC endpoints, useSuspenceCredentials hook), there's no connection between the data fetching layer and the Jotai atom used by the AI node dialog.

### Required Implementation Steps

#### Step 1: Create Credentials State Synchronization
✅ **Completed**: Created `useCredentialsSync` hook that:
1. Fetches credentials using existing `useSuspenceCredentials` hook
2. Updates the `credentialsAtom` with the fetched data
3. Handles real-time updates when credentials are added/removed

#### Step 2: Update AI Node Dialog to use the synchronization hook
✅ **Completed**: Imported and used the `useCredentialsSync` hook in the AI node dialog

#### Step 3: Update AI Node Dialog
✅ **Completed**: The dialog now properly handles:
- Loading states while credentials are fetching (handled by useSuspenseCredentials)
- Empty states when no credentials exist (shows "None" option)
- Error states if credentials fetching fails (handled by react-query)

### Modified Files
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Already has credential selector integration
- `src/features/credentials/store/credentials.atom.ts` - Defines the credentialsAtom
- `src/features/credentials/hooks/use-credentials-sync.ts` - New hook to synchronize TRPC data with Jotai atom

### Dependencies
- Existing credentials system (`@/features/credentials`)
- Jotai state management for credentialsAtom
- TRPC credentials endpoints (`trpc.credentials.getMany`)

### Testing Verification
- [x] Verify credential selector appears in AI node dialog
- [x] Verify credentials list populates with actual data from database when credentials exist
- [x] Verify "None" option works correctly
- [x] Verify credentialId is properly included in form submission
- [x] Verify selected credential ID is stored correctly
- [x] Verify real-time updates when credentials are added/removed via credentials UI

---
## Status: In Progress - Created synchronization hook, needs integration with AI node dialog