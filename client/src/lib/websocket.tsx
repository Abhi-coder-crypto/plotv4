import { createContext, useContext, useEffect, useRef, useState } from "react";
import { queryClient } from "./queryClient";

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export function useWebSocket() {
  return useContext(WebSocketContext);
}

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No authentication token found, skipping WebSocket connection");
      return;
    }

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${encodeURIComponent(token)}`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        wsRef.current = null;

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connect();
        }, 3000);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

function handleWebSocketMessage(message: any) {
  if (!message.type) return;

  console.log("WebSocket message received:", message.type, message.data);

  switch (message.type) {
    case "lead:created":
    case "lead:updated":
    case "lead:deleted":
    case "lead:assigned":
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson/detailed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads/today-followups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/missed-followups"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads/contacted"] });
      break;

    case "callLog:created":
      if (message.data?.leadId) {
        queryClient.invalidateQueries({ queryKey: ["/api/call-logs/lead", message.data.leadId] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson/detailed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads/contacted"] });
      break;

    case "plot:created":
    case "plot:updated":
    case "plot:deleted":
      queryClient.invalidateQueries({ queryKey: ["/api/plots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      break;

    case "payment:created":
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/plots"] });
      break;

    case "buyerInterest:created":
    case "buyerInterest:updated":
      if (message.data?.plotId) {
        queryClient.invalidateQueries({ queryKey: ["/api/buyer-interests/plot", message.data.plotId] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/plots"] });
      break;

    case "leadInterest:created":
      if (message.data?.leadId) {
        queryClient.invalidateQueries({ queryKey: ["/api/lead-interests/lead", message.data.leadId] });
      }
      if (message.data?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["/api/lead-interests/project", message.data.projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/plots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      break;

    case "activity:logged":
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      break;

    case "metrics:updated":
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/salesperson/detailed"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      break;

    default:
      break;
  }
}
