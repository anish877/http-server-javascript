const net = require("net");

const server = net.createServer((socket) => {
    socket.on('data',(data)=>{
        const subData = data.toString().split(' ')
        if(subData[1]==='/'){
            const text = subData[1].split('/')
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${text[1].length}\r\n\r\ `+text[1])
        }
        else{
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
        }
    })
    socket.on("close", () => {
    socket.end();
    });
});

server.listen(4221, "localhost");
