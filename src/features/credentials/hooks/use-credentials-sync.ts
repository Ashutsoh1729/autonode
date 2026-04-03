import { useEffect } from "react";
import { useAtom } from "jotai";
import { credentialsAtom } from "../store/credentials.atom";
import { useSuspenceCredentials } from "./credentials.hooks";

/**
 * Hook to synchronize credentials data from TRPC to Jotai atom
 * This ensures that UI components using credentialsAtom (like AI node dialog)
 * have access to the actual credential data from the database
 */
export const useCredentialsSync = () => {
  const { data: credentialsData, isLoading } = useSuspenceCredentials();
  const [, setCredentialsAtom] = useAtom(credentialsAtom);

  useEffect(() => {
    if (!isLoading && credentialsData?.items) {
      // Transform TRPC credentials format to atom format
      // TRPC returns: { id, name, provider, key, createdAt, updatedAt }
      // Atom expects: { id, name, provider }
      const formattedCredentials = credentialsData.items.map((cred: any) => ({
        id: cred.id,
        name: cred.name,
        provider: cred.provider,
      }));

      setCredentialsAtom(formattedCredentials);
    }
  }, [isLoading, credentialsData?.items, setCredentialsAtom]);
};

