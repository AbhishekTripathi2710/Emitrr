let socket;

const getWebSocketUrl = () => {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (wsUrl) return wsUrl;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = import.meta.env.VITE_API_URL || window.location.host;
    return `${protocol}//${host}/ws`;
};

export function connect(onMessage){
    socket = new WebSocket(getWebSocketUrl());

    socket.onopen = () => {
        console.log("WS connected");
    };

    socket.onmessage = (event) => {
        console.log("WS message:", event.data);
        const msg = JSON.parse(event.data);
        onMessage(msg);
    }
}

export function send(message){
    if(socket?.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(message));
    }
}