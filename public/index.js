const http = require('http');
const https = require('https');
const fs = require('fs');
// ############################################################
// Load Config.json - Environment Variables
const config = require("./../config.json");
const port = config.port;
const host = config.host;

// ############################################################
// Map the Steam name to the discord Id to @mention the players
var playerMapping = config.playerMapping;

// #################################################################
// Map game name to webook IDs so you can have channels per game
var serverMapping = config.serverMapping;

// #################################################################
// Debug webhook if something goes wrong ( eg server or player is not found in arrays above )
var debugserver = '';

const server = http.createServer(function (req, response) {
    if (req.method == 'POST') {
        console.log('POST');
        var postData = '';
        req.on('data', function (data) {
            postData = JSON.parse(data);
            console.log('Post Data: ' + postData);
        });
        req.on('end', function () {
            if (typeof playerMapping[postData.value2] == 'undefined') {
                var playerId = postData.value2;
            } else {
                var playerId = playerMapping[postData.value2];
            }
            var server = serverMapping[postData.value1];
            var gamename = postData.value1;
            var turnNumber = postData.value3;

            if (playerId && server) {
                var body = "<@" + playerId + ">, it's time to take your turn #" + turnNumber + " in '" + gamename + "'!";
                sendMessage(server, body);
                console.log("Done triggering.");
            } else {
                var body = "Error in data, missing game or player?\n" + req.body;
                sendMessage(debugserver, body);
                console.log(body);
            }
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end('post received');
        });
    } else if (req.method == 'GET') {
        console.log('GET');
        fs.readFile('public/view/index.html','utf8', (err,data) => {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    } else {
        response.writeHead(402, { 'Content-Type': 'text/html' });
        response.end("Undefined request.");
    }
});

server.listen(port, host)
console.log(`Listening at http://${host}:${port}`)

function sendMessage(server, body) {
    var data = JSON.stringify({
        username: 'Civ VI: Play by Cloud',
        avatar_url: 'https://cdn.hardlynerding.com/games/Civ6.jpg',
        content: body
    });

    var options = {
        hostname: 'discord.com',
        port: 443,
        path: `/api/webhooks/${server}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    var req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', d => {
            process.stdout.write(d)
        });
    });

    req.on('error', error => {
        console.error(error)
    });

    req.write(data);
    req.end();
}