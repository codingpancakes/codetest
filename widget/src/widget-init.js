(function () {
  function initWidget() {
    let scriptTag = document.currentScript || document.getElementById('widget-script');

    if (!scriptTag) {
      console.error('Widget script tag not found.');
      return;
    }

    const configToken = scriptTag.getAttribute('data-config-token');
    const theme = scriptTag.getAttribute('data-theme') || 'light';

    const container = document.createElement('div');
    container.className = 'my-widget-container';

    if (scriptTag.parentNode) {
      scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    } else {
      document.body.appendChild(container);
    }

    if (configToken) {
      fetchConfig(configToken)
        .then((config) => {
          renderWidget(container, { ...config, theme });
        })
        .catch((error) => {
          console.error('Error loading widget configuration:', error);
          renderWidget(container, { theme });
        });
    } else {
      renderWidget(container, { theme });
    }
  }

  function fetchConfig(token) {
    const baseUrl = 'https://gardencenter.vercel.app';
    return fetch(`${baseUrl}/api/widget-config/${token}`)
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching configuration:', error);
        throw error;
      });
  }

  function renderWidget(container, config) {
    const {
      title = 'Choose Your Preferences',
      message = 'Select your yard space and style preferences',
      logoUrl,
      brandColor = '#000000',
      theme = 'light',
    } = config;

    container.innerHTML = `
      <div class="widget-content ${theme}" style="--brand-color: ${brandColor};">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="widget-logo">` : ''}
        <h3>${title}</h3>
        <p>${message}</p>
        <!-- Multiple Selection Form -->
        <form id="widget-form">
          <div class="form-section">
            <h4>Choose a starting yard space:</h4>
            <label>
              <input type="checkbox" name="yardSpace" value="Part-shade, East Facing"> Part-shade, East Facing
            </label>
            <label>
              <input type="checkbox" name="yardSpace" value="Full Sun, South Facing"> Full Sun, South Facing
            </label>
          </div>
          <div class="form-section">
            <h4>Style preference:</h4>
            <label>
              <input type="checkbox" name="style" value="Drought Tolerant"> Drought Tolerant
            </label>
            <label>
              <input type="checkbox" name="style" value="English/Traditional"> English/Traditional
            </label>
            <label>
              <input type="checkbox" name="style" value="Pollinator"> Pollinator
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        <!-- Response -->
        <div id="widget-response" style="display: none;"></div>
      </div>
    `;

    if (!document.getElementById('my-widget-styles')) {
      const style = document.createElement('style');
      style.id = 'my-widget-styles';
      style.textContent = `
        .my-widget-container {
          margin: 16px 0;
        }
        .widget-content {
          padding: 16px;
          border-radius: 8px;
          font-family: Arial, sans-serif;
          text-align: center;
          background-color: var(--brand-color, #ffffff);
          color: ${theme === 'light' ? '#000000' : '#ffffff'};
        }
        .widget-logo {
          max-width: 100px;
          margin-bottom: 16px;
        }
        /* Form Styles */
        #widget-form {
          margin-top: 16px;
          text-align: left;
        }
        .form-section {
          margin-bottom: 16px;
        }
        .form-section h4 {
          margin-bottom: 8px;
        }
        .form-section label {
          display: block;
          margin-bottom: 8px;
        }
        #widget-form input[type="checkbox"] {
          margin-right: 8px;
        }
        #widget-form button {
          padding: 8px 16px;
          background-color: #ffffff;
          border: 1px solid var(--brand-color, #000000);
          cursor: pointer;
          color: var(--brand-color, #000000);
        }
        #widget-form button:hover {
          background-color: var(--brand-color, #000000);
          color: #ffffff;
        }
        #widget-response {
          margin-top: 16px;
        }
      `;
      document.head.appendChild(style);
    }

    const form = container.querySelector('#widget-form');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      handleFormSubmission(form, config);
    });
  }

  function handleFormSubmission(form, config) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      if (!data[key]) {
        data[key] = [];
      }
      data[key].push(value);
    });

    const responseMessage = generateResponse(data, config);
    const responseDiv = form.parentElement.querySelector('#widget-response');
    responseDiv.textContent = responseMessage;
    responseDiv.style.display = 'block';
    form.reset();
  }

  function generateResponse(data, config) {
    return `Thank you for your submission! You selected: ${data.yardSpace.join(', ')} for yard space, and ${data.style.join(', ')} for style preferences.`;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
