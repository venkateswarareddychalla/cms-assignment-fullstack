export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-in fade-in zoom-in duration-1000">
      <div className="space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
          Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">RenewCred</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          A dynamic, modern, headless CMS driving beautiful, structured experiences.
        </p>
      </div>
      <div className="glass-panel px-8 py-6 rounded-2xl flex flex-col items-center">
        <p className="text-gray-500 font-medium">Select a page from the navigation menu above to get started.</p>
      </div>
    </div>
  );
}
