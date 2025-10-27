import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Calendar, CheckCircle, DollarSign } from "lucide-react";
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
      case "Urgent": return "bg-red-500 text-white";
      case "High": return "bg-yellow-500 text-foreground";
      case "Low": return "bg-blue-500 text-white";
      default: return "bg-secondary";
    }
  };

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
        <h1 className="text-2xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your performance overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Assigned Leads</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.assignedLeads || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-muted-foreground">Today's Follow-ups</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.todayFollowUps || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Conversions</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats?.convertedLeads || 0}</p>
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
          <CardTitle>Today's Follow-ups</CardTitle>
        </CardHeader>
        <CardContent>
          {followUpsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : todayFollowUps && todayFollowUps.length > 0 ? (
            <div className="space-y-3">
              {todayFollowUps.map((lead) => (
                <div
                  key={lead._id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  data-testid={`followup-${lead._id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRatingColor(lead.rating)}>
                      {lead.rating}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => setLocation('/leads')}
                      data-testid={`button-view-lead-${lead._id}`}
                    >
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No follow-ups scheduled for today</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
