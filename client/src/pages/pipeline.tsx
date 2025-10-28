import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import type { Lead } from "@shared/schema";
import { format } from "date-fns";

const stages = ["New", "Contacted", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

const stageColors: Record<string, string> = {
  "New": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "Contacted": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "Qualified": "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  "Proposal": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  "Negotiation": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  "Closed Won": "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  "Closed Lost": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

const ratingColors: Record<string, string> = {
  "Hot": "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  "High": "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  "Medium": "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
  "Low": "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
};

export default function Pipeline() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAdmin } = useAuth();

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const filteredLeads = isAdmin 
    ? leads 
    : leads.filter(lead => lead.assignedTo === user?._id);

  const searchedLeads = filteredLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLeadsByStage = (stage: string) => {
    return searchedLeads.filter(lead => lead.status === stage);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground" data-testid="text-page-title">
            {isAdmin ? "Sales Pipeline" : "My Pipeline"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin 
              ? "Track all leads through the sales pipeline" 
              : "Track your assigned leads through the sales pipeline"}
          </p>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-leads"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage);
            const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.highestOffer || 0), 0);

            return (
              <div key={stage} className="flex flex-col">
                <Card className="mb-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">
                      {stage}
                    </CardTitle>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span data-testid={`text-stage-count-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                        {stageLeads.length} leads
                      </span>
                      <span data-testid={`text-stage-value-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                        ₹{totalValue.toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                </Card>

                <div className="space-y-3 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-8">
                      No leads
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <Card
                        key={lead._id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        data-testid={`card-lead-${lead._id}`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold text-sm truncate" data-testid={`text-lead-name-${lead._id}`}>
                              {lead.name}
                            </h3>
                            
                            {lead.email && (
                              <p className="text-xs text-muted-foreground truncate">
                                {lead.email}
                              </p>
                            )}
                            
                            {lead.phone && (
                              <p className="text-xs text-muted-foreground">
                                {lead.phone}
                              </p>
                            )}

                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${ratingColors[lead.rating]}`}
                                data-testid={`badge-rating-${lead._id}`}
                              >
                                {lead.rating}
                              </Badge>
                              {lead.classification && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs"
                                  data-testid={`badge-classification-${lead._id}`}
                                >
                                  {lead.classification}
                                </Badge>
                              )}
                            </div>

                            {lead.highestOffer && lead.highestOffer > 0 && (
                              <div className="pt-2 border-t">
                                <p className="text-xs font-semibold text-primary" data-testid={`text-offer-${lead._id}`}>
                                  ₹{lead.highestOffer.toLocaleString()}
                                </p>
                              </div>
                            )}

                            <div className="text-xs text-muted-foreground pt-1">
                              {format(new Date(lead.createdAt), "MMM dd, yyyy")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
