
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
