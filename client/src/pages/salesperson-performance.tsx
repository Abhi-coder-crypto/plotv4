import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Award, TrendingUp, DollarSign, Phone, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import type { SalespersonPerformance, CallLog } from "@shared/schema";

export default function SalespersonPerformancePage() {
  const [selectedSalesperson, setSelectedSalesperson] = useState<SalespersonPerformance | null>(null);

  const { data: salespersonPerformance, isLoading } = useQuery<SalespersonPerformance[]>({
    queryKey: ["/api/analytics/salesperson-performance"],
  });

  const { data: callLogs, isLoading: callLogsLoading } = useQuery<CallLog[]>({
    queryKey: [`/api/analytics/customer-contacts/${selectedSalesperson?.id}`],
    enabled: !!selectedSalesperson,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (selectedSalesperson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedSalesperson(null)}
            data-testid="button-back-to-performance"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedSalesperson.name}'s Call Logs</h1>
            <p className="text-muted-foreground mt-1">View all customer contacts and call activities</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Call Activity History
            </CardTitle>
            <CardDescription>All calls made to leads by {selectedSalesperson.name}</CardDescription>
          </CardHeader>
          <CardContent>
            {callLogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : callLogs && callLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead</TableHead>
                      <TableHead>Call Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Next Follow-up</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {callLogs.map((log) => (
                      <TableRow key={log._id} data-testid={`call-log-${log._id}`}>
                        <TableCell className="font-medium">
                          {(log.leadId as any)?.name || (log.leadId as any)?.phone || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              log.callStatus === "Interested" || log.callStatus === "Meeting Scheduled" 
                                ? "default" 
                                : log.callStatus === "Not Interested"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {log.callStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {log.notes || '-'}
                        </TableCell>
                        <TableCell>
                          {log.nextFollowUpDate 
                            ? format(new Date(log.nextFollowUpDate), 'PP')
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {format(new Date(log.createdAt), 'PP p')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No call logs yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Performance</h1>
        <p className="text-muted-foreground mt-1">Team performance overview - Click on a salesperson to view their call logs</p>
      </div>

      {salespersonPerformance && salespersonPerformance.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {salespersonPerformance.map((person) => (
            <Card 
              key={person.id} 
              className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => setSelectedSalesperson(person)}
              data-testid={`card-salesperson-${person.id}`}
            >
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
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>View Call Logs</span>
                    </div>
                    <span>→</span>
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
