let socket;

export function connect(onMessage){
    socket = new WebSocket("ws://localhost:3000/ws");

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