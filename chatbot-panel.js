// Collapsible bot panel on the right side
// The iframe will be injected into the element with ID "docs-bot"

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBotPanel);
  } else {
    initBotPanel();
  }

  function initBotPanel() {
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'bot-panel';
    panel.className = 'bot-panel bot-panel-collapsed';

    // Create the toggle button to open (arrow on right side)
    const toggleButton = document.createElement('button');
    toggleButton.id = 'bot-toggle';
    toggleButton.className = 'bot-toggle';
    toggleButton.setAttribute('aria-label', 'Open bot');
    toggleButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    // Create the toggle button to close (inside panel, left side)
    const toggleCloseButton = document.createElement('button');
    toggleCloseButton.id = 'bot-toggle-close';
    toggleCloseButton.className = 'bot-toggle-close';
    toggleCloseButton.setAttribute('aria-label', 'Close bot');
    toggleCloseButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;

    // Create the resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'bot-resize-handle';
    resizeHandle.setAttribute('aria-label', 'Resize panel');

    // Create mobile dismiss arrow (shown only on mobile)
    const mobileDismiss = document.createElement('div');
    mobileDismiss.className = 'bot-mobile-dismiss';
    mobileDismiss.setAttribute('aria-label', 'Close bot');
    mobileDismiss.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;

    // Create the container for the iframe (user will inject iframe here)
    const botContainer = document.createElement('div');
    botContainer.id = 'docs-bot';
    botContainer.className = 'bot-iframe-container';
    
    // Assemble the panel
    panel.appendChild(mobileDismiss);
    panel.appendChild(toggleCloseButton);
    panel.appendChild(botContainer);
    panel.appendChild(resizeHandle);

    // Add to body
    document.body.appendChild(panel);
    document.body.appendChild(toggleButton);

    // Restore panel width from localStorage
    const savedWidth = localStorage.getItem('bot-panel-width');
    if (savedWidth) {
      panel.style.width = savedWidth;
    }

    // Toggle functionality
    function togglePanel() {
      const isCollapsed = panel.classList.contains('bot-panel-collapsed');
      
      if (isCollapsed) {
        panel.classList.remove('bot-panel-collapsed');
        panel.classList.add('bot-panel-expanded');
        toggleButton.classList.add('bot-toggle-expanded');
        // Store state in localStorage
        localStorage.setItem('bot-panel-open', 'true');
      } else {
        panel.classList.remove('bot-panel-expanded');
        panel.classList.add('bot-panel-collapsed');
        toggleButton.classList.remove('bot-toggle-expanded');
        localStorage.setItem('bot-panel-open', 'false');
      }
      updateContentSideLayoutVisibility();
    }

    function closePanel() {
      panel.classList.remove('bot-panel-expanded');
      panel.classList.add('bot-panel-collapsed');
      toggleButton.classList.remove('bot-toggle-expanded');
      localStorage.setItem('bot-panel-open', 'false');
      updateContentSideLayoutVisibility();
    }

    // Function to update content-side-layout visibility
    function updateContentSideLayoutVisibility() {
      const contentSideLayout = document.getElementById('content-side-layout');
      if (contentSideLayout) {
        const isExpanded = panel.classList.contains('bot-panel-expanded');
        if (isExpanded) {
          contentSideLayout.style.visibility = 'hidden';
        } else {
          contentSideLayout.style.visibility = '';
        }
      }
    }

    // Resize functionality
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
      // Don't start resizing if clicking on the close button
      if (e.target.closest('#bot-toggle-close')) {
        return;
      }
      isResizing = true;
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
      
      const diff = startX - e.clientX; // Inverted because we're resizing from the right
      const newWidth = Math.max(368, Math.min(600, startWidth + diff));
      panel.style.width = newWidth + 'px';
      localStorage.setItem('bot-panel-width', newWidth + 'px');
      e.preventDefault();
      e.stopPropagation();
    });

    document.addEventListener('mouseup', (e) => {
      if (isResizing) {
        isResizing = false;
        panel.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Event listeners
    toggleButton.addEventListener('click', togglePanel);
    toggleCloseButton.addEventListener('click', closePanel);
    mobileDismiss.addEventListener('click', closePanel);

    // Keyboard shortcut handler (Command+I or Ctrl+I) to toggle panel
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;
      
        if (modifierKey && e.key === 'i' && !e.shiftKey && !e.altKey) {
        // Don't trigger if user is typing in an input/textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
          return;
        }
        
        e.preventDefault();
        const isCollapsed = panel.classList.contains('bot-panel-collapsed');
        if (isCollapsed) {
          togglePanel();
        } else {
          closePanel();
        }
      }
    });

    // Restore previous state from localStorage
    const wasOpen = localStorage.getItem('bot-panel-open') === 'true';
    if (wasOpen) {
      panel.classList.remove('bot-panel-collapsed');
      panel.classList.add('bot-panel-expanded');
      toggleButton.classList.add('bot-toggle-expanded');
    }
    // Update content-side-layout visibility based on initial state
    updateContentSideLayoutVisibility();
  }
})();

// Floating input bubble at bottom center
(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInputBubble);
  } else {
    initInputBubble();
  }

  function initInputBubble() {
    // Create the input bubble container
    const inputBubble = document.createElement('div');
    inputBubble.id = 'ask-ai-input-bubble';
    inputBubble.className = 'ask-ai-input-bubble';

    // Create the inner wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'ask-ai-input-wrapper';

    // Create the input element
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Ask a question...';
    input.className = 'ask-ai-input';
    input.setAttribute('aria-label', 'Ask a question...');

    // Create keyboard shortcut indicator
    const shortcutIndicator = document.createElement('span');
    shortcutIndicator.className = 'ask-ai-shortcut';
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    shortcutIndicator.textContent = isMac ? '⌘I' : 'Ctrl+I';

    // Create send button
    const sendButton = document.createElement('button');
    sendButton.className = 'ask-ai-send-button';
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

    // Start with hidden class so it can animate in
    inputBubble.classList.add('ask-ai-input-bubble-hidden');

    // Check if we're on the landing page
    function isLandingPage() {
      const path = window.location.pathname;
      return path === '/' || path === '/index' || path.endsWith('/index.html');
    }

    // Check if mobile
    function isMobile() {
      return window.innerWidth <= 768;
    }

    // Handle Enter key in input (desktop only)
    function handleEnterKey(e) {
      if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
        e.preventDefault();
        if (input.value.trim()) {
          handleAskAI();
        }
      }
    }

    // Make input bar clickable to open panel on mobile
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
          localStorage.setItem('bot-panel-open', 'true');
          
          // Update content-side-layout visibility
          const contentSideLayout = document.getElementById('content-side-layout');
          if (contentSideLayout) {
            contentSideLayout.style.visibility = 'hidden';
          }
        }
      }
    }

    // Set up mobile/desktop behavior
    function setupInputBehavior() {
      if (isMobile()) {
        input.readOnly = true;
        // Remove desktop handlers
        input.removeEventListener('keydown', handleEnterKey);
        // Add mobile click handlers
        input.addEventListener('click', handleMobileInputClick, { once: false });
        wrapper.addEventListener('click', handleMobileInputClick, { once: false });
      } else {
        input.readOnly = false;
        // Remove mobile click handlers
        input.removeEventListener('click', handleMobileInputClick);
        wrapper.removeEventListener('click', handleMobileInputClick);
        // Add desktop handler
        input.addEventListener('keydown', handleEnterKey);
      }
    }

    // Initial setup
    setupInputBehavior();

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupInputBehavior();
      }, 100);
    });

    // Function to check panel state and update visibility
    function updateVisibility() {
      // Don't show on landing page
      if (isLandingPage()) {
        inputBubble.style.display = 'none';
        return;
      }

      const panel = document.getElementById('bot-panel');
      if (panel) {
        const isExpanded = panel.classList.contains('bot-panel-expanded');
        if (isExpanded) {
          // Animate out
          inputBubble.classList.add('ask-ai-input-bubble-hidden');
        } else {
          // Animate in - ensure it's visible first, then remove hidden class
          inputBubble.style.display = '';
          // Use requestAnimationFrame to ensure the display change is applied before removing the class
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              inputBubble.classList.remove('ask-ai-input-bubble-hidden');
            });
          });
        }
      } else {
        // Panel doesn't exist yet, show the bubble
        inputBubble.style.display = '';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            inputBubble.classList.remove('ask-ai-input-bubble-hidden');
          });
        });
      }
    }

    // Watch for URL changes (for SPA navigation)
    let lastPath = window.location.pathname;
    const checkPathChange = () => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        updateVisibility();
      }
    };

    // Check periodically for path changes
    setInterval(checkPathChange, 100);

    // Also listen to popstate for browser back/forward
    window.addEventListener('popstate', updateVisibility);

    // Watch for panel state changes
    const panel = document.getElementById('bot-panel');
    if (panel) {
      const observer = new MutationObserver(() => {
        updateVisibility();
      });
      
      observer.observe(panel, {
        attributes: true,
        attributeFilter: ['class']
      });
      
      // Initial check
      updateVisibility();
    } else {
      // If panel doesn't exist yet, check periodically
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

    // Function to update send button state
    function updateSendButton() {
      const hasValue = input.value.trim().length > 0;
      sendButton.disabled = !hasValue;
    }

    // Update send button on input
    input.addEventListener('input', updateSendButton);
    updateSendButton(); // Initial state

    // Function to execute when input is activated
    function handleAskAI() {
      const message = input.value.trim();
      if (!message) return;

      // Check if webchat has successfully loaded
      if (window.botpress && typeof window.botpress.init === 'function') {
        // Open the chat panel
        const panel = document.getElementById('bot-panel');
        const toggleButton = document.getElementById('bot-toggle');
        
        if (panel && !panel.classList.contains('bot-panel-expanded')) {
          panel.classList.remove('bot-panel-collapsed');
          panel.classList.add('bot-panel-expanded');
          if (toggleButton) {
            toggleButton.classList.add('bot-toggle-expanded');
          }
          localStorage.setItem('bot-panel-open', 'true');
          
          // Update content-side-layout visibility
          const contentSideLayout = document.getElementById('content-side-layout');
          if (contentSideLayout) {
            contentSideLayout.style.visibility = 'hidden';
          }
        }

        // Send the message to the webchat
        // Try different methods to send the message
        if (window.botpress && window.botpress.sendMessage) {
          window.botpress.sendMessage(message);
        } else if (window.botpress && window.botpress.sendTextMessage) {
          window.botpress.sendTextMessage(message);
        } else if (window.botpress && window.botpress.api && window.botpress.api.sendMessage) {
          window.botpress.api.sendMessage(message);
        } else {
          // Try to send via postMessage to the iframe inside docs-bot
          const botContainer = document.getElementById('docs-bot');
          if (botContainer) {
            const iframe = botContainer.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage({
                type: 'sendMessage',
                text: message
              }, '*');
            }
          }
        }

        // Clear the input
        input.value = '';
        updateSendButton();
        input.blur();
      }
    }

    // Handle send button click
    sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!sendButton.disabled) {
        handleAskAI();
      }
    });
  }
})();

