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
