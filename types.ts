export interface GifFrame {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export interface GifSettings {
  delay: number; // in seconds
  quality: number; // 1-10 (1 is best)
  width: number | null; // null means auto
  height: number | null; // null means auto
  isCustomSize: boolean;
  repeat: number; // 0 for infinite
  transparent: boolean;
  backgroundColor: string; // hex string e.g. #ffffff
}

export interface GenerationStatus {
  isGenerating: boolean;
  progress: number; // 0 to 1
  stage: 'idle' | 'loading-images' | 'rendering' | 'encoding' | 'done' | 'error';
}