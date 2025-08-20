import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useMeteredAccess } from '../../hooks/useContracts';
import { useUIState } from '../../hooks/useAppState';
import { type ContentItem } from '../../types/contracts';

interface ContentPlayerProps {
  content: ContentItem;
}

export const ContentPlayer: React.FC<ContentPlayerProps> = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [consumption, setConsumption] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const consumptionInterval = useRef<NodeJS.Timeout | null>(null);
  
  const { createSession, updateSession, endSession } = useMeteredAccess();

  const { setLoading, setError, addNotification } = useUIState();

  // Start session when component mounts
  useEffect(() => {
    const startSession = async () => {
      try {
        setLoading(true);
        const txHash = await createSession(content.creator, content.id);
        setSessionId(txHash);
        
        addNotification({
          type: 'success',
          title: 'Session Started',
          message: `Started watching ${content.title}`,
        });
        
        // Start consumption tracking
        startConsumptionTracking();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to start session');
      } finally {
        setLoading(false);
      }
    };

    startSession();
  }, [content]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        endSession(sessionId);
      }
      if (consumptionInterval.current) {
        clearInterval(consumptionInterval.current);
      }
    };
  }, [sessionId]);

  const startConsumptionTracking = () => {
    consumptionInterval.current = setInterval(async () => {
      if (isPlaying && sessionId) {
        try {
          const newConsumption = consumption + 1;
          setConsumption(newConsumption);
          
          // Update session every 10 seconds
          if (newConsumption % 10 === 0) {
            await updateSession(sessionId, newConsumption);
          }
        } catch (error) {
          console.error('Failed to update consumption:', error);
        }
      }
    }, 1000);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateCost = () => {
    return (consumption * content.pricePerSecond) / 1e18;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      {/* Video Container */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={`/api/content/${content.id}/stream`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full h-1 bg-gray-600 rounded-lg">
                <div 
                  className="h-1 bg-blue-500 rounded-lg transition-all"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-white text-sm mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              
              <div className="flex items-center space-x-2">
                <Volume2 size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4 bg-gray-900">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{content.title}</h2>
            <p className="text-gray-300 text-sm mb-2">{content.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Price: {content.pricePerSecond / 1e18} SOM/s</span>
              <span>Views: {content.totalViews}</span>
            </div>
          </div>
          
          {/* Session Info */}
          <div className="text-right">
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-2">
              Session Active
            </div>
            <div className="text-sm text-gray-300">
              <div>Time: {formatTime(consumption)}</div>
              <div>Cost: {calculateCost().toFixed(6)} SOM</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
