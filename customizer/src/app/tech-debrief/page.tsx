"use client";

export default function ExplanationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Why I Chose These Technologies</h1>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Vanilla JavaScript for the Widget</h2>
            <p className="text-gray-700 leading-relaxed">
              I went with **vanilla JavaScript** for the widget because it's the most flexible and
              compatible option when embedding it across various websites. By sticking to plain JavaScript, 
              I ensure the widget can work on any platform—whether it's a React app, a WordPress site, or even 
              just a static HTML page.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              **No dependencies** means the widget doesn't carry any unnecessary weight, so there's no risk 
              of conflicting with the host site’s tech stack. It’s also easy to embed—just a simple 
              `script tag, much like Google Analytics or a chatbot.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Performance is another key reason. With vanilla JavaScript, the widget is lightweight 
              and fast, making it ideal for embedding without slowing down the host site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Next.js for the Widget Customizer</h2>
            <p className="text-gray-700 leading-relaxed">
              For the **widget customizer**, I chose **Next.js** because it gives me the best of both worlds: 
              server-side rendering and client-side interactivity. The customizer needs to be dynamic, responsive, 
              and interactive, which is where **React** (and by extension, Next.js) shines.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              **Server-side rendering** ensures fast performance and SEO benefits, while **client-side** features 
              make it easy to create a highly interactive interface. The customizer also needs to fetch and save 
              configurations, which is super simple with Next.js's **API routes**. These routes let me handle backend 
              functionality without needing a separate server.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Plus, the **developer experience** with Next.js is fantastic. Features like hot reloading, routing, 
              and CSS support make the development process smooth and efficient.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-emerald-600 mb-4">Vercel KV for the Database</h2>
            <p className="text-gray-700 leading-relaxed">
              I decided to use **Vercel KV** (a key-value store) for managing the widget configurations and token data 
              because it’s fast, simple, and perfectly suited for this kind of task.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              **Simplicity** is key here. I don’t need a complex relational database—just a fast, straightforward way 
              to store widget settings. Vercel KV fits the bill by letting me store simple key-value pairs.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              The fact that **Vercel KV is edge-optimized** is another huge benefit. It distributes the data globally, 
              meaning the widget loads quickly no matter where the user is. It's fast and scales effortlessly, which 
              means I don’t have to worry about performance as more people use the widget.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              And since **Vercel KV** integrates perfectly with my Next.js app (which is deployed on Vercel), the setup 
              is seamless, and everything works together without needing complex configuration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
