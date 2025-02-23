const net = require("net");
const fs = require('fs');
const path = require("path");
const zlib = require('zlib')

const command = process.argv[2]
const option = process.argv[3]
let filePath
let contentEncoding = ''

switch (command) {
    case '--directory':
        if(option){
            filePath = option
        }
        break;
    default:
        break;
}

const server = net.createServer((socket) => {
    socket.on('data',(data)=>{

        const subData = data.toString().split(' ')
        const acceptEncoding = data.toString().split('\r\n')[2].split(": ")
        if(acceptEncoding[0]==='Accept-Encoding')
        {
            const encodingSchemes = acceptEncoding[1].split(", ")
            for (let scheme in encodingSchemes){
                console.log(encodingSchemes[scheme])
                if(encodingSchemes[scheme]==="gzip"){
                    contentEncoding = 'Content-Encoding: gzip\r\n'
                    break;
                }
                else{
                    contentEncoding = ''
                }
            }
        }
        else{
            contentEncoding = ''
        }
        if(subData[0]==='GET'){
            if(subData[1]==='/'){
                socket.write(`HTTP/1.1 200 OK\r\n\r\n`)
            }
            else if(subData[1]==='/user-agent'){
                const userAgentLine = data.toString().split('\r\n')[2]
                const userAgent = userAgentLine.slice(userAgentLine.indexOf(" ")+1)
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`)
            }
            else if(subData[1].split('/')[1]==="files"){
                const fileName = subData[1].split('/')[2]
                const fullPath = path.resolve(filePath,fileName)
                if(fs.existsSync(fullPath)){
                    const content = fs.readFileSync(fullPath)
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}`)
                }
                else{
                    socket.write(`HTTP/1.1 404 Not Found\r\n\r\n`)
                }
            }
            else if(subData[1].split('/').length==3){
                const text = subData[1].split('/')
                let compressed
                if(contentEncoding==''){
                    compressed = text[text.length-1]
                }
                else{
                    compressed = zlib.gzipSync(text[text.length-1])
                }
                socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n${contentEncoding}Content-Length: ${compressed.toString().length}\r\n\r\n`)
                socket.write(compressed)
            }
            else{
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
            }
        }
        else if(subData[0]==='POST'){
            if(subData[1].split('/')[1]==="files"){
                const fileName = subData[1].split('/')[2]
                const fullPath = path.resolve(filePath,fileName)
                const contentToWrite = data.toString().split('\r\n')[5]
                console.log(contentToWrite,fileName,fullPath)
                fs.writeFileSync(fullPath,contentToWrite)
                socket.write(`HTTP/1.1 201 Created\r\n\r\n`)
            }
        }
    })
    socket.on("close", () => {
    socket.end();
    });
});

server.listen(4221, "localhost");
