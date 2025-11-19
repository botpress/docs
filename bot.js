// Inject the Botpress Webchat script
const webchatScript = document.createElement('script')
webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js'
webchatScript.async = true
webchatScript.defer = true

function loadWebchat() {
  window.botpress.init({
    "botId": "001e4b2d-d9af-4324-9021-000e3dc530fe",
    "configuration": {
      "version": "v2",
      "composerPlaceholder": "Ask a question...",
      "botName": "Assistant",
      "botAvatar": "https://files.bpcontent.cloud/2025/11/19/21/20251119210301-2SLGBPIY.png",
      "botDescription": "Ask AI a question about the documentation. Powered by Botpress.",
      "website": {},
      "email": {},
      "phone": {},
      "termsOfService": {},
      "privacyPolicy": {},
      "color": "#0588f0",
      "variant": "solid",
      "headerVariant": "glass",
      "themeMode": "light",
      "fontFamily": "inter",
      "radius": 1.5,
      "feedbackEnabled": true,
      "footer": "[âš¡ by Botpress](https://botpress.com/?from=webchat)",
      "additionalStylesheetUrl": "https://files.bpcontent.cloud/2025/11/19/21/20251119210232-LISUTXUC.css",
      "allowFileUpload": true,
      "soundEnabled": false,
      "toggleChatId": "docs-bot",
      "embeddedChatId": "docs-bot",
      "proactiveMessageEnabled": false,
      "proactiveBubbleMessage": "Hi! ðŸ‘‹ Need help?",
      "proactiveBubbleTriggerType": "afterDelay",
      "proactiveBubbleDelayTime": 10
    },
    "clientId": "a1a38604-d5c7-4f5b-a644-0c9347acd585"
  });
  // Hash handling for #ask - opens custom pane
  url = new URL(window.location.href)
  if (url.hash === "#ask") {
    openChatPanel()
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#ask") {
      openChatPanel()
    }
  })
};

function openChatPanel() {
  const panel = document.getElementById('bot-panel');
  const toggleButton = document.getElementById('bot-toggle');
  
  if (panel) {
    if (!panel.classList.contains('bot-panel-expanded')) {
      panel.classList.remove('bot-panel-collapsed');
      panel.classList.add('bot-panel-expanded');
      if (toggleButton) {
        toggleButton.classList.add('bot-toggle-expanded');
      }
      localStorage.setItem('bot-panel-open', 'true');
    }
  } else {
    // Panel not created yet, wait a bit and try again
    setTimeout(() => {
      openChatPanel();
    }, 100);
  }
}

function askAi() {
  openChatPanel()
}

webchatScript.onload = () => {
  if (window.botpress && typeof window.botpress.init === 'function') {
    loadWebchat()
  } else {
    console.error('Botpress init not available')
  }
}

document.body.appendChild(webchatScript)