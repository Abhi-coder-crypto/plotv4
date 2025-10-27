import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Home, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@shared/schema";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/admin"],
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Business overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Leads</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalLeads || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Converted</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.convertedLeads || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Available Plots</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.availablePlots || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-muted-foreground">Revenue</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{((stats?.totalRevenue || 0) / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Lost Leads</span>
              <Badge variant="destructive" className="w-full justify-center" data-testid="badge-lost-leads">
                {stats?.lostLeads || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Unassigned</span>
              <Badge variant="secondary" className="w-full justify-center" data-testid="badge-unassigned-leads">
                {stats?.unassignedLeads || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Projects</span>
              <Badge className="bg-primary w-full justify-center" data-testid="badge-total-projects">
                {stats?.totalProjects || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Booked Plots</span>
              <Badge className="bg-green-600 w-full justify-center" data-testid="badge-booked-plots">
                {stats?.bookedPlots || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Today's Follow-ups</span>
              <Badge className="bg-blue-600 w-full justify-center" data-testid="badge-today-followups">
                {stats?.todayFollowUps || 0}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
