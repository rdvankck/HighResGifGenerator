import React, { useState, useEffect } from 'react';
import { Play, Download, Trash2, X, Clock } from 'lucide-react';
import { GifFrame, GifSettings } from '../types';

interface GifPreviewProps {
  frames: GifFrame[];
  settings: GifSettings;
  generatedGifUrl: string | null;
  onRemoveFrame: (id: string) => void;
  isGenerating: boolean;
  onUpdateFrameDuration: (id: string, duration: number) => void;
}

const GifPreview: React.FC<GifPreviewProps> = ({ frames, settings, generatedGifUrl, onRemoveFrame, isGenerating, onUpdateFrameDuration }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Simulation Logic with individual frame durations
  useEffect(() => {
    if (frames.length === 0 || generatedGifUrl) return;

    let frameIndex = 0;
    const interval = setInterval(() => {
      setCurrentFrameIndex(frameIndex);
      frameIndex = (frameIndex + 1) % frames.length;
    }, 100); // Check every 100ms

    return () => clearInterval(interval);
  }, [frames.length, generatedGifUrl]);

  useEffect(() => {
    if (frames.length === 0 || generatedGifUrl) return;

    const currentFrame = frames[currentFrameIndex];
    const timeout = setTimeout(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, currentFrame.duration * 1000);

    return () => clearTimeout(timeout);
  }, [currentFrameIndex, frames, generatedGifUrl]);

  if (frames.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700 flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
          <Play className="w-8 h-8 text-gray-500 ml-1" />
        </div>
        <h3 className="text-gray-400 font-medium">No images uploaded</h3>
        <p className="text-gray-500 text-sm mt-1">Upload images to start previewing</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Preview Area */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 relative shadow-2xl flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
        <div className="relative w-full aspect-video flex items-center justify-center p-4 min-h-[400px]">
          {generatedGifUrl ? (
            <img 
              src={generatedGifUrl} 
              alt="Final GIF" 
              className="max-w-full max-h-[500px] object-contain shadow-lg rounded"
            />
          ) : (
            <div className="relative flex flex-col items-center">
              <img
                src={frames[currentFrameIndex].previewUrl}
                alt={`Frame ${currentFrameIndex + 1}`}
                className="max-w-full max-h-[500px] object-contain shadow-lg rounded transition-all duration-75"
              />
              <div className="absolute bottom-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono border border-white/10">
                Frame: {currentFrameIndex + 1} / {frames.length} • {frames[currentFrameIndex].duration}s
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frame List (Timeline) */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center justify-between">
            <span>Frame Timeline</span>
            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">{frames.length} frames</span>
        </h3>
        <div className="space-y-3">
          {frames.map((frame, idx) => (
            <div
              key={frame.id}
              className={`flex items-center space-x-3 p-3 rounded-lg border-2 group transition-all ${
                !generatedGifUrl && idx === currentFrameIndex
                  ? 'border-indigo-500 bg-indigo-500/5'
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
              }`}
            >
              <div
                className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border cursor-pointer"
                onClick={() => setCurrentFrameIndex(idx)}
              >
                <img
                  src={frame.previewUrl}
                  alt={`Thumb ${idx}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                  {idx + 1}
                </div>
              </div>
              
              <div className="flex-grow flex items-center space-x-3">
                <div className="flex items-center space-x-2 flex-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <label className="text-sm text-gray-300">Duration:</label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={frame.duration}
                    onChange={(e) => onUpdateFrameDuration(frame.id, parseFloat(e.target.value))}
                    disabled={isGenerating}
                    className="w-20 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-400">seconds</span>
                </div>
                
                <button
                  onClick={() => onRemoveFrame(frame.id)}
                  disabled={isGenerating}
                  className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GifPreview;
