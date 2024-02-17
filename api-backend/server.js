require('dotenv').config();
const app = require('./app');
const https = require('https');
var fs = require('fs');
const path = require('path');

const sslServer = https.createServer(
    {
        key: fs.readFileSync(path.join(__dirname, '../cert', 'key.pem')),
        cert: fs.readFileSync(path.join(__dirname, '../cert', 'cert.pem'))
    }, app)

const PORT = process.env.PORT || 9876;

// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));


sslServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));

