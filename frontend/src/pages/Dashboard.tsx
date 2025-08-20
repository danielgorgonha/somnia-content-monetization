import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, DollarSign, Clock } from 'lucide-react'

const Dashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration] = useState(180) // 3 minutes in seconds

  const mockContent = [
    {
      id: 'content-1',
      title: 'Introduction to Web3',
      creator: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      thumbnail: 'https://picsum.photos/300/200?random=1',
      duration: 180,
      pricePerSecond: 1000000000000000, // 0.001 ETH/s
      totalViews: 150,
      totalEarnings: 500000000000000000, // 0.5 ETH
    },
    {
      id: 'content-2',
      title: 'Smart Contract Development',
      creator: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
      thumbnail: 'https://picsum.photos/300/200?random=2',
      duration: 240,
      pricePerSecond: 1500000000000000, // 0.0015 ETH/s
      totalViews: 89,
      totalEarnings: 300000000000000000, // 0.3 ETH
    },
    {
      id: 'content-3',
      title: 'DeFi Fundamentals',
      creator: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      thumbnail: 'https://picsum.photos/300/200?random=3',
      duration: 300,
      pricePerSecond: 2000000000000000, // 0.002 ETH/s
      totalViews: 234,
      totalEarnings: 800000000000000000, // 0.8 ETH
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value)
    setCurrentTime(newTime)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Dashboard</h1>
          <p className="text-gray-600">Discover and consume content with micropayments</p>
        </div>

        {/* Featured Content */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
          
          {/* Video Player */}
          <div className="card">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative">
              <img 
                src="https://picsum.photos/800/450?random=4"
                alt="Featured Content"
                className="w-full h-full object-cover rounded-lg"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div className="w-full">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-1" />
                        )}
                      </button>
                      
                      <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <SkipBack className="w-4 h-4 text-white" />
                      </button>
                      
                      <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <SkipForward className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Volume2 className="w-4 h-4 text-white" />
                      </button>
                      
                      <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                        <DollarSign className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">0.001 SOM/sec</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Introduction to Web3
              </h3>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of Web3, blockchain technology, and decentralized applications.
                This comprehensive guide covers everything you need to know to get started.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By Alice Crypto</span>
                  <span>•</span>
                  <span>15:30</span>
                  <span>•</span>
                  <span>1,247 views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Session: 0:45</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-somnia-600 font-medium">
                    <DollarSign className="w-4 h-4" />
                    <span>Paid: 0.045 SOM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Library */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Library</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockContent.map((item) => (
              <div key={item.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-2">Creator: {item.creator.slice(0, 6)}...{item.creator.slice(-4)}</p>
                  <p className="text-gray-600 mb-2">Duration: {formatTime(item.duration)}</p>
                  <p className="text-gray-600 mb-2">Rate: {(item.pricePerSecond / 1e18).toFixed(6)} ETH/s</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.totalViews} views</span>
                    <span className="text-sm text-green-600">{(item.totalEarnings / 1e18).toFixed(2)} ETH earned</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
