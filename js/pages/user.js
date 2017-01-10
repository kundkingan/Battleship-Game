
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
