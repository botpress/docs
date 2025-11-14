// Collapsible chatbot panel on the right side
// The iframe will be injected into the element with ID "docs-bot"

(function() {
  'use strict';

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbotPanel);
  } else {
    initChatbotPanel();
  }

  function initChatbotPanel() {
    // Create the panel container
    const panel = document.createElement('div');
    panel.id = 'chatbot-panel';
    panel.className = 'chatbot-panel chatbot-panel-collapsed';

    // Create the toggle button (arrow on right middle side)
    const toggleButton = document.createElement('button');
    toggleButton.id = 'chatbot-toggle';
    toggleButton.className = 'chatbot-toggle';
    toggleButton.setAttribute('aria-label', 'Toggle chatbot');
    toggleButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;

    // Create the resize handle
    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'chatbot-resize-handle';
    resizeHandle.setAttribute('aria-label', 'Resize panel');

    // Create the container for the iframe (user will inject iframe here)
    const botContainer = document.createElement('div');
    botContainer.id = 'docs-bot';
    botContainer.className = 'chatbot-iframe-container';
    
    // Assemble the panel
    panel.appendChild(botContainer);
    panel.appendChild(resizeHandle);

    // Add to body
    document.body.appendChild(panel);
    document.body.appendChild(toggleButton);

    // Restore panel width from localStorage
    const savedWidth = localStorage.getItem('chatbot-panel-width');
    if (savedWidth) {
      panel.style.width = savedWidth;
    }

    // Toggle functionality
    function togglePanel() {
      const isCollapsed = panel.classList.contains('chatbot-panel-collapsed');
      
      if (isCollapsed) {
        panel.classList.remove('chatbot-panel-collapsed');
        panel.classList.add('chatbot-panel-expanded');
        toggleButton.classList.add('chatbot-toggle-expanded');
        // Store state in localStorage
        localStorage.setItem('chatbot-panel-open', 'true');
      } else {
        panel.classList.remove('chatbot-panel-expanded');
        panel.classList.add('chatbot-panel-collapsed');
        toggleButton.classList.remove('chatbot-toggle-expanded');
        localStorage.setItem('chatbot-panel-open', 'false');
      }
    }

    // Resize functionality
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
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
      localStorage.setItem('chatbot-panel-width', newWidth + 'px');
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
        togglePanel();
      }
    });

    // Restore previous state from localStorage
    const wasOpen = localStorage.getItem('chatbot-panel-open') === 'true';
    if (wasOpen) {
      // Small delay to ensure smooth animation
      setTimeout(() => {
        panel.classList.remove('chatbot-panel-collapsed');
        panel.classList.add('chatbot-panel-expanded');
        toggleButton.classList.add('chatbot-toggle-expanded');
      }, 100);
    }
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

    // Function to check panel state and update visibility
    function updateVisibility() {
      const panel = document.getElementById('chatbot-panel');
      if (panel) {
        const isExpanded = panel.classList.contains('chatbot-panel-expanded');
        if (isExpanded) {
          inputBubble.classList.add('ask-ai-input-bubble-hidden');
        } else {
          inputBubble.classList.remove('ask-ai-input-bubble-hidden');
        }
      }
    }

    // Watch for panel state changes
    const panel = document.getElementById('chatbot-panel');
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
        const panel = document.getElementById('chatbot-panel');
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
        const panel = document.getElementById('chatbot-panel');
        const toggleButton = document.getElementById('chatbot-toggle');
        
        if (panel && !panel.classList.contains('chatbot-panel-expanded')) {
          panel.classList.remove('chatbot-panel-collapsed');
          panel.classList.add('chatbot-panel-expanded');
          if (toggleButton) {
            toggleButton.classList.add('chatbot-toggle-expanded');
          }
          localStorage.setItem('chatbot-panel-open', 'true');
        }

        // Send the message to the webchat
        // Wait a bit for the panel to open, then send
        setTimeout(() => {
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
        }, 300);

        // Clear the input
        input.value = '';
        updateSendButton();
        input.blur();
      }
    }

    // Handle Enter key in input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (input.value.trim()) {
          handleAskAI();
        }
      }
    });

    // Handle send button click
    sendButton.addEventListener('click', (e) => {
      e.preventDefault();
      if (!sendButton.disabled) {
        handleAskAI();
      }
    });
  }
})();
