// Bot panel
(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBotPanel);
  } else {
    initBotPanel();
  }

  function initBotPanel() {
    const panel = document.createElement('div');
    panel.id = 'bot-panel';
    panel.classList.add('bot-panel', 'bot-panel-collapsed');

    const toggleButton = document.createElement('button');
    toggleButton.id = 'bot-toggle';
    toggleButton.classList.add('bot-toggle');
    toggleButton.setAttribute('aria-label', 'Open bot');
    toggleButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-open-icon lucide-panel-right-open"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m10 15-3-3 3-3"/></svg>
    `;

    const toggleCloseButton = document.createElement('button');
    toggleCloseButton.id = 'bot-toggle-close';
    toggleCloseButton.classList.add('bot-toggle-close');
    toggleCloseButton.setAttribute('aria-label', 'Close bot');
    toggleCloseButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-panel-right-close-icon lucide-panel-right-close"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
    `;

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('bot-resize-handle');
    resizeHandle.setAttribute('aria-label', 'Resize panel');

    const mobileDismiss = document.createElement('div');
    mobileDismiss.classList.add('bot-mobile-dismiss');
    mobileDismiss.setAttribute('aria-label', 'Swipe down to close');
    mobileDismiss.innerHTML = `
      <svg width="36" height="20" viewBox="0 0 36 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="2" width="36" height="4" rx="2" fill="currentColor"/>
      </svg>
    `;

    const overlay = document.createElement('div');
    overlay.classList.add('bot-overlay');
    overlay.setAttribute('aria-label', 'Close panel');

    const botContainer = document.createElement('div');
    botContainer.id = 'docs-bot';
    botContainer.classList.add('bot-iframe-container');
    
    const iframe = document.createElement('iframe');
    iframe.title = 'Botpress';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = 'http://192.168.1.48:5174/'; // TODO: replace with real link
    
    botContainer.appendChild(iframe);
    
    panel.appendChild(mobileDismiss);
    resizeHandle.appendChild(toggleCloseButton);
    panel.appendChild(botContainer);
    panel.appendChild(resizeHandle);

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    document.body.appendChild(toggleButton);

    function isMobile() {
      return window.innerWidth <= 1024;
    }

    function updateOverlay() {
      if (!isMobile()) {
        overlay.classList.remove('visible');
        return;
      }
      
      const isExpanded = panel.classList.contains('bot-panel-expanded');
      if (isExpanded) {
        overlay.classList.add('visible');
      } else {
        overlay.classList.remove('visible');
      }
    }

    function focusComposerInput() {
      const iframe = document.querySelector('iframe[title="Botpress"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'focusInput'
        }, '*');
      }
    }

    function sendPanelOpenedMessage() {
      const iframe = document.querySelector('iframe[title="Botpress"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'panelOpened',
          data: {
            path: window.location.pathname,
            title: document.title.replace(' - Botpress', '')
          }
        }, '*');
      }
    }

    window.focusComposerInput = focusComposerInput;

    window.askAi = function() {
      if (panel.classList.contains('bot-panel-collapsed')) {
        panel.classList.remove('bot-panel-collapsed');
        panel.classList.add('bot-panel-expanded');
        toggleButton.classList.add('bot-toggle-expanded');
        sendPanelOpenedMessage();
        focusComposerInput();
        updateOverlay();
      }
    };

    function togglePanel() {
      const isCollapsed = panel.classList.contains('bot-panel-collapsed');
      
      if (isCollapsed) {
        panel.classList.remove('bot-panel-collapsed');
        panel.classList.add('bot-panel-expanded');
        toggleButton.classList.add('bot-toggle-expanded');
        sendPanelOpenedMessage();
        focusComposerInput();
      } else {
        panel.classList.remove('bot-panel-expanded');
        panel.classList.add('bot-panel-collapsed');
        toggleButton.classList.remove('bot-toggle-expanded');
      }
      updateOverlay();
    }

    function closePanel() {
      panel.classList.remove('bot-panel-expanded');
      panel.classList.add('bot-panel-collapsed');
      panel.classList.remove('swiping');
      panel.style.transform = '';
      toggleButton.classList.remove('bot-toggle-expanded');
      updateOverlay();
    }

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    let hasMoved = false;
    const clickThreshold = 5;

    resizeHandle.addEventListener('mousedown', (e) => {
      if (e.target.closest('#bot-toggle-close')) {
        return;
      }
      isResizing = true;
      hasMoved = false;
      startX = e.clientX;
      startWidth = parseInt(window.getComputedStyle(panel).width, 10);
      panel.classList.add('resizing');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      
      const moveDistance = Math.abs(e.clientX - startX);
      if (moveDistance > clickThreshold) {
        hasMoved = true;
      }
      
      if (hasMoved) {
        const diff = startX - e.clientX;
        const maxWidth = window.innerWidth * 0.35;
        const newWidth = Math.max(368, Math.min(maxWidth, startWidth + diff));
        panel.style.width = newWidth + 'px';
      }
      
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mouseup', (e) => {
      if (isResizing) {
        isResizing = false;
        panel.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        if (!hasMoved) {
          togglePanel();
        }
        
        hasMoved = false;
        e.preventDefault();
        e.stopPropagation();
      }
    });

    let touchStartY = 0;
    let touchCurrentY = 0;
    let touchStartTime = 0;
    let isSwiping = false;
    const swipeThreshold = 100;
    const swipeVelocityThreshold = 0.3;

    function handleTouchStart(e) {
      if (window.innerWidth > 1024) return;
      if (!panel.classList.contains('bot-panel-expanded')) return;
      
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isSwiping = true;
      panel.classList.add('swiping');
    }

    function handleTouchMove(e) {
      if (!isSwiping || window.innerWidth > 1024) return;
      if (!panel.classList.contains('bot-panel-expanded')) return;

      touchCurrentY = e.touches[0].clientY;
      const deltaY = touchCurrentY - touchStartY;

      if (deltaY > 0) {
        e.preventDefault();
        const translateY = Math.min(deltaY, window.innerHeight);
        panel.style.transform = `translateX(0) translateY(${translateY}px)`;
      }
    }

    function handleTouchEnd(e) {
      if (!isSwiping || window.innerWidth > 1024) return;
      if (!panel.classList.contains('bot-panel-expanded')) return;

      const deltaY = touchCurrentY - touchStartY;
      const timeDelta = Date.now() - touchStartTime;
      const velocity = timeDelta > 0 ? deltaY / timeDelta : 0;

      if (deltaY > swipeThreshold || velocity > swipeVelocityThreshold) {
        closePanel();
      } else {
        panel.style.transform = '';
      }

      panel.classList.remove('swiping');
      isSwiping = false;
      touchStartY = 0;
      touchCurrentY = 0;
      touchStartTime = 0;
    }

    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd, { passive: false });
    panel.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    toggleButton.addEventListener('click', togglePanel);
    toggleCloseButton.addEventListener('click', (e) => {
      e.stopPropagation();
      closePanel();
    });
    mobileDismiss.addEventListener('click', closePanel);
    overlay.addEventListener('click', (e) => {
      if (isMobile() && panel.classList.contains('bot-panel-expanded')) {
        closePanel();
      }
    });

    function handleKeyboardShortcut(e) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;
      
      if (e.key === 'Escape') {
        const isExpanded = panel.classList.contains('bot-panel-expanded');
        if (isExpanded) {
          e.preventDefault();
          closePanel();
        }
      }
      
      if (modifierKey && e.key === 'i' && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const isCollapsed = panel.classList.contains('bot-panel-collapsed');
        if (isCollapsed) {
          togglePanel();
        } else {
          closePanel();
        }
      }
    }

    document.addEventListener('keydown', handleKeyboardShortcut);

    window.addEventListener('message', (event) => {
      if (event.data.type === 'togglePanel') {
        const isCollapsed = panel.classList.contains('bot-panel-collapsed');
        if (isCollapsed) {
          togglePanel();
        } else {
          closePanel();
        }
      }
      
      if (event.data.type === 'closePanel') {
        closePanel();
      }
      
      if (event.data.type === 'requestCurrentPage') {
        sendPanelOpenedMessage();
      }
    });

    function handleHashChange() {
      if (window.location.hash === '#ask') {
        if (panel.classList.contains('bot-panel-collapsed')) {
          panel.classList.remove('bot-panel-collapsed');
          panel.classList.add('bot-panel-expanded');
          toggleButton.classList.add('bot-toggle-expanded');
          sendPanelOpenedMessage();
          focusComposerInput();
          updateOverlay();
        }
      }
    }
    
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    updateOverlay();
    
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        updateOverlay();
        const currentWidth = parseInt(window.getComputedStyle(panel).width, 10);
        const maxWidth = window.innerWidth * 0.38;
        if (currentWidth > maxWidth) {
          panel.style.width = maxWidth + 'px';
        }
      }, 100);
    });
    
    const panelObserver = new MutationObserver(() => {
      updateOverlay();
    });
    
    panelObserver.observe(panel, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    let lastPath = window.location.pathname;
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        
        const isExpanded = panel.classList.contains('bot-panel-expanded');
        if (isExpanded) {
          const iframe = document.querySelector('iframe[title="Botpress"]');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'pageChanged',
              data: {
                path: window.location.pathname,
                title: document.title.replace(' - Botpress', '')
              }
            }, '*');
          }
        }
      }
    };
    
    setInterval(checkPathChange, 100);
    window.addEventListener('popstate', () => {
      setTimeout(checkPathChange, 10);
    });
  }
})();

// Input bubble
(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInputBubble);
  } else {
    initInputBubble();
  }

  function initInputBubble() {
    const inputBubble = document.createElement('div');
    inputBubble.id = 'ask-ai-input-bubble';
    inputBubble.classList.add('ask-ai-input-bubble');

    const wrapper = document.createElement('div');
    wrapper.classList.add('ask-ai-input-wrapper');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ask a question...';
    input.classList.add('ask-ai-input');
    input.setAttribute('aria-label', 'Ask a question...');

    const shortcutIndicator = document.createElement('span');
    shortcutIndicator.classList.add('ask-ai-shortcut');
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    shortcutIndicator.textContent = isMac ? '⌘I' : 'Ctrl+I';

    const sendButton = document.createElement('button');
    sendButton.classList.add('ask-ai-send-button');
    sendButton.setAttribute('aria-label', 'Send message');
    sendButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 12 7-7 7 7"></path>
        <path d="M12 19V5"></path>
      </svg>
    `;

    wrapper.appendChild(input);
    wrapper.appendChild(shortcutIndicator);
    wrapper.appendChild(sendButton);
    inputBubble.appendChild(wrapper);
    document.body.appendChild(inputBubble);

    inputBubble.classList.add('ask-ai-input-bubble-hidden');

    function isLandingPage() {
      const path = window.location.pathname;
      return path === '/' || path === '/index' || path.endsWith('/index.html');
    }

    function isMobile() {
      return window.innerWidth <= 1024;
    }

    function handleEnterKey(e) {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        if (input.value.trim()) {
          handleAskAI();
        }
      }
    }

    function handleMobileInputClick(e) {
      if (isMobile()) {
        e.preventDefault();
        e.stopPropagation();
        const panel = document.getElementById('bot-panel');
        const toggleButton = document.getElementById('bot-toggle');
        
        if (panel && panel.classList.contains('bot-panel-collapsed')) {
          panel.classList.remove('bot-panel-collapsed');
          panel.classList.add('bot-panel-expanded');
          if (toggleButton) {
            toggleButton.classList.add('bot-toggle-expanded');
          }
          const iframe = document.querySelector('iframe[title="Botpress"]');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'panelOpened',
              data: {
                path: window.location.pathname,
                title: document.title.replace(' - Botpress', '')
              }
            }, '*');
          }
          if (window.focusComposerInput) {
            window.focusComposerInput();
          }
        }
      }
    }

    function setupInputBehavior() {
      if (isMobile()) {
        input.readOnly = true;
        input.removeEventListener('keydown', handleEnterKey);
        input.addEventListener('click', handleMobileInputClick, { once: false });
        wrapper.addEventListener('click', handleMobileInputClick, { once: false });
      } else {
        input.readOnly = false;
        input.removeEventListener('click', handleMobileInputClick);
        wrapper.removeEventListener('click', handleMobileInputClick);
        input.addEventListener('keydown', handleEnterKey);
      }
    }

    setupInputBehavior();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupInputBehavior();
      }, 100);
    });

    function updateVisibility() {
      if (isLandingPage()) {
        inputBubble.style.display = 'none';
        return;
      }

      const panel = document.getElementById('bot-panel');
      if (panel) {
        const isExpanded = panel.classList.contains('bot-panel-expanded');
        if (isExpanded) {
          inputBubble.classList.add('ask-ai-input-bubble-hidden');
        } else {
          inputBubble.style.display = '';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              inputBubble.classList.remove('ask-ai-input-bubble-hidden');
            });
          });
        }
      } else {
        inputBubble.style.display = '';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inputBubble.classList.remove('ask-ai-input-bubble-hidden');
          });
        });
      }
    }

    let lastPath = window.location.pathname;
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        updateVisibility();
      }
    };

    setInterval(checkPathChange, 100);
    window.addEventListener('popstate', updateVisibility);

    const panel = document.getElementById('bot-panel');
    if (panel) {
      const observer = new MutationObserver(() => {
        updateVisibility();
      });
      
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      updateVisibility();
    } else {
      const checkInterval = setInterval(() => {
        const panel = document.getElementById('bot-panel');
        if (panel) {
          const observer = new MutationObserver(() => {
            updateVisibility();
          });
          
          observer.observe(panel, {
            attributes: true,
            attributeFilter: ['class']
          });
          
          updateVisibility();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    function updateSendButton() {
      const hasValue = input.value.trim().length > 0;
      sendButton.disabled = !hasValue;
    }

    input.addEventListener('input', updateSendButton);
    updateSendButton();

    function handleAskAI() {
      const message = input.value.trim();
      if (!message) return;

      const panel = document.getElementById('bot-panel');
      const toggleButton = document.getElementById('bot-toggle');
      
      if (panel && !panel.classList.contains('bot-panel-expanded')) {
        panel.classList.remove('bot-panel-collapsed');
        panel.classList.add('bot-panel-expanded');
        if (toggleButton) {
          toggleButton.classList.add('bot-toggle-expanded');
        }
      }

      const iframe = document.querySelector('iframe[title="Botpress"]');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'panelOpened',
          data: {
            path: window.location.pathname,
            title: document.title.replace(' - Botpress', '')
          }
        }, '*');
        
        iframe.contentWindow.postMessage({
          type: 'sendMessage',
          message: message
        }, '*');
      }

      input.value = '';
      updateSendButton();
      input.blur();
    }

    sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!sendButton.disabled) {
        handleAskAI();
      }
    });
  }
})();

// "Ask AI" button override
(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAskAIOverride);
  } else {
    initAskAIOverride();
  }

  function initAskAIOverride() {
    const overriddenButtons = new WeakSet();
    
    function findAndOverrideButton() {
      const button = document.getElementById('page-context-menu-button');
      
      if (button && button.innerText.trim() === 'Ask AI' && !overriddenButtons.has(button)) {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          const panel = document.getElementById('bot-panel');
          const toggleButton = document.getElementById('bot-toggle');
          
          if (panel && !panel.classList.contains('bot-panel-expanded')) {
            panel.classList.remove('bot-panel-collapsed');
            panel.classList.add('bot-panel-expanded');
            if (toggleButton) {
              toggleButton.classList.add('bot-toggle-expanded');
            }
          }
          
          const iframe = document.querySelector('iframe[title="Botpress"]');
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'panelOpened',
              data: {
                path: window.location.pathname,
                title: document.title.replace(' - Botpress', '')
              }
            }, '*');
            
            iframe.contentWindow.postMessage({
              type: 'askAI',
              data: {
                path: window.location.pathname,
                title: document.title.replace(' - Botpress', '')
              }
            }, '*');
            
            iframe.contentWindow.postMessage({
              type: 'focusInput'
            }, '*');
          }
        }, true);
        
        overriddenButtons.add(button);
        return true;
      }
      return false;
    }

    findAndOverrideButton();

    const observer = new MutationObserver(() => {
      findAndOverrideButton();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();