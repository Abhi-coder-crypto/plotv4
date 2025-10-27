import { useQuery } from "@tanstack/react-query";
import { Users, Award, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-muted-foreground mt-1">Team performance overview</p>
      </div>

      {salespersonPerformance && salespersonPerformance.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {salespersonPerformance.map((person) => (
            <Card key={person.id} className="hover:shadow-md transition-shadow" data-testid={`card-salesperson-${person.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{person.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{person.email}</p>
                  </div>
                  <Badge 
                    variant={person.conversionRate > 30 ? "default" : "secondary"}
                    className={`${person.conversionRate > 30 ? "bg-green-500" : person.conversionRate > 15 ? "bg-yellow-500" : ""} text-sm`}
                  >
                    {person.conversionRate}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-xs">Leads</span>
                    </div>
                    <p className="text-2xl font-bold">{person.leadsAssigned}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="h-4 w-4" />
                      <span className="text-xs">Conversions</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {person.conversions}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Interests</span>
                    </div>
                    <p className="text-2xl font-bold">{person.buyerInterestsAdded}</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold">₹{(person.revenue / 100000).toFixed(1)}L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-foreground">No performance data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Data will appear here once salespersons start managing leads
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
