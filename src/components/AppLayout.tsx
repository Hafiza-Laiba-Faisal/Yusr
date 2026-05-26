import { NavLink, useLocation, Outlet } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { MessageSquare, BookOpen, Settings, LogOut, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import logo from "@/assets/yusr-logo.png";

const items = [
  { title: "Inbox", url: "/app/inbox", icon: MessageSquare, requiredPermission: "inbox.view" },
  { title: "Knowledge Base", url: "/app/knowledge", icon: BookOpen, requiredPermission: "knowledge.view" },
  { title: "Settings", url: "/app/settings", icon: Settings, requiredPermission: "settings.view" },
  { title: "Admin", url: "/app/admin", icon: ShieldCheck, requiredPermission: "users.view" },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { signOut, user, hasPermission } = useAuth();

  const visibleItems = items.filter(item => 
    !item.requiredPermission || hasPermission(item.requiredPermission)
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent className="bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
          <img src={logo} alt="yusr" className="h-8 w-8 rounded-lg" width={32} height={32} />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base">yusr</span>
              <span className="text-[10px] text-muted-foreground tracking-wide uppercase">AI Automation</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-3 border-t border-sidebar-border">
          {!collapsed && (
            <div className="mb-3 rounded-lg bg-gradient-primary p-3 text-primary-foreground shadow-elegant">
              <div className="flex items-center gap-2 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                AI Powered
              </div>
              <p className="mt-1 text-[11px] opacity-90 truncate">{user?.email}</p>
            </div>
          )}
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b bg-card/50 backdrop-blur sticky top-0 z-10">
            <SidebarTrigger className="ml-2" />
          </header>
          <main className="flex-1 min-w-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
