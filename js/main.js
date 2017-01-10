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
