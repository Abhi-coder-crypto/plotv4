import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { WebSocketProvider } from "@/lib/websocket";
import Login from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import SalespersonDashboard from "@/pages/salesperson-dashboard";
import Leads from "@/pages/leads";
import Salespersons from "@/pages/salespersons";
import SalespersonPerformancePage from "@/pages/salesperson-performance";
import Analytics from "@/pages/analytics";
import Plots from "@/pages/plots";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/login");
    } else if (!isAdmin) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isAdmin, setLocation]);

  if (!isAuthenticated || !isAdmin) return null;

  return <Component />;
}

function DashboardRoute() {
  const { user } = useAuth();
  return user?.role === "admin" ? <AdminDashboard /> : <SalespersonDashboard />;
}

function Router() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardRoute} />} />
      <Route path="/leads" component={() => <ProtectedRoute component={Leads} />} />
      <Route path="/analytics" component={() => <AdminRoute component={Analytics} />} />
      <Route path="/performance" component={() => <AdminRoute component={SalespersonPerformancePage} />} />
      <Route path="/salespersons" component={() => <AdminRoute component={Salespersons} />} />
      <Route path="/plots" component={() => <ProtectedRoute component={Plots} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
      <Route path="/" component={() => <ProtectedRoute component={DashboardRoute} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <WebSocketProvider>
            <TooltipProvider>
              <AppContent style={style} />
              <Toaster />
            </TooltipProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function AppContent({ style }: { style: any }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated || location === "/login") {
    return <Router />;
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-muted/30 dark:bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-card backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <SidebarTrigger data-testid="button-sidebar-toggle" className="hover:bg-muted rounded-lg p-2" />
            <div className="flex items-center gap-3">
              {!isAdmin && <NotificationBell />}
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8 bg-background/50 dark:bg-background">
            <div className="max-w-[1600px] mx-auto">
              <Router />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
