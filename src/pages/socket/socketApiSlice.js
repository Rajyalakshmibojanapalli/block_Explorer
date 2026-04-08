// src/services/websocket.js

class WebSocketService {
  constructor() {
    this.ws = null;
    this.url = "wss://jaimax-explorer-backend-gin-production.up.railway.app/api/v1/ws";
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectInterval = 3000;
    this.reconnectTimeout = null;
    this.isIntentionalClose = false;
    this.heartbeatInterval = null;
    this.connectionStatus = "disconnected";
  }

  // Connect to WebSocket
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.isIntentionalClose = false;
    this.connectionStatus = "connecting";
    this._notify("status", "connecting");

    try {
      // console.log("🔌 Connecting to:", this.url);
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this._onOpen.bind(this);
      this.ws.onmessage = this._onMessage.bind(this);
      this.ws.onerror = this._onError.bind(this);
      this.ws.onclose = this._onClose.bind(this);
    } catch (error) {
      console.error("❌ Connection failed:", error);
      this._reconnect();
    }
  }

  // Handle connection open
  _onOpen() {
    // console.log("✅ WebSocket Connected");
    this.connectionStatus = "connected";
    this.reconnectAttempts = 0;
    this._notify("status", "connected");
    this._startHeartbeat();
  }

  // Handle incoming messages
  _onMessage(event) {
    try {
      let data;

      if (typeof event.data === "string") {
        try {
          data = JSON.parse(event.data);
        } catch {
          data = { type: "raw", payload: event.data };
        }
      } else if (event.data instanceof ArrayBuffer) {
        const text = new TextDecoder().decode(event.data);
        data = JSON.parse(text);
      } else {
        data = { type: "unknown", payload: event.data };
      }



      // Get message type
      const type = data.type || data.event || data.channel || "message";
      const payload = data.payload || data.data || data;

      // Notify type-specific listeners
      this._notify(type, payload);

      // Notify global listeners
      this._notify("*", data);
    } catch (error) {
      console.error("❌ Message parse error:", error);
    }
  }

  // Handle errors
  _onError(error) {
    console.error("❌ WebSocket Error:", error);
    this.connectionStatus = "error";
    this._notify("status", "error");
  }

  // Handle connection close
  _onClose(event) {
    console.log(`🔌 Closed (Code: ${event.code}, Clean: ${event.wasClean})`);
    this.connectionStatus = "disconnected";
    this._notify("status", "disconnected");
    this._stopHeartbeat();

    if (!this.isIntentionalClose) {
      this._reconnect();
    }
  }

  // Reconnect logic
  _reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("❌ Max reconnect attempts reached");
      this._notify("status", "failed");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * this.reconnectAttempts;

    console.log(
      `🔄 Reconnecting in ${delay}ms (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Heartbeat to keep connection alive
  _startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        this.send({ type: "ping" });
      }
    }, 30000);
  }

  _stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Notify listeners
  _notify(type, data) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach((cb) => {
        try {
          cb(data);
        } catch (error) {
          console.error(`Listener error [${type}]:`, error);
        }
      });
    }
  }

  // Send message
  send(data) {
    if (this.isConnected()) {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    }
    console.warn("⚠️ Cannot send - not connected");
    return false;
  }

  // Subscribe to events
  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);

    // Return unsubscribe function
    return () => this.off(type, callback);
  }

  // Unsubscribe from events
  off(type, callback) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).delete(callback);
      if (this.listeners.get(type).size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  // Disconnect
  disconnect() {
    this.isIntentionalClose = true;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this._stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.listeners.clear();
    this.connectionStatus = "disconnected";
    console.log("👋 Disconnected");
  }

  // Check connection
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  // Get current status
  getStatus() {
    return this.connectionStatus;
  }
}

// Singleton instance
const websocketService = new WebSocketService();
export default websocketService;