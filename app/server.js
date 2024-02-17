const https = require('https');
const fs = require('fs');
const path = require('path');
const next = require('next');
const express = require('express');
const env = require('process')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const sslServer = https.createServer(
    {
        key: fs.readFileSync((process.env.KEY_PATH)),
        cert: fs.readFileSync((process.env.CERT_PATH))
    }, server) // pass the Express server as the request listener

  sslServer.listen(4000, (err) => {
    if (err) throw err;
    console.log('🚀 Ready on https://localhost:4000');
  });
});