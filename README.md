# HighResGifGenerator

A high-resolution GIF generator tool for creating optimized animated GIFs with a modern React interface.

## Features

- Create high-resolution animated GIFs from images
- Web-based interface using React and TypeScript
- Real-time preview
- Optimized file sizes
- Customizable settings

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser to `http://localhost:5173` (or the port shown in terminal)
2. Upload images using the file uploader
3. Adjust GIF settings in the settings panel
4. Generate and preview your GIF
5. Download the result

## Project Structure

- `components/` - React components for the UI
- `utils/` - Helper functions for GIF processing
- `types.ts` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
