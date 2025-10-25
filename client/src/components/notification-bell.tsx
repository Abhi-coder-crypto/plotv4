import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import type { Lead } from "@shared/schema";
import { Link } from "wouter";

export function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  
  const { data: missedFollowUps = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/missed-followups"],
    refetchInterval: 60000, // Refetch every minute
    enabled: isAuthenticated && !!user, // Only fetch when authenticated
  });

  const count = missedFollowUps.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              data-testid="badge-notification-count"
            >
              {count}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Missed Follow-ups</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading...
          </div>
        ) : count === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No missed follow-ups
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {missedFollowUps.map((lead) => (
              <DropdownMenuItem
                key={lead._id}
                asChild
                className="cursor-pointer"
                data-testid={`notification-lead-${lead._id}`}
              >
                <Link href="/leads" className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{lead.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {lead.rating}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {lead.phone}
                  </div>
                  <div className="text-xs text-destructive">
                    Follow-up: {lead.followUpDate ? format(new Date(lead.followUpDate), 'PP') : 'N/A'}
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
