import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { useMeteredAccess } from '../../hooks/useContracts';
import { useUIState } from '../../hooks/useAppState';
import { type ContentItem } from '../../types/contracts';

interface ContentPlayerProps {
  content: ContentItem;
  onClose?: () => void;
}

const ContentPlayer: React.FC<ContentPlayerProps> = ({ content, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes default
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { startSession, updateSession, endSession, isLoading } = useMeteredAccess();
  const { addNotification } = useUIState();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalPaid, setTotalPaid] = useState(0);

  useEffect(() => {
    // Initialize session when component mounts
    const initSession = async () => {
      try {
        if (startSession) {
          const session = await startSession(content.id);
          setSessionId(session);
          addNotification({
            type: 'success',
            title: 'Session Started',
            message: `Micropayment session created for ${content.title}`,
          });
        }
      } catch (error) {
        console.error('Error creating session:', error);
        addNotification({
          type: 'error',
          title: 'Session Error',
          message: 'Failed to create micropayment session',
        });
      }
    };

    initSession();

    // Cleanup session when component unmounts
    return () => {
      if (sessionId && endSession) {
        endSession(sessionId);
      }
    };
  }, [content, startSession, endSession, addNotification]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          // Add error handling for play
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              console.warn('Video play failed:', error);
              // Don't update isPlaying state if play fails
            });
          }
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.warn('Video control error:', error);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(videoRef.current.currentTime + seconds, duration));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePayment = (timeInSeconds: number) => {
    return (timeInSeconds * content.pricePerSecond) / 1e18;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{content.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 md:h-96 bg-gray-900"
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/sample-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

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
                    disabled={isLoading}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-1" />
                    )}
                  </button>
                  
                  <button 
                    onClick={() => handleSkip(-10)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <SkipBack className="w-4 h-4 text-white" />
                  </button>
                  
                  <button 
                    onClick={() => handleSkip(10)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <SkipForward className="w-4 h-4 text-white" />
                  </button>
                  
                  <div className="text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white text-sm">
                      ${calculatePayment(currentTime).toFixed(6)} SOM paid
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Creator: {content.creator}</span>
            <span className="text-sm text-green-600">
              Total Paid: ${totalPaid.toFixed(6)} SOM
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            Rate: ${(content.pricePerSecond / 1e18).toFixed(6)} SOM/sec
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPlayer;
