const https = require('https');
const http = require('http');
const express = require('express');
const fs = require('fs');
const utils = require('./src/utils/utils')

const httpPort = process.env.PORT || 4201;

// const httpsOptions = {
//     cert: fs.readFileSync('./ssl/yourCertHereForSSL_com.crt'), 
//     ca: fs.readFileSync('./ssl/yourCertHereForSSL_ca.crt'), 
//     key: fs.readFileSync('./ssl/yourCertHereForSSL.key')
// };

const app = express();
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(httpsOptions, app);

app.use(express.static('./www'));
app.use(express.static('./public'));
app.enable('trust proxy')

// app.use(function(request, response, next) {

//     if (process.env.NODE_ENV != 'development' && !request.secure) {
//        return response.redirect(301,"https://" + request.headers.host + request.url);
//     }

//     next();
// })

// app.all('*/*', function(req, res) {
//     res.redirect("/");
// });

app.get('/', function(req, res) {
    res.send("Operational.");
});


app.get('/processCSV', async function(req, res) {
    try{
        utils.processCSV();
        res.send("Now processing sourceIDs.csv. This will take a long time, but you do not need to stay on this page.");
    }
    catch(e){
        res.send(e);
    }
});


app.get('/', function(req, res) {
    res.send("Running.");
});


httpServer.listen(httpPort);
// httpsServer.listen(httpsPort);

// console.log(`HTTPS Server running on PORT ${httpsPort}`)
console.log(`HTTP Server running on PORT ${httpPort}`)