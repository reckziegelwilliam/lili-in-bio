'use client';

import { useEffect, useRef } from 'react';
import type { AuraBackgroundProps, BlobConfig } from '@/types/visitor';
import { mapRange } from '@/lib/utils/seedGenerator';

interface CanvasBlob extends BlobConfig {
  vx: number;
  vy: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  currentSize: number;
  targetSize: number;
}

/**
 * Generate blob configurations for canvas
 */
function generateCanvasBlobs(props: AuraBackgroundProps, width: number, height: number): CanvasBlob[] {
  const { seed, palette, snapshot } = props;
  const blobs: CanvasBlob[] = [];
  
  let speedMultiplier = 1;
  if (snapshot.readingMode === 'gist') speedMultiplier = 1.2;
  if (snapshot.readingMode === 'nerd') speedMultiplier = 0.8;
  if (snapshot.readingMode === 'reflective') speedMultiplier = 0.6;
  
  const blobCount = 6;
  const seeds = [seed.s1, seed.s2, seed.s3, seed.s4, seed.s5, seed.s6];
  const hues = [palette.hue1, palette.hue2, palette.hue3, palette.hue1, palette.hue2, palette.hue3];
  
  for (let i = 0; i < blobCount; i++) {
    const s = seeds[i];
    const nextS = seeds[(i + 1) % blobCount];
    const hue = hues[i];
    
    const x = mapRange(s, 0, 1, width * 0.1, width * 0.9);
    const y = mapRange(nextS, 0, 1, height * 0.1, height * 0.9);
    const size = mapRange(s, 0, 1, 120, 280);
    
    const saturation = mapRange(s, 0, 1, 60, 80);
    const lightness = mapRange(s, 0, 1, 70, 85);
    const alpha = mapRange(s, 0, 1, 0.4, 0.7);
    
    blobs.push({
      x: (x / width) * 100,
      y: (y / height) * 100,
      currentX: x,
      currentY: y,
      targetX: x,
      targetY: y,
      size: size / 16,
      currentSize: size,
      targetSize: size,
      color: `hsla(${hue + (s - 0.5) * 20}, ${saturation}%, ${lightness}%, ${alpha})`,
      blur: mapRange(s, 0, 1, 60, 120),
      opacity: mapRange(s, 0, 1, 0.5, 0.8),
      vx: mapRange(seeds[(i + 2) % blobCount], 0, 1, -0.3, 0.3) * speedMultiplier,
      vy: mapRange(seeds[(i + 3) % blobCount], 0, 1, -0.3, 0.3) * speedMultiplier,
      animationDelay: 0,
      animationDuration: 0,
    });
  }
  
  return blobs;
}

/**
 * Draw a blurred blob on canvas
 */
function drawBlob(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  blur: number
) {
  ctx.save();
  ctx.filter = `blur(${blur}px)`;
  ctx.globalCompositeOperation = 'screen';
  
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function CanvasAuraBackground(props: AuraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<CanvasBlob[]>([]);
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Set canvas size
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    // Initialize blobs
    blobsRef.current = generateCanvasBlobs(props, window.innerWidth, window.innerHeight);
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Animation loop
    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Clear with base gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, props.palette.primary);
      gradient.addColorStop(0.5, props.palette.secondary);
      gradient.addColorStop(1, props.palette.accent);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Update and draw blobs
      blobsRef.current.forEach((blob) => {
        if (!prefersReducedMotion) {
          // Update position
          blob.currentX += blob.vx;
          blob.currentY += blob.vy;
          
          // Bounce off edges
          if (blob.currentX < width * 0.1 || blob.currentX > width * 0.9) {
            blob.vx *= -1;
          }
          if (blob.currentY < height * 0.1 || blob.currentY > height * 0.9) {
            blob.vy *= -1;
          }
          
          // Subtle size pulsing
          blob.currentSize += Math.sin(Date.now() / 1000 + blob.x) * 0.5;
        }
        
        drawBlob(
          ctx,
          blob.currentX,
          blob.currentY,
          blob.currentSize / 2,
          blob.color,
          blob.blur
        );
      });
      
      // Glossy overlay
      const glossGradient = ctx.createLinearGradient(0, 0, 0, height);
      glossGradient.addColorStop(0, 'rgba(255,255,255,0.15)');
      glossGradient.addColorStop(0.3, 'rgba(255,255,255,0)');
      glossGradient.addColorStop(0.7, 'rgba(0,0,0,0)');
      glossGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
      ctx.fillStyle = glossGradient;
      ctx.fillRect(0, 0, width, height);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [props]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

