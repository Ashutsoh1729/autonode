"use client"

import { Home, Settings, LogOut, Code2, Plus } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

// Menu items.
const items = [
    {
        title: "Workflows",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Templates",
        url: "/dashboard/templates",
        icon: Code2,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const router = useRouter();

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex items-center justify-between px-4 py-2">
                        <SidebarGroupLabel className="text-lg font-bold text-foreground">Autonode</SidebarGroupLabel>
                        <button className="text-muted-foreground hover:text-foreground">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={async () => {
                                await signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push("/sign-in");
                                        },
                                    },
                                });
                            }}
                        >
                            <LogOut />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
