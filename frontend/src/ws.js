let socket;
let messageQueue = [];
let connectionState = "connecting";
let connectionCallbacks = [];

const getWebSocketUrl = () => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (wsUrl) {
        if (wsUrl.endsWith("/ws")) {
            return wsUrl;
        }
        return wsUrl.endsWith("/") ? `${wsUrl}ws` : `${wsUrl}/ws`;
    }
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const apiUrl = import.meta.env.VITE_API_URL;
    
    if (apiUrl) {
        return `${protocol}//${apiUrl}/ws`;
    }
    
    if (import.meta.env.DEV) {
        return "ws://localhost:3000/ws";
    }
    
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
};

function updateConnectionState(newState) {
    connectionState = newState;
    connectionCallbacks.forEach(cb => cb(newState));
}

function flushMessageQueue() {
    while (messageQueue.length > 0 && socket?.readyState === WebSocket.OPEN) {
        const message = messageQueue.shift();
        socket.send(JSON.stringify(message));
    }
}

export function connect(onMessage){
    const wsUrl = getWebSocketUrl();
    console.log("Connecting to WebSocket:", wsUrl);
    updateConnectionState("connecting");
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WS connected");
        updateConnectionState("connected");
        flushMessageQueue();
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateConnectionState("error");
    };

    socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        updateConnectionState("disconnected");
        
        if (event.code !== 1000) {
            setTimeout(() => {
                console.log("Attempting to reconnect...");
                connect(onMessage);
            }, 3000);
        }
    };

    socket.onmessage = (event) => {
        console.log("WS message:", event.data);
        try {
            const msg = JSON.parse(event.data);
            onMessage(msg);
        } catch (err) {
            console.error("Failed to parse WebSocket message:", err);
        }
    }
}

export function send(message){
    if(socket?.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(message));
    } else {
        messageQueue.push(message);
        console.log("WebSocket not ready, queuing message:", message);
    }
}

export function getConnectionState() {
    return connectionState;
}

export function onConnectionStateChange(callback) {
    connectionCallbacks.push(callback);
    return () => {
        connectionCallbacks = connectionCallbacks.filter(cb => cb !== callback);
    };
}

export function isConnected() {
    return socket?.readyState === WebSocket.OPEN;
}