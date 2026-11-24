'use client';

import React, { useState } from 'react';

interface DuskImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  aspectRatio?: '3/4' | '16/9' | '4/5' | '1/1' | 'auto';
  className?: string;
  containerClassName?: string;
}

export function DuskImage({
  src,
  alt,
  aspectRatio = '3/4',
  className = '',
  containerClassName = '',
  ...props
}: DuskImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass = {
    '3/4': 'aspect-[3/4]',
    '16/9': 'aspect-[16/9]',
    '4/5': 'aspect-[4/5]',
    '1/1': 'aspect-square',
    'auto': '',
  }[aspectRatio];

  const showPlaceholder = !src || hasError;

  return (
    <div
      className={`relative overflow-hidden bg-surface-container-low border border-outline ${aspectClass} ${containerClassName}`}
    >
      {!showPlaceholder ? (
        <>
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-image-hover ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            loading="lazy"
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-surface-container animate-pulse" />
          )}
        </>
      ) : (
        /* Dark Streetwear Neutral Placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-surface-container text-center select-none">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 bg-accent inline-block" />
            <span className="font-label text-[10px] uppercase text-accent tracking-widest font-mono">
              DUSK RIOT
            </span>
          </div>
          <span className="font-display text-headline-md uppercase text-on-surface/30 tracking-wider">
            RAW CUT
          </span>
          <span className="font-label text-[9px] uppercase text-on-surface-variant/40 mt-1">
            ARCHIVAL SILHOUETTE
          </span>
        </div>
      )}
    </div>
  );
}
