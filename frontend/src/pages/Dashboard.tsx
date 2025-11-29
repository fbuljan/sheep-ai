export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Your Feed</h1>

        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
          🐑
        </div>
      </header>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-[#111827]/80 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
          <h2 className="text-lg font-medium">Example article</h2>
          <p className="text-gray-400 text-sm mt-1">
            This is where summaries will appear once the backend is connected.
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-indigo-600/40 text-indigo-300 rounded-lg">
              relevance: 82%
            </span>
            <span className="px-2 py-1 bg-green-600/40 text-green-300 rounded-lg">
              trust: 95%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}