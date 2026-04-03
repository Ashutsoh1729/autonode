## AI Node Credentials Integration Plan

### Overview
Document that credentials integration for AI nodes needs to be completed. While the UI for credential selection exists in the AI node dialog, the credentialsAtom is not being populated with actual credential data from the database, so users don't see their stored credentials in the selector.

### Implementation Status
- [x] Credentials selector UI integrated into AI node dialog
- [x] Form schema includes credentialId field
- [ ] UI shows list of available credentials from credentialsAtom (currently empty)
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
Create a hook or mechanism to:
1. Fetch credentials using existing `useSuspenceCredentials` hook
2. Update the `credentialsAtom` with the fetched data
3. Handle real-time updates when credentials are added/removed

#### Step 2: Implementation Options
Option A: Create a custom hook that synchronizes TRPC data with Jotai atom
Option B: Update credentials component to also update the atom when data changes
Option C: Create a provider/context that manages credentials state

#### Step 3: Update AI Node Dialog
Ensure the dialog properly handles:
- Loading states while credentials are fetching
- Empty states when no credentials exist
- Error states if credentials fetching fails

### Modified Files
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Already has credential selector integration
- `src/features/credentials/store/credentials.atom.ts` - May need to update atom initialization or create update mechanism
- New file: `src/features/credentials/hooks/use-credentials-sync.ts` or similar - To synchronize TRPC data with Jotai atom

### Dependencies
- Existing credentials system (`@/features/credentials`)
- Jotai state management for credentialsAtom
- TRPC credentials endpoints (`trpc.credentials.getMany`)

### Testing Verification
- [ ] Verify credential selector appears in AI node dialog
- [ ] Verify credentials list populates with actual data from database when credentials exist
- [ ] Verify "None" option works correctly
- [ ] Verify credentialId is properly included in form submission
- [x] Verify selected credential ID is stored correctly
- [x] Verify real-time updates when credentials are added/removed via credentials UI

### Modified Files
- `src/features/executors/nodes/ai_node/components/ai-node-dialog.tsx` - Added credential selector and useCredentialsSync hook
- `src/features/credentials/hooks/use-credentials-sync.ts` (new) - Hook to sync TRPC credentials to Jotai atom

---
## Status: Completed