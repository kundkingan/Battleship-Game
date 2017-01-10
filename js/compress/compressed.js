$(document).ready(function(){
var i = 0,
    k = 0,
    //LOGIN VARS
    login_username,
    login_password,
    input_name,
    input_username,
    input_password,
    password,
    guest = false,

    //SETUP VARS
    selectedPos,
    selectedDiv,
    boats = 20,
    gameField = [],
    fieldType,
    tableH = ['','A','B','C','E','F','G','H','I','J'],
    yourShipPos = [],
    takenPos = [],
    alreadyTaken = false,
    posOfShip,

    //GAMEPLAY VARS
    hitOrMiss = false,
    userShipLeft = 20,
    enemyShipLeft = 20,

    //CHAT VARS
    input_message,

    //USER PROFILE VARS
    user_hits = 0,
    user_miss = 0,
    user_win = false,


    //CLIENT-SERVER VARS
    partnerId,
    partnerUsername,
    message,

    //SERVER VARS
    // url = 'ws://127.0.0.1:8034',
    url = 'ws://nodejs1.student.bth.se:8034',
    websocket,
    incMessage;



function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


$(document).ready(function(){
    'use strict';
    loginStructure();
    loginGuest();
    // loginGetInputVals();
});


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
function userExists(data,type){

    if(data['success']){
        clientConnectToServer(data['user'],false);
    }else{
        if(type){
            if($('.login__buttom p').length === 0){
                $('.login__buttom').append('<p style=color:white;>Wrong username/password</p>');
            }
        }else{
            if($('.login__buttom p').length === 0){
                $('.login__buttom').append('<p style=color:white;>Username is taken</p>');
            }
        }
    }
}

function userSignIn(user,pass){
    $.ajax({
        type: 'post',
        url: 'ajax/db.php?action=signin',
        dataType: 'json',
        data: {
            username: user,
            password: pass,
        },
        success: function(data){
            userExists(data,true);
            console.log('Ajax request returned successfully');
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
        }
    });
}

function userSignUp(name,user,pass){
    $.ajax({
        type: 'post',
        url: 'ajax/db.php?action=signup',
        dataType: 'json',
        data: {
            name: name,
            username: user,
            password: pass,
        },
        success: function(data){
            userExists(data);
            console.log('Ajax request returned successfully');
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
        }
    });
}

function ajaxstatsProfileStats(){
    $.ajax({
        type: 'post',
        url: 'ajax/db.php?action=stats',
        dataType: 'json',
        data: {
            username: input_username,
        },
        success: function(data){
            userDisplayStats(data);
            console.log('Ajax request returned successfully');
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
        }
    });
}


function ajaxstatsProfileLeaderboard(){
    $.ajax({
        type: 'post',
        url: 'ajax/db.php?action=leaderboard',
        dataType: 'json',
        success: function(data){
            userDisplayLeaderboard(data);
            console.log('Ajax request returned successfully');
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
        }
    });
}

function ajaxstatsProfileUpdate(){
    $.ajax({
        type: 'post',
        url: 'ajax/db.php?action=updateStats',
        dataType: 'json',
        data: {
            username: input_username,
            win: user_win,
            hits: user_hits,
            miss: user_miss,
        },
        success: function(data){
            console.log('Ajax request returned successfully');
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log('Ajax request failed: ' + textStatus + ', ' + errorThrown);
        }
    });
}
function loginRemove(){
    $('.login').remove();
}

function loginEmptyForm(){
    $('.login__form').empty();
}

function loginStructure(){
    $('.container').append(''+
    '<div class="login">' +
        '<div class="login__box">' +
            '<div class="login__form">' +
                '<button type="button" class="login__submit play">Play</button>' +
                '<p class="login__bottom"></p>' +
            '</div>' +
        '</div>' +
    '</div>');
}

function loginGetInputVals(){
    input_username = $('.login__input.username').val(),
    input_password = $('.login__input.password').val();
    input_name = $('.login__input.name').val();
}

function loginAddInputs(name){
    if(name){
        $('.login__form').append('' +
       '<div class="login__row">' +
           '<i class="fa fa-user" aria-hidden="true"></i>' +
           '<input class="login__input name" name="name" type="text" placeholder="name" required="required" minlength=1 maxlength=15>' +
       '</div>');
    }
    $('.login__form').append('' +
   '<div class="login__row">' +
       '<i class="fa fa-user" aria-hidden="true"></i>' +
       '<input class="login__input username" name="username" type="text" placeholder="Username" required="required" maxlength=15>' +
   '</div>'+
    '<div class="login__row">' +
        '<i class="fa fa-user" aria-hidden="true"></i>' +
        '<input class="login__input password" name="password" type="password" placeholder="Password" required="required" maxlength=15>' +
    '</div>');
}

function loginGuest(){
    $('.login__form').prepend('' +
    '<div class="login__row">' +
       '<i class="fa fa-user" aria-hidden="true"></i>' +
       '<input class="login__input username" name="username" type="text" placeholder="Username" required="required"  maxlength=15>' +
    '</div>');

    $('.login__bottom').append('' +
        '<button type="button" class="login__submit signin">Sign in</button>' +
        '<button type="button" class="login__submit signup">Sign up</button>'
    );

    $('.login__submit.play').click(function(){
        if($('.login__input.username').val() !== ""){
            input_username = $('.login__input.username').val();
            guest = true;
            clientConnectToServer(input_username,guest);
        }
    });

    $('.login__submit.signin').click(function(){
        loginEmptyForm();
        loginSignIn();
    });

    $('.login__submit.signup').click(function(){
        loginEmptyForm();
        loginSignUp();
    });
}

function loginSignIn(){
    loginAddInputs();
    $('.login__form').append('<p class="login__bottom"></p>');
    $('.login__bottom').append('<button type="button" class="login__submit signin">Sign in</button>');
    $('.login__bottom').append('<button type="button" class="login__submit back">Back</button>');

    $('.login__submit.signin').click(function(){
        loginGetInputVals();
        if(input_username !== "" && input_password !== ""){
            userSignIn(input_username,input_password);
        }
    });

    $('.login__submit.back').click(function(){
        loginEmptyForm();
        loginStructure();
        loginGuest();
    });

}

function loginSignUp(){
    loginAddInputs(true);
    $('.login__form').append('<p class="login__bottom"></p>');
    $('.login__bottom').append('<button type="button" class="login__submit signup">Sign Up</button>');
    $('.login__bottom').append('<button type="button" class="login__submit back">Back</button>');

    $('.login__submit.signup').click(function(){
        loginGetInputVals();
        if(input_name !== "" && input_username !== "" && input_password !== ""){
            userSignUp(input_name,input_username,input_password);
        }
    });

    $('.login__submit.back').click(function(){
        loginEmptyForm();
        loginStructure();
        loginGuest();
    });
}



function setupFieldStructure(className){
    $('.game__area').append('' +
    '<div class="game__' + className + '">' +
        '<div class="game__' + className + '__username"></div>' +
        '<div class="game__board ' + className + '">' +
            '<div class="game__placeholder">' +
                '<div class="game__' + className + '__field"></div>' +
            '</div>' +
        '</div>' +
    '</div>');
}

function setupFieldGame(className){
    fieldType = '.game__' + className + '__field';
    for (i = 0; i < tableH.length; i++) {
        $(fieldType).append('<div class="game__row"></tr>');
        if(i !== 0){
            $(fieldType + ' .game__row').eq(i).append('<div class="game__cell nr">'+ i +'</div>');
        }
        for (k = 0; k < tableH.length; k++) {

            if(i === 0) $(fieldType + ' .game__row').first().append('<div class="game__header">' + tableH[k] + '</div>');

            if(k !== 0 && i !== 0){
                if(className !== 'enemy'){
                    gameField.push(i + tableH[k]);
                }
                $(fieldType + ' .game__row').eq(i).append('<div class="game__cell ' + className + ' ' + i + tableH[k]+ '"><div class="content__boat empty"></div></div>');

            }
        }
    }
}

function setupRemoveSpinner(){
    $('.spinner').remove();
}

function setupAddSpinner(){
    $('.game__enemy__field').append(
    '<div class="spinner"> ' +
        '<div class="rect1"></div>' +
        '<div class="rect2"></div>' +
        '<div class="rect3"></div>' +
        '<div class="rect4"></div>' +
        '<div class="rect5"></div>' +
    '</div>' +
    '<div class="spinner text"><p>Finding partner</p></div>');
}


function setupMiddle(){
    $('' +
        '<div class="game__middlebox">' +
            '<div class="game__topbox">' +
                '<div class="game__scoreboard">' +
                    '<div class="left">' + userShipLeft + '</div>' +
                    '<div class="right">' + enemyShipLeft + '</div>' +
                '</div>' +
                '<div class="game__buttons">' +
                    '<button type="button" class="game__submit disconnect">Surrender</button>' +
                '</div>' +
            '</div>' +
            '<div class="game__chat">' +
                '<div class="game__messages">' +
                    '<ul></ul>' +
                '</div>' +
                '<div class="game__form">' +
                    '<div class="game__forminner">' +
                        '<input class="game__forminput" name="message" type="text"   placeholder="Send Message" required="required">' +
                        '<button class="game__submit send">+</button>' +
                    '</div>' +
                '<div>' +
            '</div>' +
        '</div>'
    ).insertAfter('.game__user');

    $('.game__submit.send').click(function(){
        input_message = $('.game__forminput').val();
        chatAddMessage(input_message,'user');
        clientSendMessage(input_message);
        $('.game__messages').stop().animate({
          scrollTop: $('.game__messages')[0].scrollHeight
        }, 0);
    });

    $(document).keypress(function(event){
        if(event.which == 13){
            if($('.game__forminput').val().length !== 0){
                input_message = $('.game__forminput').val();
                chatAddMessage(input_message,'user');
                clientSendMessage(input_message);
                $('.game__messages').stop().animate({
                  scrollTop: $('.game__messages')[0].scrollHeight
                }, 0);
            }
        }
    });

}

function setupFinishConfig() {
    $('.game__board').removeClass('config');
    $('.game__placeholder').removeClass('config');
    $('.game__user').removeClass('config');
    $('.game').removeClass('config');
    $('.game__boats').remove();
    $('.game__cell').unbind();
}

function setupInfoBox(){
    $('.game__board').addClass('config');
    $('.game__placeholder').addClass('config');
    $('.game__user').addClass('config');
    $('.game__board.user').append('' +
    '<div class="game__boats">' +
        '<div class="game__info">' +
            '<p class="game__text">Click on the game field to place your boats</p>' +
            '<p>You have: <p class="game__boatsleft">' +
                + boats   +
            ' </p>Boats left</p>' +
        '</div>' +
        '<div class="game__setupconnect">' +
            '<button type="button" class="game__submit play">Play</button>' +
        '</div>' +
    '</div>');

    $('.game__submit.play').click(function() {
        // if(boats === 0){
            setupFinishConfig();
            setupFieldStructure('enemy');
            setupAddSpinner();
            setupMiddle();
            clientFindGamePartner();
        // }else{
            // if($('.game__boats__output').length === 0){
            //     $('.game__boats').append('<p class="game__boats__output">You still have boats left</p>');
            // }
        // }
    });
}

function setupShips() {
    $('.game__cell').click(function() {
        selectedDiv = $(this);
        selectedPos = $(this).attr('class').split(' ').pop();

        if ($(selectedDiv).attr('class').split(' ').pop() !== 'taken') {
            if (boats > 0) {
                var index = gameField.indexOf(selectedPos);
                if (gameField.indexOf(selectedPos) !== -1) {
                    yourShipPos.push(gameField[index]);
                    $(this).addClass('taken');
                }
                boats--;
                $('.game__boatsleft').text(boats);
            }
        } else {
            if ($(this).attr('class').split(' ').pop() === 'taken') {
                $(this).removeClass('taken');
                posOfShip = yourShipPos.indexOf(selectedPos);
                yourShipPos.splice(posOfShip, 1);
                boats++;
                $('.game__boatsleft').text(boats);
            }
        }
    });
}

function setupStructure() {
    $('.container').prepend('' +
        '<div class="game config">' +
            '<div class="game__area">' +
            '</div>' +
        '</div>'
    );
}

function setupInit(guest){
    setupStructure();
    setupFieldStructure('user');
    setupFieldGame('user');
    setupInfoBox()
    setupShips();
    userSetupProfile(guest);
}

function gameEndScreen(winner,reason){

    $('.game__buttons').empty();
    $('.game__buttons').append('<button type="button" class="game__submit setup">To setup</button>');
    $('.game__cell.enemy').unbind();
    $('.game__user__field').css('opacity','0.5');
    $('.game__enemy__field').css('opacity','0.5');

    if(reason){
        chatAddMessageWinnerDc(winner);
    }else{
        chatAddMessageWinner(winner);
        if(winner === input_username){
            user_win = true;
        }
    }

    if(!guest){
        ajaxstatsProfileUpdate();
    }

    $('.game__submit.setup').click(function(){
        $('.container').empty();
        yourShipPos = [];
        takenPos = [];
        boats = 20;
        setupInit(guest);
        $(document).keypress(function(event){
            if(event.which == 13){
                event.preventDefault();
            }
        });
    });
}


function gameCheckTurn(hitOrMiss){
    if(hitOrMiss){
        $(selectedDiv).removeClass('taken').addClass('hit');
        $('.game__scoreboard .right').text(--enemyShipLeft);
        chatAddMessageHit(input_username);
        user_hits++;
    }else{
        $(selectedDiv).removeClass('taken').addClass('miss');
        chatAddMessageMiss(input_username);
        gameClickHandler(false);
        user_miss++;
    }
}

function gameCheckHitOrMiss(coordinates){

    hitOrMiss = false;
    i = yourShipPos.indexOf(coordinates);

    if(i !== -1){
        $('.game__cell.user.' + coordinates).removeClass('taken');
        $('.game__cell.user.' + coordinates).addClass('hit');
        $('.game__scoreboard .left').text(--userShipLeft);
        yourShipPos.splice(i,1);
        hitOrMiss = true;
        chatAddMessageHit(partnerUsername);
    }else{
        $('.game__cell.user.' + coordinates).addClass('miss');
        chatAddMessageMiss(partnerUsername);
        gameClickHandler(true);
    }

    clientSendTurn(hitOrMiss);

    if(yourShipPos.length === 0){
        clientSendGameOver();
    }
}

function gameClickEnemyShip(){
    $('.game__cell.enemy').click(function(){
        selectedDiv = $(this);
        selectedPos = $(this).attr('class').split(' ');

        for (i = 0; i < selectedPos.length; i++) {
            if(gameField.indexOf(selectedPos[i]) !== -1){
                selectedPos = selectedPos[i];
                break;
            }
        }

        if(takenPos.indexOf(selectedPos) !== -1){
            console.log('already taken');
        }else{
            takenPos.push(selectedPos);
            clientSendCoordinates(selectedPos);
        }
    });
}

function gameClickHandler(turn){
    if(turn){
        console.log('your turn');
        $('.game__enemy__field .game__row .game__cell.enemy').removeClass('disabled');
        gameClickEnemyShip();
    }else{
        console.log('enemy turn');
        $('.game__enemy__field .game__row .game__cell.enemy').addClass('disabled');
        $('.game__cell.enemy').unbind();
    }
}

function gameSetUsernames(){
    $('.game__user__username').css('padding-top','0');
    $('.game__enemy__username').css('padding-top','0');
    $('.game__user__username').append('<p>' + input_username + '</p>');
    $('.game__enemy__username').append('<p>' + partnerUsername + '</p>');

}

function gameInit(turn){
    setupRemoveSpinner();
    gameSetUsernames();
    setupFieldGame('enemy');
    gameClickHandler(turn);
    chatAddMessageStarting(turn);

    $('.game__submit.disconnect').click(function(){
        chatAddMessageSurrender(input_username);
        clientSendGameOver();
    });
}


function chatAddMessage(incMessage,className){
    incMessage = htmlEntities(incMessage);
    if(className === 'enemy'){
        $('.game__messages ul').append('' +
        '<li class="game__li' + className + '">' +
            '<div class="game__messagesmsg"><span>' + incMessage + '</span></div>' +
            '<div class="game__messagespic"><i class="fa fa-user-circle" aria-hidden="true"></i></div>' +
        '</li>');
    }else{
        $('.game__messages ul').append('' +
        '<li class="game__li' + className + '">' +
            '<div class="game__messagespic"><i class="fa fa-user-circle" aria-hidden="true"></i></div>' +
            '<div class="game__messagesmsg"><span>' + incMessage + '</span></div>' +
        '</li>');
    }
}

function chatScrollDown(){
    $('.game__messages').stop().animate({
      scrollTop: $('.game__messages')[0].scrollHeight
    }, 0);
}

function chatAddMessageMove(player,coordinates){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>' + input_username + 'clicked' + coordinates + '</span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageHit(output){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>' + output + ' hit a ship </span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageMiss(output){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>' + output + ' missed </span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageSurrender(output){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>' + output + ' conceded</span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageWinner(output){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>The Winner Is: ' + output + '!</span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageWinnerDc(output){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>Partner DC, You Win: ' + output + '!</span></div>' +
    '</li>');
    chatScrollDown();
}

function chatAddMessageStarting(turn){
    if(turn){
        $('.game__messages ul').append('' +
        '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>You Start!</span></div>' +
        '</li>');
    }else{
        $('.game__messages ul').append('' +
        '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>Enemy Start!</span></div>' +
        '</li>');
    }
    chatScrollDown();
}

function chatInitMatch(){
    $('.game__messages ul').append('' +
    '<li class="game__liadmin">' +
        '<div class="game__messagesmsg"><span>Starting Match: ' + input_username + ' vs ' + partnerUsername + '</span></div>' +
    '</li>');
    chatScrollDown();
}

function userSetupProfile(guest){

    $('.container').append('' +
        '<div class="user__box">' +
            '<div class="user__icon">' +
                '<i class="fa fa-user-circle-o fa-3x" aria-hidden="true"></i>' +
            '</div>' +
        '</div>' +
        '<div class="user__profile">' +
            '<div class="user__icon">' +
                '<i class="fa fa-user-circle-o fa-3x" aria-hidden="true"></i>' +
                '<p>' + input_username + '</p>' +
            '</div>' +
            '<div class="user__exit">' +
                '<i class="fa fa-times fa-2x" aria-hidden="true"></i>' +
            '</div>' +
            '<div class="user__navbar">' +
                '<ul>' +
                    '<li><a>Leaderboard</a></li>' +
                '</ul>' +
            '</div>' +

            '<div class="user__leaderboard">' +
                '<table>' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Name</th>' +
                            '<th>Wins</th>' +
                            '<th>W/R</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>'
    );

    if (!guest) {
        $('.user__navbar ul').addClass('full');
        $('.user__navbar ul').prepend('<li class="toggle"><a>Statistics</a></li>');
        $('<div class="user__stats toggle">' +
            '<div class="stats__top">' +
                '<p>Your Stats</p>' +
                '</div>' +
            '<div class="stats__bottom">' +
                '<ul></ul>' +
            '</div>' +
        '</div>').insertAfter('.user__navbar');


        ajaxstatsProfileStats();
        ajaxstatsProfileLeaderboard();

        $('.user__navbar ul li').click(function(){
            $('.user__navbar ul li').removeClass('toggle');
            $(this).addClass('toggle');
            if($(this).find('a').text() === 'Statistics'){
                $('.user__leaderboard').removeClass('toggle');
                $('.user__stats').addClass('toggle');
            }
            if($(this).find('a').text() === 'Leaderboard'){
                $('.user__stats').removeClass('toggle');
                $('.user__leaderboard').addClass('toggle');
            }
        });
    }else{
        ajaxstatsProfileLeaderboard();
        $('.user__navbar ul li').addClass('toggle');
        $('.user__leaderboard').addClass('toggle');
    }

    $('.user__icon').click(function(){
        $('.user__profile').addClass('toggle');
        $('.user__box').addClass('toggle');
    });

    $('.user__exit').click(function(){
        $('.user__profile').removeClass('toggle');
        $('.user__box').removeClass('toggle');
    });



}

function userDisplayStats(data){
    $('.stats__bottom ul').empty().append(data.stats);
}

function userDisplayLeaderboard(data){
    $('.user__leaderboard tbody').empty().html(data.leaderboard);
}
});
