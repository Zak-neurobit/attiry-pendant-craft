import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from './skeleton';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  loadingClassName?: string;
  priority?: boolean; // For above-the-fold images
  quality?: 'low' | 'medium' | 'high';
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  fallback = 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&auto=format&fit=crop&q=60',
  loadingClassName,
  priority = false,
  quality = 'medium',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Optimize image URL with quality and format parameters
  const optimizeImageUrl = (url: string): string => {
    if (!url.includes('unsplash.com') && !url.includes('supabase')) return url;
    
    const qualityMap = { low: 30, medium: 60, high: 80 };
    const qualityValue = qualityMap[quality];
    
    if (url.includes('unsplash.com')) {
      // Add WebP format and quality for Unsplash
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}fm=webp&q=${qualityValue}`;
    }
    
    return url;
  };

  useEffect(() => {
    if (priority) return; // Skip observer if priority image
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '200px' // Increased for better preloading
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <Skeleton className={`absolute inset-0 ${loadingClassName}`} />
      )}
      {isInView && (
        <img
          src={error ? optimizeImageUrl(fallback) : optimizeImageUrl(src)}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          {...props}
        />
      )}
    </div>
  );
};