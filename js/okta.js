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

    var oktaData = {
        profile : {
            organization : ""
        }
    };

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

                    getOktaUserInfo();

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
        oktaSignIn.signOut();
        document.location.href = "/login.html";
    });

    setTimeout(function(){
        $('#cust_preloader').addClass('hide');
    }, 5000);


    function getOktaUserInfo() {
        var baseUrl = 'https://dev-327182.okta.com';
        $.ajax({
          url: baseUrl + '/api/v1/users/me',
          type: 'GET',
          xhrFields: { withCredentials: true },
          accept: 'application/json'
        }).done(function(data) {
            oktaData.profile = data.profile;

            setTimeout(function () {
                if (typeof app !== 'undefined') {
                    app.album = oktaData.profile.organization
                }
            }, 1000);
        })
        .fail(function(xhr, textStatus, error) {
          var title, message;
          switch (xhr.status) {
            case 403 :
              title = xhr.responseJSON.errorSummary;
              message = 'Please login to your Okta organization before running the test';
              break;
            default :
              title = 'Invalid URL or Cross-Origin Request Blocked';
              message = 'You must explicitly add this site (' + window.location.origin + ') to the list of allowed websites in your administrator UI';
              break;
          }
          // alert(title + ': ' + message);
        });

    }