

function clientConnectToServer(username,guest) {
    console.log(username);
    console.log('Connecting to: ' + url);
    websocket = new window.WebSocket(url, 'broadcast-protocol');

    websocket.onopen = function() {
        message = {
            user:username,
            guest: guest,
        }
        websocket.send(JSON.stringify(message));

    };

    websocket.onmessage = function(event) {
        incMessage = JSON.parse(event.data);

        if ('connectedToServer' in incMessage) {
            if (incMessage.connectedToServer === true) {
                if(incMessage.guest){
                    input_username = incMessage.username;
                }
                loginRemove();
                setupInit(guest);
            }
        }

        if ('connected' in incMessage) {
            partnerId = incMessage.partnerId;
            partnerUsername = incMessage.partnerUsername;
            console.log('GAMEMODE');
            chatInitMatch();
            gameInit(incMessage.starting);
        }

        if ('coordinates' in incMessage) {
            console.log(incMessage.coordinates + ' CORDS');
            gameCheckHitOrMiss(incMessage.coordinates);
        }
        if ('hitOrMiss' in incMessage) {
            console.log('CHECKING turn after click');
            gameCheckTurn(incMessage.hitOrMiss);
        }

        if('yourTurn' in incMessage){
            console.log('CHECKING its my turn');
            gameClickHandler(incMessage.yourTurn);
        }

        if('gameOver' in incMessage){
            console.log('Its game over');
            gameEndScreen(incMessage.winner);
        }

        if('message' in incMessage){
            console.log('Got a message from chat');
            chatAddMessage(incMessage.message,'enemy');
        }

        if('disconnected' in incMessage){
            console.log(incMessage.disconnected);
            if(incMessage.disconnected === partnerUsername){
                gameEndScreen(input_username,true);
            }
        }
    };

    websocket.onclose = function() {
        console.log('The websocket is now closed.');
    };
}

function clientFindGamePartner() {
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
        console.log("LOOKING FOR PARTER " + input_username);

        websocket.send(JSON.stringify({lfp: input_username}));
    }
}

function clientSendCoordinates(coordinates) {
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
        console.log("SENDING clicked coordinates to enemy");
        message = {
            playing: true,
            coordinates: coordinates,
            partnerId: partnerId,
        };
        websocket.send(JSON.stringify(message));
    }
}

function clientSendTurn(hitOrMiss){
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
        console.log("SENDING to the clicker if its a hit or miss");
        message = {
            hitOrMiss: hitOrMiss,
            partnerId: partnerId,
        };
        websocket.send(JSON.stringify(message));
    }
}

function clientSendGameOver(){
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
        message = {
            gameOver: true,
            partnerId: partnerId,
            winner: partnerUsername,
        };
        websocket.send(JSON.stringify(message));
    }
}


function clientSendMessage(input_message){
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
        message = {
            partnerId: partnerId,
            message: htmlEntities(input_message),
        };
        websocket.send(JSON.stringify(message));
    }
}
