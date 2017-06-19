# Storing information

You can use `angular-storage` to store the user profile and tokens so that they will not have to log in every time the page is refreshed.

In this tutorial, you'll learn how to do this.

### 1. Including angular-storage dependency

The first thing you should do is adding `angular-storage` and `angular-jwt` as dependencies. Follow [this link](https://github.com/auth0/angular-storage#installing-it) to learn how to install `angular-storage` and [this other one](https://github.com/auth0/angular-jwt#installing-it) to install `angular-jwt` via npm, bower or manually. Once you've done that, just include `angular-storage` and `angular-jwt` modules to your application:

````js
angular.module('myApp', ['auth0', 'angular-storage', 'angular-jwt']);
````

### 2. Saving the user information after login.

After the user has successfully signed in, you’ll want to store the profile details and authentication token:


````js
function Controller(auth, $location, store, $scope)
  $scope.login = function() {
    auth.signin({}, function (profile, id_token, access_token, state, refresh_token) {
      store.set('profile', profile);
      store.set('token', id_token);
      $location.path('/');
    }, function () {
      // TODO Handle when login fails
    });
  }
````

### 3. Authenticating the user on page refresh

Now that you have the user information stored, you can use `auth.authenticate` method after the page has refreshed to let `auth0-angular` know that the user is already authenticated if the JWT isn't expired:

````js
angular.module('myApp', ['auth0', 'angular-storage', 'angular-jwt'])
.run(function($rootScope, auth, store, jwtHelper) {
  // This events gets triggered on refresh or URL change
  $rootScope.$on('$locationChangeStart', function() {
    var token = store.get('token');
    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token).then(function (profile) {

                    console.log("Logged in via refresh token and got profile");

                    console.log(profile);
                    
                    // Successful login, now redirect to secured content.

                }, function (err) { });;
        }
      } else {
        // Either show Login page or use the refresh token to get a new idToken
      }
    }
    
  });
});
````

### 4. You've nailed it

That's it :). Now, you can check out some of our [examples](https://github.com/auth0/auth0-angular/tree/master/examples). 

