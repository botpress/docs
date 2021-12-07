---
id: configuration
title: Configuration
original_id: configuration
---
Botpress uses `JSON` files for most configurations. Environment variables can also set configuration. In this topic, you will learn about Botpress global configuration, individual chatbot configuration, module configuration, and environment variables.

## Botpress Global Config

The Botpress global config file is the main file used to configure the Botpress server. Your instance of Botpress creates this file automatically if it is missing. Default values should work well when using Botpress, but we will show you other configurations you may need to change on this page.

To get more information about each option, check out the [comments on the configuration schema](https://github.com/botpress/botpress/blob/master/src/bp/core/config/botpress.config.ts)

## HTTP Server Configuration

By default, Botpress will start an HTTP server on localhost, listening to port 3000. If the configured port is already in use, it will pick the next available one. You can change the port by editing `httpServer.host` and `httpServer.port`.

### Exposing your chatbot to the internet

When you are ready to expose your chatbot externally, you will need to change some server settings. The server doesn't support HTTPS connections, so you will need to set up a reverse proxy in front of it (for example, NGINX).

Your server will still listen for connections on port 3000, but your reverse proxy will answer queries on port 80. It's also the reverse proxy that will handle secure connections if you want to access your chatbot using `https`

At this point, Botpress doesn't know how to access the chatbot from the web.  You will need to set the `httpServer.externalUrl` configuration to the complete hostname, for example, `https://bot.botpress.com`

### Changing the base URL of your bot

By default, Botpress is accessible at the root of your domain (ex: https:). It is possible to change that to serve it from a different URL, for example, ``. All you need to do is set the External URL as either an environment variable (``) or via the `` file.

The path will be automatically extracted from that URL and will function as the root path.

## Logs Configuration

Logs are handy to debug and understand the root cause when your chatbot doesn't behave as expected.

When you start Botpress from the binary (or using the Docker image), the chatbot is in `` mode. As such, the console will display a lot of information to understand what happens.

There are five different levels of logs:

-   Debug: display very detailed information about the chatbot operations
-   Info: gives general information or "good to know" stuff
-   Warn: means that something didn't go as expected, but the chatbot was able to recover
-   Error: there was an error that you should address
-   Critical: something prevents the chatbot or the server from behaving correctly (may not work at all)

### Log Verbosity

Verbosity is the amount of information contained in the debug log. There are three different configurations of verbosity for the logger:

-   Production (verbosity: 0)
-   Developer (verbosity: 1)
-   Debug (verbosity: 2)

By default, Botpress uses the `` configuration. When you run Botpress in production `` or with cluster mode ``, logs will be configured as ``

You can configure the level of verbosity using an environment variable (`` for production) or using a command line (ex: `` for Debug)

#### Production

-   The console will display ``, ``, ``, and `` logs
-   In the studio's log console, chatbot developers will see `` logs for their chatbot
    \-The console will display-No stack traces\* 

#### Developer

-   Logs will contain the same information ``, but the console will also include stack traces\*

#### Debug

-   Includes everything from `` and ``
-   The central ui will display debug logs in the main console

\* Stack traces are additional information used by developers to identify the source of an error. They are helpful when developing, but in production, they can hide more important log messages.

### Saving Logs

It is also possible to send log output to a file in a specific folder. To save logs, edit your `` file as follows:

```js



```

### Advanced Logging

In a production environment, you can persist additional logs such as a full audit trail. To enable more granular logs, use the debug environment variable and save those extra logs to a separate file:

```sh



```

&gt; **Tip**: You can combine this with a log rotation tool such as [newsyslog](https://www.real-world-systems.com/docs/newsyslog.1.html) or [logrotate](https://linux.die.net/man/8/logrotate).

## Enable/Disable modules

When you start Botpress for the first time, it will add the most popular modules included with the binary to your `` file. If you want to disable or enable modules, you may either do so on the admin page or edit the `` property in ``.

![Admin Modules Page](assets/admin_modules.png)

Should you choose the latter, note that the special string `` is replaced when your configuration file is read. It represents the modules folder's location on your hard drive; therefore, you shouldn't have to change it.

```js



```

## Individual Chatbot Configuration

Every chatbot that you create will have its configuration file. This file is in the directory ``. You can edit most of the available options by clicking on the `` link next to the chatbot name on the administration panel or accessing the chatbot studio's configuration panel.

## Module Configuration

When you enable a module on Botpress, it is available globally, which means that you can't disable or enable it for a specific bot. However, you can configure every chatbot differently.

Each module has a different configuration, so when you run a module for the first time, Botpress will create the default configuration in ``. If you need a unique configuration for your bot, you can right-click any global configuration from the Code Editor, then **duplicate to the current bot**.

Alternatively, you can manually create a `` folder in the chatbot folder, copy the configuration file in it: ``.

## Environment Variables

The configuration file found in `` can set most of these variables. Infrastructure configuration (like the database, cluster mode, etc.) isn't available in the configuration file since it is required before the config is loaded.

Botpress supports `` files, so you don't have to set environment variables every time you start the app. Save the file in the same folder as the executable.

### Common

| Environment Variable     | Description                                                                                 | Default               |
| ------------------------ | ------------------------------------------------------------------------------------------- | --------------------- |
| PORT                     | Sets the port that Botpress will listen to                                                  | 3000                  |
| BP_HOST                  | The host to check for incoming connections                                                  | localhost             |
| EXTERNAL_URL             | This is the external URL that users type in the address bar to talk with the bot.           | http://HOST:PORT |
| DATABASE_URL             | Full connection string to connect to the DB. For Postgres, start with ``  | -                     |
| BP_PRODUCTION            | Sets Botpress in production mode, which has the same effect as starting it with `` | false                 |
| BPFS_STORAGE             | Storage destination used by BPFS to read and write files (global and bots)                  | disk                  |
| BP_CONFIG_PRO_ENABLED    | Enables the pro version of Botpress, the license key will be required                       | false                 |
| BP_CONFIG_PRO_LICENSEKEY | Your license key (can also be specified in ``)                   | -                     |
| CLUSTER_ENABLED          | Enables multi-node support using Redis                                                      | false                 |
| REDIS_URL                | The connection string to connect to your Redis instance                                     | -                     |
| AUTO_MIGRATE             | Automatically migrates bots up to the running Botpress version                              | -                     |
| DEBUG                    | Namespaces to [debug](#advanced-logging)                                                    | -                     |

### Runtime and Modules

| Environment Variable      | Description                                                                                     | Default |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| VERBOSITY_LEVEL           | Botpress will be more chatty when processing requests which have the same effect as `` |         |
| BP_DECISION_MIN_CONFIENCE | Sets the minimum threshold required for the Decision Engine to elect a suggestion               | 0.3     |
| FAST_TEXT_VERBOSITY       | Define the level of verbosity that FastText will use when training models                       | 0       |
| FAST_TEXT_CLEANUP_MS      | The model will be kept in memory until it receives no messages to process for that duration     | 60000   |
| REVERSE_PROXY             | When enabled, it uses "x-forwarded-for" to fetch the user IP instead of remoteAddress           | false   |

It is also possible to use environment variables to override module configuration. The pattern is ``, all in the upper case. For example, to define the `` option of the module ``, you would use ``. 

&gt; **Tip**: You can list the available environment variables for each module by enabling the `` flag.

### Security

You can use these variables to disable some sensitive features destined to Super Admins.

| Environment Variable            | Description                                                                                                                                         | Default |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| BP_CODE_EDITOR_DISABLE_ADVANCED | The advanced editor, lacks some safeguard and is only intended for experienced users. It can be disabled completely using this environment variable | false   |
| BP_CODE_EDITOR_DISABLE_UPLOAD   | Prevent users from uploading files when using the advanced editor                                                                                   | false   |
| BP_DISABLE_SERVER_CONFIG        | Prevent Super Admins from accessing the "Production Checklist" page on the Admin panel, since it may contain sensitive information                  | false   |

## NGINX_Config

We recommend the configuration below when deploying Botpress in production.

```bash



```

## More Information

-   Check out the [database](../infrastructure/database) page for details about ``
-   Check out the [cluster](../infrastructure/cluster) page for details about `` and ``
