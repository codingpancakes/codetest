"use client";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface PlannerProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
}

const Planner: React.FC<PlannerProps> = ({ isOpen, setIsOpen, token }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const code = `  <!-- Widget Embed Code -->
  <script
    async
    src="https://gardencenter.vercel.app/widget.bundle.js"
    id="widget-script"
    data-config-token="${token}"
    data-theme="light"
  ></script>`;

  const previewUrl = `https://gardencenter.vercel.app/widget-preview?token=${token}`;

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
      <div className="fixed inset-0 bg-black bg-opacity-30" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                        Your Plantista Widget
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">
                    <p className="mb-4 text-sm text-gray-600">
                      To embed your widget on your website, copy the code below and paste it inside your HTML file where you want the widget to appear.
                    </p>
                    <div className="relative my-4">
                      <CopyToClipboard text={code} onCopy={handleCopy}>
                        <button
                          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded text-sm"
                          aria-label="Copy code"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                      </CopyToClipboard>
                      <pre className="overflow-x-auto bg-gray-800 text-white p-4 rounded">
                        <code className="language-javascript text-xs">
                          {code}
                        </code>
                      </pre>
                    </div>
                    <p className="mb-4 text-sm text-gray-600">
                      If you'd like to preview the widget, you can view it directly by clicking the link below:
                    </p>
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-400"
                    >
                      Preview your widget here
                    </a>
                  </div>
                </div>
                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                  >
                    Cancel
                  </button>
                  <CopyToClipboard text={code} onCopy={handleCopy}>
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      {isCopied ? "Copied!" : "Copy code"}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export { Planner };
