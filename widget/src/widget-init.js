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
        <form id="widget-form">
          <!-- Step 1: Choose Yard Space -->
          <div id="step-1" class="step active">
            <h4>Choose a starting yard space:</h4>
            <div class="grid">
              <label class="card">
                <input type="radio" name="yardSpace" value="Part-shade, East Facing">
                <img src="https://gardencenter.vercel.app/images/opt1.png" alt="Part-shade, East Facing">
                <div class="card-content">
                  <h5>Part-shade, East Facing</h5>
                  <p>An east-facing yard, with shade in the back</p>
                </div>
              </label>
              <label class="card">
                <input type="radio" name="yardSpace" value="Full Sun, South Facing">
                <img src="https://gardencenter.vercel.app/images/opt2.png" alt="Full Sun, South Facing">
                <div class="card-content">
                  <h5>Full Sun, South Facing</h5>
                  <p>A south-facing yard, receiving full sun</p>
                </div>
              </label>
            </div>
            <button type="button" id="continue-to-step-2" disabled>Continue</button>
          </div>

          <!-- Step 2: Choose Style Preference -->
          <div id="step-2" class="step">
            <h4>Style preference:</h4>
            <div class="grid">
              <label class="card">
                <input type="checkbox" name="style" value="Drought Tolerant">
                <img src="https://gardencenter.vercel.app/images/opt3.png" alt="Drought Tolerant">
                <div class="card-content">
                  <h5>Drought Tolerant</h5>
                  <p>Water conservation, using drought-tolerant plants</p>
                </div>
              </label>
              <label class="card">
                <input type="checkbox" name="style" value="English/Traditional">
                <img src="https://gardencenter.vercel.app/images/opt4.png" alt="English/Traditional">
                <div class="card-content">
                  <h5>English/Traditional</h5>
                  <p>Format design, structured layouts, flowering plants</p>
                </div>
              </label>
              <label class="card">
                <input type="checkbox" name="style" value="Pollinator">
                <img src="https://gardencenter.vercel.app/images/opt5.png" alt="Pollinator">
                <div class="card-content">
                  <h5>Pollinator</h5>
                  <p>Supports pollinators like bees, butterflies, and more</p>
                </div>
              </label>
            </div>
            <button type="submit" id="submit-button" disabled>Submit</button>
          </div>
        </form>
        <div id="widget-response" style="display: none;"></div>
      </div>
    `;

    if (!document.getElementById('my-widget-styles')) {
      const style = document.createElement('style');
      style.id = 'my-widget-styles';
      style.textContent = `
       .my-widget-container {
          margin: 32px 0;
        }

        .widget-content {
          padding: 24px;
          border-radius: 16px;
          font-family: 'Roboto', sans-serif;
          text-align: center;
          background-color: var(--brand-color, #ffffff);
          color: ${theme === 'light' ? '#333333' : '#ffffff'};
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .widget-logo {
          max-width: 80px;
          margin-bottom: 24px;
        }

        h3 {
          font-size: 1.6rem;
          margin-bottom: 12px;
        }

        p {
          font-size: 1rem;
          margin-bottom: 24px;
          color: ${theme === 'light' ? '#666666' : '#cccccc'};
        }

        .grid {
          display: flex;
          gap: 24px;
          justify-content: space-between;
        }

        .card {
          position: relative;
          display: flex;
          flex-direction: column;
          width: 45%;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          cursor: pointer;
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }

        .card input {
          display: none;
        }

        .card img {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .card-content {
          padding: 16px;
        }

        .card-content h5 {
          margin: 0;
          font-size: 1.1rem;
          color: ${theme === 'light' ? '#333333' : '#ffffff'};
        }

        .card-content p {
          font-size: 0.9rem;
          color: ${theme === 'light' ? '#777777' : '#bbbbbb'};
        }

        #widget-form button {
          padding: 12px 24px;
          background-color: var(--brand-color, #0066cc);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          color: #ffffff;
          transition: background-color 0.2s ease-in-out;
        }

        #widget-form button:disabled {
          background-color: #cccccc;
        }

        #widget-form button:hover:not(:disabled) {
          background-color: #0055aa;
        }

        #widget-response {
          margin-top: 16px;
          font-size: 1rem;
          color: ${theme === 'light' ? '#333333' : '#ffffff'};
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
