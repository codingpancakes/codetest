(function () {
    function initWidget() {
      const scriptTag = document.currentScript;
      const configToken = scriptTag.getAttribute('data-config-token');
      const theme = scriptTag.getAttribute('data-theme') || 'light';
  
      // Create the widget container
      const container = document.createElement('div');
      container.className = 'my-widget-container';
      scriptTag.parentNode.insertBefore(container, scriptTag);
  
      if (configToken) {
        fetch(`https://codingpancakes.com/api/widget-config/${configToken}`)
          .then((response) => response.json())
          .then((config) => {
            renderWidget(container, config);
          })
          .catch((error) => {
            console.error('Error loading widget configuration:', error);
            renderWidget(container, getDefaultConfig());
          });
      } else {
        renderWidget(container, getDefaultConfig());
      }
  
      function renderWidget(container, config) {
        // Build the widget content
        container.innerHTML = `
          <div class="widget-content ${theme}">
            <h3>${config.title}</h3>
            <p>${config.message}</p>
          </div>
        `;
  
        // Apply styles
        const styleId = 'my-widget-styles';
        if (!document.getElementById(styleId)) {
          const style = document.createElement('style');
          style.id = styleId;
          style.textContent = `
            .my-widget-container {
              margin: 16px 0;
            }
            .widget-content {
              padding: 16px;
              border-radius: 8px;
              font-family: Arial, sans-serif;
              text-align: center;
            }
            .widget-content.light {
              background-color: #ffffff;
              color: #000000;
            }
            .widget-content.dark {
              background-color: #333333;
              color: #ffffff;
            }
          `;
          document.head.appendChild(style);
        }
      }
  
      function getDefaultConfig() {
        return {
          title: 'Default Widget Title',
          message: 'This is the default widget message.',
        };
      }
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWidget);
    } else {
      initWidget();
    }
  })();
  