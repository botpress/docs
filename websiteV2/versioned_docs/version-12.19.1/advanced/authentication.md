---
id: authentication
title: Authentication Methods
original_id: authentication
---
There's three different types of authentication:

1.  **Collaborators**: These users are able to access the Admin UI and will have access to manage and edit bots based on their roles.
2.  **Chat Users**: These users are only able to speak with bots, and they can see the list of bots if they log on the Admin UI
3.  **External User**: This method of authentication expects that you handle user authentication yourself and provide a JWT token to identify the user.

## Authentication Overview

There are 4 different type of authentication strategies currently supported: Basic, SAML, OAuth2 and LDAP. You can also implement them multiple times (for example, you could have two different OAuth2 configurations for different workspaces).

No matter what authentication strategy is used, they are all stored in the database. When you add a new strategy in the `botpress.config.json` file, upon server restart a new table called `strategy_STRATEGYID` will be created.

When you give access to a user for a specific workspace, an entry is created in the table `workspace_users` with his role.

If you have more than one authentication strategy, a menu will be displayed to pick a strategy. You can skip the menu and bookmark a specific strategy by changing the page URL: `/admin/login/STRATEGYID`.

Moreover, you can access a specific workspace by using `/admin/login?workspaceId=WORKSPACEID`

You can find the definition for the various authentication strategies [here](https://github.com/botpress/botpress/blob/master/src/bp/core/config/botpress.config.ts#L326).

### Storage of the user token

By default, tokens which identifies the user on the admin panel and on the studio are stored in the local storage. It does the job, but for additional security, we recommend enabling the storage of tokens in cookies.

However, enabling this feature requires an additional configuration to work properly. The CORS parameter of the HTTP Server must be configured to the external URL of your server:

```js

httpServer: {
  cors: {
      enabled: true,
      origin: "http://localhost:3001", // change to your hostname
      credentials: true
      // You can add additional parameters, you can read more about them here:
      // https://expressjs.com/en/resources/middleware/cors.html
    },
}

```

To enable this feature, set `jwtToken.useCookieStorage` to `true` in the `botpress.config.json` file.

It is possible to fine-tune the settings for the cookie with `jwtToken.cookieOptions`. Please refer to the options of the Cookies module here: https:

```js



```

### Basic

Basic Authentication allows a user to log in with a simple username / password. The password is salted for added security.

To create more accounts, visit the `` tab on the Admin UI. Choose the role and enter the E-mail of your collaborator, then you will receive a random password. The user will need to pick a password after the first login.

Super Admins are able to reset the password of any user using the basic authentication.

#### Configuration Example

In your `` file:

```js



```

#### Additional Security

There are additional options that can be configured when using this authentication strategy. Please refer to the [configuration file for more information](https://github.com/botpress/botpress/blob/master/src/bp/core/config/botpress.config.ts#L350) :

-   ``: Max number of tries allowed before locking out the user
-   ``: Account will be disabled for this amount of time when `` is reached
-   ``: Password will expire after this specified duration
-   ``: Minimum length for the user's password
-   ``: Requires at least 1 character of 3 categories of characters

#### Forgot your password?

Only the first user is allowed to register a new account. If you forgot your password and can't access your account, you will need to clear the list of users, then you will be able to re-create your account.

You can clear the list of users by emptying (or deleting) the table `` (if you are using the default strategy)

### OAuth2

Some OAuth2 implementations returns a JWT token containing all the user's information, while some other returns a special token, which must then be used to query the user's information.

```js



```

### SAML

You can link your SAML Identity Provider seamlessly with Botpress. When it is enabled, Admins will be greeted with a `` button on the Admin UI. The first user to ever login to Botpress using the SSO provider will automatically have an account created and will be a Super Admin.

When a user successfully log on the Admin UI, Botpress will create an internal account for that user. They will be added to the table ``

There are two possible behaviors. You can either:

-   Allow any user that successfully logs on using your SAML IdP to create an account. Set `` to ``
-   Manage users manually (you need to add their emails in the Collaborators page). Set `` to ``

#### Prerequisite

-   Botpress Pro enabled with a valid license key
-   A SAML IdP (Identity Provider)

#### Quick Start

1.  Open `` and set ``
2.  Configure the available options. The complete list of SAML options is [available here](https://github.com/bergie/passport-saml).

Here is a complete example

```js



```

### LDAP

#### Prerequisite

-   Botpress Pro enabled with a valid license key
-   Information to access the LDAP server

#### Quick Start

1.  Open `` and set ``
2.  Configure the available options: [check the full configuration for more details](https://github.com/botpress/botpress/blob/master/src/bp/core/config/botpress.config.ts)

### Field Mapping

The `` configuration allows you to match existing properties of your users with the one Botpress uses. These are the fields that you can define for users: ``, either `` or `` with ``, ``, `` and ``.

Whenever a user successfully logs on using SAML or LDAP, his details will be updated in his Botpress profile.

```js



```

## User Authentication

Using External Authentication, it is possible to authenticate a user on your system, then validate his identity each time he sends a message to the bot. That information can be used in Actions, Hooks, and for Transitions on the Flow Editor.

Here's a summary of the process:

1.  User authenticate on your platform
2.  Your platform returns a JWT token to the user and configure the webchat
3.  The token is sent to Botpress every time a message is sent
4.  Botpress validates the token, decrypt the content and makes it available through ``

### Prerequisite

-   Botpress Pro must be enabled with a valid license
-   A backend that will authenticate the user and generate the JWT token
-   The public key used by the backend

### Quick Start

1.  Edit `` and set `` to ``
2.  Configure the other variables for the JWT token (issuer, audience, algorithm, publicKey)
3.  Restart Botpress
4.  Edit the code of the embedded webchat to send the generated JWT token
5.  Enjoy!

Here is an example configuration, [check the full configuration for more details](https://github.com/botpress/botpress/blob/master/src/bp/core/config/botpress.config.ts)

```js



```

#### How to configure the Public Key

The public key can be added directly in the `` file (on the same line). If you prefer to add the key in a file, remove the property ``, and Botpress will load the key from ``

#### How to create a new Key Pair

The certificate must be in the PEM format. You can use the below commands to generate one.

```bash



```

### Authenticate the user

Once you have generated the JWT token, it must be passed down to the web chat. It will then be sent to Botpress with every message and events. Check out the [Connecting your bot with your existing backend](../tutorials/existing-backend) for more details. There are two different situations:

1.  The user is authenticated before the webchat is loaded.

Simply add the external token as an option to the `` method:

```js



```

2.  The user is already discussing with the bot, then he is authenticated

Use the `` method to change the option:

```js



```

### How to use the authenticated payload

When a user is authenticated, the JWT token is automatically decoded. If the token is valid, all the data it contains will be available through the `` property. This can be accessed inside Hooks and while using Actions.
