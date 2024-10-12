(function () {
  function initWidget() {
    let scriptTag = document.currentScript;
    if (!scriptTag) {
      scriptTag = document.getElementById("widget-script");
    }

    if (!scriptTag) {
      console.error("Widget script tag not found.");
      return;
    }

    const configToken = scriptTag.getAttribute("data-config-token");
    const theme = scriptTag.getAttribute("data-theme") || "light";
    const container = document.createElement("div");
    container.className = "my-widget-container";

    if (scriptTag.parentNode) {
      scriptTag.parentNode.insertBefore(container, scriptTag);
    } else {
      document.body.appendChild(container);
    }

    const baseUrl = "https://gardencenter.vercel.app";
    if (configToken) {
      fetch(`${baseUrl}/api/widget-config/${configToken}`)
        .then((response) => response.json())
        .then((config) => {
          renderWidget(container, config, theme);
        })
        .catch((error) => {
          console.error("Error loading widget configuration:", error);
          renderWidget(container, getDefaultConfig(), theme);
        });
    } else {
      renderWidget(container, getDefaultConfig(), theme);
    }

    function renderWidget(container, config, theme) {
      container.innerHTML = `
        <div class="widget-content ${theme}">
          <h3>${config.title}</h3>
          <p>${config.message}</p>
        </div>
      `;

      if (!document.getElementById("my-widget-styles")) {
        const style = document.createElement("style");
        style.id = "my-widget-styles";
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
        title: "Default Widget Title",
        message: "This is the default widget message.",
      };
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
