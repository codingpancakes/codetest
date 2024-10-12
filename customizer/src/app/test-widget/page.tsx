'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TestWidgetPage() {
  const searchParams = useSearchParams();
  const configToken = searchParams.get('token');
  const theme = searchParams.get('theme') || 'light';

  useEffect(() => {
    const existingScript = document.getElementById('widget-script');
    if (existingScript) {
      existingScript.remove();
    }

    const existingContainer = document.querySelector('.my-widget-container');
    if (existingContainer) {
      existingContainer.remove();
    }

    const script = document.createElement('script');
    script.src = '/widget.bundle.js';
    script.async = true;
    script.id = 'widget-script'; // Add the id here

    if (configToken) {
      script.setAttribute('data-config-token', configToken);
    }
    script.setAttribute('data-theme', theme);

    // Append the script to the body
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const scriptToRemove = document.getElementById('widget-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }

      const widgetContainer = document.querySelector('.my-widget-container');
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, [configToken, theme]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Widget Page</h1>
      <p>
        This page is used to test the embedded widget within the Next.js app. You can pass{' '}
        <code>?token=YOUR_CONFIG_TOKEN&amp;theme=dark</code> as query parameters.
      </p>
    </div>
  );
}
