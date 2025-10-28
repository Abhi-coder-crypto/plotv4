import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Calendar, CheckCircle, DollarSign, Phone, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import type { SalespersonStats, Lead } from "@shared/schema";
import { format } from "date-fns";

export default function SalespersonDashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery<SalespersonStats>({
    queryKey: ["/api/dashboard/salesperson"],
  });

  const { data: todayFollowUps, isLoading: followUpsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads/today-followups"],
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Urgent": return "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg";
      case "High": return "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg";
      case "Low": return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg";
      default: return "bg-secondary";
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-full gradient-bg-subtle">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent pulse-glow"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl p-8 gradient-bg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg mb-2">
            My Performance Dashboard
          </h1>
          <p className="text-white/90 text-lg">
            Track your leads, conversions, and earnings 🚀
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Cards with Stagger Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up" data-testid="card-assigned-leads">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Assigned Leads</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {stats?.assignedLeads || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <ClipboardList className="h-4 w-4" />
                  <span className="font-medium">Your Pipeline</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-100" data-testid="card-followups">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Today's Follow-ups</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {stats?.todayFollowUps || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Scheduled</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-200" data-testid="card-conversions">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Conversions</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                  {stats?.convertedLeads || 0}
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Success!</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg pulse-glow">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-none glass shadow-xl animate-fade-in-up animate-delay-300" data-testid="card-revenue">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">My Revenue</p>
                <p className="text-5xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">
                  ₹{((stats?.totalRevenue || 0) / 100000).toFixed(1)}L
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Earnings</span>
                </div>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Follow-ups Card */}
      <Card className="card-hover border-none glass shadow-xl animate-scale-in">
        <CardHeader className="border-b border-border/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl font-bold">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <span>Today's Follow-ups</span>
              {todayFollowUps && todayFollowUps.length > 0 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {todayFollowUps.length} calls pending
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {followUpsLoading ? (
            <div className="flex justify-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              </div>
            </div>
          ) : todayFollowUps && todayFollowUps.length > 0 ? (
            <div className="space-y-3">
              {todayFollowUps.map((lead, index) => (
                <div
                  key={lead._id}
                  className="group flex items-center justify-between p-4 rounded-xl border-2 border-transparent hover:border-primary/20 bg-gradient-to-r from-background to-accent/30 hover:from-accent/50 hover:to-accent/70 transition-all duration-300 shadow-sm hover:shadow-lg animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  data-testid={`followup-${lead._id}`}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-lg group-hover:text-primary transition-colors">{lead.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${getRatingColor(lead.rating)} px-4 py-2 text-sm font-semibold`}>
                      {lead.rating} Priority
                    </Badge>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
                      onClick={() => setLocation('/leads')}
                      data-testid={`button-view-lead-${lead._id}`}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-500 shadow-xl">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">All caught up! 🎉</p>
                <p className="text-muted-foreground mt-2">No follow-ups scheduled for today. Great job!</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
