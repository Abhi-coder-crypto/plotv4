import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { log } from "./vite";

let wss: WebSocketServer | null = null;

export function setupWebSocket(server: Server) {
  wss = new WebSocketServer({ server, path: "/ws" });

  wss.on("connection", (ws: WebSocket) => {
    log("WebSocket client connected");

    ws.on("close", () => {
      log("WebSocket client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.send(JSON.stringify({ type: "connected", message: "Connected to real-time updates" }));
  });

  return wss;
}

export function broadcastUpdate(event: string, data: any) {
  if (!wss) {
    return;
  }

  const message = JSON.stringify({
    type: event,
    data,
    timestamp: new Date().toISOString(),
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export const wsEvents = {
  LEAD_CREATED: "lead:created",
  LEAD_UPDATED: "lead:updated",
  LEAD_DELETED: "lead:deleted",
  LEAD_ASSIGNED: "lead:assigned",
  
  CALL_LOG_CREATED: "callLog:created",
  
  PLOT_CREATED: "plot:created",
  PLOT_UPDATED: "plot:updated",
  PLOT_DELETED: "plot:deleted",
  
  PAYMENT_CREATED: "payment:created",
  
  BUYER_INTEREST_CREATED: "buyerInterest:created",
  BUYER_INTEREST_UPDATED: "buyerInterest:updated",
  
  LEAD_INTEREST_CREATED: "leadInterest:created",
  
  ACTIVITY_LOGGED: "activity:logged",
  
  METRICS_UPDATED: "metrics:updated",
};
