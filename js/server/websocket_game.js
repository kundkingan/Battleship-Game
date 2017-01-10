var port = 8034,
http = require('http'),
// WebSocketServer = require('S:/Program(x86)/nodejs/node_modules/websocket').server,
// WebSocketServer = require('C:/xampp/htdocs/~daae15/dbwebb-kurser/javascript/node_modules/websocket').server,
WebSocketServer = require('/home/saxon/students/20152/daae15/node_modules/websocket').server,
broadcastTo = [],
connectedUsers = [],
lookingForPartner = [],
message;


// Create a http server with a callback handling all requests
var httpServer = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(200, {'Content-type': 'text/plain'});
    response.end('Hello world\n');
}).listen(port, function() {
    console.log((new Date()) + ' HTTP server is listening on port ' + port);
});


// Create an object for the websocket
// https://github.com/Worlize/WebSocket-Node/wiki/Documentation
wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false
});

// Always check and explicitly allow the origin
function originIsAllowed(origin) {
    if(origin === 'http://localhost:8080' || origin === 'http://www.student.bth.se') {
        return true;
    }
    return false;

}

function acceptConnectionAsBroadcast(request) {
    var connection = request.accept('broadcast-protocol', request.origin);
    connection.broadcastId = broadcastTo.push(connection) - 1;
    // console.log((new Date()) + ' Broadcast connection accepted from ' + request.origin + ' id = ' + connection.broadcastId)

    connection.on('message', function(message){
        var clients = 0,
        incomingObj = JSON.parse(message.utf8Data);

        if('user' in incomingObj){
            if(incomingObj.guest){
                incomingObj.user += '_' + connection.broadcastId;
            }

            var message = {
                connectedToServer: false,
                guest: incomingObj.guest,
                username: incomingObj.user,
            };

            if(connectedUsers.length < 1){
                connectedUsers.push({
                    username: incomingObj.user,
                    id: connection.broadcastId,
                });
                message.connectedToServer = true;
            }else{
                for (var i = 0; i < connectedUsers.length; i++) {
                    if(connectedUsers[i].username !== incomingObj.user){
                        connectedUsers.push({
                            username: incomingObj.user,
                            id: connection.broadcastId,
                        });
                        message.connectedToServer = true;
                    }
                }
            }
            broadcastTo[connection.broadcastId].send(JSON.stringify(message));
        }

        if('lfp' in incomingObj){
            console.log(incomingObj);
            lookingForPartner.push(incomingObj.lfp);
            var user1,user2;
            if(lookingForPartner.length === 2){
                for (var i = 0; i < connectedUsers.length; i++) {
                    if(connectedUsers[i].username === lookingForPartner[0]) user1 = connectedUsers[i];
                    if(connectedUsers[i].username === lookingForPartner[1]) user2 = connectedUsers[i];
                    if(user1 !== undefined && user2 !== undefined){
                        message = {
                            connected: true,
                            partnerId: user2.id,
                            partnerUsername: user2.username,
                            starting: true,
                        };
                        i = connectedUsers.length;
                        broadcastTo[user1.id].send(JSON.stringify(message));
                        message.starting = false;
                        message.partnerId = user1.id;
                        message.partnerUsername = user1.username;
                        broadcastTo[user2.id].send(JSON.stringify(message));

                        lookingForPartner = [];
                        console.log('Making ' + user1.username + ' && ' + user2.username + '    ---PARTNERS');
                        user1 = '';
                        user2 = '';
                    }
                }
            }
        }

        if('playing' in incomingObj){
            console.log('Playing obj');
            message = {
                coordinates: incomingObj.coordinates,
            };
            broadcastTo[incomingObj.partnerId].send(JSON.stringify(message));
        }

        if('hitOrMiss' in incomingObj){
            console.log('HitOrMiss obj');
            message = {
                hitOrMiss: incomingObj.hitOrMiss,
            };
            broadcastTo[incomingObj.partnerId].send(JSON.stringify(message));
        }

        if('gameOver' in incomingObj){
            console.log('gameOver obj');
            message = {
                gameOver: true,
                winner: incomingObj.winner,
            };
            broadcastTo[incomingObj.partnerId].send(JSON.stringify(message));
            broadcastTo[connection.broadcastId].send(JSON.stringify(message));
        }

        if('message' in incomingObj){
            console.log('message obj');
            if(incomingObj.partnerId !== undefined){
                message = {
                    message: incomingObj.message
                };
                broadcastTo[incomingObj.partnerId].send(JSON.stringify(message));
            }
        }
    });

    // Callback when client closes the connection
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected broadcastid = ' + connection.broadcastId + '.');
        var leaver;
        for (i = 0; i < connectedUsers.length; i++) {
            if(connectedUsers[i].id === connection.broadcastId){
                leaver = connectedUsers[i];
                connectedUsers.splice(i,1);
                if(leaver.username === lookingForPartner[0]){
                    lookingForPartner = [];
                }
                break;
            }
        }

        for (i = 0; i < broadcastTo.length; i++) {
            message = {
                disconnected: leaver.username,
            };
            if(broadcastTo[i]){
                broadcastTo[i].send(JSON.stringify(message));
            }
        }

        broadcastTo[connection.broadcastId] = null;

    });
    return true;
}

// Create a callback to handle each connection request
wsServer.on('request', function(request) {
    var status = null;

  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  acceptConnectionAsBroadcast(request);
  // Loop through protocols. Accept by highest order first.
  // for (var i=0; i < request.requestedProtocols.length; i++) {
  //   if(request.requestedProtocols[i] === 'broadcast-protocol') {
  //     status = acceptConnectionAsBroadcast(request);
  //   } else if(request.requestedProtocols[i] === 'echo-protocol') {
  //     status = acceptConnectionAsEcho(request);
  //   }
  // };

  // Unsupported protocol.
  if(!status) {
    // acceptConnectionAsEcho(request, null);
    //console.log('Subprotocol not supported');
    //request.reject(404, 'Subprotocol not supported');
  }

});





// function acceptConnectionAsEcho(request, subprotocol) {
//     if(subprotocol === undefined) {
//         subprotocol = 'echo-protocol';
//     }
//     var connection = request.accept(subprotocol, request.origin);
//     console.log((new Date()) + ' Echo connection accepted from ' + request.origin);
//
//     // Callback to handle each message from the client
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             console.log('Received Message: ' + message.utf8Data);
//             connection.sendUTF(message.utf8Data);
//         }
//         else if (message.type === 'binary') {
//             console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//             connection.sendBytes(message.binaryData);
//         }
//     });
//
//     // Callback when client closes the connection
//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });
//
//     return true;
// }
