import { useState, useCallback } from 'react';

interface UseImageZoomOptions {
  images: string[];
  initialIndex?: number;
  alt?: string;
}

interface UseImageZoomReturn {
  isOpen: boolean;
  currentIndex: number;
  openZoom: (index?: number) => void;
  closeZoom: () => void;
  nextImage: () => void;
  prevImage: () => void;
  setIndex: (index: number) => void;
}

export const useImageZoom = ({ 
  images, 
  initialIndex = 0, 
  alt 
}: UseImageZoomOptions): UseImageZoomReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const openZoom = useCallback((index: number = initialIndex) => {
    setCurrentIndex(index);
    setIsOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }, [initialIndex]);

  const closeZoom = useCallback(() => {
    setIsOpen(false);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  }, []);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const setIndex = useCallback((index: number) => {
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  }, [images.length]);

  return {
    isOpen,
    currentIndex,
    openZoom,
    closeZoom,
    nextImage,
    prevImage,
    setIndex
  };
};