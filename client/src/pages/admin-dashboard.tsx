import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Home, DollarSign, Users, TrendingUp, AlertCircle, Calendar, Building2, Target } from "lucide-react";
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
    <div className="space-y-8 p-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your business overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-4xl font-bold tracking-tight">{stats?.totalLeads || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-400/10">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 dark:border-l-green-400 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Converted</p>
                <p className="text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">{stats?.convertedLeads || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 dark:bg-green-400/10">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 dark:border-l-purple-400 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Available Plots</p>
                <p className="text-4xl font-bold tracking-tight">{stats?.availablePlots || 0}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 dark:bg-purple-400/10">
                <Home className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 dark:border-l-amber-400 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-4xl font-bold tracking-tight">₹{((stats?.totalRevenue || 0) / 100000).toFixed(1)}L</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-400/10">
                <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Target className="h-5 w-5 text-primary" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 dark:bg-red-400/10">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Lost Leads</span>
                </div>
                <p className="text-3xl font-bold ml-10">{stats?.lostLeads || 0}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-500/10 dark:bg-gray-400/10">
                    <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Unassigned</span>
                </div>
                <p className="text-3xl font-bold ml-10">{stats?.unassignedLeads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Building2 className="h-5 w-5 text-primary" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.totalProjects || 0}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 dark:bg-green-400/10">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.bookedPlots || 0}</p>
                <p className="text-xs text-muted-foreground">Booked Plots</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stats?.todayFollowUps || 0}</p>
                <p className="text-xs text-muted-foreground">Follow-ups Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
