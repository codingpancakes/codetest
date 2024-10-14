"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function WidgetTestPage() {
  const searchParams = useSearchParams();
  const [configToken, setConfigToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setConfigToken(token);
    }
  }, [searchParams]);

  useEffect(() => {
    if (configToken) {
      const existingScript = document.getElementById("widget-script");

      if (!existingScript) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://gardencenter.vercel.app/widget.bundle.js";
        script.id = "widget-script";
        script.setAttribute("data-config-token", configToken);
        script.setAttribute("data-theme", "light");
        document.body.appendChild(script);
      }
    }

    return () => {
      const scriptToRemove = document.getElementById("widget-script");
      if (scriptToRemove) {
        document.body.removeChild(scriptToRemove);
      }
    };
  }, [configToken]);

  return (
    <div className="bg-white flex flex-col p-4">
      <h1 className="text-emerald-700">Widget Test Page</h1>
      <p>Embedding the widget below. Token: {configToken}</p>
      <div id="widget-container" className="bg-white" />
    </div>
  );
}
