import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AccountReviewMfe } from './components/account-review'
import { PaymentTaskMfe } from './components/payment-task'
import { DynamicSection } from './components/dynamic-section'
import { paymentReviewRefData } from './components/dynamic-section/mockRefData'
import Login from './pages/Login'
import './App.css'

const demoPayment = {
  id: 1,
  fromOwnerName: 'ram thapa',
  toOwnerName: 'sita rai',
  amount: 5500.00,
  status: 'under review',
  createdAt: '2026-08-09T10:00:00'
}

// route guard component
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('merobank-token')
  return token ? <>{children}</> : <Navigate to="/login" />
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
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
            <div className="app">
              <nav className="navbar">
                <div className="brand">MeroBank Platform</div>
                <ul className="nav-links">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/accounts">Accounts</Link></li>
                  <li><Link to="/payments">Payments</Link></li>
                  <li><Link to="/demo">Dynamic Demo</Link></li>
                  <li>
                    <button
                      onClick={() => {
                        localStorage.removeItem('merobank-token')
                        window.location.href = '/login'
                      }}
                      style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
              <main className="content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/accounts" element={<AccountReviewMfe mode="work" />} />
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
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App