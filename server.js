require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let clients = new Set();

// Handle new connections
wss.on("connection", (ws) => {
    console.log("🔗 New client connected");
    clients.add(ws);

    ws.on("message", (message) => {
        console.log(`📩 Received: ${message}`);
        
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                console.log(`📤 Sending: ${message}`);
                client.send(message);
            }
        });
    });
    

    ws.on("close", () => {
        console.log("❌ Client disconnected");
        clients.delete(ws);
    });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 WebSocket Server running on port ${PORT}`));
