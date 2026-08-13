import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <div>
      <h2>Welcome to MeroBank</h2>
      <p>Select a module from the navigation above.</p>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="brand">MeroBank Platform</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/accounts">Accounts</Link></li>
            <li><Link to="/payments">Payments</Link></li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<div>Account MFE loads here</div>} />
            <Route path="/payments" element={<div>Payment Task MFE loads here</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App