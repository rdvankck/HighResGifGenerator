import React, { useState, useEffect } from 'react';
import { Layers, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import SettingsPanel from './components/SettingsPanel';
import GifPreview from './components/GifPreview';
import { GifFrame, GifSettings, GenerationStatus } from './types';
import { generateGif } from './utils/gifHelper';

const App: React.FC = () => {
  // --- State ---
  const [frames, setFrames] = useState<GifFrame[]>([]);
  const [settings, setSettings] = useState<GifSettings>({
    delay: 0.5,
    quality: 1, // Best quality by default
    width: null,
    height: null,
    isCustomSize: false,
    repeat: 0,
    transparent: true, // Default to transparent for PNGs
    backgroundColor: '#ffffff',
  });
  
  const [status, setStatus] = useState<GenerationStatus>({
    isGenerating: false,
    progress: 0,
    stage: 'idle'
  });

  const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  const handleImagesSelected = (newFrames: GifFrame[]) => {
    setFrames(prev => [...prev, ...newFrames]);
    setGeneratedGifUrl(null); // Reset result if new images added
    setError(null);
  };

  const handleRemoveFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
    setGeneratedGifUrl(null);
  };

  const handleUpdateFrameDuration = (id: string, duration: number) => {
    setFrames(prev => prev.map(frame => 
      frame.id === id ? { ...frame, duration } : frame
    ));
    setGeneratedGifUrl(null);
  };

  const handleGenerate = async () => {
    if (frames.length === 0) return;

    setGeneratedGifUrl(null);
    setError(null);
    setStatus({ isGenerating: true, progress: 0, stage: 'loading-images' });

    try {
        // Small delay to let UI update
        await new Promise(r => setTimeout(r, 100));
        
        setStatus(prev => ({ ...prev, stage: 'rendering' }));

        const blob = await generateGif(frames, settings, (progress) => {
            setStatus(prev => ({ 
                ...prev, 
                progress, 
                stage: 'encoding' 
            }));
        });

        const url = URL.createObjectURL(blob);
        setGeneratedGifUrl(url);
        setStatus({ isGenerating: false, progress: 1, stage: 'done' });
    } catch (err: any) {
        console.error(err);
        setError("Failed to create GIF. Please try fewer frames or smaller dimensions if memory is an issue.");
        setStatus({ isGenerating: false, progress: 0, stage: 'error' });
    }
  };

  const handleDownload = () => {
    if (generatedGifUrl) {
      const a = document.createElement('a');
      a.href = generatedGifUrl;
      a.download = `animation-${Date.now()}.gif`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Layers className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              High-Res GIF Creator
            </h1>
          </div>
          <div className="text-sm text-gray-500 hidden sm:block">
            Pro Client-Side Processing
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Settings & Upload */}
          <div className="lg:col-span-4 space-y-6">
            <ImageUploader onImagesSelected={handleImagesSelected} />
            <SettingsPanel 
                settings={settings} 
                setSettings={setSettings} 
                firstFrame={frames.length > 0 ? frames[0] : null}
            />
            
            {/* Generate Button Area */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <button
                    onClick={handleGenerate}
                    disabled={status.isGenerating || frames.length === 0}
                    className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2 
                    ${status.isGenerating 
                        ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                        : frames.length === 0 
                            ? 'bg-gray-700 cursor-not-allowed text-gray-500' 
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 hover:shadow-indigo-500/40'
                    }`}
                >
                    {status.isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>
                                {status.stage === 'encoding' 
                                    ? `Encoding ${(status.progress * 100).toFixed(0)}%` 
                                    : 'Processing...'}
                            </span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            <span>Create GIF</span>
                        </>
                    )}
                </button>
                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                        {error}
                    </div>
                )}
            </div>
          </div>

          {/* Right Column: Preview & Result */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="flex-grow">
                <GifPreview 
                    frames={frames} 
                    settings={settings} 
                    generatedGifUrl={generatedGifUrl}
                    onRemoveFrame={handleRemoveFrame}
                    onUpdateFrameDuration={handleUpdateFrameDuration}
                    isGenerating={status.isGenerating}
                />
            </div>
            
            {/* Download Action Bar */}
            {generatedGifUrl && !status.isGenerating && (
                 <div className="mt-6 p-6 bg-gray-800 rounded-xl border border-green-500/30 flex flex-col sm:flex-row items-center justify-between shadow-lg shadow-green-900/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-semibold text-green-400">GIF Ready!</h3>
                        <p className="text-gray-400 text-sm">Your high-resolution animation is ready to save.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setGeneratedGifUrl(null)}
                            className="px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            Back to Edit
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold shadow-lg shadow-green-600/20 transition-all flex items-center"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download GIF
                        </button>
                    </div>
                </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;