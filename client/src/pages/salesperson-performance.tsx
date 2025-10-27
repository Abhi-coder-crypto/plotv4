import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalespersonPerformanceCard } from "@/components/salesperson-performance-card";
import type { SalespersonPerformance } from "@shared/schema";

export default function SalespersonPerformancePage() {
  const { data: salespersonPerformance, isLoading } = useQuery<SalespersonPerformance[]>({
    queryKey: ["/api/analytics/salesperson-performance"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          Salesperson Performance
        </h1>
        <p className="text-muted-foreground mt-1">
          Detailed performance metrics and analytics for all salespersons
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>
            View detailed metrics for each salesperson including leads, conversions, and customer interactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : salespersonPerformance && salespersonPerformance.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {salespersonPerformance.map((salesperson) => (
                <SalespersonPerformanceCard
                  key={salesperson.id}
                  person={salesperson}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-foreground">No salesperson data available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Performance metrics will appear here once salespersons start managing leads
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
