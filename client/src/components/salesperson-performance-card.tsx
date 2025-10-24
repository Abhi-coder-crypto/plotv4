import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { SalespersonPerformance, CustomerContactDetail } from "@shared/schema";
import { format } from "date-fns";
import { Users, TrendingUp, Phone, Target, Eye, ChevronDown, ChevronUp } from "lucide-react";

interface SalespersonPerformanceCardProps {
  person: SalespersonPerformance;
}

export function SalespersonPerformanceCard({ person }: SalespersonPerformanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const { data: contacts, isLoading: contactsLoading } = useQuery<CustomerContactDetail[]>({
    queryKey: [`/api/analytics/customer-contacts/${person.id}`],
    enabled: showContacts,
  });

  const conversionFunnelData = [
    { label: "Approached", count: person.approached, color: "bg-blue-500" },
    { label: "Contacted", count: person.contacted, color: "bg-purple-500" },
    { label: "Interested", count: person.interested, color: "bg-yellow-500" },
    { label: "Site Visits", count: person.siteVisits, color: "bg-orange-500" },
    { label: "Converted", count: person.conversions, color: "bg-green-500" },
    { label: "Lost", count: person.lost, color: "bg-red-500" },
  ];

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`card-salesperson-${person.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold text-lg">
              {person.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg" data-testid={`text-name-${person.id}`}>{person.name}</CardTitle>
              <p className="text-sm text-muted-foreground" data-testid={`text-email-${person.id}`}>{person.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid={`button-expand-${person.id}`}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Leads Assigned</p>
            <p className="text-2xl font-bold" data-testid={`stat-assigned-${person.id}`}>{person.leadsAssigned}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Conversions</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid={`stat-conversions-${person.id}`}>
              {person.conversions}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
            <Badge 
              variant={person.conversionRate > 30 ? "default" : "secondary"}
              className={person.conversionRate > 30 ? "bg-green-500" : person.conversionRate > 15 ? "bg-yellow-500" : ""}
              data-testid={`badge-rate-${person.id}`}
            >
              {person.conversionRate}%
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold" data-testid={`stat-revenue-${person.id}`}>
              ₹{(person.revenue / 100000).toFixed(1)}L
            </p>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily" data-testid={`tab-daily-${person.id}`}>Daily</TabsTrigger>
                <TabsTrigger value="weekly" data-testid={`tab-weekly-${person.id}`}>Weekly</TabsTrigger>
                <TabsTrigger value="monthly" data-testid={`tab-monthly-${person.id}`}>Monthly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="daily" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard icon={Users} label="Approached" value={person.dailyMetrics.approached} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={person.dailyMetrics.contacted} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={person.dailyMetrics.interested} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={person.dailyMetrics.conversions} color="text-green-500" />
                </div>
              </TabsContent>
              
              <TabsContent value="weekly" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard icon={Users} label="Approached" value={person.weeklyMetrics.approached} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={person.weeklyMetrics.contacted} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={person.weeklyMetrics.interested} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={person.weeklyMetrics.conversions} color="text-green-500" />
                </div>
              </TabsContent>
              
              <TabsContent value="monthly" className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <MetricCard icon={Users} label="Approached" value={person.monthlyMetrics.approached} color="text-blue-500" />
                  <MetricCard icon={Phone} label="Contacted" value={person.monthlyMetrics.contacted} color="text-purple-500" />
                  <MetricCard icon={TrendingUp} label="Interested" value={person.monthlyMetrics.interested} color="text-yellow-500" />
                  <MetricCard icon={Target} label="Converted" value={person.monthlyMetrics.conversions} color="text-green-500" />
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Conversion Funnel</h4>
              <div className="space-y-2">
                {conversionFunnelData.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-medium">{item.count}</span>
                    </div>
                    <Progress 
                      value={person.leadsAssigned > 0 ? (item.count / person.leadsAssigned) * 100 : 0} 
                      className={`h-2 ${item.color}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Dialog open={showContacts} onOpenChange={setShowContacts}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" data-testid={`button-view-contacts-${person.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Customer Contacts
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Customer Contacts - {person.name}</DialogTitle>
                  <DialogDescription>
                    View all customers contacted by this salesperson
                  </DialogDescription>
                </DialogHeader>
                {contactsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : contacts && contacts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Last Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id} data-testid={`row-contact-${contact.id}`}>
                          <TableCell className="font-medium">{contact.name}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{contact.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                contact.rating === "Urgent" 
                                  ? "bg-red-500" 
                                  : contact.rating === "High" 
                                  ? "bg-yellow-500" 
                                  : "bg-blue-500"
                              }
                            >
                              {contact.rating}
                            </Badge>
                          </TableCell>
                          <TableCell>{contact.source}</TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(contact.lastContactDate), 'PP')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No contacts found</p>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="space-y-1 p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
