---
title: Quickstart
excerpt: >-
  This guide assumes you have a basic understanding of React and have already
  set up a React project.
deprecated: false
hidden: true
metadata:
  title: ''
  description: >-
    Install the Botpress Webchat package using npm, pnpm, or yarn, and obtain
    your bot's Client ID from the Botpress Workspace to integrate the Webchat
    into your React application.
  keywords:
    - webchat react botpress
  robots: index
next:
  description: ''
---
## Install the packages

To integrate Botpress Webchat, you'll need to install the necessary packages from the npm public registry.

```javascript npm
npm install @botpress/webchat @botpress/webchat-generator
```
```javascript pnpm
pnpm add @botpress/webchat @botpress/webchat-generator
```
```javascript yarn
yarn add @botpress/webchat @botpress/webchat-generator
```

## Obtain the Client ID

To integrate Botpress Webchat into your application, you need to obtain your bot's Client ID, which uniquely identifies your bot and enables communication with the Webchat service. Follow these steps to retrieve it:

1. Open Your Bot in Botpress Workspace
2. Navigate to the Webchat Tab
3. Access Advanced Settings
4. Copy the Client ID

<Image align="center" src="https://files.readme.io/c4b8059-Screenshot_2024-08-15_at_9.05.51_AM.png" />

## Add the code

Here’s a basic implementation example to get you started:

```jsx App.tsx
import { Webchat, WebchatProvider, Fab, getClient } from "@botpress/webchat";
import { buildTheme } from "@botpress/webchat-generator";
import { useState } from "react";

const { theme, style } = buildTheme({
  themeName: "prism",
  themeColor: "#634433",
});

//Add your Client ID here ⬇️
const clientId = "YOUR_CLIENT_ID";

export default function App() {
  const client = getClient({ clientId });
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <style>{style}</style>
      <WebchatProvider
        theme={theme}
        client={client}
      >
        <Fab onClick={toggleWebchat} />
        <div
          style={{
            display: isWebchatOpen ? "block" : "none",
          }}
        >
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}
```

## Optional: Configuration

You can enhance your Webchat experience by incorporating additional configuration options. Here's an example:

```jsx App.tsx
// ...

const config = {
  composerPlaceholder: "What would you like to know?",
  botName: "Customer service",
  botAvatar: "https://picsum.photos/200/300",
  botDescription:
    "Hi! 👋  Welcome to webchat this is some description talking about what it is. This might be a bit longer when expanded.",
  email: {
    title: "randomEmail@boptress.com",
    link: "mailto:randomEmail@boptress.com",
  },
  phone: {
    title: "555-555-5555",
    link: "tel:555-555-5555",
  },
  website: {
    title: "https://botpress.com",
    link: "https://botpress.com",
  },
  termsOfService: {
    title: "Terms of service",
    link: "https://botpress.com/terms",
  },
  privacyPolicy: {
    title: "Privacy policy",
    link: "https://botpress.com/privacy",
  },
};

export default function App() {
  // ...

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <style>{style}</style>
      <WebchatProvider
        key={JSON.stringify(config)}
        theme={theme}
        //Add the configuration to the Webchat Provider
        configuration={config}
        client={client}
      >
        <Fab onClick={toggleWebchat} />
        <div
          style={{
            display: isWebchatOpen ? "block" : "none",
          }}
        >
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}
```
