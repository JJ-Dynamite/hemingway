'use client'
import { useState } from 'react'
export default function Home() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const analyze = async () => {
    setLoading(true)
    const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">Hemingway</h1>
        <p className="text-gray-400 mb-8">Make your writing bold and clear</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <textarea value={text} onChange={e => setText(e.target.value)}
              className="w-full h-96 bg-white/10 backdrop-blur rounded-2xl p-6 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste your text here to analyze readability..." />
            <button onClick={analyze} disabled={!text || loading}
              className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
              {loading ? 'Analyzing...' : 'Analyze Text'}
            </button>
          </div>
          <div className="space-y-4">
            {result ? (
              <>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <h3 className="text-sm text-gray-400 mb-1">Readability Score</h3>
                  <p className="text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">{result.score}</p>
                  <p className="text-gray-400 mt-1">Grade Level: {result.grade}</p>
                  <p className="text-gray-400 text-sm">{result.word_count} words</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <h3 className="font-semibold mb-3">Suggestions</h3>
                  {result.suggestions?.map((s: any, i: number) => (
                    <div key={i} className="mb-3 p-3 bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500">
                      <p className="text-yellow-400 font-medium text-sm">{s.issue}</p>
                      <p className="text-gray-300 text-sm mt-1">{s.suggestion}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center text-gray-400">
                <p className="text-4xl mb-2">📝</p>
                <p>Paste text and click Analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
