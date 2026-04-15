import { useEffect } from "react";
import { useAtom } from "jotai";
import { credentialsAtom } from "../store/credentials.atom";
import { useSuspenceCredentials } from "./credentials.hooks";

type CredentialItem = {
  id: string;
  name: string;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
};

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
      const formattedCredentials = credentialsData.items
        .filter((cred) => cred.provider !== null)
        .map((cred) => ({
          id: cred.id,
          name: cred.name,
          provider: cred.provider as string,
        }));

      setCredentialsAtom(formattedCredentials);
    }
  }, [isLoading, credentialsData?.items, setCredentialsAtom]);
};

