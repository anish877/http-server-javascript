const net = require("net");

const server = net.createServer((socket) => {
    socket.on('data',(data)=>{
        datas = data.split(" ")
        if(datas[1]==='/'){
            socket.write('HTTP/1.1 200 OK\r\n\r\n')
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
