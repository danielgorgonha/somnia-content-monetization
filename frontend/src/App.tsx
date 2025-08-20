import { Routes, Route } from 'react-router-dom'


import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Creator from './pages/Creator'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
