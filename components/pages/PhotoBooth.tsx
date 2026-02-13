"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { playCameraShutter } from "@/utils/sounds";
import { LoveNoteHeart } from "../effects/LoveNotes";

const FloatingHeart = ({ delay, x, y, size, rotation }: { delay: number; x: string; y: string; size: number; rotation: number }) => (
  <div
    className="absolute pointer-events-none animate-float-slow"
    style={{
      left: x,
      top: y,
      fontSize: size,
      color: "#A8C69F",
      animationDelay: `${delay}s`,
      opacity: '0.6',
      transform: `rotate(${rotation}deg)`
    }}
    aria-hidden="true"
  >
    🍵
  </div>
);

interface PhotoBoothProps {
  onNext: () => void;
  onPrev: () => void;
}

type FrameType = "purikura" | "hearts" | "cookies" | "minimal" | "none";
type FilterType = "normal" | "soft-glow" | "vintage" | "matcha" | "pink";

// Filter configurations for CSS preview and canvas capture
const FILTERS: Record<FilterType, { css: string; label: string; icon: string }> = {
  normal: { css: "", label: "Normal", icon: "📷" },
  "soft-glow": { css: "brightness(1.08) contrast(0.92) saturate(1.1)", label: "Soft Glow", icon: "✨" },
  vintage: { css: "sepia(0.2) saturate(1.15) brightness(1.05) contrast(0.95)", label: "Vintage", icon: "🎞️" },
  matcha: { css: "saturate(0.9) brightness(1.05) hue-rotate(15deg)", label: "Matcha", icon: "🌿" },
  pink: { css: "saturate(1.1) brightness(1.08) hue-rotate(-10deg)", label: "Soft Pink", icon: "🌸" },
};

// Frame decoration positions for purikura style
const PURIKURA_DECORATIONS = [
  // Top edge
  { emoji: "✨", x: 0.1, y: 0.02, size: 18 },
  { emoji: "💕", x: 0.25, y: 0.01, size: 22 },
  { emoji: "🌸", x: 0.5, y: 0.02, size: 20 },
  { emoji: "⭐", x: 0.75, y: 0.01, size: 18 },
  { emoji: "✨", x: 0.9, y: 0.02, size: 16 },
  // Left edge
  { emoji: "🍪", x: 0.02, y: 0.25, size: 18 },
  { emoji: "💕", x: 0.01, y: 0.5, size: 20 },
  { emoji: "🌸", x: 0.02, y: 0.75, size: 18 },
  // Right edge
  { emoji: "⭐", x: 0.98, y: 0.25, size: 16 },
  { emoji: "✨", x: 0.99, y: 0.5, size: 18 },
  { emoji: "💕", x: 0.98, y: 0.75, size: 20 },
];

export default function PhotoBooth({ onNext }: PhotoBoothProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameType>("purikura");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("soft-glow");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  // Start webcam - with iOS Safari compatibility
  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // iOS Safari requires specific constraints
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
        },
        audio: false,
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // iOS Safari needs explicit play call
        try {
          await videoRef.current.play();
        } catch (playError) {
          console.log("Video autoplay handled:", playError);
        }
      }
    } catch (err) {
      console.error("Camera error:", err);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Camera access denied. Please allow camera permissions in your browser settings.");
        } else if (err.name === "NotFoundError") {
          setError("No camera found on this device.");
        } else if (err.name === "NotReadableError") {
          setError("Camera is in use by another app. Please close other apps using the camera.");
        } else {
          setError("Could not access camera. Please try again.");
        }
      } else {
        setError("Could not access camera. Please allow camera permissions and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Set video srcObject when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Helper to draw emoji on canvas
  const drawEmoji = useCallback((ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number, size: number) => {
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, x, y);
  }, []);

  // Get current date formatted for purikura stamp
  const getDateStamp = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }, []);

  // Draw frame overlay on canvas - using emojis to match preview
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: FrameType) => {
    ctx.save();
    
    switch (frame) {
      case "purikura":
        // Full purikura-style frame with cream border
        const borderWidth = Math.min(width, height) * 0.05;
        const bottomStripHeight = Math.min(width, height) * 0.12;
        
        // Draw cream/white border frame
        ctx.fillStyle = "#F5F5F0";
        // Top border
        ctx.fillRect(0, 0, width, borderWidth);
        // Bottom border (taller for text)
        ctx.fillRect(0, height - bottomStripHeight, width, bottomStripHeight);
        // Left border
        ctx.fillRect(0, 0, borderWidth, height);
        // Right border
        ctx.fillRect(width - borderWidth, 0, borderWidth, height);
        
        // Add subtle inner shadow/border
        ctx.strokeStyle = "rgba(123, 158, 108, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(borderWidth - 1, borderWidth - 1, width - borderWidth * 2 + 2, height - bottomStripHeight - borderWidth + 2);
        
        // Draw scattered decorations along border
        PURIKURA_DECORATIONS.forEach(dec => {
          const decX = dec.x * width;
          const decY = dec.y * height;
          const scaledSize = dec.size * (width / 400); // Scale based on canvas size
          drawEmoji(ctx, dec.emoji, decX, decY, scaledSize);
        });
        
        // Bottom strip with date and text
        ctx.fillStyle = "#6B5B4F";
        ctx.font = `bold ${Math.floor(width * 0.04)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Baked with Love 💕 ${getDateStamp()}`, width / 2, height - bottomStripHeight / 2);
        
        // Add corner sparkles
        const cornerSize = Math.floor(width * 0.06);
        drawEmoji(ctx, "✨", borderWidth / 2, borderWidth / 2, cornerSize);
        drawEmoji(ctx, "✨", width - borderWidth / 2, borderWidth / 2, cornerSize);
        break;
        
      case "hearts":
        // Pink/rose border with hearts - purikura style
        const heartBorderWidth = Math.min(width, height) * 0.05;
        const heartBottomStrip = Math.min(width, height) * 0.12;
        
        // Draw pink border frame
        ctx.fillStyle = "#FADADD";
        ctx.fillRect(0, 0, width, heartBorderWidth);
        ctx.fillRect(0, height - heartBottomStrip, width, heartBottomStrip);
        ctx.fillRect(0, 0, heartBorderWidth, height);
        ctx.fillRect(width - heartBorderWidth, 0, heartBorderWidth, height);
        
        // Inner accent border
        ctx.strokeStyle = "rgba(219, 112, 147, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(heartBorderWidth - 1, heartBorderWidth - 1, width - heartBorderWidth * 2 + 2, height - heartBottomStrip - heartBorderWidth + 2);
        
        // Heart decorations around border
        const heartDecorations = [
          // Top
          { emoji: "💕", x: 0.08, y: 0.02 }, { emoji: "💗", x: 0.25, y: 0.02 },
          { emoji: "💕", x: 0.5, y: 0.02 }, { emoji: "💗", x: 0.75, y: 0.02 },
          { emoji: "💕", x: 0.92, y: 0.02 },
          // Left
          { emoji: "💗", x: 0.02, y: 0.2 }, { emoji: "💕", x: 0.02, y: 0.4 },
          { emoji: "💗", x: 0.02, y: 0.6 }, { emoji: "💕", x: 0.02, y: 0.8 },
          // Right
          { emoji: "💕", x: 0.98, y: 0.2 }, { emoji: "💗", x: 0.98, y: 0.4 },
          { emoji: "💕", x: 0.98, y: 0.6 }, { emoji: "💗", x: 0.98, y: 0.8 },
          // Corners
          { emoji: "💖", x: 0.02, y: 0.02 }, { emoji: "💖", x: 0.98, y: 0.02 },
        ];
        const heartEmojiSize = Math.floor(width * 0.05);
        heartDecorations.forEach(dec => {
          drawEmoji(ctx, dec.emoji, dec.x * width, dec.y * height, heartEmojiSize);
        });
        
        // Bottom strip text
        ctx.fillStyle = "#DB7093";
        ctx.font = `bold ${Math.floor(width * 0.04)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`💕 With Love 💕 ${getDateStamp()}`, width / 2, height - heartBottomStrip / 2);
        break;
        
      case "cookies":
        // Cookie tan border with cookies - purikura style
        const cookieBorderWidth = Math.min(width, height) * 0.05;
        const cookieBottomStrip = Math.min(width, height) * 0.12;
        
        // Draw tan/wheat border frame
        ctx.fillStyle = "#F5DEB3";
        ctx.fillRect(0, 0, width, cookieBorderWidth);
        ctx.fillRect(0, height - cookieBottomStrip, width, cookieBottomStrip);
        ctx.fillRect(0, 0, cookieBorderWidth, height);
        ctx.fillRect(width - cookieBorderWidth, 0, cookieBorderWidth, height);
        
        // Inner accent border
        ctx.strokeStyle = "rgba(139, 90, 43, 0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(cookieBorderWidth - 1, cookieBorderWidth - 1, width - cookieBorderWidth * 2 + 2, height - cookieBottomStrip - cookieBorderWidth + 2);
        
        // Cookie decorations around border
        const cookieDecorations = [
          // Top
          { emoji: "🍪", x: 0.1, y: 0.02 }, { emoji: "✨", x: 0.3, y: 0.02 },
          { emoji: "🍪", x: 0.5, y: 0.02 }, { emoji: "✨", x: 0.7, y: 0.02 },
          { emoji: "🍪", x: 0.9, y: 0.02 },
          // Left
          { emoji: "🍪", x: 0.02, y: 0.25 }, { emoji: "✨", x: 0.02, y: 0.5 },
          { emoji: "🍪", x: 0.02, y: 0.75 },
          // Right
          { emoji: "✨", x: 0.98, y: 0.25 }, { emoji: "🍪", x: 0.98, y: 0.5 },
          { emoji: "✨", x: 0.98, y: 0.75 },
          // Corners
          { emoji: "🍪", x: 0.02, y: 0.02 }, { emoji: "🍪", x: 0.98, y: 0.02 },
        ];
        const cookieEmojiSize = Math.floor(width * 0.05);
        cookieDecorations.forEach(dec => {
          drawEmoji(ctx, dec.emoji, dec.x * width, dec.y * height, cookieEmojiSize);
        });
        
        // Bottom strip text
        ctx.fillStyle = "#8B5A2B";
        ctx.font = `bold ${Math.floor(width * 0.04)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`🍪 Fresh Baked 🍪 ${getDateStamp()}`, width / 2, height - cookieBottomStrip / 2);
        break;
        
      case "minimal":
        // Matcha green border - purikura style
        const matchaBorderWidth = Math.min(width, height) * 0.05;
        const matchaBottomStrip = Math.min(width, height) * 0.12;
        
        // Draw matcha green border frame
        ctx.fillStyle = "#A8C69F";
        ctx.fillRect(0, 0, width, matchaBorderWidth);
        ctx.fillRect(0, height - matchaBottomStrip, width, matchaBottomStrip);
        ctx.fillRect(0, 0, matchaBorderWidth, height);
        ctx.fillRect(width - matchaBorderWidth, 0, matchaBorderWidth, height);
        
        // Inner accent border
        ctx.strokeStyle = "rgba(90, 122, 76, 0.4)";
        ctx.lineWidth = 2;
        ctx.strokeRect(matchaBorderWidth - 1, matchaBorderWidth - 1, width - matchaBorderWidth * 2 + 2, height - matchaBottomStrip - matchaBorderWidth + 2);
        
        // Matcha decorations around border
        const matchaDecorations = [
          // Top
          { emoji: "🍵", x: 0.1, y: 0.02 }, { emoji: "🌿", x: 0.25, y: 0.02 },
          { emoji: "🍃", x: 0.5, y: 0.02 }, { emoji: "🌿", x: 0.75, y: 0.02 },
          { emoji: "🍵", x: 0.9, y: 0.02 },
          // Left
          { emoji: "🌿", x: 0.02, y: 0.25 }, { emoji: "🍃", x: 0.02, y: 0.5 },
          { emoji: "🌿", x: 0.02, y: 0.75 },
          // Right
          { emoji: "🍃", x: 0.98, y: 0.25 }, { emoji: "🌿", x: 0.98, y: 0.5 },
          { emoji: "🍃", x: 0.98, y: 0.75 },
          // Corners
          { emoji: "🍵", x: 0.02, y: 0.02 }, { emoji: "🍵", x: 0.98, y: 0.02 },
        ];
        const matchaEmojiSize = Math.floor(width * 0.05);
        matchaDecorations.forEach(dec => {
          drawEmoji(ctx, dec.emoji, dec.x * width, dec.y * height, matchaEmojiSize);
        });
        
        // Bottom strip text
        ctx.fillStyle = "#3D5A3A";
        ctx.font = `bold ${Math.floor(width * 0.04)}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`🍃 Matcha Moments 🍃 ${getDateStamp()}`, width / 2, height - matchaBottomStrip / 2);
        break;
        
      case "none":
      default:
        break;
    }
    
    ctx.restore();
  }, [drawEmoji, getDateStamp]);

  // Apply filter to canvas
  const applyFilter = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, filter: FilterType) => {
    if (filter === "normal") return;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      switch (filter) {
        case "soft-glow":
          // Brighten and reduce contrast slightly
          data[i] = Math.min(255, r * 1.08);
          data[i + 1] = Math.min(255, g * 1.08);
          data[i + 2] = Math.min(255, b * 1.08);
          break;
          
        case "vintage":
          // Sepia-like warm tone
          data[i] = Math.min(255, r * 1.1 + 20);
          data[i + 1] = Math.min(255, g * 1.0 + 10);
          data[i + 2] = Math.min(255, b * 0.9);
          break;
          
        case "matcha":
          // Slight green tint
          data[i] = Math.min(255, r * 0.95);
          data[i + 1] = Math.min(255, g * 1.08);
          data[i + 2] = Math.min(255, b * 0.95);
          break;
          
        case "pink":
          // Soft pink/warm tint
          data[i] = Math.min(255, r * 1.1);
          data[i + 1] = Math.min(255, g * 1.0);
          data[i + 2] = Math.min(255, b * 1.05);
          break;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }, []);

  // Take photo with countdown
  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    // 3-2-1 countdown
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(null);
    
    // Flash effect
    setFlash(true);
    playCameraShutter();
    setTimeout(() => setFlash(false), 200);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame (mirrored for selfie feel)
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.restore();
    
    // Apply selected filter to the image
    applyFilter(ctx, canvas.width, canvas.height, selectedFilter);
    
    // Draw selected frame overlay
    drawFrame(ctx, canvas.width, canvas.height, selectedFrame);
    
    // Get data URL
    const photoUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(photoUrl);
    stopCamera();
  }, [selectedFrame, selectedFilter, drawFrame, applyFilter, stopCamera]);

  // Retake photo
  const retakePhoto = useCallback(() => {
    setCapturedPhoto(null);
    startCamera();
  }, [startCamera]);

  // Download photo
  const downloadPhoto = useCallback(() => {
    if (!capturedPhoto) return;
    
    const link = document.createElement("a");
    link.href = capturedPhoto;
    link.download = "baking-scrapbook-photo.png";
    link.click();
  }, [capturedPhoto]);

  const frames: { type: FrameType; label: string; icon: string }[] = [
    { type: "purikura", label: "Purikura", icon: "🎀" },
    { type: "hearts", label: "Hearts", icon: "💕" },
    { type: "cookies", label: "Cookies", icon: "🍪" },
    { type: "minimal", label: "Matcha", icon: "🍵" },
    { type: "none", label: "None", icon: "📷" },
  ];

  const filters: { type: FilterType; label: string; icon: string }[] = [
    { type: "normal", label: "Normal", icon: "📷" },
    { type: "soft-glow", label: "Soft Glow", icon: "✨" },
    { type: "vintage", label: "Vintage", icon: "🎞️" },
    { type: "matcha", label: "Matcha", icon: "🌿" },
    { type: "pink", label: "Pink", icon: "🌸" },
  ];

  // Get current date for preview
  const dateStamp = getDateStamp();

  return (
    <div className="scrapbook-page paper-texture relative overflow-hidden">
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h2 className="font-handwritten text-4xl sm:text-5xl text-brown mb-2">
            Photo Booth
          </h2>
          <p className="font-body text-brown-light text-sm">
            Take a cute photo with baking frames!
          </p>
        </motion.div>

        {/* Camera/Photo area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mx-auto mb-4 rounded-2xl overflow-hidden bg-brown-light/10 shadow-lg"
          style={{ aspectRatio: "4/3", maxWidth: "400px" }}
        >
          {/* Flash overlay */}
          <AnimatePresence>
            {flash && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-white z-20"
              />
            )}
          </AnimatePresence>

          {/* Countdown overlay */}
          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30"
              >
                <span className="font-handwritten text-8xl text-white drop-shadow-lg">
                  {countdown}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No camera state */}
          {!stream && !capturedPhoto && !isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <span className="text-6xl mb-4">📸</span>
              <p className="font-body text-brown-light text-sm mb-4">
                {error || "Ready to take a photo?"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                className="px-6 py-3 bg-blush text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
              >
                Start Camera
              </motion.button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blush border-t-transparent rounded-full"
              />
            </div>
          )}

          {/* Video preview */}
          {stream && !capturedPhoto && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                // iOS Safari requires webkit-playsinline attribute
                {...{ 'webkit-playsinline': 'true' } as React.VideoHTMLAttributes<HTMLVideoElement>}
                className="w-full h-full object-cover"
                style={{ 
                  transform: "scaleX(-1)", // Mirror for selfie
                  filter: FILTERS[selectedFilter].css || "none",
                }}
              />
              {/* Frame overlay preview */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Purikura frame - full border with decorations */}
                {selectedFrame === "purikura" && (
                  <>
                    {/* Cream border frame */}
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 0 12px #F5F5F0, inset 0 0 0 14px rgba(123, 158, 108, 0.3)",
                      }}
                    />
                    {/* Top decorations */}
                    <span className="absolute top-1 left-[10%] text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-0 left-[25%] text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-1 left-1/2 -translate-x-1/2 text-base sm:text-lg drop-shadow-sm">🌸</span>
                    <span className="absolute top-0 right-[25%] text-sm sm:text-base drop-shadow-sm">⭐</span>
                    <span className="absolute top-1 right-[10%] text-sm drop-shadow-sm">✨</span>
                    {/* Side decorations */}
                    <span className="absolute top-[25%] left-0 text-sm sm:text-base drop-shadow-sm">🍪</span>
                    <span className="absolute top-1/2 -translate-y-1/2 left-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-[75%] left-0 text-sm sm:text-base drop-shadow-sm">🌸</span>
                    <span className="absolute top-[25%] right-0 text-sm drop-shadow-sm">⭐</span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-0 text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-[75%] right-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    {/* Corner sparkles */}
                    <span className="absolute top-0 left-0 text-lg sm:text-xl drop-shadow-sm">✨</span>
                    <span className="absolute top-0 right-0 text-lg sm:text-xl drop-shadow-sm">✨</span>
                    {/* Bottom strip with date */}
                    <div className="absolute bottom-0 left-0 right-0 h-[14%] bg-cream flex items-center justify-center">
                      <span className="font-body text-xs sm:text-sm text-brown font-semibold">
                        Baked with Love 💕 {dateStamp}
                      </span>
                    </div>
                  </>
                )}
                {/* Hearts frame - pink/rose border with hearts */}
                {selectedFrame === "hearts" && (
                  <>
                    {/* Pink border frame */}
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 0 12px #FADADD, inset 0 0 0 14px rgba(219, 112, 147, 0.4)",
                      }}
                    />
                    {/* Top decorations */}
                    <span className="absolute top-0 left-[8%] text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-1 left-[25%] text-sm sm:text-base drop-shadow-sm">💗</span>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-lg sm:text-xl drop-shadow-sm">💕</span>
                    <span className="absolute top-1 right-[25%] text-sm sm:text-base drop-shadow-sm">💗</span>
                    <span className="absolute top-0 right-[8%] text-base sm:text-lg drop-shadow-sm">💕</span>
                    {/* Side decorations */}
                    <span className="absolute top-[20%] left-0 text-sm sm:text-base drop-shadow-sm">💗</span>
                    <span className="absolute top-[40%] left-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-[60%] left-0 text-sm sm:text-base drop-shadow-sm">💗</span>
                    <span className="absolute top-[80%] left-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-[20%] right-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-[40%] right-0 text-sm sm:text-base drop-shadow-sm">💗</span>
                    <span className="absolute top-[60%] right-0 text-base sm:text-lg drop-shadow-sm">💕</span>
                    <span className="absolute top-[80%] right-0 text-sm sm:text-base drop-shadow-sm">💗</span>
                    {/* Corner hearts */}
                    <span className="absolute top-0 left-0 text-lg sm:text-xl drop-shadow-sm">💖</span>
                    <span className="absolute top-0 right-0 text-lg sm:text-xl drop-shadow-sm">💖</span>
                    {/* Bottom strip with date */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-[14%] flex items-center justify-center"
                      style={{ backgroundColor: "#FADADD" }}
                    >
                      <span className="font-body text-xs sm:text-sm font-semibold" style={{ color: "#DB7093" }}>
                        💕 With Love 💕 {dateStamp}
                      </span>
                    </div>
                  </>
                )}
                {/* Cookies frame - warm cookie/tan border with cookies */}
                {selectedFrame === "cookies" && (
                  <>
                    {/* Cookie tan border frame */}
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 0 12px #F5DEB3, inset 0 0 0 14px rgba(139, 90, 43, 0.3)",
                      }}
                    />
                    {/* Top decorations */}
                    <span className="absolute top-0 left-[10%] text-base sm:text-lg drop-shadow-sm">🍪</span>
                    <span className="absolute top-1 left-[30%] text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-lg sm:text-xl drop-shadow-sm">🍪</span>
                    <span className="absolute top-1 right-[30%] text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-0 right-[10%] text-base sm:text-lg drop-shadow-sm">🍪</span>
                    {/* Side decorations */}
                    <span className="absolute top-[25%] left-0 text-base sm:text-lg drop-shadow-sm">🍪</span>
                    <span className="absolute top-1/2 -translate-y-1/2 left-0 text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-[75%] left-0 text-base sm:text-lg drop-shadow-sm">🍪</span>
                    <span className="absolute top-[25%] right-0 text-sm sm:text-base drop-shadow-sm">✨</span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-0 text-base sm:text-lg drop-shadow-sm">🍪</span>
                    <span className="absolute top-[75%] right-0 text-sm sm:text-base drop-shadow-sm">✨</span>
                    {/* Corner cookies */}
                    <span className="absolute top-0 left-0 text-lg sm:text-xl drop-shadow-sm">🍪</span>
                    <span className="absolute top-0 right-0 text-lg sm:text-xl drop-shadow-sm">🍪</span>
                    {/* Bottom strip with date */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-[14%] flex items-center justify-center"
                      style={{ backgroundColor: "#F5DEB3" }}
                    >
                      <span className="font-body text-xs sm:text-sm font-semibold" style={{ color: "#8B5A2B" }}>
                        🍪 Fresh Baked 🍪 {dateStamp}
                      </span>
                    </div>
                  </>
                )}
                {/* Minimal/Matcha frame - matcha green border */}
                {selectedFrame === "minimal" && (
                  <>
                    {/* Matcha green border frame */}
                    <div 
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow: "inset 0 0 0 12px #A8C69F, inset 0 0 0 14px rgba(90, 122, 76, 0.4)",
                      }}
                    />
                    {/* Top decorations */}
                    <span className="absolute top-0 left-[10%] text-sm sm:text-base drop-shadow-sm">🍵</span>
                    <span className="absolute top-1 left-[25%] text-base sm:text-lg drop-shadow-sm">🌿</span>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 text-lg sm:text-xl drop-shadow-sm">🍃</span>
                    <span className="absolute top-1 right-[25%] text-base sm:text-lg drop-shadow-sm">🌿</span>
                    <span className="absolute top-0 right-[10%] text-sm sm:text-base drop-shadow-sm">🍵</span>
                    {/* Side decorations */}
                    <span className="absolute top-[25%] left-0 text-base sm:text-lg drop-shadow-sm">🌿</span>
                    <span className="absolute top-1/2 -translate-y-1/2 left-0 text-sm sm:text-base drop-shadow-sm">🍃</span>
                    <span className="absolute top-[75%] left-0 text-base sm:text-lg drop-shadow-sm">🌿</span>
                    <span className="absolute top-[25%] right-0 text-sm sm:text-base drop-shadow-sm">🍃</span>
                    <span className="absolute top-1/2 -translate-y-1/2 right-0 text-base sm:text-lg drop-shadow-sm">🌿</span>
                    <span className="absolute top-[75%] right-0 text-sm sm:text-base drop-shadow-sm">🍃</span>
                    {/* Corner matcha */}
                    <span className="absolute top-0 left-0 text-lg sm:text-xl drop-shadow-sm">🍵</span>
                    <span className="absolute top-0 right-0 text-lg sm:text-xl drop-shadow-sm">🍵</span>
                    {/* Bottom strip with date */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-[14%] flex items-center justify-center"
                      style={{ backgroundColor: "#A8C69F" }}
                    >
                      <span className="font-body text-xs sm:text-sm font-semibold" style={{ color: "#3D5A3A" }}>
                        🍃 Matcha Moments 🍃 {dateStamp}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Captured photo */}
          {capturedPhoto && (
            <img
              src={capturedPhoto}
              alt="Captured photo"
              className="w-full h-full object-cover"
            />
          )}

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>

        {/* Frame selector (only when camera is active) */}
        {stream && !capturedPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3"
          >
            <p className="font-body text-xs text-brown-light mb-1.5">Frame:</p>
            <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
              {frames.map((frame) => (
                <motion.button
                  key={frame.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFrame(frame.type)}
                  className={`
                    w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-base sm:text-lg
                    transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush touch-manipulation
                    ${selectedFrame === frame.type
                      ? "bg-blush text-white shadow-lg"
                      : "bg-white shadow-md active:shadow-lg sm:hover:shadow-lg"
                    }
                  `}
                  aria-label={frame.label}
                  title={frame.label}
                >
                  {frame.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Filter selector (only when camera is active) */}
        {stream && !capturedPhoto && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <p className="font-body text-xs text-brown-light mb-1.5">Filter:</p>
            <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
              {filters.map((filter) => (
                <motion.button
                  key={filter.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFilter(filter.type)}
                  className={`
                    w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-base sm:text-lg
                    transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sage touch-manipulation
                    ${selectedFilter === filter.type
                      ? "bg-sage text-white shadow-lg"
                      : "bg-white shadow-md active:shadow-lg sm:hover:shadow-lg"
                    }
                  `}
                  aria-label={filter.label}
                  title={filter.label}
                >
                  {filter.icon}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 sm:gap-3 justify-center items-center mb-4"
        >
          {/* Take photo button */}
          {stream && !capturedPhoto && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={takePhoto}
              disabled={countdown !== null}
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blush text-white font-body font-semibold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 disabled:opacity-50 touch-manipulation active:scale-95"
            >
              Take Photo 📸
            </motion.button>
          )}

          {/* Photo taken actions */}
          {capturedPhoto && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={retakePhoto}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-brown-light/20 text-brown font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 touch-manipulation active:scale-95"
              >
                Retake
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadPhoto}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-sage text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 touch-manipulation active:scale-95"
              >
                Download 💾
              </motion.button>
            </>
          )}
        </motion.div>

        {/* Continue button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            stopCamera();
            onNext();
          }}
          className="px-6 py-3 bg-blush text-white font-body font-semibold rounded-full shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2"
        >
          Continue
        </motion.button>

        {/* Decorative elements - positioned in far corners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-2 right-2 text-3xl pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          📷
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-2 left-2 text-3xl pointer-events-none hidden xl:block"
          aria-hidden="true"
        >
          🎞️
        </motion.div>

        <LoveNoteHeart x="5%" y="40%" delay={3.5} rotation={10} />
        <LoveNoteHeart x="90%" y="20%" delay={3.8} rotation={-8} />

        <FloatingHeart delay={1.0} x="4%" y="28%" size={18} rotation={-7} />
        <FloatingHeart delay={1.4} x="93%" y="15%" size={20} rotation={9} />
        <FloatingHeart delay={1.7} x="78%" y="82%" size={16} rotation={-6} />
      </div>
    </div>
  );
}
