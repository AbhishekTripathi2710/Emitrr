let socket;

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

export function connect(onMessage){
    const wsUrl = getWebSocketUrl();
    console.log("Connecting to WebSocket:", wsUrl);
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WS connected");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    socket.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
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
    }
}