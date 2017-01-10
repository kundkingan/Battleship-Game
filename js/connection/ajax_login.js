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
