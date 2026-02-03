"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { playCameraShutter } from "@/utils/sounds";

interface PhotoBoothProps {
  onNext: () => void;
  onPrev: () => void;
}

type FrameType = "hearts" | "cookies" | "banner" | "none";

export default function PhotoBooth({ onNext }: PhotoBoothProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameType>("hearts");
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

  // Draw frame overlay on canvas
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, frame: FrameType) => {
    ctx.save();
    
    switch (frame) {
      case "hearts":
        // Heart border corners
        const heartSize = 40;
        const positions = [
          { x: 20, y: 20, rot: -15 },
          { x: width - 60, y: 20, rot: 15 },
          { x: 20, y: height - 60, rot: -30 },
          { x: width - 60, y: height - 60, rot: 30 },
          { x: width / 2 - 20, y: 15, rot: 0 },
          { x: width / 2 - 20, y: height - 55, rot: 0 },
        ];
        
        ctx.fillStyle = "#F4A5AE";
        positions.forEach(pos => {
          ctx.save();
          ctx.translate(pos.x + heartSize / 2, pos.y + heartSize / 2);
          ctx.rotate((pos.rot * Math.PI) / 180);
          ctx.beginPath();
          // Heart shape
          ctx.moveTo(0, heartSize * 0.3);
          ctx.bezierCurveTo(-heartSize * 0.5, -heartSize * 0.3, -heartSize * 0.5, heartSize * 0.1, 0, heartSize * 0.5);
          ctx.bezierCurveTo(heartSize * 0.5, heartSize * 0.1, heartSize * 0.5, -heartSize * 0.3, 0, heartSize * 0.3);
          ctx.fill();
          ctx.restore();
        });
        break;
        
      case "cookies":
        // Cookie corners
        const cookiePositions = [
          { x: 15, y: 15 },
          { x: width - 55, y: 15 },
          { x: 15, y: height - 55 },
          { x: width - 55, y: height - 55 },
        ];
        
        cookiePositions.forEach(pos => {
          // Cookie base
          ctx.fillStyle = "#E8C9A0";
          ctx.beginPath();
          ctx.arc(pos.x + 20, pos.y + 20, 20, 0, Math.PI * 2);
          ctx.fill();
          
          // Chocolate chips
          ctx.fillStyle = "#5D4037";
          ctx.beginPath();
          ctx.arc(pos.x + 15, pos.y + 15, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pos.x + 28, pos.y + 18, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pos.x + 20, pos.y + 28, 4, 0, Math.PI * 2);
          ctx.fill();
        });
        break;
        
      case "banner":
        // "Baked with Love" banner at bottom
        const bannerHeight = 50;
        ctx.fillStyle = "rgba(244, 165, 174, 0.9)";
        ctx.fillRect(0, height - bannerHeight, width, bannerHeight);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 24px 'Caveat', cursive";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Baked with Love 💕", width / 2, height - bannerHeight / 2);
        break;
        
      case "none":
      default:
        break;
    }
    
    ctx.restore();
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
    
    // Draw selected frame overlay
    drawFrame(ctx, canvas.width, canvas.height, selectedFrame);
    
    // Get data URL
    const photoUrl = canvas.toDataURL("image/png");
    setCapturedPhoto(photoUrl);
    stopCamera();
  }, [selectedFrame, drawFrame, stopCamera]);

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
    { type: "hearts", label: "Hearts", icon: "💕" },
    { type: "cookies", label: "Cookies", icon: "🍪" },
    { type: "banner", label: "Banner", icon: "🎀" },
    { type: "none", label: "None", icon: "📷" },
  ];

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
                style={{ transform: "scaleX(-1)" }} // Mirror for selfie
              />
              {/* Frame overlay preview */}
              <div className="absolute inset-0 pointer-events-none">
                {selectedFrame === "hearts" && (
                  <>
                    <span className="absolute top-3 left-3 text-3xl -rotate-12">💕</span>
                    <span className="absolute top-3 right-3 text-3xl rotate-12">💕</span>
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 text-3xl">💕</span>
                    <span className="absolute bottom-3 left-3 text-3xl -rotate-[30deg]">💕</span>
                    <span className="absolute bottom-3 right-3 text-3xl rotate-[30deg]">💕</span>
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-3xl">💕</span>
                  </>
                )}
                {selectedFrame === "cookies" && (
                  <>
                    <span className="absolute top-2 left-2 text-3xl">🍪</span>
                    <span className="absolute top-2 right-2 text-3xl">🍪</span>
                    <span className="absolute bottom-2 left-2 text-3xl">🍪</span>
                    <span className="absolute bottom-2 right-2 text-3xl">🍪</span>
                  </>
                )}
                {selectedFrame === "banner" && (
                  <div className="absolute bottom-0 left-0 right-0 bg-blush/90 py-2 text-center">
                    <span className="font-handwritten text-xl text-white">Baked with Love 💕</span>
                  </div>
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
            className="mb-4"
          >
            <p className="font-body text-sm text-brown-light mb-2">Choose a frame:</p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {frames.map((frame) => (
                <motion.button
                  key={frame.type}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedFrame(frame.type)}
                  className={`
                    w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg sm:text-xl
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

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 0.8 }}
          className="absolute top-20 right-6 text-5xl pointer-events-none hidden sm:block"
          aria-hidden="true"
        >
          📷
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 1 }}
          className="absolute bottom-28 left-6 text-4xl pointer-events-none hidden sm:block"
          aria-hidden="true"
        >
          🎞️
        </motion.div>
      </div>
    </div>
  );
}
