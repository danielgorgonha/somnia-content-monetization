import React, { useState } from 'react';
import { Play, Clock, Eye, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentPlayer from '../components/content/ContentPlayer';
import { type ContentItem } from '../types/contracts';

const Dashboard = () => {
  const [duration] = useState(180) // 3 minutes in seconds
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  const mockContent: ContentItem[] = [
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleContentClick = (content: ContentItem) => {
    console.log('Content clicked:', content.id);
    setSelectedContent(content);
  };

  const handlePlayFeatured = () => {
    console.log('Playing featured content');
    setSelectedContent(mockContent[0]); // Use first content as featured
  };

  const handleClosePlayer = () => {
    setSelectedContent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Consume content with micropayments</p>
        </div>

        {/* Featured Content */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Content</h2>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-900 rounded-lg mb-4 relative">
              <img 
                src="https://picsum.photos/800/450?random=4"
                alt="Featured Content"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button 
                  onClick={handlePlayFeatured}
                  className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-6 py-3 rounded-full flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  <span className="font-semibold">Play with Micropayments</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Introduction to Web3</h3>
              <p className="text-gray-600 mb-4">
                Learn the fundamentals of Web3, blockchain technology, and decentralized applications. 
                This comprehensive guide covers everything you need to know to get started.
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <span>By Alice Crypto</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>15:30</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>1,247 views</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Session: 0:45</div>
                    <div className="text-sm font-medium text-green-600">Paid: 0.045 SOM</div>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <DollarSign className="w-4 h-4" />
                    <span>$ 0.001 SOM/sec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Library */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Content Library</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockContent.map((item) => (
              <div 
                key={item.id} 
                className="card hover:shadow-md transition-shadow cursor-pointer bg-white rounded-lg shadow-sm overflow-hidden"
                onClick={() => handleContentClick(item)}
              >
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 relative">
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Play className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
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

      {/* Content Player Modal */}
      {selectedContent && (
        <ContentPlayer 
          content={selectedContent} 
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
};

export default Dashboard;
