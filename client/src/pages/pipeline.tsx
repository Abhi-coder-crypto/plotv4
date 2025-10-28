import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import type { Lead, PopulatedUser } from "@shared/schema";

const stages = ["New", "Contacted", "Interested", "Site Visit", "Booked", "Lost"];

const stageConfig: Record<string, { gradient: string; badge: string; border: string }> = {
  "New": {
    gradient: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20",
    badge: "bg-blue-600 text-white",
    border: "border-blue-300 dark:border-blue-700"
  },
  "Contacted": {
    gradient: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20",
    badge: "bg-purple-600 text-white",
    border: "border-purple-300 dark:border-purple-700"
  },
  "Interested": {
    gradient: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20",
    badge: "bg-green-600 text-white",
    border: "border-green-300 dark:border-green-700"
  },
  "Site Visit": {
    gradient: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20",
    badge: "bg-indigo-600 text-white",
    border: "border-indigo-300 dark:border-indigo-700"
  },
  "Booked": {
    gradient: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20",
    badge: "bg-emerald-600 text-white",
    border: "border-emerald-300 dark:border-emerald-700"
  },
  "Lost": {
    gradient: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20",
    badge: "bg-red-600 text-white",
    border: "border-red-300 dark:border-red-700"
  },
};

const ratingColors: Record<string, string> = {
  "Urgent": "bg-red-500 text-white",
  "Hot": "bg-orange-500 text-white",
  "High": "bg-yellow-500 text-foreground",
  "Medium": "bg-blue-500 text-white",
  "Low": "bg-gray-400 text-foreground",
};

export default function Pipeline() {
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isAdmin } = useAuth();

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const filteredLeads = isAdmin 
    ? leads 
    : leads.filter(lead => {
        const assignedToId = lead.assignedTo 
          ? (typeof lead.assignedTo === 'object' ? (lead.assignedTo as PopulatedUser)._id : lead.assignedTo)
          : null;
        return assignedToId === user?._id;
      });

  const searchedLeads = filteredLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLeadsByStage = (stage: string) => {
    return searchedLeads.filter(lead => lead.status === stage);
  };

  const totalPipelineValue = searchedLeads.reduce((sum, lead) => sum + (lead.highestOffer || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground" data-testid="text-page-title">
                {isAdmin ? "Sales Pipeline" : "My Pipeline"}
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                {isAdmin 
                  ? "Track all leads through the sales pipeline" 
                  : "Track your assigned leads through the sales pipeline"}
              </p>
            </div>
            <div className="flex items-center gap-4 bg-card border border-border rounded-lg px-6 py-4 shadow-sm">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Pipeline Value</p>
                <p className="text-2xl font-bold text-foreground">₹{totalPipelineValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search leads by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 text-base border-2 focus:ring-2 focus:ring-primary/20"
              data-testid="input-search-leads"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage);
            const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.highestOffer || 0), 0);
            const config = stageConfig[stage];

            return (
              <div key={stage} className="flex flex-col">
                <div className={`mb-4 p-4 rounded-xl ${config.gradient} border-2 ${config.border} shadow-lg`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-foreground">{stage}</h3>
                    <Badge className={`${config.badge} text-sm font-bold px-3 py-1 shadow-md`} data-testid={`text-stage-count-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stageLeads.length}
                    </Badge>
                  </div>
                  {totalValue > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-current/10">
                      <TrendingUp className="h-3.5 w-3.5 text-foreground/70" />
                      <p className="text-sm font-bold text-foreground" data-testid={`text-stage-value-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                        ₹{totalValue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 flex-1 min-h-[300px] bg-muted/10 rounded-xl p-3 border-2 border-dashed border-border/50">
                  {stageLeads.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-sm text-muted-foreground py-8">
                        <div className="mb-2 text-4xl opacity-20">📋</div>
                        <p className="font-medium">No leads</p>
                      </div>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <Card
                        key={lead._id}
                        className="hover:shadow-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer border-2 bg-card/95 backdrop-blur"
                        data-testid={`card-lead-${lead._id}`}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-base text-foreground truncate" data-testid={`text-lead-name-${lead._id}`}>
                              {lead.name}
                            </h4>
                            
                            <p className="text-sm text-muted-foreground truncate font-medium">
                              📞 {lead.phone}
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge 
                                className={`text-xs px-2 py-1 font-bold shadow-sm ${ratingColors[lead.rating]}`}
                                data-testid={`badge-rating-${lead._id}`}
                              >
                                {lead.rating}
                              </Badge>
                              {lead.classification && (
                                <Badge 
                                  variant="outline" 
                                  className="text-xs px-2 py-1 font-semibold border-2"
                                  data-testid={`badge-classification-${lead._id}`}
                                >
                                  {lead.classification}
                                </Badge>
                              )}
                            </div>

                            {lead.highestOffer && lead.highestOffer > 0 && (
                              <div className="pt-2.5 mt-2.5 border-t-2 border-dashed">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground font-semibold">Offer</span>
                                  <p className="text-base font-bold text-primary" data-testid={`text-offer-${lead._id}`}>
                                    ₹{lead.highestOffer.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}
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
