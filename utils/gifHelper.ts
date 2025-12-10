import GIF from 'gif.js';
import { GifFrame, GifSettings } from '../types';

// We need to fetch the worker script from a CDN to create a local Blob URL.
// This allows the app to run without needing a specific file in the 'public' folder.
const WORKER_URL = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';

let workerBlobUrl: string | null = null;

const getWorkerBlobUrl = async (): Promise<string> => {
  if (workerBlobUrl) return workerBlobUrl;

  try {
    const response = await fetch(WORKER_URL);
    if (!response.ok) throw new Error('Failed to load GIF worker');
    const workerScript = await response.text();
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    workerBlobUrl = URL.createObjectURL(blob);
    return workerBlobUrl;
  } catch (error) {
    console.error("Could not load worker script automatically. Fallback might fail.", error);
    // Fallback to expecting it at root if fetch fails (rare)
    return 'gif.worker.js';
  }
};

export const generateGif = async (
  frames: GifFrame[],
  settings: GifSettings,
  onProgress: (progress: number) => void
): Promise<Blob> => {
  const workerUrl = await getWorkerBlobUrl();

  return new Promise((resolve, reject) => {
    if (frames.length === 0) {
      reject(new Error("No frames to generate"));
      return;
    }

    // Determine output dimensions
    let outputWidth = 0;
    let outputHeight = 0;

    if (settings.isCustomSize && settings.width && settings.height) {
      outputWidth = settings.width;
      outputHeight = settings.height;
    } else {
      // Auto: Use the first frame's dimensions
      outputWidth = frames[0].width;
      outputHeight = frames[0].height;
    }

    // Prepare GIF options
    // If transparent is selected, we use a distinct color (Chroma Key) 
    // to fill the background and then tell gif.js to treat that color as transparent.
    // 0xFF00FF (Magenta) is a standard key color.
    const transparentColorHex = 0xFF00FF; 
    const transparentColorString = '#FF00FF';

    const gifOptions: any = {
      workers: 2,
      quality: settings.quality, // 1 is best
      width: outputWidth,
      height: outputHeight,
      workerScript: workerUrl,
      repeat: settings.repeat,
    };

    if (settings.transparent) {
      gifOptions.transparent = transparentColorHex;
    }

    const gif = new GIF(gifOptions);

    gif.on('progress', (p: number) => {
      onProgress(p);
    });

    gif.on('finished', (blob: Blob) => {
      resolve(blob);
    });

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolveImg, rejectImg) => {
        const img = new Image();
        img.onload = () => resolveImg(img);
        img.onerror = (e) => rejectImg(e);
        img.src = src;
      });
    };

    // Load all images and add them to the GIF
    const processFrames = async () => {
      try {
        for (const frame of frames) {
          const img = await loadImage(frame.previewUrl);
          
          const canvas = document.createElement('canvas');
          canvas.width = outputWidth;
          canvas.height = outputHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';

              // Handle Background
              if (settings.transparent) {
                // Fill with the chroma key color first
                ctx.fillStyle = transparentColorString;
                ctx.fillRect(0, 0, outputWidth, outputHeight);
              } else {
                // Fill with user selected background color
                ctx.fillStyle = settings.backgroundColor;
                ctx.fillRect(0, 0, outputWidth, outputHeight);
              }
              
              // Draw the image on top
              // We stretch to fit the dimensions provided.
              ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
              
              gif.addFrame(canvas, { delay: frame.duration * 1000 });
          }
        }

        gif.render();
      } catch (err) {
        reject(err);
      }
    };

    processFrames();
  });
};