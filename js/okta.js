    var oktaSignIn = new OktaSignIn({
        baseUrl: "https://dev-327182.okta.com",
        clientId: "0oa2dcvf0gBmMalZC357",
        redirectUri: 'https://www.entryin.ml/index.html',
        authParams: {
            issuer: "default",
            responseType: ['token', 'id_token'],
            display: 'page'
        }
    });

    if (oktaSignIn.token.hasTokensInUrl()) {
        oktaSignIn.token.parseTokensFromUrl(
            // If we get here, the user just logged in.
            function success(res) {
                // console.log(res);
                var accessToken = res[0];
                var idToken = res[1];

                oktaSignIn.tokenManager.add('accessToken', accessToken);
                oktaSignIn.tokenManager.add('idToken', idToken);
                oktaSignIn.tokenManager.add('logoutUrl', "https://dev-327182.okta.com/oauth2/default/v1/logout?id_token_hint="+idToken.idToken+"&post_logout_redirect_uri=http://www.entryin.ml/login.html");

                // window.location.hash='';
            },
            function error(err) {
                // console.error(err);
            }
        );
    } else {
        oktaSignIn.session.get(function (res) {

                // If we get here, the user is already signed in.
                if (res.status === 'ACTIVE') {

                    if (document.location.pathname == "/login.html") {
                        document.location.href = "/index.html";
                    }

                    $('#cust_preloader').addClass('hide');

                }
                else{
                    if (document.location.pathname == "/login.html") {
                        
                        oktaSignIn.renderEl(
                            { el: '#okta-login-container' },
                            function success(res) {

                            },
                            function error(err) {
                                console.error(err);
                            }
                        );

                        $('#cust_preloader').addClass('hide');

                    }else{
                        document.location.href = "/login.html";
                    }
                }

        });
    }

    $("#logout").on('click', function(){
        oktaSignIn.session.close();
        document.location.href = "/login.html";
    });

    setTimeout(function(){
        $('#cust_preloader').addClass('hide');
    }, 5000);