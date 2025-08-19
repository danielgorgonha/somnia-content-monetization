import { Play, DollarSign, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const Home = () => {
  const features = [
    {
      icon: Play,
      title: 'Seamless Content',
      description: 'Watch videos and listen to audio with automatic micropayment tracking'
    },
    {
      icon: DollarSign,
      title: 'Instant Payments',
      description: 'Real-time micropayments to creators as you consume content'
    },
    {
      icon: Users,
      title: 'Creator Focused',
      description: 'Direct monetization for content creators with transparent revenue'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built on Somnia Network for instant, low-cost transactions'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-somnia-600 to-somnia-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Monetize Your Content
              <span className="block text-somnia-200">with Micropayments</span>
            </h1>
            <p className="text-xl md:text-2xl text-somnia-100 mb-8 max-w-3xl mx-auto">
              Universal micropayment platform for digital content creators, 
              built on Somnia Network. Earn from every second of content consumption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/creator" 
                className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Creating
              </Link>
              <Link 
                to="/dashboard" 
                className="btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                View Content
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Somnia Content?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary micropayment technology that puts creators first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center">
                  <div className="w-12 h-12 bg-somnia-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-somnia-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the future of content monetization. Connect your wallet and start earning today.
          </p>
          <Link 
            to="/creator" 
            className="btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
          >
            <Zap className="w-5 h-5 mr-2" />
            Launch Your Content
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
