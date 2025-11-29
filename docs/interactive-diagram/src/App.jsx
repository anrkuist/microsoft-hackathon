import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ElectionChatbotArchitecture from './components/ElectionChatbotArchitecture'

export default function App() {
  return (
    <BrowserRouter>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold text-slate-800">Citizen Impact - Election Information Chatbot</Link>
            <nav className="flex items-center gap-3">
              <Link to="/architecture" className="text-slate-600 hover:text-slate-900">Architecture</Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ElectionChatbotArchitecture />} />
          <Route path="/architecture" element={<ElectionChatbotArchitecture />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}