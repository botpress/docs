---
id: tutorials
title: Tutorials
original_id: tutorials
---
## Embedding the bot on your website

Embedding a bot to your existing site is quite straightforward. You will need to deploy your bot to a server or hosting provider and make it accessible via a URL. You will then be able to add the following script tag to the end of your `index.html` page.

NB: Remember to replace your-url-here with the URL of your bot!

```html



```

After the import script above you need to initialize the bot to the `` object with the script below.

```html



```

And that's it! Once you deploy the changes to your website, the bot will become available, and its button will appear.

There is an example included in the default botpress installation at ``

#### Displaying and hiding the webchat programmatically from the website

If the default Botpress button doesn't work for you, it can be changed by adding a `` event listener to any element on the page. You will also need to pass the `` key to your `` function like this:

```html



```

Here is some sample code for adding the event listeners to your custom elements:

```html



```

### Customizing the look and feel of the Webchat

The Webchat view is customizable by passing additional params to the `` function, below are the options available:

```js



```

## Supported databases

Botpress comes with support for SQL databases out-the-box and can be accessed by:

1.  The key-value store - This can be accessed via functions like `` and ``
2.  A knex-instance - This allows you to work with the DB directly via ``

### Switching DB to Postgres

By default Botpress uses SQLite as its database. This will be fine for local development and for self-hosted installations, but you may run into issues when hosting using services like Heroku.

To fix this issue and to provide you with a more powerful database, Botpress also supports Postgres.
Switching to it is straightforward.

Firstly, check your `` for the postgres-configuration section. By default it looks something like this:

```js



```

To enable Postgres, you can edit the configuration or pass 2 environment variables: `` and ``. Please make sure you are using Postgres 9.5 or higher.

## Human In The Loop

Botpress allows you to build a powerful tool for autonomous communication with your users.
However there may be cases where it is difficult or very resource-consuming to implement a conversation flow within the bot. At this point you may consider having a human take over the conversation and continue to communicate with your user.

The [Human-in-the-Loop (hitl)](https://github.com/botpress/botpress/tree/master/modules/hitl) module allows you to do just that!

Human-in-the-Loop is currently supported on `` and ``.

Once you have this module installed, you will be able to:

1.  Pause a user's conversation with the bot
2.  Alert your agents that a conversation requires attention
3.  As an agent you will be able to continue the conversation via the admin-panel
4.  Resume conversation with the bot

### Pausing conversation

There are several ways you can pause the conversation:

-   from the admin-panel, toggling the appropriate button
-   by performing an API-request:
    -   POST /mod/hitl/sessions/{"{"}$id{"}"}/pause
    -   POST /mod/hitl/sessions/{"{"}$id{"}"}/unpause
    -   POST /mod/hitl/channel/{"{"}$channel{"}"}/user/{"{"}$userId{"}"}/pause
    -   POST /mod/hitl/channel/{"{"}$channel{"}"}/user/{"{"}$userId{"}"}/unpause

### Alerting agents

There are a number of ways to alert your agents of a paused conversation, an email, a call to an external API or, as in the example below, via a notification in the admin-panel:

```js



```

The agent can then navigate to the appropriate conversation and take over the conversation from the bot.

### Resuming conversation

Once the agent is done communicating with the user, they can unpause the conversation.

It is also possible for the user to unpause the conversation by calling the API endpoint.

## Jump To

The flow-editor allows you to visually design the flow of the conversation. However, it may be easier for you to jump to a specific conversation node programmatically, when a specific set of conditions is met.

```js



```

As can be seen in the above example, the `` method takes 4 arguments:

-   the session id
-   the event
-   the target flow name
-   the target node name (optional - by default it is flow.startNode)

## Acting Proactively

You may wish to make your bot act proactively on your website in response to some action. E.g., suggest they buy the product they are viewing after a set time or ask them for feedback on services they were using.

With Botpress this is simple:

1.  First you need to open the bot-window and then trigger a custom action-type (`` in the example below). These can be triggered by a javascript event such as a timeout.

```js



```

2.  This trigger will be dispatched to the bot so you need to add a handler for it. This should be added as a [Hook](/docs/build/code#hooks)

```js



```

That's it! If you have your builtin renderers registered, the code above will work!

## Shortlinks

In Botpress you can natively create shortlinks to your bot.

This has a number of advantages:

1.  Short URLs - no one likes a long URL
2.  Flexibility - it allows you to change any of the parameters without affecting the URL

Below is an example where our new shortlink `` will redirect a user to `` (the standard webchat interface) with any additional parameters you specify in the options object.

```js



```

## Timeouts

Occasionally a user may leave a conversation with your bot part way through the interaction, leaving it in an unwanted state.

This could lead to the bot trying to answer the wrong question when the user returns to the conversation at a later time, which is a bad user experience.

To prevent this Botpress has the ability to set the time-to-live on a session and how often these should be checked. You will find the following options in ``.

```js



```

This means that if you started a conversation and then didn't respond for 2 minutes, the bot would set your session as expired.
When you then resume the conversation, the bot will start from the beginning.

### Receiving an event when a user timeout

There is a [hook](/docs/build/code#hooks) that is called before the user's session timeouts.

### Performing actions on timeout

When a user's conversation session expires, you are able to trigger an action by specifying the node's name or by having a dedicated timeout flow.

There are 4 ways to handle this. The bot will invoke the first handler set, based on the order below:

1.  Using the `` key on a node.

```js



```

2.  Using the `` key on the flow

```js



```

3.  By adding a node called `` within a flow

```js



```

4.  Having a dedicated timeout flow file called ``

## I18n

Support of multiple languages means answering several questions:

1.  How would the bot know which language to use?
2.  How would admin add text-translations?
3.  How would bot render appropriate content?

### Selecting language

There are many scenarios when dealing with language and depend on your needs, solutions can range from storing a users choice in a variable to fetching the users language from the third-party service.

In our case, we will keep things simple and just a add a Choice for the user to pick from at the beginning of the conversation.

You can then store the user's choice in the `` by preparing a [simple action](/docs/build/code) for this purpose. Let's assume we offer the choice between English and Arabic, after the user chooses their language, we will set `` either to "En" or "Ar".

### Adopting content schema

Botpress allows you to define a [custom content type](/docs/build/content) that will allow you to store text in multiple languages. Here's an example of a `` content-type:

```js



```

Notice in the above example that via the `` key we are changing the direction in which the text is written, making it right-to-left for Arabic

## Calling an API in a Custom Action

One of the most popular use-case for Actions is to call an API, get some data and use it in your flow. That's what we're going to demonstrate here.

We're going to use `` as http client because its already a Botpress dependency. See our [Custom Code](https://botpress.com/docs/build/code/) section to learn more about how dependencies work in Actions.

Start by creating a new javascript file in ``. Then copy the following code:

```javascript



```

### Bot Reply

Let's make the bot reply with the quote:

```javascript



```

### Memory

In the end, calling an API in an Action works as it would in any other javascript project. The real difference is how you want to handle the data afterwards. So we just made the bot reply, but what if we wanted to return that data and use it later on in the flow?

We're gonna use [Temp Memory](https://botpress.com/docs/build/memory#temporary-memory) to store the data instead.

```javascript



```

And then use the temp memory in another node:

![Get Quote Flow](assets/get-quote.png)
