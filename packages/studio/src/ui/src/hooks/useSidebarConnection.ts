import { useCallback, useEffect, useRef } from "react";
import { useStudioStore } from "../store/useStudioStore";
import { getWebSocketUrl } from "../utils/url";

const RECONNECT_INTERVAL = 3000; // 3 seconds

export function useSidebarConnection() {
  const { setIsConnected } = useStudioStore();
  const WS_URL = getWebSocketUrl("/ws/status");

  // Ref to hold the WebSocket instance outside of the effect scope
  const wsRef = useRef<WebSocket | null>(null);

  // Ref to hold the timeout ID for reconnection attempts
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    // Clear any pending reconnection timeout before attempting a new connection
    if (reconnectTimeoutRef.current !== null) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws; // Store the new instance

    // Handler for successful connection
    ws.onopen = () => {
      console.log(`[WS] Connection established.`);
      // We still wait for the STATUS message from the backend to set isConnected=true

      // Enable sending messages
      useStudioStore.setState({
        sendWebSocketMessage: (msg: any) => {
          console.log(ws);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
          } else {
            console.warn("[WS] Cannot send message, socket not open");
          }
        },
      });
    };

    // Handler for incoming messages
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "STATUS") {
          if (data.message === "backend_online") {
            // Backend is confirmed online, update state
            console.log("[WS] Status: Backend reported online.");

            const wasExpired = useStudioStore.getState().isSessionExpired;
            setIsConnected(true);
            useStudioStore.getState().setIsSessionExpired(false);

            if (wasExpired) {
              console.log(
                "[WS] Session reloaded, reconnecting for fresh context..."
              );
              ws.close();
            }
          } else if (data.message === "session_expired") {
            console.warn("[WS] Session expired.");
            setIsConnected(false);
            useStudioStore.getState().setIsSessionExpired(true);
            // Keep socket open to allow sending RELOAD_SESSION
          }
        }
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    // Handler for connection close (CRITICAL: Implements reconnection)
    ws.onclose = () => {
      console.warn(
        `[WS] Connection closed. Attempting reconnect in ${
          RECONNECT_INTERVAL / 1000
        }s...`
      );
      setIsConnected(false); // Immediately set to disconnected

      // Only reconnect if the component is still mounted and session is NOT expired
      // We use setTimeout to create a new connection attempt
      if (!useStudioStore.getState().isSessionExpired) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect(); // Call the connect function again
        }, RECONNECT_INTERVAL);
      }
    };

    // Handler for connection error
    ws.onerror = (error) => {
      // Errors often lead directly to 'onclose', but we log it here
      console.error("[WS] Connection Error detected:", error);
      // The 'onclose' handler will manage the state and reconnection
    };

    // Cleanup old listener references if necessary
    return ws;
  }, [setIsConnected]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);
}
