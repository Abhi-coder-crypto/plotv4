import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, Eye, Phone, Mail, Calendar, User } from "lucide-react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import type { Lead, PopulatedUser } from "@shared/schema";
import { format } from "date-fns";

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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground" data-testid="text-page-title">
                {isAdmin ? "Sales Pipeline" : "My Pipeline"}
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                {isAdmin 
                  ? "Track all leads through the sales pipeline" 
                  : "Track your assigned leads through the sales pipeline"}
              </p>
            </div>
            <div className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
              <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium">Total Pipeline Value</p>
                <p className="text-lg md:text-xl font-bold text-foreground truncate">₹{totalPipelineValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
              data-testid="input-search-leads"
            />
          </div>
        </div>

        <div className="flex gap-0 overflow-x-auto pb-4">
          {stages.map((stage, index) => {
            const stageLeads = getLeadsByStage(stage);
            const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.highestOffer || 0), 0);
            const config = stageConfig[stage];
            const isLast = index === stages.length - 1;

            return (
              <div 
                key={stage} 
                className={`flex flex-col min-w-[250px] max-w-[280px] px-4 ${!isLast ? 'border-r-2 border-border' : ''}`}
              >
                <div className={`mb-3 p-3 rounded-lg ${config.gradient} border ${config.border} shadow-md`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-sm font-bold text-foreground truncate">{stage}</h3>
                    <Badge className={`${config.badge} text-xs font-bold px-2 py-0.5 shadow-sm flex-shrink-0`} data-testid={`text-stage-count-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                      {stageLeads.length}
                    </Badge>
                  </div>
                  {totalValue > 0 && (
                    <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-current/10">
                      <TrendingUp className="h-3 w-3 text-foreground/70 flex-shrink-0" />
                      <p className="text-xs font-bold text-foreground truncate" data-testid={`text-stage-value-${stage.toLowerCase().replace(/\s+/g, "-")}`}>
                        ₹{totalValue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 flex-1 min-h-[250px] bg-muted/10 rounded-lg p-3 border border-dashed border-border/50 overflow-y-auto max-h-[600px] custom-scrollbar">
                  {stageLeads.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-xs text-muted-foreground py-6">
                        <p className="font-medium">No leads</p>
                      </div>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <Card
                        key={lead._id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsViewDialogOpen(true);
                        }}
                        className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-2 bg-card/95 backdrop-blur-sm shadow-md hover:border-primary/50 group relative overflow-hidden"
                        data-testid={`card-lead-${lead._id}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <CardContent className="p-3.5 relative z-10">
                          <div className="space-y-2.5">
                            <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors" data-testid={`text-lead-name-${lead._id}`}>
                              {lead.name}
                            </h4>
                            
                            <p className="text-xs text-muted-foreground truncate font-medium">
                              {lead.phone}
                            </p>

                            <div className="flex items-center gap-1.5">
                              <Badge 
                                className={`text-xs px-2 py-0.5 font-bold shadow-md ${ratingColors[lead.rating]}`}
                                data-testid={`badge-rating-${lead._id}`}
                              >
                                {lead.rating}
                              </Badge>
                            </div>

                            {lead.highestOffer && lead.highestOffer > 0 && (
                              <div className="pt-2.5 mt-2.5 border-t border-border/60">
                                <div className="flex items-center justify-between bg-primary/5 dark:bg-primary/10 rounded-md px-2.5 py-1.5">
                                  <span className="text-xs text-muted-foreground font-semibold">Offer</span>
                                  <p className="text-xs font-bold text-primary truncate ml-2" data-testid={`text-offer-${lead._id}`}>
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

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
            <DialogDescription>View complete information about this lead</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <p className="text-foreground font-medium break-words">{selectedLead.name}</p>
                </div>
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <p className="text-foreground font-medium break-all">{selectedLead.phone}</p>
                </div>
              </div>
              <div className="min-w-0">
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="text-foreground font-medium break-all">{selectedLead.email || "N/A"}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Source</Label>
                  <p className="text-foreground font-medium truncate">{selectedLead.source}</p>
                </div>
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge className={`${stageConfig[selectedLead.status]?.badge || "bg-gray-500"} text-xs`}>
                    {selectedLead.status}
                  </Badge>
                </div>
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Rating</Label>
                  <Badge className={`${ratingColors[selectedLead.rating]} text-xs`}>
                    {selectedLead.rating}
                  </Badge>
                </div>
              </div>
              <div className="min-w-0">
                <Label className="text-muted-foreground text-xs">Follow-up Date</Label>
                <p className="text-foreground font-medium">
                  {selectedLead.followUpDate
                    ? format(new Date(selectedLead.followUpDate), "PPP")
                    : "Not scheduled"}
                </p>
              </div>
              <div className="min-w-0">
                <Label className="text-muted-foreground text-xs">Notes</Label>
                <p className="text-foreground font-medium break-words whitespace-pre-wrap">{selectedLead.notes || "No notes"}</p>
              </div>
              {selectedLead.highestOffer && selectedLead.highestOffer > 0 && (
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Highest Offer</Label>
                  <p className="text-foreground font-bold text-lg text-primary">
                    ₹{selectedLead.highestOffer.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Assigned To</Label>
                  <p className="text-foreground font-medium break-words">
                    {selectedLead.assignedTo 
                      ? (typeof selectedLead.assignedTo === 'object' && selectedLead.assignedTo?.name)
                        ? (selectedLead.assignedTo as PopulatedUser).name 
                        : 'Unassigned'
                      : "Unassigned"}
                  </p>
                </div>
                <div className="min-w-0">
                  <Label className="text-muted-foreground text-xs">Added By</Label>
                  <p className="text-foreground font-medium break-words">
                    {selectedLead.assignedBy && typeof selectedLead.assignedBy === 'object' && (selectedLead.assignedBy as PopulatedUser)?.name
                      ? (selectedLead.assignedBy as PopulatedUser).name
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
