# YouTube Video Background Setup Structure

This folder contains all the files needed to set up a YouTube video background for your React application.

## 📁 Files Included:

### 1. **VideoBackground.tsx**
- Main component for YouTube video background
- Features:
  - YouTube embed with auto-play and loop
  - Retro gaming scanlines effect
  - Pokemon Emerald theme UI elements
  - Loading animation with fade-in effect
  - Gradient fallback background
  - Responsive 16:9 aspect ratio

### 2. **Index.tsx**
- Main page component that uses VideoBackground
- Features:
  - Fabric classification interface
  - Image upload functionality
  - Materials database display
  - Blog section with recycling insights
  - Responsive design with Tailwind CSS

### 3. **README.md** (This file)
- Documentation for the setup structure

## 🚀 How to Use:

1. **Copy VideoBackground.tsx** to your components folder
2. **Copy Index.tsx** to your pages folder
3. **Install dependencies**: `npm install react lucide-react sonner`
4. **Import VideoBackground** in your main component:
   ```tsx
   import VideoBackground from '@/components/VideoBackground';
   ```
5. **Use it in your component**:
   ```tsx
   <VideoBackground />
   ```

## 🎮 Features:

- **YouTube Video Background**: Embeds YouTube video with custom parameters
- **Retro Gaming Aesthetic**: Scanlines and Pokemon Emerald theme
- **Loading States**: Smooth fade-in animations
- **Responsive Design**: Works on all screen sizes
- **Fallback Background**: Gradient if video fails to load
- **Interactive Elements**: Time display, region indicators

## 📋 YouTube Embed Parameters:

- `autoplay=1` - Auto-play video
- `mute=1` - No audio
- `loop=1` - Continuous loop
- `controls=0` - No video controls
- `showinfo=0` - No video info
- `modestbranding=1` - Minimal YouTube branding
- `rel=0` - No related videos
- `iv_load_policy=3` - No annotations
- `disablekb=1` - Disable keyboard controls

## 🎨 Styling Features:

- **Blur Effect**: Subtle background blur
- **Brightness Control**: Adjusted for readability
- **Z-index Layering**: Proper stacking order
- **Scanlines Animation**: Retro gaming effect
- **Gradient Fallback**: Safety net background

## ⚠️ Notes:

- The TypeScript errors in Index.tsx are expected since this is a standalone copy
- In your actual project, the import paths would resolve correctly
- No MP4 files needed - YouTube streams directly to the browser
- Make sure to have Tailwind CSS configured for the styling to work

## 🔧 Dependencies:

- React (for hooks and components)
- Lucide React (for icons)
- Sonner (for toast notifications)
- Tailwind CSS (for styling)

This setup provides a complete, self-contained YouTube video background solution with a retro gaming aesthetic!
