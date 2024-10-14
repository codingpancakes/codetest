"use client";

import { useState } from "react";

export default function CustomizeWidgetPage() {
  const [title, setTitle] = useState("My Widget");
  const [message, setMessage] = useState("This is your custom widget content.");
  const [theme, setTheme] = useState("light");
  const [configToken, setConfigToken] = useState("");

  const generateEmbedCode = async () => {
    const response = await fetch("/api/save-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message }),
    });
    const data = await response.json();
    setConfigToken(data.token);
  };

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  const embedCode = `<script async src="${origin}/widget.js" data-config-token="${configToken}" data-theme="${theme}"></script>`;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Customize Your Widget</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>
            Title:
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
        </div>
        <div>
          <label>
            Message:
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Theme:
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </div>
        <button onClick={generateEmbedCode}>Generate Embed Code</button>
      </form>
      {configToken && (
        <>
          <h2>Embed Code:</h2>
          <textarea
            readOnly
            value={embedCode}
            style={{ width: "100%", height: "100px" }}
          />
        </>
      )}
    </div>
  );
}
