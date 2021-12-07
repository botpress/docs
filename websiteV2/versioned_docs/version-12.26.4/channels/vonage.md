---
id: vonage
title: Vonage
original_id: vonage
---
&gt; **⭐ Note**: Currently, only WhatsApp is supported on this channel.

### Prerequisite

-   An HTTPS Endpoint to your bot

    -   Set the externalUrl field in botpress.config.json
    -   Create an HTTPS tunnel to your machine using Ngrok. Tutorial
    -   Using Nginx and Let's Encrypt. Tutorial

-   [Create a Vonage Account](https://dashboard.nexmo.com/sign-up)

-   [Create a Vonage Application](https://dashboard.nexmo.com/applications/new)
    -   Give it a name
    -   Under _Authentication_, click _Generate public and private key_ (this will download a file called `private.key`. You will need this file later on.)
    -   Click _Generate new application_

### Steps

#### Get your API credentials

1.  Go to your [Account Settings](https://dashboard.nexmo.com/settings)
2.  Scroll down and copy your API key, API secret and Signature secret from the LIVE credentials section
3.  Go to your applications and select your newly created application (https:)
4.  Copy the Application ID

#### Configure your bot

1.  Edit ``. In the `` section write this configuration :

-   ``: Set to true
-   ``: Paste your API key.
-   ``: Paste your API Secret.
-   ``: Paste your Signature secret.
-   ``: Paste your Application ID.
-   ``: Paste the content of the `` file that was generated when you created your Vonage Application.
    -   Paste the full key value, including the `` and  `` lines.
    -   Replace all line breaks with the newline character ``.
-   ``: Set to `` if you want to use the _Sandbox_ instead of the _Live_ version of Vonage API (see [Setup a Messages Sandbox](#Setup%20a%20Messages%20Sandbox)).

    Your `` should look like this :

```json



```

2.  Restart Botpress
3.  You should see your webhook endpoint in the console on startup

#### Setup a Messages Sandbox

When wanting to test the integration with Vonage and WhatsApp, you need to enable a Sandbox where you can send test messages.

1.  In the left end side menu of [Vonage Dashboard](https://dashboard.nexmo.com/) select _Messages and Dispatch (beta)_ -&gt; _Sandbox_
2.  Click on the channel you want to setup and follow the instructions detailed on the page.
3.  Under ``, type the following URLs:

    _Inbound:_ ``

    _Status:_ ``

## File Reception

Vonage currently supports receiving `` , ``, ``, `` , and ``. **Please, keep in mind that the links coming from the Vonage API are only valid for 10 minutes**. An action (Storage - Store File Locally) is available in order to store the file locally.
