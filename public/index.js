const http = require('http');
const https = require('https');
const fs = require('fs');
// ############################################################
// Load Config.json - Environment Variables
const config = require('./../config.json');
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
        var html = fs.readFile(include/header.html) + `<main class="flex-shrink-0">
            <div class="container">
                <img href="https://cdn.hardlynerding.com/icons/games/Civ6.jpg">
                <h1 class="mt-5">Civ6PBC to Webhook</h1>
                <p class="lead">If you and your friends have a hard time keeping on top of your Civ 6 Play-by-Cloud turns, I created an API that relays your turns through a webhook to a chat client.</p>
                <p>Use <a href="/docs/5.3/examples/sticky-footer-navbar/">the sticky footer with a fixed navbar</a> if need be, too.</p>
            </div>
        </main>
        <footer class="footer mt-auto py-3 bg-light">
            <div class="container">
                <span class="text-muted">Created by <a href="https://github.com/evanlanester">Evan Lane</a>.</span>
            </div>
        </footer>` + fs.readFile(include/footer.html);
        response.writeHead(200, { 'Content-Type': 'text/html' })
        response.end(html)
    } else {
        response.writeHead(402, { 'Content-Type': 'text/html' })
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