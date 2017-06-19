## Linking Accounts

To use the account linking feature a user needs to be logged in with 'Account A' (eg: Google) after which he can start the account linking to link 'Account B' (eg: Facebook) to his original account.

This flow is based on the access token of the current user and [is documented here](https://auth0.com/docs/link-accounts).

## Example

In order to link two accounts, create a link method in a controller (make sure to have the `auth` object injected):

```js
$scope.link = function () {
  auth.config.auth0js._callbackOnLocationHash = true;
  auth.signin({
    authParams: {
      access_token: auth.accessToken
    }
  }, function (profile, token) {
    // TODO Handle accounts linked
    console.log('linked');
  }, function () {
    // TODO Handle error
  }, 'Auth0');
};
```

Then, create an anchor in your view:

```html
<a ng-click="link()">link account</a>
```

When the user clicks on that anchor, they will be prompted to enter the credentials for the account they want to link. 

### Restricting Selection

You may want to add a `connection` parameter to restrict user selection. For instance, you can create a view that looks like this:

```html
<a ng-click="linkGoogle()">Link your Google Account</a>
<a ng-click="linkTwitter()">Link your Twitter Account</a>
```

Then, in your controller:

```js
$scope.linkGoogle = function () {
  auth.signin({
    connection: 'google-oauth2',
    authParams: {
      access_token: auth.accessToken
    }
  }, function (profile, token) {
    // TODO Handle accounts linked
    console.log('linked');
  }, function () {
    // TODO Handle error
  }, 'Auth0');
};

$scope.linkTwitter = function () {
  auth.signin({
    connection: 'twitter',
    authParams: {
      access_token: auth.accessToken
    }
  }, function (profile, token) {
    // TODO Handle accounts linked
    console.log('linked');
  }, function () {
    // TODO Handle error
  }, 'Auth0');
};
```

## Advanced Configuration

When we sign in we typically only store the `profile` and the `idToken`. For the account linking feature to work correctly (even after closing and reopening the browser or refreshing the page) we'll need to store the access token.

```js
  auth.signin({ }, function(profile, idToken, accessToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('accessToken', accessToken);
      $location.path("/");
  }, function(error) {
      console.log("There was an error logging in", error);
  });
```

When logging out we'll also need to cleanup the access token:

```js
  $scope.logout = function() {
    auth.signout();
    store.remove('profile');
    store.remove('token');
    store.remove('accessToken');
    $location.path('/login');
  }
```

At application startup we always initialize the module by calling `auth.authenticate`. Now we're updating this call to also include the access token. By adding this we'll be able to use the account linking feature even if the user refreshes the page or closes/reopens the browser:

```js
  $rootScope.$on('$locationChangeStart', function() {
    if (!auth.isAuthenticated) {
      var token = store.get('token');
      if (token) {
        if (!jwtHelper.isTokenExpired(token)) {
          auth.authenticate(store.get('profile'), token, store.get('accessToken'));
        } else {
          $location.path('/login');
        }
      }
    }

  });
```
