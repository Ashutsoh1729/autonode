import { atom } from "jotai";

export const credentialDialog = atom<boolean>(false);

// Atom to store credentials data
export const credentialsAtom = atom<Array<{ id: string; name: string; provider: string }>>([]);