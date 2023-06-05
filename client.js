const net = require('net');
const readline = require('readline/promises');

const PORT = 4020;
const HOST = "127.0.0.1";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let id;

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    });
};

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        });
    });
};

const client = net.createConnection({ port: PORT, host: HOST }, async () => {
    console.log("Connected to  network!");

    const ask = async () => {
        let data = await rl.question("Message: ");
        await moveCursor(0, -1);
        await clearLine(0);
        console.log(`User ${1}: '${data}'`);
        client.write(data);
        ask();
      };
      
    ask();

    client.on("data", async (data) => {
        if (data.toString('utf-8').includes("Welcome to the network!")) {
            id = data.toString('utf-8').split(" ")[6].split("!")[0];
            console.log();
            await moveCursor(0, -1);
            await clearLine(0);
            console.log(data.toString('utf-8'));
            ask();
            return;
        } 
        console.log();
        await moveCursor(0, -1);
        await clearLine(0);
        console.log(data.toString('utf-8'));
        ask();
    });

});

client.on("end", () => {
    console.log("Disconnected from server!");
});