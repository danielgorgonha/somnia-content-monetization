import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { Wallet, Video, BarChart3 } from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  })
  const { disconnect } = useDisconnect()

  const navItems = [
    { path: '/', label: 'Home', icon: Video },
    { path: '/creator', label: 'Creator', icon: BarChart3 },
    { path: '/dashboard', label: 'Dashboard', icon: Wallet },
  ]

  const handleConnect = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-somnia-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Somnia Content
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-somnia-600 bg-somnia-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleConnect}
              className="flex items-center space-x-2 px-4 py-2 bg-somnia-600 text-white rounded-lg hover:bg-somnia-700 transition-colors"
            >
              <Wallet className="w-4 h-4" />
              <span>
                {isConnected 
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : 'Connect Wallet'
                }
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
