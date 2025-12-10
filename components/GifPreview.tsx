import React, { useState, useEffect } from 'react';
import { Play, Download, Trash2, X } from 'lucide-react';
import { GifFrame, GifSettings } from '../types';

interface GifPreviewProps {
  frames: GifFrame[];
  settings: GifSettings;
  generatedGifUrl: string | null;
  onRemoveFrame: (id: string) => void;
  isGenerating: boolean;
}

const GifPreview: React.FC<GifPreviewProps> = ({ frames, settings, generatedGifUrl, onRemoveFrame, isGenerating }) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Simulation Logic
  useEffect(() => {
    if (frames.length === 0 || generatedGifUrl) return;

    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, settings.delay * 1000);

    return () => clearInterval(interval);
  }, [frames.length, settings.delay, generatedGifUrl]);

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
                Preview Frame: {currentFrameIndex + 1} / {frames.length}
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
        <div className="flex space-x-2 overflow-x-auto pb-4 custom-scrollbar">
          {frames.map((frame, idx) => (
            <div
              key={frame.id}
              className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 group transition-all cursor-pointer ${
                !generatedGifUrl && idx === currentFrameIndex
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-105 z-10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
              onClick={() => setCurrentFrameIndex(idx)}
            >
              <img
                src={frame.previewUrl}
                alt={`Thumb ${idx}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded">
                {idx + 1}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFrame(frame.id);
                }}
                disabled={isGenerating}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GifPreview;
