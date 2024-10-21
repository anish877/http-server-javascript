const net = require("net");


const server = net.createServer((socket) => {
    socket.on('data',(data)=>{
        const subData = data.toString().split(' ')
        if(subData[1]==='/'){
            socket.write(`HTTP/1.1 200 OK\r\n\r\n`)
        }
        else if(subData[1]==='/user-agent'){
            const indexOfLineStart = subData[1].indexOf('User-Agent:')+1
            const indexOfUserAgentStart = subData[1].indexOf(': ',indexOfLineStart)+1
            const indexOfUserAgentEnd = subData[1].indexOf('\r',indexOfUserAgentStart)
            const userAgent = subData[1].slice(indexOfUserAgentStart,indexOfUserAgentEnd)
            console.log(userAgent,indexOfLineStart,indexOfUserAgentEnd,indexOfUserAgentStart)
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
