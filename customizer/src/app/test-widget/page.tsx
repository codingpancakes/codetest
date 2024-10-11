"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TestWidgetPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const existingScript = document.getElementById("widget-script");
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.src = "/widget.bundle.js";
    script.async = true;
    script.id = "widget-script";

    if (token) {
      script.setAttribute("data-config-token", token);
    }

    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("widget-script");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }

      const widgetContainer = document.getElementById("widget-container");
      if (widgetContainer) {
        widgetContainer.innerHTML = "";
      }
    };
  }, [token]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Widget Test Page</h1>
      <p>
        This page is used to test the embedded widget within the Next.js app.
      </p>
      <div id="widget-container"></div>
    </div>
  );
}
