// Inject the Botpress Webchat script
const webchatScript = document.createElement('script')
webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js'
webchatScript.async = true
webchatScript.defer = true

function loadWebchat() {
  window.botpress.init({
    "botId": "e3098b37-2e06-4351-859c-d79e06f39ca8",
    "configuration": {
      "version": "v2",
      "composerPlaceholder": "Ask a question...",
      "botName": "Assistant",
      "botAvatar": "https://files.bpcontent.cloud/2025/11/19/21/20251119215003-XFGOK7KD.png",
      "botDescription": "Ask AI a question about the documentation. Powered by Botpress.",
      "privacyPolicy": {},
      "color": "#0588F0",
      "variant": "solid",
      "headerVariant": "glass",
      "themeMode": "light",
      "fontFamily": "Inter",
      "radius": 1.5,
      "feedbackEnabled": true,
      "footer": "[âš¡ by Botpress](https://botpress.com/?from=webchat)",
      "additionalStylesheetUrl": "https://files.bpcontent.cloud/2025/06/13/14/20250613145950-XC43YPI7.css",
      "allowFileUpload": true,
      "soundEnabled": false,
      "toggleChatId": "docs-bot",
      "embeddedChatId": "docs-bot",
      "proactiveMessageEnabled": false,
    },
    "clientId": "44246de9-1d1b-462c-8ef3-1ce39e65d89a"
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