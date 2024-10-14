"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientTestWidget() {
  const searchParams = useSearchParams();
  const configToken = searchParams.get("token");
  const theme = searchParams.get("theme") || "light";

  useEffect(() => {
    const existingScript = document.getElementById("widget-script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "/widget.bundle.js";
    script.async = true;
    script.id = "widget-script";

    if (configToken) {
      script.setAttribute("data-config-token", configToken);
    }
    script.setAttribute("data-theme", theme);

    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("widget-script");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }

      const widgetContainer = document.querySelector(".my-widget-container");
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, [configToken, theme]);

  return null;
}
