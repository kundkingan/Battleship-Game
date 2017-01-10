
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
