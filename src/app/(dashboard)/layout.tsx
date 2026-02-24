import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-screen ">
      <AppSidebar />
      <main className="flex-1  min-h-0 h-[calc(100vh-4rem)]">{children}</main>
    </SidebarProvider>
  );
}
