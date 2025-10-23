// Inject the Botpress Webchat script
const webchatScript = document.createElement('script')
webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js'
webchatScript.async = true
webchatScript.defer = true

function loadWebchat() {
  // Find the chat assistant sheet element and prepare it
  const chatAssistantSheet = document.getElementById('chat-assistant-sheet');
  if (chatAssistantSheet) {
    // Clear all child nodes
    while (chatAssistantSheet.firstChild) {
      chatAssistantSheet.removeChild(chatAssistantSheet.firstChild);
    }
    // Make it visible
    Object.assign(chatAssistantSheet.style, {
      display: 'block',
      // padding: '15px',
      visibility: 'visible',
      position: 'relative',
      borderRadius: '0.75em'
    })
    
    // Also make its parent element visible
    const parentElement = chatAssistantSheet.parentElement;
    if (parentElement) {
      Object.assign(parentElement.style, {
        // display: 'block',
        // visibility: 'visible',
        // backgroundColor: 'transparent',
        // width: '600px',
        // maxWidth: '600px'
      })
    }

    Object.assign(chatAssistantSheet.style, {
      position: 'absolute',
    })

    // const hoverbud = document.createElement('div')
    // Object.assign(hoverbud.style, {
    //   width: '100%',
    //   height: '100%',
    //   top: '0',
    //   left: '0',
    //   right: '0',
    //   bottom: '0',
    //   position: 'absolute',
    //   backgroundColor: 'transparent',
    // })



    // chatAssistantSheet.appendChild(hoverbud)
  }

  window.botpress.init({
    "botId": "fa748728-6cae-4abe-9f0f-333d555ec70f",
    "configuration": {
      "version": "v2",
      "website": {},
      "email": {},
      "phone": {},
      "termsOfService": {},
      "privacyPolicy": {},
      "color": "#3276EA",
      "variant": "solid",
      "headerVariant": "glass",
      "themeMode": "light",
      "fontFamily": "inter",
      "radius": 2,
      "feedbackEnabled": false,
      "footer": "[⚡️ by Botpress](https://botpress.com/?from=webchat)",
      "soundEnabled": false,
      "embeddedChatId": "chat-assistant-sheet",
      "proactiveMessageEnabled": false,
      "proactiveBubbleMessage": "Hi! ðŸ‘‹ Need help?",
      "proactiveBubbleTriggerType": "afterDelay",
      "proactiveBubbleDelayTime": 10
    },
    "clientId": "ac9f89ac-d610-4fd8-a824-2f7f223bbd4c"
  });
  url = new URL(window.location.href)
  if (url.hash === "#ask" ) window.botpress.open()

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#ask") {
      window.botpress.open()
    }
  })
};

function askAi() {
  if (window.botpress) {
    window.botpress.close()
  }
}

webchatScript.onload = () => {
  if (window.botpress && typeof window.botpress.init === 'function') {
    loadWebchat()
  } else {
    console.error('Botpress init not available')
  }
}

// document.body.appendChild(webchatScript)