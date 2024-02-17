require('dotenv').config();
const app = require('./app');
const https = require('https');
var fs = require('fs');
const path = require('path');
const env = require('process')

const sslServer = https.createServer(
    {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH)
    }, app)

const PORT = process.env.PORT || 9876;

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));


sslServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));

