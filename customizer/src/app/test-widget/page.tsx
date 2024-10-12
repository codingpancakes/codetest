import ClientTestWidget from "./ClientTestWidget";
import { Suspense } from "react";

export default function TestWidgetPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Widget Page</h1>
      <p>
        This page is used to test the embedded widget within the Next.js app.
        You can pass <code>?token=YOUR_CONFIG_TOKEN&amp;theme=dark</code> as
        query parameters.
      </p>
      <Suspense>
        <ClientTestWidget />
      </Suspense>
    </div>
  );
}
