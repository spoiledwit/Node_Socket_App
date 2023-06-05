const net = require('net');

const PORT = 4020;
const HOST = "127.0.0.1";

const server = net.createServer();

let clients = [];

server.on("connection", (socket) => {
    console.log("Client connected!");
    const clientId = clients.length + 1;

    clients.push({
        id: clientId,
        socket: socket
    });

    socket.write(`Welcome to the network! Your Id is ${clientId}!`);
    clients.map((client) => {
        if (client.id !== clientId) {
            client.socket.write(`---> User ${clientId} has joined <---`);
        }
    });

    socket.on("end", () => {
        clients = clients.filter((client) => {
            return client.id !== clientId;
        });

        clients.map((client) => {
            if (client.id !== clientId) {
                client.socket.write(`---> User ${clientId} has left the network! <---`);
            }
        });
    });

    socket.on("data", (data) => {
        clients.map((client) => {
            if (client.id !== clientId) {
                client.socket.write(`User ${clientId}: ${data.toString('utf-8')}`);
            }
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Opened server on ${server.address().address}:${server.address().port}`)
});