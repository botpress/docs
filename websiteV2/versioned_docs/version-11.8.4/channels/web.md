---
id: web
title: Website Embedding
original_id: web
---
## Embedding

Embedding a bot to your existing site is quite straightforward. You will need to deploy your bot to a server or hosting provider and make it accessible via a URL. You will then be able to add the following script tag to the end of your `index.html` page.

NB: Remember to replace your-url-here with the URL of your bot!

```html



```

After the import script above you need to initialize the bot to the `` object with the script below.

```html



```

And that's it! Once you deploy the changes to your website, the bot will become available, and its button will appear.

There is an example included in the default botpress installation at ``

## Bot Information page

The information page displays information like the website url, a phone number, an e-mail contact address, and links to terms of services and privacy policies. You can also include a cover picture and an avatar for your bot.

![Bot Info Page](assets/webchat-bot-info.png)

How to set up the information page:

1.  On the Admin UI, click on the link `` next to the name of the bot you want to change.
2.  Edit your bot information in the `` and `` sections.
3.  Edit the file `` and set `` to `` **\*\***
4.  Refresh your browser.

You will see the page when starting a new conversation. The page is always accessible by clicking on the information icon in the top right corner of the chat window.

&gt; **\*\*** We edited the `` configuration file for the sake of simplicity. To enable the bot information page on a single bot, you will need to copy the file `` to your bot folder `` and edit that file.

## Custom look and feel

You can customize the look and feel of the Botpress Webchat with a custom stylesheet. Armed with the [list of all overridable classes](https://github.com/botpress/botpress/blob/master/modules/channel-web/assets/default.css) and your browser inspector, you can customize every element of the Webchat.

![WebChat Customization](assets/webchat-customization.png)

1.  Add the `` property to your `` script.
2.  Create your `` file and override the classes of your choice.

## Show and hide automatically

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

## Configure at runtime

The method `` allows you to change the configuration of the chat during a conversation without having to reload the page.

## Advanced Customization

Every message sent by the bot to a user consist of a ``. That payload has a `` property, that tells the webchat how the other information included on that payload should be rendered on screen.

There are different ways to send that payload to the user:

-   Sending a Content Element via the Flow Editor [example here](https://github.com/botpress/botpress/blob/master/modules/builtin/src/content-types/image.js)
-   Sending an event via Hooks or Actions [example here](https://github.com/botpress/botpress/blob/master/examples/custom-component/src/hooks/after_incoming_middleware/sendoptions.js)

There are multiple types already built in Botpress (they are listed at the bottom of this page), but if you require more advanced components, you can create them easily.

### Prevent storing sensitive information

By default, the complete payload is stored in the database, so the information is not lost when the user refreshes the page. On some occasion, however, we may want to hide some properties deemed "sensitive" (ex: password, credit card, etc..).

To remove this information, there is a special property that you need to set: ``. Here's an example:

```js



```

## Creating a Custom Component

We already have an [example module](https://github.com/botpress/botpress/tree/master/examples/custom-component) showing how to create them, so we will just make a quick recap here.

Custom components leverages the `` payload type, which is

1.  Create a module (we have [example templates here](https://github.com/botpress/botpress/tree/master/examples/module-templates))
2.  Develop your component
3.  Export your component in the `` file ([here's a couple of different ways to do it](https://github.com/botpress/botpress/blob/master/examples/custom-component/src/views/lite/index.jsx))
4.  Send a custom payload to the user:

```js



```

### What can I do in my component ?

There are a couple of properties that are passed down to your custom component. These can be used to customize the displayed information, and/or to pursue interactions.

| Property      | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| ...props      | The payload properties are available on the root object (this.props.)          |
| onSendData    | This method can be used to send a payload to the bot on the behalf of the user |
| onFileUpload  | Instead of sending an event, this will upload the specified file               |
| sentOn        | This is the timestamp of the message.                                          |
| isLastGroup   | Indicates if your component is part of the group of messages sent by the bot   |
| isLastOfGroup | Indicates if your component is the last message in its group                   |
| keyboard      | This object allows you to manipulate the keyboard (more below)                 |
| wrapped       | Represent any child components (more below)                                    |

&gt; isLastGroup and isLastOfGroup can be combined to let your component know if the current message is the last one the user is seeing. This can be used, for example, to display feedback buttons, a login form or anything else, that will disappear when the user continues the discussion.

#### Wrappers

Wrappers allows you to transform the content of a payload before passing it down to the renderer, or to another component. We have some [example components here](https://github.com/botpress/botpress/tree/master/examples/custom-component/src/views/lite/components/Advanced.jsx)

Here's an example of a wrapped text message:

```js



```

It is also possible to chain multiple custom components using the `` property

#### Keyboards

Keyboard allows you to add elements before or after the composer. Keyboard items can be buttons, or any other type of valid component. Use `` to display it before the composer, and `` to display it after.

```js



```

##### Using a Button Keyboard

There is a built hook that makes it easy to add buttons to any kind of element. You can pass down an array of buttons, or an array of array of buttons.

```js



```
