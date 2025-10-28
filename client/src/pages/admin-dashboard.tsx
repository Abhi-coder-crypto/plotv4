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
      <div className="flex items-center justify-center h-full gradient-bg-subtle">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent pulse-glow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header Section with Gradient */}
      <div className="relative overflow-hidden rounded-2xl p-8 gradient-bg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/90 text-lg">
            Welcome back! Here's your business overview ✨
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards with Animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Leads</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stats?.totalLeads || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Active Pipeline</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg float-icon">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-100">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Converted</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {stats?.convertedLeads || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Success Stories</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg float-icon">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-200">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Available Plots</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stats?.availablePlots || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <Home className="h-4 w-4" />
                  <span className="font-medium">Ready to Book</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg float-icon">
                <Home className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-300">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Revenue</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  ₹{((stats?.totalRevenue || 0) / 100000).toFixed(1)}L
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Earnings</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg float-icon">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance & Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-hover border-none glass shadow-xl animate-scale-in">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Lost Leads</span>
                </div>
                <p className="text-4xl font-bold">{stats?.lostLeads || 0}</p>
              </div>
              
              <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gray-500 to-slate-500 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground">Unassigned</span>
                </div>
                <p className="text-4xl font-bold">{stats?.unassignedLeads || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-scale-in animate-delay-100">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span>Project Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center space-y-3 p-4 rounded-xl hover:bg-accent/50 transition-all cursor-pointer">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg float-icon">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stats?.totalProjects || 0}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Projects</p>
              </div>
              
              <div className="text-center space-y-3 p-4 rounded-xl hover:bg-accent/50 transition-all cursor-pointer">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg float-icon">
                    <CheckCircle className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stats?.bookedPlots || 0}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Booked Plots</p>
              </div>
              
              <div className="text-center space-y-3 p-4 rounded-xl hover:bg-accent/50 transition-all cursor-pointer">
                <div className="flex justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg float-icon">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stats?.todayFollowUps || 0}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Follow-ups Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
