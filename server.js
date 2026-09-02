const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

http.createServer((request, response) => {
  const requestPath = request.url.split('?')[0] === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.resolve(root, `.${decodeURIComponent(requestPath)}`);
  if (!filePath.startsWith(root)) { response.writeHead(403); response.end('Forbidden'); return; }
  fs.readFile(filePath, (error, data) => {
    if (error) { response.writeHead(error.code === 'ENOENT' ? 404 : 500); response.end(error.code === 'ENOENT' ? 'Not found' : 'Server error'); return; }
    response.writeHead(200, {
      'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    response.end(data);
  });
}).listen(process.env.PORT || 5173, () => console.log(`NovaTop is running at http://localhost:${process.env.PORT || 5173}`));


