import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, DollarSign, Clock } from 'lucide-react'

const Dashboard = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes in seconds

  const contentItems = [
    {
      id: 1,
      title: 'Introduction to Web3',
      creator: 'Alice Crypto',
      duration: '15:30',
      rate: '0.001 SOM/sec',
      thumbnail: 'https://via.placeholder.com/300x200',
      description: 'Learn the basics of Web3 and blockchain technology'
    },
    {
      id: 2,
      title: 'Solidity Smart Contracts',
      creator: 'Bob Developer',
      duration: '22:15',
      rate: '0.002 SOM/sec',
      thumbnail: 'https://via.placeholder.com/300x200',
      description: 'Deep dive into Solidity programming language'
    },
    {
      id: 3,
      title: 'DeFi Fundamentals',
      creator: 'Carol Finance',
      duration: '18:45',
      rate: '0.0015 SOM/sec',
      thumbnail: 'https://via.placeholder.com/300x200',
      description: 'Understanding decentralized finance concepts'
    }
  ]

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
                src="https://via.placeholder.com/800x450" 
                alt="Video thumbnail"
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
            {contentItems.map((item) => (
              <div key={item.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-500">
                      <div>{item.creator}</div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{item.duration}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-somnia-600 font-medium">{item.rate}</div>
                      <button className="btn-primary text-sm px-3 py-1">
                        <Play className="w-3 h-3 mr-1" />
                        Play
                      </button>
                    </div>
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
