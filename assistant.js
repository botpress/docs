// Bot panel
;(function () {
  'use strict'

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBotPanel)
  } else {
    initBotPanel()
  }

  function initBotPanel() {
    const panel = document.createElement('div')
    panel.id = 'bot-panel'
    // Restore the panel's open state across same-tab navigations triggered
    // by link clicks inside the bot iframe. If the previous page set the
    // flag before unloading, start expanded; otherwise default to collapsed.
    let restoredOpen = false
    try {
      restoredOpen = sessionStorage.getItem('bot-panel-open') === '1'
      if (restoredOpen) sessionStorage.removeItem('bot-panel-open')
    } catch (e) {}
    panel.classList.add('bot-panel', restoredOpen ? 'bot-panel-expanded' : 'bot-panel-collapsed')

    const toggleButton = document.createElement('button')
    toggleButton.id = 'bot-toggle'
    toggleButton.classList.add('bot-toggle')
    toggleButton.setAttribute('aria-label', 'Open bot')
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-open-icon lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
    `

    const toggleCloseButton = document.createElement('button')
    toggleCloseButton.id = 'bot-toggle-close'
    toggleCloseButton.classList.add('bot-toggle-close')
    toggleCloseButton.setAttribute('aria-label', 'Close bot')
    toggleCloseButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-close-icon lucide-panel-right-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
    `

    const resizeHandle = document.createElement('div')
    resizeHandle.classList.add('bot-resize-handle')
    resizeHandle.setAttribute('aria-label', 'Resize panel')

    const mobileDismiss = document.createElement('div')
    mobileDismiss.classList.add('bot-mobile-dismiss')
    mobileDismiss.setAttribute('aria-label', 'Swipe down to close')
    mobileDismiss.innerHTML = `
      <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="2" width="36" height="4" rx="2" fill="currentColor"/>
      </svg>
    `

    const overlay = document.createElement('div')
    overlay.classList.add('bot-overlay')
    overlay.setAttribute('aria-label', 'Close panel')

    const botContainer = document.createElement('div')
    botContainer.id = 'docs-bot'
    botContainer.classList.add('bot-iframe-container')

    // A single docs assistant (marg) covers everything under botpress.com/docs.
    const MARG_BOT_URL = 'https://botpress.github.io/docs-bot/marg-frontend/'

    const iframe = document.createElement('iframe')
    iframe.title = 'Botpress'
    iframe.style.width = '100%'
    iframe.style.height = '100%'
    iframe.style.position = 'absolute'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.allow = 'clipboard-write'
    iframe.src = MARG_BOT_URL

    // "ready" means the React app inside the iframe has mounted and rendered its
    // first frame. We detect this via the `requestTheme` postMessage the frontend
    // sends from a useEffect on mount — the `load` event fires too early (HTML
    // loaded but React not yet mounted), so using it directly causes a flash.
    let ready = false

    function markReady() {
      ready = true
      showActiveIframe()
    }

    // Fallback: if the iframe never sends requestTheme, mark ready 600ms after
    // the HTML load event so the panel isn't stuck hidden forever.
    iframe.addEventListener('load', () => {
      setTimeout(() => { if (!ready) markReady() }, 600)
    })

    function showActiveIframe() {
      if (ready) {
        iframe.style.zIndex = '2'
        iframe.style.pointerEvents = 'auto'
      }
    }

    // Kept as a function so downstream message senders need no changes.
    function getActiveIframe() {
      return iframe
    }

    iframe.style.zIndex = '1'
    iframe.style.pointerEvents = 'none'

    botContainer.style.position = 'relative'
    botContainer.appendChild(iframe)
    showActiveIframe()

    panel.appendChild(mobileDismiss)
    resizeHandle.appendChild(toggleCloseButton)
    // The iframe header now provides the collapse control, so hide this edge
    // toggle to avoid two "hide" buttons. The drag-to-resize handle remains.
    toggleCloseButton.style.display = 'none'
    panel.appendChild(botContainer)
    panel.appendChild(resizeHandle)

    document.body.appendChild(overlay)
    document.body.appendChild(panel)
    document.body.appendChild(toggleButton)

    if (restoredOpen) {
      toggleButton.classList.add('bot-toggle-expanded')
    }

    function isMobile() {
      return window.innerWidth <= 1024
    }

    function updateOverlay() {
      if (!isMobile()) {
        overlay.classList.remove('visible')
        return
      }

      const isExpanded = panel.classList.contains('bot-panel-expanded')
      if (isExpanded) {
        overlay.classList.add('visible')
      } else {
        overlay.classList.remove('visible')
      }
    }

    function focusComposerInput() {
      const iframe = getActiveIframe()
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'focusInput',
          },
          '*'
        )
      }
    }

    function sendPanelOpenedMessage() {
      const iframe = getActiveIframe()
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'panelOpened',
            data: {
              path: window.location.pathname,
              title: document.title.replace(' - Botpress', ''),
            },
          },
          '*'
        )
      }
    }

    window.focusComposerInput = focusComposerInput

    window.askAi = function () {
      if (panel.classList.contains('bot-panel-collapsed')) {
        panel.classList.remove('bot-panel-collapsed')
        panel.classList.add('bot-panel-expanded')
        toggleButton.classList.add('bot-toggle-expanded')
        sendPanelOpenedMessage()
        focusComposerInput()
        updateOverlay()
      }
    }

    function togglePanel() {
      const isCollapsed = panel.classList.contains('bot-panel-collapsed')

      if (isCollapsed) {
        panel.classList.remove('bot-panel-collapsed')
        panel.classList.add('bot-panel-expanded')
        toggleButton.classList.add('bot-toggle-expanded')
        sendPanelOpenedMessage()
        focusComposerInput()
      } else {
        panel.classList.remove('bot-panel-expanded')
        panel.classList.add('bot-panel-collapsed')
        toggleButton.classList.remove('bot-toggle-expanded')
      }
      updateOverlay()
    }

    function closePanel() {
      panel.classList.remove('bot-panel-expanded')
      panel.classList.add('bot-panel-collapsed')
      panel.classList.remove('swiping')
      panel.style.transform = ''
      toggleButton.classList.remove('bot-toggle-expanded')
      updateOverlay()
    }

    // Maximize/restore the panel width (driven by the iframe's expand button).
    // Remembers the prior inline width so "restore" returns to the CSS default
    // or a drag-resized width. Persisted so it survives in-docs navigation.
    let widePrevWidth = ''
    let isWide = false
    function setWide(wide) {
      if (wide === isWide) return
      if (wide) {
        widePrevWidth = panel.style.width
        const target = Math.round(Math.min(window.innerWidth * 0.6, 820))
        panel.style.width = target + 'px'
      } else {
        panel.style.width = widePrevWidth
      }
      isWide = wide
      try { sessionStorage.setItem('bot-panel-wide', wide ? '1' : '0') } catch (e) {}
    }
    function toggleWidth() {
      setWide(!isWide)
    }

    let isResizing = false
    let startX = 0
    let startWidth = 0
    let hasMoved = false
    const clickThreshold = 5

    resizeHandle.addEventListener('mousedown', (e) => {
      if (e.target.closest('#bot-toggle-close')) {
        return
      }
      // Drag-to-resize is intentionally disabled: the panel uses fixed widths
      // (default + the expand button). We still track press/move here only so a
      // plain click on the edge can toggle the panel, while a drag is ignored.
      isResizing = true
      hasMoved = false
      startX = e.clientX
      e.preventDefault()
      e.stopPropagation()
    })

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return

      const moveDistance = Math.abs(e.clientX - startX)
      if (moveDistance > clickThreshold) {
        hasMoved = true
      }
      // No width mutation — resizing the panel by dragging is disabled.

      e.preventDefault()
      e.stopPropagation()
    })

    document.addEventListener('mouseup', (e) => {
      if (isResizing) {
        isResizing = false
        hasMoved = false
        e.preventDefault()
        e.stopPropagation()
      }
    })

    let touchStartY = 0
    let touchCurrentY = 0
    let touchStartTime = 0
    let isSwiping = false
    const swipeThreshold = 100
    const swipeVelocityThreshold = 0.3

    function handleTouchStart(e) {
      if (window.innerWidth > 1024) return
      if (!panel.classList.contains('bot-panel-expanded')) return

      touchStartY = e.touches[0].clientY
      touchStartTime = Date.now()
      isSwiping = true
      panel.classList.add('swiping')
    }

    function handleTouchMove(e) {
      if (!isSwiping || window.innerWidth > 1024) return
      if (!panel.classList.contains('bot-panel-expanded')) return

      touchCurrentY = e.touches[0].clientY
      const deltaY = touchCurrentY - touchStartY

      if (deltaY > 0) {
        e.preventDefault()
        const translateY = Math.min(deltaY, window.innerHeight)
        panel.style.transform = `translateX(0) translateY(${translateY}px)`
      }
    }

    function handleTouchEnd(e) {
      if (!isSwiping || window.innerWidth > 1024) return
      if (!panel.classList.contains('bot-panel-expanded')) return

      const deltaY = touchCurrentY - touchStartY
      const timeDelta = Date.now() - touchStartTime
      const velocity = timeDelta > 0 ? deltaY / timeDelta : 0

      if (deltaY > swipeThreshold || velocity > swipeVelocityThreshold) {
        closePanel()
      } else {
        panel.style.transform = ''
      }

      panel.classList.remove('swiping')
      isSwiping = false
      touchStartY = 0
      touchCurrentY = 0
      touchStartTime = 0
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: false })
    panel.addEventListener('touchmove', handleTouchMove, { passive: false })
    panel.addEventListener('touchend', handleTouchEnd, { passive: false })
    panel.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    toggleButton.addEventListener('click', togglePanel)
    toggleCloseButton.addEventListener('click', (e) => {
      e.stopPropagation()
      closePanel()
    })
    mobileDismiss.addEventListener('click', closePanel)
    overlay.addEventListener('click', (e) => {
      if (isMobile() && panel.classList.contains('bot-panel-expanded')) {
        closePanel()
      }
    })

    function handleKeyboardShortcut(e) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modifierKey = isMac ? e.metaKey : e.ctrlKey

      if (e.key === 'Escape') {
        const isExpanded = panel.classList.contains('bot-panel-expanded')
        if (isExpanded) {
          e.preventDefault()
          closePanel()
        }
      }

      if (modifierKey && e.key === 'i' && !e.shiftKey && !e.altKey) {
        e.preventDefault()
        const isCollapsed = panel.classList.contains('bot-panel-collapsed')
        if (isCollapsed) {
          togglePanel()
        } else {
          closePanel()
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcut)

    window.addEventListener('message', (event) => {
      if (event.data.type === 'togglePanel') {
        const isCollapsed = panel.classList.contains('bot-panel-collapsed')
        if (isCollapsed) {
          togglePanel()
        } else {
          closePanel()
        }
      }

      if (event.data.type === 'closePanel') {
        closePanel()
      }

      if (event.data.type === 'toggleWidth') {
        toggleWidth()
      }

      if (event.data.type === 'requestCurrentPage') {
        sendPanelOpenedMessage()
      }

      // Bot links route through the parent so in-docs URLs navigate same-tab
      // (keeping the panel open via sessionStorage) and external URLs open
      // in a new tab. URLs are normalized against the current origin.
      if (event.data.type === 'navigate' && typeof event.data.url === 'string') {
        try {
          const target = new URL(event.data.url, window.location.href)
          // Treat any link that points at the docs (this site or
          // botpress.com/docs) as in-docs navigation so the panel can be
          // restored on the next page. Everything else opens externally.
          const isSameOrigin = target.origin === window.location.origin
          const isBotpressDocs =
            /(^|\.)botpress\.com$/.test(target.hostname) && target.pathname.startsWith('/docs')
          if (isSameOrigin || isBotpressDocs) {
            try {
              sessionStorage.setItem('bot-panel-open', '1')
            } catch (e) {}
            // When we're on a different host (e.g., localhost during dev
            // and the link points at production), navigate to the absolute
            // URL — the panel state lives in sessionStorage of *that* host.
            window.location.href = target.href
          } else {
            window.open(target.href, '_blank', 'noopener,noreferrer')
          }
        } catch (e) {
          window.open(event.data.url, '_blank', 'noopener,noreferrer')
        }
      }

      // The agent-0 frontend asks for the current docs theme on mount, then
      // listens for `themeChanged` messages we send when the user toggles
      // light/dark. Mintlify sets `class="dark"` on <html> in dark mode.
      if (event.data.type === 'requestTheme') {
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        // The iframe's React app just mounted — mark it as visually ready so we
        // can show it without a blank-white flash.
        if (event.source === iframe.contentWindow && !ready) markReady()
        // Respond with the current theme to whichever iframe asked.
        if (event.source && typeof event.source.postMessage === 'function') {
          try { event.source.postMessage({ type: 'themeChanged', theme }, '*') } catch (_e) {}
        }
      }
    })

    // Watch for docs theme toggles and forward to the iframe so it stays in sync.
    const themeObserver = new MutationObserver(() => {
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      if (iframe.contentWindow) iframe.contentWindow.postMessage({ type: 'themeChanged', theme }, '*')
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    function handleHashChange() {
      if (window.location.hash === '#ask') {
        if (panel.classList.contains('bot-panel-collapsed')) {
          panel.classList.remove('bot-panel-collapsed')
          panel.classList.add('bot-panel-expanded')
          toggleButton.classList.add('bot-toggle-expanded')
          sendPanelOpenedMessage()
          focusComposerInput()
          updateOverlay()
        }
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    updateOverlay()

    // Card/button link clicks trigger Mintlify's page transition animation which
    // causes the iframe to flash. Sidebar links don't trigger this. Hide the
    // panel for the duration of the transition to prevent the flash.
    let hideTimer = null
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return
      if (panel.classList.contains('bot-panel-expanded')) return
      if (hideTimer) clearTimeout(hideTimer)
      panel.style.visibility = 'hidden'
      toggleButton.style.visibility = 'hidden'
      hideTimer = setTimeout(() => {
        panel.style.visibility = ''
        toggleButton.style.visibility = ''
        hideTimer = null
      }, 400)
    }, true)

    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        updateOverlay()
        const currentWidth = parseInt(window.getComputedStyle(panel).width, 10)
        const maxWidth = window.innerWidth * 0.38
        if (currentWidth > maxWidth) {
          panel.style.width = maxWidth + 'px'
        }
      }, 100)
    })

    const panelObserver = new MutationObserver(() => {
      updateOverlay()
    })

    panelObserver.observe(panel, {
      attributes: true,
      attributeFilter: ['class'],
    })

    let lastPath = window.location.pathname
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname

        // Always tell the bot the page changed so it can refresh its page
        // context, even when the panel is collapsed (it routes on the page URL).
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: 'pageChanged',
              data: {
                path: window.location.pathname,
                title: document.title.replace(' - Botpress', ''),
              },
            },
            '*'
          )
        }
      }
    }

    setInterval(checkPathChange, 100)
    window.addEventListener('popstate', () => {
      setTimeout(checkPathChange, 10)
    })
  }
})()

// Input bubble
;(function () {
  'use strict'

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInputBubble)
  } else {
    initInputBubble()
  }

  function initInputBubble() {
    const inputBubble = document.createElement('div')
    inputBubble.id = 'ask-ai-input-bubble'
    inputBubble.classList.add('ask-ai-input-bubble')

    const wrapper = document.createElement('div')
    wrapper.classList.add('ask-ai-input-wrapper')

    const input = document.createElement('input')
    input.type = 'text'
    input.placeholder = 'Ask a question...'
    input.classList.add('ask-ai-input')
    input.setAttribute('aria-label', 'Ask a question...')

    const shortcutIndicator = document.createElement('span')
    shortcutIndicator.classList.add('ask-ai-shortcut')
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    shortcutIndicator.textContent = isMac ? '⌘I' : 'Ctrl+I'

    const sendButton = document.createElement('button')
    sendButton.classList.add('ask-ai-send-button')
    sendButton.setAttribute('aria-label', 'Send message')
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 12 7-7 7 7"></path>
        <path d="M12 19V5"></path>
      </svg>
    `

    wrapper.appendChild(input)
    wrapper.appendChild(shortcutIndicator)
    wrapper.appendChild(sendButton)
    inputBubble.appendChild(wrapper)
    document.body.appendChild(inputBubble)

    inputBubble.classList.add('ask-ai-input-bubble-hidden')

    function isLandingPage() {
      const path = window.location.pathname
      return path === '/' || path === '/docs' || path === '/index' || path.endsWith('/index.html')
    }

    function isMobile() {
      return window.innerWidth <= 1024
    }

    function handleEnterKey(e) {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
        e.preventDefault()
        if (input.value.trim()) {
          handleAskAI()
        }
      }
    }

    function handleMobileInputClick(e) {
      if (isMobile()) {
        e.preventDefault()
        e.stopPropagation()
        const panel = document.getElementById('bot-panel')
        const toggleButton = document.getElementById('bot-toggle')

        if (panel && panel.classList.contains('bot-panel-collapsed')) {
          panel.classList.remove('bot-panel-collapsed')
          panel.classList.add('bot-panel-expanded')
          if (toggleButton) {
            toggleButton.classList.add('bot-toggle-expanded')
          }
          const iframe = getActiveIframe()
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: 'panelOpened',
                data: {
                  path: window.location.pathname,
                  title: document.title.replace(' - Botpress', ''),
                },
              },
              '*'
            )
          }
          if (window.focusComposerInput) {
            window.focusComposerInput()
          }
        }
      }
    }

    function setupInputBehavior() {
      if (isMobile()) {
        input.readOnly = true
        input.removeEventListener('keydown', handleEnterKey)
        input.addEventListener('click', handleMobileInputClick, { once: false })
        wrapper.addEventListener('click', handleMobileInputClick, { once: false })
      } else {
        input.readOnly = false
        input.removeEventListener('click', handleMobileInputClick)
        wrapper.removeEventListener('click', handleMobileInputClick)
        input.addEventListener('keydown', handleEnterKey)
      }
    }

    setupInputBehavior()

    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setupInputBehavior()
      }, 100)
    })

    function updateVisibility() {
      if (isLandingPage()) {
        inputBubble.style.display = 'none'
        return
      }

      const panel = document.getElementById('bot-panel')
      if (panel) {
        const isExpanded = panel.classList.contains('bot-panel-expanded')
        if (isExpanded) {
          inputBubble.classList.add('ask-ai-input-bubble-hidden')
        } else {
          inputBubble.style.display = ''
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              inputBubble.classList.remove('ask-ai-input-bubble-hidden')
            })
          })
        }
      } else {
        inputBubble.style.display = ''
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inputBubble.classList.remove('ask-ai-input-bubble-hidden')
          })
        })
      }
    }

    let lastPath = window.location.pathname
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname
        updateVisibility()
      }
    }

    setInterval(checkPathChange, 100)
    window.addEventListener('popstate', updateVisibility)

    const panel = document.getElementById('bot-panel')
    if (panel) {
      const observer = new MutationObserver(() => {
        updateVisibility()
      })

      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['class'],
      })

      updateVisibility()
    } else {
      const checkInterval = setInterval(() => {
        const panel = document.getElementById('bot-panel')
        if (panel) {
          const observer = new MutationObserver(() => {
            updateVisibility()
          })

          observer.observe(panel, {
            attributes: true,
            attributeFilter: ['class'],
          })

          updateVisibility()
          clearInterval(checkInterval)
        }
      }, 100)
    }

    function updateSendButton() {
      const hasValue = input.value.trim().length > 0
      sendButton.disabled = !hasValue
    }

    input.addEventListener('input', updateSendButton)
    updateSendButton()

    function handleAskAI() {
      const message = input.value.trim()
      if (!message) return

      const panel = document.getElementById('bot-panel')
      const toggleButton = document.getElementById('bot-toggle')

      if (panel && !panel.classList.contains('bot-panel-expanded')) {
        panel.classList.remove('bot-panel-collapsed')
        panel.classList.add('bot-panel-expanded')
        if (toggleButton) {
          toggleButton.classList.add('bot-toggle-expanded')
        }
      }

      const iframe = getActiveIframe()
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            type: 'panelOpened',
            data: {
              path: window.location.pathname,
              title: document.title.replace(' - Botpress', ''),
            },
          },
          '*'
        )

        iframe.contentWindow.postMessage(
          {
            type: 'sendMessage',
            message: message,
          },
          '*'
        )
      }

      input.value = ''
      updateSendButton()
      input.blur()
    }

    sendButton.addEventListener('click', (e) => {
      e.preventDefault()
      if (!sendButton.disabled) {
        handleAskAI()
      }
    })
  }
})()

// "Ask AI" button override
;(function () {
  'use strict'

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAskAIOverride)
  } else {
    initAskAIOverride()
  }

  function initAskAIOverride() {
    const overriddenButtons = new WeakSet()

    function findAndOverrideButton() {
      const button = document.getElementById('page-context-menu-button')

      if (button && button.innerText.trim() === 'Ask AI' && !overriddenButtons.has(button)) {
        button.addEventListener(
          'click',
          (e) => {
            e.preventDefault()
            e.stopPropagation()

            const panel = document.getElementById('bot-panel')
            const toggleButton = document.getElementById('bot-toggle')

            if (panel && !panel.classList.contains('bot-panel-expanded')) {
              panel.classList.remove('bot-panel-collapsed')
              panel.classList.add('bot-panel-expanded')
              if (toggleButton) {
                toggleButton.classList.add('bot-toggle-expanded')
              }
            }

            const iframe = getActiveIframe()
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage(
                {
                  type: 'panelOpened',
                  data: {
                    path: window.location.pathname,
                    title: document.title.replace(' - Botpress', ''),
                  },
                },
                '*'
              )

              iframe.contentWindow.postMessage(
                {
                  type: 'askAI',
                  data: {
                    path: window.location.pathname,
                    title: document.title.replace(' - Botpress', ''),
                  },
                },
                '*'
              )

              iframe.contentWindow.postMessage(
                {
                  type: 'focusInput',
                },
                '*'
              )
            }
          },
          true
        )

        overriddenButtons.add(button)
        return true
      }
      return false
    }

    findAndOverrideButton()

    const observer = new MutationObserver(() => {
      findAndOverrideButton()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }
})()
