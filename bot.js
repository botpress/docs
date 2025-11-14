// Inject the Botpress Webchat script
const webchatScript = document.createElement('script')
webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js'
webchatScript.async = true
webchatScript.defer = true

function loadWebchat() {
  window.botpress.init({
    "botId": "3448a722-1716-4b50-b82a-769ec4f2154b",
    "configuration": {
      "version": "v2",
      "botName": "Assistant",
      "botAvatar": "https://files.bpcontent.cloud/2025/06/16/20/20250616204038-BRUW6C2R.svg",
      "botDescription": "Ask AI a question about the documentation.",
      "composerPlaceholder": "Ask a question...",
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
      "feedbackEnabled": false,
      "footer": "[⚡️ by Botpress](https://botpress.com/?from=webchat)",
      "additionalStylesheetUrl": "https://files.bpcontent.cloud/2025/11/14/20/20251114205601-4UXE6WYZ.css",
      "soundEnabled": false,
      "embeddedChatId": "docs-bot",
      "proactiveMessageEnabled": false,
      "proactiveBubbleMessage": "Hi! ðŸ‘‹ Need help?",
      "proactiveBubbleTriggerType": "afterDelay",
      "proactiveBubbleDelayTime": 10
    },
    "clientId": "ea22a9a4-2216-48e6-941a-51b66ebfdf1d"
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
  const panel = document.getElementById('chatbot-panel');
  const toggleButton = document.getElementById('chatbot-toggle');
  
  if (panel) {
    if (!panel.classList.contains('chatbot-panel-expanded')) {
      panel.classList.remove('chatbot-panel-collapsed');
      panel.classList.add('chatbot-panel-expanded');
      if (toggleButton) {
        toggleButton.classList.add('chatbot-toggle-expanded');
      }
      localStorage.setItem('chatbot-panel-open', 'true');
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