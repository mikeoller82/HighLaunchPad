"use client";
import React, { useState, useEffect } from "react";
import NextImage from "next/image";
// Removed image-loader import - using simple fallback approach

// You can change this to any fallback image you want
const DEFAULT_FALLBACK = "/fallback-image.png";

// Accepts all props for Next.js Image, plus optional fallbackSrc
export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  "data-ai-hint"?: string;
  priority?: number; // Priority for rate-limited loading
  [key: string]: any;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  priority = 0,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(false);
    setError(false);
  }, [src]);

  // Show loading placeholder for external images
  if (isLoading && (src.startsWith("http") || src.startsWith("https"))) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center ${
          props.className || ""
        }`}
        style={{
          width: props.width,
          height: props.height,
          aspectRatio: props.fill ? undefined : "auto",
        }}
      >
        <div className="text-gray-500 text-xs text-center px-2">
          <div className="mb-1">⏳</div>
          <div>Loading image...</div>
        </div>
      </div>
    );
  }

  // If src is a string, we can handle error fallback
  if (typeof src === "string") {
    return (
      <NextImage
        {...props}
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        onError={() => {
          if (!error) {
            setError(true);
            setCurrentSrc(fallbackSrc);
          }
        }}
      />
    );
  }

  // If src is a static import, fallback is not needed (should always exist)
  return <NextImage {...props} src={src} alt={alt} />;
};

export default ImageWithFallback;
