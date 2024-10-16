(function () {
  function initWidget() {
    let scriptTag =
      document.currentScript || document.getElementById("widget-script");

    if (!scriptTag) {
      console.error("Widget script tag not found.");
      return;
    }

    const configToken = scriptTag.getAttribute("data-config-token");
    const theme = scriptTag.getAttribute("data-theme") || "light";

    const container = document.createElement("div");
    container.className = "my-widget-container";

    if (scriptTag.parentNode) {
      scriptTag.parentNode.insertBefore(container, scriptTag.nextSibling);
    } else {
      document.body.appendChild(container);
    }

    if (configToken) {
      fetchConfig(configToken)
        .then((config) => {
          renderWidget(container, { ...config, configToken, theme });
        })
        .catch((error) => {
          console.error("Error loading widget configuration:", error);
          renderWidget(container, { configToken, theme });
        });
    } else {
      renderWidget(container, { configToken, theme });
    }
  }

  function fetchConfig(token) {
    const baseUrl = "https://your-vercel-app-url.vercel.app";
    return fetch(`${baseUrl}/api/widget-config/${token}`)
      .then((response) => response.json())
      .catch((error) => {
        throw error;
      });
  }

  function renderWidget(container, config) {
    const {
      title = "Choose Your Preferences",
      message = "Select your yard space and style preferences",
      logoUrl,
      brandColor = "#000000",
      theme = "light",
      configToken
    } = config;

    container.innerHTML = `
      <div class="widget-content ${theme}" style="--brand-color: ${brandColor};">
        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" class="widget-logo">` : ""}
        <h3>${title}</h3>
        <p>${message}</p>
        <form id="widget-form">
          <div id="step-1" class="step active">
            <h4>Choose a starting yard space:</h4>
            <div class="grid">
              <label class="card">
                <input type="radio" name="yardSpace" value="Part-shade, East Facing">
                <img src="https://your-vercel-app-url.vercel.app/images/opt1.png" alt="Part-shade, East Facing">
                <div class="card-content">
                  <h5>Part-shade, East Facing</h5>
                  <p>An east-facing yard, with shade in the back</p>
                </div>
              </label>
              <label class="card">
                <input type="radio" name="yardSpace" value="Full Sun, South Facing">
                <img src="https://your-vercel-app-url.vercel.app/images/opt2.png" alt="Full Sun, South Facing">
                <div class="card-content">
                  <h5>Full Sun, South Facing</h5>
                  <p>A south-facing yard, receiving full sun</p>
                </div>
              </label>
            </div>
            <button type="button" id="continue-to-step-2" disabled>Continue</button>
          </div>

          <div id="step-2" class="step">
            <h4>Style preference:</h4>
            <div class="grid">
              <label class="card">
                <input type="checkbox" name="style" value="Drought Tolerant">
                <img src="https://your-vercel-app-url.vercel.app/images/opt3.png" alt="Drought Tolerant">
                <div class="card-content">
                  <h5>Drought Tolerant</h5>
                  <p>Water conservation, using drought-tolerant plants</p>
                </div>
              </label>
              <label class="card">
                <input type="checkbox" name="style" value="English/Traditional">
                <img src="https://your-vercel-app-url.vercel.app/images/opt4.png" alt="English/Traditional">
                <div class="card-content">
                  <h5>English/Traditional</h5>
                  <p>Format design, structured layouts, flowering plants</p>
                </div>
              </label>
              <label class="card">
                <input type="checkbox" name="style" value="Pollinator">
                <img src="https://your-vercel-app-url.vercel.app/images/opt5.png" alt="Pollinator">
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

    addStyles();
    setupForm(container, config);
  }

  function addStyles() {
    if (!document.getElementById("my-widget-styles")) {
      const style = document.createElement("style");
      style.id = "my-widget-styles";
      style.textContent = `
      /* Add your styles here */
      `;
      document.head.appendChild(style);
    }
  }

  function setupForm(container, config) {
    const step1 = container.querySelector("#step-1");
    const step2 = container.querySelector("#step-2");
    const continueButton = container.querySelector("#continue-to-step-2");
    const submitButton = container.querySelector("#submit-button");
    const form = container.querySelector("#widget-form");

    step1.querySelectorAll('input[name="yardSpace"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        continueButton.disabled = false;
      });
    });

    continueButton.addEventListener("click", () => {
      step1.classList.remove("active");
      step2.classList.add("active");
    });

    step2.querySelectorAll('input[name="style"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        submitButton.disabled = !step2.querySelector('input:checked');
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      handleFormSubmission(form, config);
    });
  }

  function handleFormSubmission(form, config) {
    const formData = new FormData(form);
    const data = {};

    // Add form fields to data object
    formData.forEach((value, key) => {
      data[key] = value;
    });

    // Add configToken to the form data
    data.configToken = config.configToken || 'unknown-token'; // Default if no token is available

    const baseUrl = "https://your-vercel-app-url.vercel.app";
    fetch(`${baseUrl}/api/submit-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        const responseDiv = form.parentElement.querySelector("#widget-response");
        responseDiv.textContent = result.message;
        responseDiv.style.display = "block";
        form.reset();
      })
      .catch((error) => {
        const responseDiv = form.parentElement.querySelector("#widget-response");
        responseDiv.textContent = "Error submitting form. Please try again.";
        responseDiv.style.display = "block";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
