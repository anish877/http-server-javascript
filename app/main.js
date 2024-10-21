const net = require("net");


const server = net.createServer((socket) => {
    socket.on('data',(data)=>{
        const subData = data.toString().split(' ')
        if(subData[1]==='/'){
            socket.write(`HTTP/1.1 200 OK\r\n\r\n`)
        }
        else if(subData[1]==='/user-agent'){
            const userAgentLine = data.toString().split('\r\n')[2]
            console.log(userAgentLine)
            const userAgent = userAgentLine.slice(userAgentLine.indexOf(" ")+1)
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
        }
        else if(subData[1].split('/').length==3){
            const text = subData[1].split('/')
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${text[text.length-1].length}\r\n\r\n${text[text.length-1]}`)
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
