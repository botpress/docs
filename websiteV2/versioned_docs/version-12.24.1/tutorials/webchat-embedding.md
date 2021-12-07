---
id: webchat-embedding
title: Embedding your bot on your website
original_id: webchat-embedding
---
Embedding a bot to your existing site is quite straightforward. You will need to deploy your bot to a server or hosting provider and make it accessible via a URL. You will then be able to add the following script tag to the end of your `index.html` page.

NB: Remember to replace your-url-here with the URL of your bot!

```html



```

After the import script above you need to initialize the bot to the `` object with the script below.

```html



```

And that's it! Once you deploy the changes to your website, the bot will become available, and its button will appear.

There is an example included in the default botpress installation at ``

## How to display a Bot Information page

The information page displays information like the website url, a phone number, an e-mail contact address, and links to terms of services and privacy policies. You can also include a cover picture and an avatar for your bot.

How to set up the information page:

1.  On the Admin UI, click on the link `` next to the name of the bot you want to change.
2.  Edit your bot information in the `` and `` sections.
3.  Edit the file `` and set `` to `` \*\*
4.  Refresh your browser.

You will see the page when starting a new conversation. The page is always accessible by clicking on the information icon in the top right corner of the chat window.

\*\* We edited the `` configuration file for the sake of simplicity. To enable the bot information page on a single bot, you will need to copy the file `` to your bot folder `` and edit that file.

## Customizing the look and feel of the Webchat

The Webchat view is customizable by passing additional params to the `` function, below are the options available:

```js



```

There is an example on how to customize the web chat with your custom CSS bundled with your default Botpress installation. Start the server, then head over to `` for an example. You can also check example [sources at the github](https://github.com/botpress/botpress/tree/master/modules/channel-web/assets/examples).

## Advanced

### Displaying and hiding the webchat programmatically from the website

If the default Botpress button doesn't work for you, it can be changed by adding a `` event listener to any element on the page. You will also need to pass the `` key to your `` function like this:

```html



```

Here is some sample code for adding the event listeners to your custom elements:

```html



```

### Obtaining the User ID of your visitor

It may be useful to fetch the current visitor ID to either save it in your database or to update some attributes in the Botpress DB.

Since the webchat is running in an iframe, communication between frames is done by posting messages.
The chat will dispatch an event when the user id is set, which you can listen for on your own page.

```js



```

### Configuring the Webchat during a conversation

The method `` allows you to change the configuration of the chat during a conversation without having to reload the page
