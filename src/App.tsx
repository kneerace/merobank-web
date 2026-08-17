import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AccountReviewMfe } from './components/account-review'
import { PaymentTaskMfe } from './components/payment-task'
import { DynamicSection } from './components/dynamic-section'
import { paymentReviewRefData } from './components/dynamic-section/mockRefData'
import './App.css'

// add a demo payment data object
const demoPayment = {
  id: 1,
  fromOwnerName: 'Rama oRama',
  toOwnerName: 'Name name',
  amount: 5500.00,
  status: 'under review',
  createdAt: '2026-08-09T10:00:00'
}

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
            <li><Link to="/demo">Dynamic Demo</Link></li>
          </ul>
        </nav>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/accounts" element={<AccountReviewMfe mode="view" />} />
            <Route path="/payments" element={<PaymentTaskMfe mode="work" />} />
            <Route path="/demo" element={
              <div>
                <h2>Dynamic Section Demo</h2>
                <DynamicSection config={paymentReviewRefData} data={demoPayment} />
              </div>
            } />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App