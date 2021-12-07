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

## Displaying and hiding the webchat programmatically from the website

If the default Botpress button doesn't work for you, it can be changed by adding a `` event listener to any element on the page. You will also need to pass the `` key to your `` function like this:

```html



```

Here is some sample code for adding the event listeners to your custom elements:

```html



```

## Obtaining the User ID of your visitor

It may be useful to fetch the current visitor ID to either save it in your database or to update some attributes in the Botpress DB.

Since the webchat is running in an iframe, communication between frames is done by posting messages.
The chat will dispatch an event when the user id is set, which you can listen for on your own page.

```js



```

## Customizing the look and feel of the Webchat

The Webchat view is customizable by passing additional params to the `` function, below are the options available:

```js



```

## Configuring the Webchat during a conversation

The method `` allows you to change the configuration of the chat during a conversation without having to reload the page
