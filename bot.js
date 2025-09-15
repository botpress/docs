// Inject the Botpress Webchat script
const webchatScript = document.createElement('script')
webchatScript.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js'
webchatScript.async = true
webchatScript.defer = true

function loadWebchat() {
  window.botpress.init({
      botId: 'e3098b37-2e06-4351-859c-d79e06f39ca8',
      configuration: {
        version: 'v1',
        composerPlaceholder: 'Ask a question...',
        botName: 'Assistant',
        botAvatar: 'https://files.bpcontent.cloud/2025/06/16/20/20250616204038-BRUW6C2R.svg',
        botDescription: 'Ask AI a question about the documentation.',
        website: {},
        email: {
          title: '',
          link: '',
        },
        phone: {},
        termsOfService: {
          title: 'Terms of service',
          link: 'google.com',
        },
        privacyPolicy: {},
        color: '#0588F0',
        variant: 'solid',
        headerVariant: 'glass',
        themeMode: 'light',
        fontFamily: 'inter',
        radius: 3,
        feedbackEnabled: true,
        footer: '[⚡️ by Botpress](https://botpress.com/?from=webchat)',
        additionalStylesheetUrl: 'https://files.bpcontent.cloud/2025/06/13/14/20250613145950-XC43YPI7.css',
        allowFileUpload: true,
      },
      clientId: '44246de9-1d1b-462c-8ef3-1ce39e65d89a',
  })
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
    window.botpress.open()
  }
}

webchatScript.onload = () => {
  if (window.botpress && typeof window.botpress.init === 'function') {
    loadWebchat()
  } else {
    console.error('Botpress init not available')
  }
}

document.body.appendChild(webchatScript)