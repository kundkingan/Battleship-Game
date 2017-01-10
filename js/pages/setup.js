
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
