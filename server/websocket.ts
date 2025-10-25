import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { log } from "./vite";
import type { IncomingMessage } from "http";
import jwt from "jsonwebtoken";

let wss: WebSocketServer | null = null;

const JWT_SECRET = process.env.SESSION_SECRET;

if (!JWT_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required");
}

export function setupWebSocket(server: Server) {
  wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (request: IncomingMessage, socket, head) => {
    const { pathname, searchParams } = new URL(request.url!, `http://${request.headers.host}`);
    
    if (pathname === "/ws") {
      const token = searchParams.get("token") || 
                     request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
      }

      try {
        jwt.verify(token, JWT_SECRET!);
        
        wss!.handleUpgrade(request, socket, head, (ws) => {
          wss!.emit("connection", ws, request);
        });
      } catch (error) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
      }
    }
  });

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

  log("WebSocket server initialized on path /ws");
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
