import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import './styles/layout.css'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { ChatProvider } from './context/ChatContext'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ChatProvider>
      <Router>
        <div className="app-layout">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          <main className="main-content">
            {/* Mobile Header for Sidebar Toggle */}
            <div className="mobile-header" style={{ display: 'none', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
              <button onClick={toggleSidebar}>☰</button>
            </div>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ChatProvider>
  )
}

export default App