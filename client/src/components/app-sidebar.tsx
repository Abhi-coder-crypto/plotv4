import { Home, Users, Building2, ClipboardList, Settings, LogOut, User, BarChart3, LineChart, LayoutDashboard, UserCog, Phone } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const { user, logout, isAdmin } = useAuth();
  const [location] = useLocation();

  const adminSections = [
    {
      label: "Overview",
      items: [
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: "Sales Management",
      items: [
        { title: "Leads", url: "/leads", icon: ClipboardList },
        { title: "Salespersons", url: "/salespersons", icon: Users },
        { title: "Projects & Plots", url: "/plots", icon: Building2 },
      ],
    },
    {
      label: "Analytics & Reports",
      items: [
        { title: "Analytics", url: "/analytics", icon: LineChart },
        { title: "Performance", url: "/performance", icon: BarChart3 },
      ],
    },
    {
      label: "System",
      items: [
        { title: "Settings", url: "/settings", icon: Settings },
      ],
    },
  ];

  const salespersonItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Assigned Leads", url: "/leads", icon: ClipboardList },
    { title: "Prospect Calls", url: "/prospect-calls", icon: Phone },
    { title: "Available Plots", url: "/plots", icon: Building2 },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent className="pt-6 pb-4">
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-accent shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground">Plot CRM</h2>
              <p className="text-xs text-muted-foreground capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>
        
        <Separator className="mb-2" />

        {isAdmin ? (
          adminSections.map((section, idx) => (
            <SidebarGroup key={section.label} className={idx > 0 ? "mt-4" : ""}>
              <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                        className="mx-3 rounded-lg"
                      >
                        <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className="h-4 w-4 shrink-0" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {salespersonItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location === item.url}
                      data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mx-3 rounded-lg"
                    >
                      <Link href={item.url} className="flex items-center gap-3 px-3 py-2.5">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 p-3 border border-sidebar-border">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm">
                <UserCog className="h-4 w-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout} 
              data-testid="button-logout" 
              className="w-full hover:bg-destructive/10 hover:text-destructive rounded-lg"
            >
              <LogOut className="h-4 w-4" />
              <span className="font-medium">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
