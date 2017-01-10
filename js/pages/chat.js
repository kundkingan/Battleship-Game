

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
