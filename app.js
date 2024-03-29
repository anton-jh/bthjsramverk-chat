const express = require("express");
const morgan = require("morgan");
const db = require("./db");

const app = express();

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
}

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.origins([
    "https://jsramverk.evilbengt.me:443",
    "http://localhost:3000"
]);

io.on("connection", function (socket) {
    socket.on("messageFromClient", function (message) {
        console.log("messageFromClient:");
        console.log("> " + message);

        io.emit("messageFromServer", message);
    });

    socket.on("saveMessage", function (message) {
        console.log("saveMessage:");
        console.log("> " + message);

        db.saveMessage(message);
    });
    socket.on("getSavedMessages", async function () {
        console.log("getSavedMessages:");

        const messages = await db.getSavedMessages();

        console.log("> " + messages);

        io.emit("savedMessages", messages);
    });

    socket.on("clientConnected", function (message) {
        console.log("clientConnected:");
        console.log("> " + message);

        io.emit("newClient", message);
    });
});

server.listen(8300);
console.log("Listening on 8300");
