'use client';

import { CSSAuraBackground } from './CSSAuraBackground';
import { SVGAuraBackground } from './SVGAuraBackground';
import { CanvasAuraBackground } from './CanvasAuraBackground';
import type { AuraBackgroundProps } from '@/types/visitor';

/**
 * Main AuraBackground component that switches between implementations
 * Default to CSS for best compatibility and performance
 */
export function AuraBackground(props: AuraBackgroundProps) {
  const variant = props.variant || 'css';
  
  switch (variant) {
    case 'svg':
      return <SVGAuraBackground {...props} />;
    case 'canvas':
      return <CanvasAuraBackground {...props} />;
    case 'css':
    default:
      return <CSSAuraBackground {...props} />;
  }
}

