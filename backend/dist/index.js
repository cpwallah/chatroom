"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let usercount = 0;
let allSocket = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedmessage = JSON.parse(message.toString());
        if (parsedmessage.type == "join") {
            allSocket.push({
                socket,
                room: parsedmessage.payload.roomId,
            });
        }
        if (parsedmessage.type == "chat") {
            let currentUserroom = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket == socket) {
                    currentUserroom = allSocket[i].room;
                }
            }
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room == currentUserroom) {
                    allSocket[i].socket.send(parsedmessage.payload.message);
                }
            }
        }
    });
    // allSocket.push(socket);
    // usercount += 1;
    // console.log("User counted: " + usercount);
    // socket.on("message", (e) => {
    //    allSocket.forEach(s=>{
    //     s.send(e.toString()+"sent from server");
    //    })
    // });
    socket.on("close", () => {
        allSocket = allSocket.filter((x) => x.socket !== socket);
        usercount -= 1;
        console.log("User disconnected. Remaining users: " + usercount);
    });
});
