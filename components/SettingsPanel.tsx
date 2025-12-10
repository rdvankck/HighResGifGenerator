import React, { useEffect } from 'react';
import { Settings, Maximize, Clock, Zap, PaintBucket } from 'lucide-react';
import { GifSettings, GifFrame } from '../types';

interface SettingsPanelProps {
  settings: GifSettings;
  setSettings: React.Dispatch<React.SetStateAction<GifSettings>>;
  firstFrame: GifFrame | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, setSettings, firstFrame }) => {
  
  // Update dimensions when auto mode is active and we have a first frame
  useEffect(() => {
    if (!settings.isCustomSize && firstFrame) {
      setSettings(prev => ({
        ...prev,
        width: firstFrame.width,
        height: firstFrame.height
      }));
    }
  }, [firstFrame, settings.isCustomSize, setSettings]);

  const handleChange = (key: keyof GifSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit sticky top-6">
      <div className="flex items-center space-x-2 mb-6 border-b border-gray-700 pb-4">
        <Settings className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-semibold text-white">Configuration</h2>
      </div>

      <div className="space-y-6">
        
        {/* Delay Setting */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            Frame Delay (Seconds)
          </label>
          <input
            type="number"
            step="0.05"
            min="0.01"
            value={settings.delay}
            onChange={(e) => handleChange('delay', parseFloat(e.target.value))}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
          <p className="text-xs text-gray-500">Lower = faster animation</p>
        </div>

        {/* Background Setting */}
        <div className="space-y-3">
          <label className="flex items-center text-sm font-medium text-gray-300">
            <PaintBucket className="w-4 h-4 mr-2 text-gray-500" />
            Background
          </label>
          
          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            <button
              onClick={() => handleChange('transparent', true)}
              className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                settings.transparent 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Transparent
            </button>
            <button
              onClick={() => handleChange('transparent', false)}
              className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all ${
                !settings.transparent 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Solid Color
            </button>
          </div>

          {!settings.transparent && (
            <div className="flex items-center space-x-3 bg-gray-900 p-3 rounded-lg border border-gray-700 animate-in fade-in slide-in-from-top-1 duration-200">
              <input
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <span className="text-sm text-gray-300 font-mono uppercase">
                {settings.backgroundColor}
              </span>
            </div>
          )}
           {settings.transparent && (
              <p className="text-xs text-gray-500">
                Best for PNGs. Transparent areas will remain transparent in the GIF.
              </p>
            )}
        </div>

        {/* Size Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm font-medium text-gray-300">
              <Maximize className="w-4 h-4 mr-2 text-gray-500" />
              Dimensions
            </label>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-900 rounded-lg border border-gray-700">
            <input
              type="checkbox"
              id="customSize"
              checked={settings.isCustomSize}
              onChange={(e) => handleChange('isCustomSize', e.target.checked)}
              className="w-4 h-4 text-indigo-500 rounded border-gray-600 focus:ring-indigo-500 focus:ring-offset-gray-900 bg-gray-700"
            />
            <label htmlFor="customSize" className="text-sm text-gray-300 select-none cursor-pointer">
              Choose width & height manually
            </label>
          </div>

          <div className={`grid grid-cols-2 gap-3 transition-opacity duration-200 ${settings.isCustomSize ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
              <input
                type="number"
                value={settings.width || ''}
                onChange={(e) => handleChange('width', parseInt(e.target.value))}
                placeholder={firstFrame ? String(firstFrame.width) : "Auto"}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
              <input
                type="number"
                value={settings.height || ''}
                onChange={(e) => handleChange('height', parseInt(e.target.value))}
                placeholder={firstFrame ? String(firstFrame.height) : "Auto"}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
           {!settings.isCustomSize && firstFrame && (
              <p className="text-xs text-green-400">
                Auto-detected: {firstFrame.width}x{firstFrame.height}px (High Quality)
              </p>
            )}
        </div>

        {/* Quality Hint */}
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
           <div className="flex items-start">
             <Zap className="w-4 h-4 text-indigo-400 mt-0.5 mr-2 shrink-0" />
             <p className="text-xs text-indigo-200">
               High-Res Mode Active. Output will attempt to maintain the highest possible color accuracy and sharpness supported by the GIF format.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;