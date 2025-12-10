import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { GifFrame } from '../types';

interface ImageUploaderProps {
  onImagesSelected: (newFrames: GifFrame[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesSelected }) => {
  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const newFrames: Promise<GifFrame>[] = Array.from(files)
      .filter(file => file.type.startsWith('image/'))
      .map(file => {
        return new Promise<GifFrame>((resolve) => {
          const img = new Image();
          const url = URL.createObjectURL(file);
          img.onload = () => {
            resolve({
              id: Math.random().toString(36).substring(7),
              file,
              previewUrl: url,
              width: img.naturalWidth,
              height: img.naturalHeight,
            });
          };
          img.src = url;
        });
      });

    Promise.all(newFrames).then(frames => {
      // Sort roughly by name to be helpful, though usually user wants control
      frames.sort((a, b) => a.file.name.localeCompare(b.file.name));
      onImagesSelected(frames);
    });
  }, [onImagesSelected]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-colors rounded-xl p-8 text-center cursor-pointer group relative overflow-hidden"
    >
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
          <Upload className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-white">Drop images here</h3>
          <p className="text-gray-400 text-sm mt-1">or click to browse</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <ImageIcon className="w-4 h-4" />
          <span>Supports PNG, JPG, WEBP, GIF</span>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
