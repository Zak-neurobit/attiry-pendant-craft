import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  X,
  Maximize2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  alt?: string;
}

interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
  rotation: number;
}

const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4];
const MIN_SCALE = 0.5;
const MAX_SCALE = 4;

export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  alt = 'Product image'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    rotation: 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom when image changes
  useEffect(() => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
    setIsLoading(true);
  }, [currentIndex]);

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateImage(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateImage(1);
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'r':
          e.preventDefault();
          rotate();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, zoomState.scale]);

  const navigateImage = (direction: number) => {
    if (images.length <= 1) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    } else if (direction > 0) {
      setCurrentIndex(0); // Loop to first
    } else {
      setCurrentIndex(images.length - 1); // Loop to last
    }
  };

  const zoomIn = () => {
    const currentZoomIndex = ZOOM_LEVELS.findIndex(level => level >= zoomState.scale);
    const nextZoomIndex = Math.min(currentZoomIndex + 1, ZOOM_LEVELS.length - 1);
    const newScale = ZOOM_LEVELS[nextZoomIndex];
    
    setZoomState(prev => ({
      ...prev,
      scale: newScale
    }));
  };

  const zoomOut = () => {
    const currentZoomIndex = ZOOM_LEVELS.findIndex(level => level >= zoomState.scale);
    const prevZoomIndex = Math.max(currentZoomIndex - 1, 0);
    const newScale = ZOOM_LEVELS[prevZoomIndex];
    
    setZoomState(prev => ({
      ...prev,
      scale: newScale,
      translateX: newScale === 1 ? 0 : prev.translateX,
      translateY: newScale === 1 ? 0 : prev.translateY
    }));
  };

  const resetZoom = () => {
    setZoomState({ scale: 1, translateX: 0, translateY: 0, rotation: 0 });
  };

  const rotate = () => {
    setZoomState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360
    }));
  };

  const fitToScreen = () => {
    if (!imageRef.current || !containerRef.current) return;
    
    const img = imageRef.current;
    const container = containerRef.current;
    
    const containerWidth = container.clientWidth - 40; // Account for padding
    const containerHeight = container.clientHeight - 40;
    
    const scaleX = containerWidth / img.naturalWidth;
    const scaleY = containerHeight / img.naturalHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%
    
    setZoomState({
      scale,
      translateX: 0,
      translateY: 0,
      rotation: 0
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, zoomState.scale + delta));
    
    setZoomState(prev => ({
      ...prev,
      scale: newScale,
      translateX: newScale === 1 ? 0 : prev.translateX,
      translateY: newScale === 1 ? 0 : prev.translateY
    }));
  };

  // Mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomState.scale <= 1) return;
    
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomState.scale <= 1) return;
    
    const deltaX = e.clientX - lastMousePosition.x;
    const deltaY = e.clientY - lastMousePosition.y;
    
    setZoomState(prev => ({
      ...prev,
      translateX: prev.translateX + deltaX,
      translateY: prev.translateY + deltaY
    }));
    
    setLastMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoomState.scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setLastMousePosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoomState.scale > 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastMousePosition.x;
      const deltaY = touch.clientY - lastMousePosition.y;
      
      setZoomState(prev => ({
        ...prev,
        translateX: prev.translateX + deltaX,
        translateY: prev.translateY + deltaY
      }));
      
      setLastMousePosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex];
    link.download = `product-image-${currentIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-none w-screen h-screen p-0 bg-black/95 border-0"
        aria-describedby="image-zoom-description"
      >
        <div id="image-zoom-description" className="sr-only">
          Image zoom modal. Use arrow keys to navigate, + and - to zoom, R to rotate, 0 to reset, Escape to close.
        </div>
        
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              {hasMultipleImages && `${currentIndex + 1} / ${images.length}`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={zoomOut}
              disabled={zoomState.scale <= MIN_SCALE}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <span className="text-white text-sm min-w-[3rem] text-center">
              {Math.round(zoomState.scale * 100)}%
            </span>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={zoomIn}
              disabled={zoomState.scale >= MAX_SCALE}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={fitToScreen}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={rotate}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadImage}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-20 overflow-hidden"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: zoomState.scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          
          <img
            ref={imageRef}
            src={currentImage}
            alt={`${alt} ${currentIndex + 1}`}
            className={cn(
              "max-w-none transition-all duration-200 select-none",
              isLoading && "opacity-0"
            )}
            style={{
              transform: `translate(${zoomState.translateX}px, ${zoomState.translateY}px) scale(${zoomState.scale}) rotate(${zoomState.rotation}deg)`,
              transformOrigin: 'center center'
            }}
            onLoad={handleImageLoad}
            onError={handleImageLoad}
            draggable={false}
          />
        </div>

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateImage(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateImage(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Thumbnail Strip for Multiple Images */}
        {hasMultipleImages && images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg max-w-md overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all",
                  index === currentIndex 
                    ? "border-white ring-2 ring-white/50" 
                    : "border-white/30 hover:border-white/60"
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};