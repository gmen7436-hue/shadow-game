const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');
const PORT = 3000;
let gameState = {
  phase: 'waiting',
  players: {},
  round: 0,
  roundCards: {},
  log: [],
  winner: null
};
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
const server = http.createServer((req,res) => {
  fs.readFile(path.join(__dirname,'client.html'),(err,data) => {
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
    res.end(data);
  });
});
const wss = new WebSocketServer({server});
wss.on('connection',(ws) => {
  ws.on('message',(raw) => {
    try {
      const msg = JSON.parse(raw);
      if(msg.type==='ping') ws.send(JSON.stringify({type:'pong'}));
    } catch(e) {}
  });
});
server.listen(process.env.PORT||PORT,'0.0.0.0',() => {
  console.log('Server running');
});
