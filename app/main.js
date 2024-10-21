const net = require("net");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on('data',()=>{
        socket.write('HTTP/1.1 200 OK\r\n\r\n')
    })
    socket.on("close", () => {
    socket.end();
    });
});

server.listen(4221, "localhost");
