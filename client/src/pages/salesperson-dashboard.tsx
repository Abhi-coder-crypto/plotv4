import { useQuery } from "@tanstack/react-query";

import { ClipboardList, Calendar, CheckCircle, DollarSign, AlertCircle, Users, Phone, TrendingUp, Target } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import type { SalespersonStats, Lead } from "@shared/schema";
import { format } from "date-fns";

interface DetailedMetrics {
  leadsAssigned: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  approached: number;
  contacted: number;
  interested: number;
  siteVisits: number;
  lost: number;
  dailyMetrics: {
    approached: number;
    contacted: number;
    interested: number;
    conversions: number;
  };
  weeklyMetrics: {
    approached: number;
    contacted: number;
    interested: number;
    conversions: number;
  };
  monthlyMetrics: {
    approached: number;
    contacted: number;
    interested: number;
    conversions: number;
  };
}

export default function SalespersonDashboard() {
  const [, setLocation] = useLocation();

  const { data: stats, isLoading: statsLoading } = useQuery<SalespersonStats>({
    queryKey: ["/api/dashboard/salesperson"],
  });

  const { data: detailedMetrics, isLoading: metricsLoading } = useQuery<DetailedMetrics>({
    queryKey: ["/api/dashboard/salesperson/detailed"],
  });

  const { data: todayFollowUps, isLoading: followUpsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads/today-followups"],
  });

  const { data: contactedLeads, isLoading: contactedLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads/contacted"],
  });

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "Urgent": return "bg-chart-3 text-white";
      case "High": return "bg-chart-4 text-foreground";
      case "Low": return "bg-chart-1 text-foreground";
      default: return "bg-secondary";
    }
  };

  if (statsLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const conversionFunnelData = [
    { label: "Approached", count: detailedMetrics?.approached || 0, color: "bg-blue-500" },
    { label: "Contacted", count: detailedMetrics?.contacted || 0, color: "bg-purple-500" },
    { label: "Interested", count: detailedMetrics?.interested || 0, color: "bg-yellow-500" },
    { label: "Site Visits", count: detailedMetrics?.siteVisits || 0, color: "bg-orange-500" },
    { label: "Converted", count: detailedMetrics?.conversions || 0, color: "bg-green-500" },
    { label: "Lost", count: detailedMetrics?.lost || 0, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div
      >
        <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your performance and today's tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Leads"
          value={stats?.assignedLeads || 0}
          icon={ClipboardList}
          gradient="from-primary to-primary/70"
          delay={0}
        />
        <StatCard
          title="Today's Follow-ups"
          value={stats?.todayFollowUps || 0}
          icon={Calendar}
          gradient="from-accent to-accent/70"
          delay={0.1}
        />
        <StatCard
          title="Converted Leads"
          value={stats?.convertedLeads || 0}
          icon={CheckCircle}
          gradient="from-chart-3 to-chart-3/70"
          delay={0.2}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${((stats?.totalRevenue || 0) / 100000).toFixed(1)}L`}
          icon={DollarSign}
          gradient="from-chart-2 to-chart-2/70"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Activity Tracking</CardTitle>
            <CardDescription>Daily, weekly, and monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily" data-testid="tab-daily-metrics">Daily</TabsTrigger>
                <TabsTrigger value="weekly" data-testid="tab-weekly-metrics">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" data-testid="tab-monthly-metrics">Monthly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard icon={Users} label="Approached" value={detailedMetrics?.dailyMetrics.approached || 0} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={detailedMetrics?.dailyMetrics.contacted || 0} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={detailedMetrics?.dailyMetrics.interested || 0} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={detailedMetrics?.dailyMetrics.conversions || 0} color="text-green-500" />
                </div>
                {contactedLeads && contactedLeads.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recently Contacted Leads</p>
                    <div className="space-y-2">
                      {contactedLeads.slice(0, 5).map((lead) => (
                        <div key={lead._id} className="flex items-center justify-between text-sm p-2 rounded bg-muted/50">
                          <span className="font-medium">{lead.name}</span>
                          <span className="text-muted-foreground text-xs">{lead.phone}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="weekly" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard icon={Users} label="Approached" value={detailedMetrics?.weeklyMetrics.approached || 0} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={detailedMetrics?.weeklyMetrics.contacted || 0} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={detailedMetrics?.weeklyMetrics.interested || 0} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={detailedMetrics?.weeklyMetrics.conversions || 0} color="text-green-500" />
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard icon={Users} label="Approached" value={detailedMetrics?.monthlyMetrics.approached || 0} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={detailedMetrics?.monthlyMetrics.contacted || 0} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={detailedMetrics?.monthlyMetrics.interested || 0} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={detailedMetrics?.monthlyMetrics.conversions || 0} color="text-green-500" />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead progression through the sales pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnelData.map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">{item.label}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                  <Progress 
                    value={detailedMetrics?.leadsAssigned ? (item.count / detailedMetrics.leadsAssigned) * 100 : 0} 
                    className={`h-3 ${item.color}`}
                  />
                </div>
              ))}
              <div className="pt-4 border-t mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Conversion Rate</span>
                  <Badge 
                    className={
                      (detailedMetrics?.conversionRate || 0) > 30 
                        ? "bg-green-500" 
                        : (detailedMetrics?.conversionRate || 0) > 15 
                        ? "bg-yellow-500" 
                        : "bg-gray-500"
                    }
                  >
                    {detailedMetrics?.conversionRate.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Today's Follow-ups</CardTitle>
            <CardDescription>Leads scheduled for follow-up today</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/leads")}
            data-testid="button-view-all-leads"
          >
            View All Leads
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {followUpsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : todayFollowUps && todayFollowUps.length > 0 ? (
              <div className="space-y-3">
                {todayFollowUps.map((lead) => (
                  <div
                    key={lead._id}
                    className="flex items-start justify-between p-4 rounded-lg border border-border hover-elevate"
                    data-testid={`followup-${lead._id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{lead.name}</p>
                        <Badge className={getRatingColor(lead.rating)} data-testid={`badge-rating-${lead._id}`}>
                          {lead.rating}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{lead.phone}</p>
                      {lead.notes && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{lead.notes}</p>
                      )}
                      {lead.followUpDate && (
                        <p className="text-xs text-accent font-medium mt-2">
                          Follow-up: {format(new Date(lead.followUpDate), "PPp")}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setLocation(`/leads?id=${lead._id}`)}
                      data-testid={`button-view-lead-${lead._id}`}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-lg font-medium text-foreground">No follow-ups today</p>
                <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="space-y-1 p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
