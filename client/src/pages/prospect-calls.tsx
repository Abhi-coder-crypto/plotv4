import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Phone, Plus, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProspectCallSchema, prospectCallStatuses, plotCategories, type InsertProspectCall, type ProspectCall, type Project } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";

export default function ProspectCalls() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: prospectCalls, isLoading } = useQuery<ProspectCall[]>({
    queryKey: ["/api/prospect-calls/salesperson", user?._id],
    enabled: !!user?._id,
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const form = useForm<InsertProspectCall>({
    resolver: zodResolver(insertProspectCallSchema),
    defaultValues: {
      phoneNumber: "",
      contactName: "",
      callStatus: "Not Answered",
      notes: "",
    },
  });

  const createProspectCallMutation = useMutation({
    mutationFn: async (data: InsertProspectCall) => {
      const response = await fetch("/api/prospect-calls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create prospect call");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prospect-calls/salesperson"] });
      toast({
        title: "Prospect call logged",
        description: "The call has been recorded successfully.",
      });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log prospect call",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProspectCall) => {
    createProspectCallMutation.mutate(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Answered - Interested":
        return "bg-green-500 text-white";
      case "Answered - Not Interested":
        return "bg-red-500 text-white";
      case "Not Answered":
        return "bg-gray-500 text-white";
      case "Call Back Later":
        return "bg-yellow-500 text-foreground";
      case "Wrong Number":
        return "bg-orange-500 text-white";
      case "Already has Plot":
        return "bg-blue-500 text-white";
      default:
        return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Prospect Calls</h1>
          <p className="text-muted-foreground mt-1">Track calls to potential customers</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-log-prospect-call">
              <Plus className="h-4 w-4 mr-2" />
              Log Call
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Prospect Call</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter phone number"
                            data-testid="input-phone-number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter contact name (if known)"
                            data-testid="input-contact-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="callStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call Status *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-call-status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {prospectCallStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="callDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Call Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                            placeholder="Optional"
                            data-testid="input-call-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="interestedInProject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interested in Project</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-project">
                            <SelectValue placeholder="Select project (if mentioned)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projects?.map((project) => (
                            <SelectItem key={project._id} value={project._id}>
                              {project.name} - {project.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="interestedInCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interested in Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category (if mentioned)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {plotCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 50L - 1Cr"
                            data-testid="input-budget-range"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Add any additional notes about the call"
                          rows={3}
                          data-testid="textarea-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProspectCallMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createProspectCallMutation.isPending ? "Logging..." : "Log Call"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Total Calls</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{prospectCalls?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Interested</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {prospectCalls?.filter(call => call.callStatus === "Answered - Interested").length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-muted-foreground">Not Answered</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {prospectCalls?.filter(call => call.callStatus === "Not Answered").length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {prospectCalls && prospectCalls.length > 0 ? (
            <div className="space-y-3">
              {prospectCalls.map((call) => (
                <div
                  key={call._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  data-testid={`prospect-call-${call._id}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{call.phoneNumber}</p>
                      {call.contactName && (
                        <span className="text-sm text-muted-foreground">({call.contactName})</span>
                      )}
                      {call.convertedToLead && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          Converted to Lead
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span>{format(new Date(call.createdAt), "MMM dd, yyyy 'at' hh:mm a")}</span>
                      {call.callDuration && <span>{call.callDuration}s</span>}
                    </div>
                    {call.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{call.notes}</p>
                    )}
                    {call.budgetRange && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Budget: {call.budgetRange}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(call.callStatus)}>
                    {call.callStatus}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No prospect calls logged yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start logging your cold calls to track your outreach
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
