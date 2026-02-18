import { AppHeader } from "@/components/dashboard/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
    </>
  );
}
