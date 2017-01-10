


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
