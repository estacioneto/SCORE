# Auth0 and AngularJS

## Deprecation Notice

**This SDK is for use with Lock v9. For use with Lock 10, see the [angular-lock](https://github.com/auth0/angular-lock) and [angular-auth0](https://github.com/auth0/angular-auth0) wrappers.**

---

This AngularJS module will help you implement client-side and server-side (API) authentication. It can be used together with [Auth0](https://www.auth0.com) to add support for username/password authentication, enterprise identity providers like Active Directory or SAML and also for social identity providers like Google, Facebook or Salesforce among others to your web, API and native mobile apps.

[Auth0](https://www.auth0.com) is a cloud service that provides a turn-key solution for authentication, authorization and single sign-on.

## Key Features

* **User login & signup**: This module lets you easily sign in and sign up your users with any Social Provider, Enterprise Provider or Username and password. You can use the UI supplied by Auth0 or create your own
* **Authenticated API calls**: JWTs are automatically added to every request made to your API after the user is authenticated
* **Events/Promise based services**: `auth0-angular` supports events and promised-based actions
* **Token management**: Using `auth0-angular` together with `angular-storage` and `angular-jwt` can handle the complete token lifecycle, including storing, expiration and renewal.

## Installation

### Bower

````bash
bower install auth0-angular
````

### NPM

````bash
npm install auth0-angular
````

### CDN

````html
<script type="text/javascript" src="//cdn.auth0.com/js/lock-9.0.js"></script>
<script type="text/javascript" src="//cdn.auth0.com/w2/auth0-angular-4.2.6.js"></script>
````

> **Warning**: If you use a CDN or download these scripts manually, be sure to include the versions of `auth0-lock` or `auth0.js` that match the versions [specified in the `bower.json`](https://github.com/auth0/auth0-angular/blob/master/bower.json#L7-L8).

## TL;DR: Quick start guide

### Add module dependency and configure it

````js
angular.module('myCoolApp', ['auth0'])
  .config(function(authProvider) {

    // routing configuration and other stuff
    // ...

    authProvider.init({
      domain: 'mydomain.auth0.com',
      clientID: 'myClientID',
      loginUrl: '/login'
    });
  })
  .run(function(auth) {
    auth.hookEvents();
  });
````

### Displaying the signin popup and retrieving user information

```js
// LoginCtrl.js
angular.module('myCoolApp').controller('LoginCtrl', function(auth) {
  $scope.signin = function() {
    auth.signin({
      authParams: {
        scope: 'openid name email' // Specify the scopes you want to retrieve
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      $location.path('/user-info')
    }, function(err) {
      console.log("Error :(", err);
    });
  }
});
```

```html
<a href="" ng-click="signin()" />
```

### Showing user information
```js
// UserInfo.js
angular.module('myCoolApp').controller('UserInfoCtrl', function(auth) {
  // Using a promise
  auth.profilePromise.then(function(profile) {
    $scope.profile = profile;
  });
  // Or using the object
  $scope.profile = auth.profile;
});
```
```html
<!-- userInfo.html -->
<span>{{profile.name}} {{profile.email}}</span>
```

### Keeping the user logged in, saving the token and using a refresh token.

There're many more things that you can do with `auth0-angular` in conjunction with [angular-storage](https://github.com/auth0/angular-storage) and [angular-jwt](https://github.com/auth0/angular-jwt).

* [Keeping the user logged in by saving their token and profile](docs/storing-information.md)
* [Sending a JWT in every request made to an API](docs/calling-an-api.md)
* [Using a refresh token after the user's JWT has expired](docs/refresh-token.md)

## Getting Started Guide

### Preface: Authentication Modes

There are three modes to handle authentication with all the providers (e.g. Facebook, Linkedin, GitHub, AD, LDAP) that Auth0 can handle: redirect, popup, and resource owner (`/oauth/ro`) CORS calls.

When using **redirect mode**, the user will be redirected to the provider's login page for authentication.
After authenticating, the user will be redirected back to the application with the requested user information in the hash fragment, which can be handled with Angular events.
This implies that the application will be **reloaded completely** when the authentication flow is initiated.

**Popup mode** will open a popup window displaying the provider's login page.
After authentication, the popup will close and return control to the application.
The requested user information will be available through a callback function and will not reload the page.

Database connection users can be authenticated by making a **CORS call to `/oauth/ro`**, passing a username and password.
Does not reload the page.

### Dependencies

auth0-angular depends on either `auth0.js` or `auth0-lock.js`.

If you want to use Auth0's [beautiful Lock UI](https://auth0.com/lock), you need to include `auth0-lock.js`. This lets you configure Title and Icons, but the UI is taken care for you. For all the customization properties, please check out [this link](https://auth0.com/docs/libraries/lock/customization)

Otherwise, if you'll use a custom UI, you need to include `auth0.js`.

**It's important to note that these scripts must be included before auth0-angular**.

If you're using `bower` or `npm`, these scripts are set as dependencies of auth0-angular so that you choose the best for you. Otherwise, you can include them from the CDN:

```html
<!-- Either this -->
<script type="text/javascript" src="//cdn.auth0.com/js/auth0-lock-7.js"></script>
<!-- or -->
<script type="text/javascript" src="//cdn.auth0.com/w2/auth0-6.7.js"></script>
```

### SDK API

Parameters between `[]` are optional.

#### auth.signin(options[, successCallback, errorCallback])

Logs in a user, returning tokens and their profile information.
Lock will be displayed if included, otherwise a login will be performed with the specified identity provider (`connection`).

If success and error callback functions are supplied, **popup mode** will be used.
This will not reload the page.

```js
auth.signin({}, function(profile, idToken, accessToken, state, refreshToken) {
  // All good
  $location.path('/');
}, function(error) {
  // Error
})
```

A `connection` parameter can be passed to log in a user without displaying Lock.
When using database connections, `username` and `password` can be passed as well.
The snippet below will perform a to a call to `/oauth/ro`:

```js
auth.signin({
  username: $scope.username,
  password: $scope.password,
  connection: 'Username-Password-Authentication'
}, function(profile, idToken, accessToken, state, refreshToken) {
  // All good
  $location.path('/');
}, function(error) {
  // Error
}, 'Auth0')
```

**Redirect mode** will be used when not passing success or error callbacks.
In this case, login success and failure are handled with events:

```js
// app.js
module.config(function(authProvider) {
  authProvider.on('loginSuccess', function($location, profilePromise, idToken, store) {
    profilePromise.then(function(profile) {
      store.set('profile', profile);
      store.set('token', idToken);
    });
    $location.path('/');
  });

  authProvider.on('authenticated', function($location) {
    // This is after a refresh of the page
    // If the user is still authenticated, you get this event
  });

  authProvider.on('loginFailure', function($location, error) {
    $location.path('/error');
  });
});
```

```js
// LoginCtrl.js
auth.signin();
```

[The complete Lock API is documented here](https://auth0.com/docs/libraries/lock/customization).

#### auth.signup(options[, successCallback, errorCallback])

Displays Lock in signup mode, and logs the user in immediately after a successful signup.
Accepts the same options and parameters as [`auth.signin`](#authsigninoptions-successcallback-errorcallback).

#### auth.reset(options[, successCallback, errorCallback])

Performs the "forgot your password" flow.
If using `auth0.js`, it will send an email to confirm the password change. [See the documentation here](https://github.com/auth0/auth0.js#change-password-database-connections).

If using Lock, the widget will be displayed in "reset password" mode.
In this case, this method accepts the options and parameters as [`auth.signin`](#authsigninoptions-successcallback-errorcallback).

#### auth.signout()

This logs the user out locally by deleting their token from local storage.

#### auth.authenticate(profile, idToken[, accessToken, state, refreshToken])

Reauthenticates the user by using a stored profile and token without going through the login flow. You can read more about this subject in [this article](https://github.com/auth0/auth0-angular/blob/master/docs/storing-information.md#3-authenticating-the-user-on-page-refresh).

#### auth.profile

Once a user has successfully logged in, this property will contain their profile.
If you want to use information from `auth.profile` only after the user is logged in, you can just do a `$watch` on this property to wait until it's set.

#### auth.profilePromise

Same as `auth.profile`, but as a promise.
If the user has not attempted a login yet, this will be `null`.

#### auth.isAuthenticated

This flag returns whether there's a user authenticated or not.

### auth.linkAccount(token, profile, options, successCallback, errCallback)

API to link multiple accounts to primary account

Note that `options.connection` must be provided because it tells Auth0 which account to link to


#### auth.id_token, auth.access_token, auth.state

These properties contain the tokens returned after the user is logged in.
Mostly for internal usage.

#### auth.hookEvents()

`auth0-angular` hooks to internal Angular events so that a user will be redirected to the login page if trying to visit a restricted resource.
For that, you need to hook `auth0-angular` to all of these events on application run.

First, configure the restricted routes:

````js
// Using ngRoute
module.config(function($routeProvider) {
  $routeProvider.
  when('/info', {
    templateUrl: 'info.html',
    controller: 'InfoCtrl',
    requiresLogin: true
  }).
  when('/login', {
    templateUrl: 'login.html',
    controller: 'LoginCtrl'
  });

  authProvider.init({
    domain: 'domain',
    clientID: 'clientID',
    callbackUrl: location.href,
    loginUrl: '/login'
  })
})

// Using ui-router
module.config(function($stateProvider) {
  $stateProvider.
  state('info', {
    url: '/info'
    templateUrl: 'info.html',
    controller: 'InfoCtrl',
    data: {
      requiresLogin: true
    }
  }).
  state('login', {
    url: '/login'
    tempalteUrl: 'login.html',
    controller: 'LoginCtrl'
  });

  authProvider.init({
    domain: 'domain',
    clientID: 'clientID',
    callbackUrl: location.href,
    loginState: 'login'
  })
});
````

Then, call `hookEvents` in the `run` method:

````js
module.run(function(auth) {
  auth.hookEvents();
});
````

To learn more about routing and using `ngRoute` or `ui-router`, please [read this tutorial](docs/routing.md).

#### auth.getToken(options)

This method does a token delegation request, which means exchanging the current token for another one.

There are two cases:

1) Auth0 has several addons which let you obtain tokens for third-party services (e.g. Firebase or AWS) from an Auth0 token. For example, to obtain a Firebase token:

```js
auth.getToken({
  api: 'firebase' // By default it's going to be the first active addon in the list of addons
})
```

2) When using multiple Auth0 applications, a token for one application can be used to obtain a token for another application.
Tokens retrieved in this way will be issued by the target application (`iss` claim) and signed with its client secret.
**Returns a promise**.

```js
auth.getToken({
  targetClientId: 'other client id',
  api: 'auth0' // We want the Auth0 ID_token of the other API
})
```

To learn more about delegated access, [please refer to the authorization API documentation](https://auth0.com/docs/auth-api#delegated).

#### auth.renewIdToken([id_token])

JSON Web Tokens have an expiration date, indicated by the `exp` claim. If you don't want your user to log in again, the current token can be refreshed. Refreshing a token means using that token before it has expired in order to obtain a new one with a later expiration date.

For example, suppose you have a token valid for 10 hours. After 9 hours, you could refresh the token to get a new token which will be valid for another 10 hours.

The renewed token will be requested with the same scopes as the original token, by using a special `passthrough` scope. To request different scopes, use [`getToken()`](#authgettokenoptions). **Returns a promise**.

#### auth.refreshIdToken([refresh_token])

Given an `id_token` which might have expired, use the `refresh_token` to get a renewed `id_token`.

#### authProvider.init(options) || auth.init(options)

You use this method to configure the auth service. It can be used either from the provider in the `config` method of your app, or anywhere else in the application from the `auth` service by calling `auth.init`. You can set the following options:

* **domain**: The domain you have from your Auth0 account.
* **clientId**: The identifier for the application you've created. This can be found in the settings for your app on Auth0.
* **sso**: If you have more than one application and you want Single Sign On on your apps, just set this to `true`. This will mean that if a user signs in to app 1, when he tries to use app 2, he will be already logged in.
* **loginUrl**: Set this to the login url **if you're using ngRoute**.
* **loginState**: Set this to the login state **if you're using ui-router**.

#### authProvider.on(event, handler)

The following events can be handled:

* **authenticated**: The user was successfully authenticated by calling [`auth.authenticate`](#authauthenticateprofile-idtoken-accesstoken-state-refreshtoken). In the handler, you can inject any service you want.
* **loginSuccess**: The user has successfully logged in . In the handler, you can inject any service you want besides the `profileProfile` and `idToken` from the user.
* **loginFailure**: There was an error trying to authenticate the user. In the handler, you can inject any service you want besides the `error` which was thrown.
* **logout**: The user has successfully logged out.
* **ssoLogin**: An SSO login is happening.
* **forbidden**: An unauthorized request was made to an API, which returned an HTTP 401 response. This can mean that the user attempted to access a restricted resource, or that their token has expired.

When using **redirect mode, it's mandatory to handle login events in this way**.
In the case of popup mode, events can be handled this way or by using a promise on [`auth.signin`](#authsigninoptions-successcallback-errorcallback).


## Tutorials & Examples

This is the list of all of the available tutorials & samples.

### [Using Auth0 Lock (no need to build a custom UI)](docs/widget-popup.md)

* [Redirect mode](https://github.com/auth0/auth0-angular/tree/master/examples/widget-redirect)

![Widget redirect](http://cl.ly/image/2o423i362s2P/WidgetRedirect.gif)

* [Popup mode](https://github.com/auth0/auth0-angular/tree/master/examples/widget)

![Widget Popup](https://cloudup.com/cg8u9kVV5Vh+)

### Using your own login UI

* [Username/Password Login](https://github.com/auth0/auth0-angular/tree/master/examples/custom-login)

![basic_guide](https://cloudup.com/cmaeJKX7LEM+)

* [Social Login](https://github.com/auth0/auth0-angular/tree/master/examples/custom-login)

![popup_guide](https://cloudup.com/cKpVNpR4s9y+)


* [Joining or linking accounts](docs/link-accounts.md)

### [Integrating to routes (ui-router and ngRoute)](docs/routing.md)

* [`ui-router` example](https://github.com/auth0/auth0-angular/tree/master/examples/ui-router)
* [`ngRoute` example](https://github.com/auth0/auth0-angular/tree/master/examples/widget-redirect)
* [`html5mode` example](https://github.com/auth0/auth0-angular/tree/master/examples/html5mode)

### [Token delegation](https://github.com/auth0/auth0-angular/tree/master/examples/delegation-token)

### [Signup with custom fields]((https://github.com/auth0/auth0-angular/tree/master/examples/custom-signup))

### [Single sign-on (SSO)](https://github.com/auth0/auth0-angular/tree/master/examples/sso)

## Changelog

Check [the CHANGELOG file](CHANGELOG.md) to see the changes from version to version.

## Contributing
 [Read here how to run auth0-angular tests](docs/testing.md)

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [JSON Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free account in Auth0

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
