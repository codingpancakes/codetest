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
        throw error;
      });
  }

  function renderWidget(container, config) {
    const { title = 'Choose Your Preferences', message = 'Select your yard space and style preferences', logoUrl, brandColor = '#000000', theme = 'light' } = config;

    container.innerHTML = `
      <div class="widget-content ${theme}" style="--brand-color: ${brandColor};">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="widget-logo">` : ''}
        <h3>${title}</h3>
        <p>${message}</p>
        <div id="step-1" class="step active">
          <h4>Choose a starting yard space:</h4>
          <div class="grid">
            <label class="card">
              <input type="radio" name="yardSpace" value="Part-shade, East Facing">
              <img src="path-to-image1.jpg" alt="Part-shade, East Facing">
              <div class="card-content">
                <h5>Part-shade, East Facing</h5>
                <p>An east-facing yard, with shade in the back</p>
              </div>
            </label>
            <label class="card">
              <input type="radio" name="yardSpace" value="Full Sun, South Facing">
              <img src="path-to-image2.jpg" alt="Full Sun, South Facing">
              <div class="card-content">
                <h5>Full Sun, South Facing</h5>
                <p>A south-facing yard, receiving full sun</p>
              </div>
            </label>
          </div>
          <button id="continue-to-step-2" disabled>Continue</button>
        </div>
        <div id="step-2" class="step">
          <h4>Style preference:</h4>
          <div class="grid">
            <label class="card">
              <input type="checkbox" name="style" value="Drought Tolerant">
              <img src="path-to-image3.jpg" alt="Drought Tolerant">
              <div class="card-content">
                <h5>Drought Tolerant</h5>
                <p>Water conservation, using drought-tolerant plants</p>
              </div>
            </label>
            <label class="card">
              <input type="checkbox" name="style" value="English/Traditional">
              <img src="path-to-image4.jpg" alt="English/Traditional">
              <div class="card-content">
                <h5>English/Traditional</h5>
                <p>Format design, structured layouts, flowering plants</p>
              </div>
            </label>
            <label class="card">
              <input type="checkbox" name="style" value="Pollinator">
              <img src="path-to-image5.jpg" alt="Pollinator">
              <div class="card-content">
                <h5>Pollinator</h5>
                <p>Supports pollinators like bees, butterflies, and more</p>
              </div>
            </label>
          </div>
          <button type="submit" id="submit-button" disabled>Submit</button>
        </div>
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
        .grid {
          display: flex;
          gap: 16px;
          justify-content: space-around;
        }
        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 45%;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          cursor: pointer;
        }
        .card input {
          margin-right: 8px;
        }
        .card img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        .card-content {
          padding: 16px;
        }
        .card-content h5 {
          margin: 0;
          font-size: 1.2rem;
        }
        .card-content p {
          font-size: 0.9rem;
          margin: 8px 0 0;
        }
        #widget-form button {
          padding: 8px 16px;
          background-color: #ffffff;
          border: 1px solid var(--brand-color, #000000);
          cursor: pointer;
          color: var(--brand-color, #000000);
          margin-top: 16px;
        }
        #widget-form button:hover {
          background-color: var(--brand-color, #000000);
          color: #ffffff;
        }
        #widget-response {
          margin-top: 16px;
        }
        .step {
          display: none;
        }
        .step.active {
          display: block;
        }
      `;
      document.head.appendChild(style);
    }

    const step1 = container.querySelector('#step-1');
    const step2 = container.querySelector('#step-2');
    const continueButton = container.querySelector('#continue-to-step-2');
    const submitButton = container.querySelector('#submit-button');
    const form = container.querySelector('#widget-form');

    step1.querySelectorAll('input[name="yardSpace"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        continueButton.disabled = false;
      });
    });

    continueButton.addEventListener('click', () => {
      step1.classList.remove('active');
      step2.classList.add('active');
    });

    step2.querySelectorAll('input[name="style"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const checked = step2.querySelectorAll('input[name="style"]:checked');
        submitButton.disabled = checked.length === 0;
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      handleFormSubmission(form, config);
    });
  }

  function handleFormSubmission(form, config) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    submitFormData(data)
      .then((responseMessage) => {
        const responseDiv = form.parentElement.querySelector('#widget-response');
        responseDiv.textContent = responseMessage;
        responseDiv.style.display = 'block';
        form.reset();
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        const responseDiv = form.parentElement.querySelector('#widget-response');
        responseDiv.textContent = 'An error occurred while submitting the form. Please try again.';
        responseDiv.style.display = 'block';
      });
  }

  function submitFormData(data) {
    const baseUrl = 'https://gardencenter.vercel.app';
    return fetch(`${baseUrl}/api/submit-form`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.error || 'Server error');
          });
        }
        return response.json();
      })
      .then((result) => {
        return result.message;
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
