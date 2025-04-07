---
title: React Native App
excerpt: Embedding the Web Chat in a React Native App
deprecated: false
hidden: false
metadata:
  title: ''
  description: ''
  robots: index
next:
  description: ''
---
![](https://files.readme.io/45172cf-image.png)

In this guide, you will learn how to integrate the Botpress chat widget into your React Native application. We will be using two primary components: `BpWidget` and `BpIncomingMessagesListener`.

# Cloning the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/botpress/react-native-example.git
cd react-native-example
```

# Installation

Before we get started, make sure to install the necessary dependencies:

```bash
npm i
```

# Running the Application

To run your application in development mode:

```bash
npm run start
```

# BpWidget

This component is responsible for rendering the Botpress chat widget in your application. It takes a `botConfig` prop, which is an object containing the configuration for your bot. The `botConfig` object should include the following properties:

* `botId`: The ID of your bot.
* `hostUrl`: The URL where your bot is hosted.
* `messagingUrl`: The URL for your bot's messaging service.
* `clientId`: The client ID for your bot.

The `BpWidget` component also takes a `onMessage` prop, which is a function that will be called whenever a message is received from the bot.

**Props**:

* `botConfig` (Object): Configuration for your bot.
  * `botId` (String): The ID of your bot.
  * `hostUrl` (String): The URL where your bot is hosted.
  * `messagingUrl` (String): The URL for your bot's messaging service.
  * `clientId` (String): The client ID for your bot.
* `onMessage` (Function): Callback function for when a message is received from the bot.

# BpIncomingMessagesListener

This component listens for incoming messages from the bot and can be used from anywhere in the bot, while hidden away. It takes the same `botConfig` prop as the `BpWidget` component, as well as an `onMessage` prop. The `onMessage` function will be called whenever a message is received from the bot.

**Props**:

* `botConfig` (Object): Same configuration object as `BpWidget`.
* `onMessage` (Function): Callback function for when a message is received from the bot.

# Usage

In your application, you can use these components as follows:

```jsx
import BpWidget from './src/BpWidget'
import BpIncommingMessagesListener from './src/BpIncommingMessagesListener'

const botConfig = {
  botId: 'your-bot-id',
  hostUrl: 'https://your-bot-host-url',
  messagingUrl: 'https://your-bot-messaging-url',
  clientId: 'your-bot-client-id',
}

function App() {
  return (
    <View>
      <BpIncommingMessagesListener
        botConfig={botConfig}
        onMessage={(message) => console.log('Received message:', message)}
      />
      <BpWidget botConfig={botConfig} onMessage={(message) => console.log('Received message:', message)} />
    </View>
  )
}
```

# Interacting with the Bot

The `BpWidget` component exposes three methods that you can use to interact with the bot:

* `sendEvent(event)`: Sends an event to the bot. The `event` parameter should be an object containing the event data.
* `sendPayload(payload)`: Sends a payload to the bot. The `payload` parameter should be an object containing the payload data.
* `mergeConfig(config)`: Merges the given `config` object with the current bot configuration.

You can call these methods using a ref to the `BpWidget` component:

```jsx
const bpWidgetRef = useRef();

// ...

<BpWidget ref={bpWidgetRef} ... />

// ...

bpWidgetRef.current.sendEvent({ type: 'toggle' });
bpWidgetRef.current.sendPayload({ type: 'text', text: 'Hello, bot!' });
bpWidgetRef.current.mergeConfig({ botName: 'New Bot Name' });
```

# Adaptability to Other Native Technologies

While this guide specifically details integration with React Native, the principles and methods can be adapted for other popular native technologies such as Flutter, Cordova, Kotlin, and others. Depending on the specifics of the platform, you might need to make adjustments, but the overall approach remains similar.
