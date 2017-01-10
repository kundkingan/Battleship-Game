

function clientConnectToServer(username,guest) {
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
            chatInitMatch();
            gameInit(incMessage.starting);
        }

        if ('coordinates' in incMessage) {
            gameCheckHitOrMiss(incMessage.coordinates);
        }
        if ('hitOrMiss' in incMessage) {
            gameCheckTurn(incMessage.hitOrMiss);
        }

        if('yourTurn' in incMessage){
            gameClickHandler(incMessage.yourTurn);
        }

        if('gameOver' in incMessage){
            gameEndScreen(incMessage.winner);
        }

        if('message' in incMessage){
            chatAddMessage(incMessage.message,'enemy');
        }

        if('disconnected' in incMessage){
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
        websocket.send(JSON.stringify({lfp: input_username}));
    }
}

function clientSendCoordinates(coordinates) {
    if (!websocket || websocket.readyState === 3) {
        console.log('The websocket is not connected to a server.');
    } else {
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
