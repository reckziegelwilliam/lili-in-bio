'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { getCardIntensity, getItemIntensity } from '@/lib/utils/freshness';
import { lerp } from '@/lib/utils/seedGenerator';

interface ProjectCardProps {
  project: Project;
  isDark: boolean;
  accentColor: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  animationDelay: string;
  onLinkClick: () => void;
}

export function ProjectCard({
  project,
  isDark,
  accentColor,
  textPrimary,
  textSecondary,
  textMuted,
  animationDelay,
  onLinkClick,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { intensity, type: cardType } = getCardIntensity(
    project.recentImprovements,
  );
  const hasImprovements = (project.recentImprovements?.length ?? 0) > 0;

  const delaySeconds = parseFloat(animationDelay) || 0;
  const shouldAnimate = intensity > 0 && !prefersReducedMotion;

  // ── Shared styles ──────────────────────────────────────────────────────

  const cardShadow = isDark
    ? `0 8px 32px rgba(0,0,0,0.3), 0 0 30px ${accentColor}40`
    : `0 8px 32px rgba(0,0,0,0.1), 0 0 30px ${accentColor}30`;

  const borderColor = isDark
    ? `rgba(255,255,255,${intensity > 0 ? lerp(0.3, 0.8, intensity) : 0.3})`
    : intensity > 0
      ? accentColor
      : 'rgb(229,231,235)';

  // ── Update-specific (breathing pulse + glow halo) ──────────────────────

  const pulseDuration = lerp(3.5, 1.8, intensity);
  const breatheScale = 1 + intensity * 0.015;

  // Inner glow — warm amber blended with accentColor for sun-like core
  const glowGradient = isDark
    ? `radial-gradient(circle, ${accentColor}ff 0%, ${accentColor}90 20%, rgba(255,180,50,0.3) 45%, transparent 70%)`
    : `radial-gradient(circle, ${accentColor}80 0%, ${accentColor}40 25%, rgba(255,180,50,0.15) 50%, transparent 75%)`;

  // Outer warm corona — larger, amber-tinted halo
  const coronaGradient = isDark
    ? `radial-gradient(circle, ${accentColor}40 0%, rgba(255,180,50,0.15) 40%, transparent 70%)`
    : `radial-gradient(circle, ${accentColor}25 0%, rgba(255,180,50,0.08) 50%, transparent 75%)`;

  const glowOpacityMin = isDark ? intensity * 0.25 : intensity * 0.15;
  const glowOpacityMax = isDark ? intensity * 0.7 : intensity * 0.45;

  // ── Upcoming-specific (shimmer sweep) ──────────────────────────────────

  const shimmerDuration = lerp(6, 2.5, intensity);
  const shimmerOpacity = isDark
    ? lerp(0.15, 0.4, intensity)
    : lerp(0.1, 0.3, intensity);

  // ── Badge label ────────────────────────────────────────────────────────

  const badgeLabel = cardType === 'upcoming' ? 'SOON' : 'NEW';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: delaySeconds,
      }}
    >
      <div className="relative">
        {/* Outer warm corona — only for "update" type */}
        {shouldAnimate && cardType === 'update' && (
          <motion.div
            className="absolute -inset-6 rounded-[2rem] -z-10"
            style={{ background: coronaGradient }}
            animate={{
              opacity: [
                glowOpacityMin * 0.6,
                glowOpacityMax * 0.6,
                glowOpacityMin * 0.6,
              ],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: pulseDuration * 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Inner glow halo — only for "update" type */}
        {shouldAnimate && cardType === 'update' && (
          <motion.div
            className="absolute -inset-3 rounded-3xl -z-10"
            style={{ background: glowGradient }}
            animate={{
              opacity: [glowOpacityMin, glowOpacityMax, glowOpacityMin],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: pulseDuration,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        <motion.a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLinkClick}
          className={`group relative block w-full py-5 px-6 rounded-2xl backdrop-blur-xl border-2 overflow-hidden transition-colors duration-300 ${
            isDark ? 'bg-white/20' : 'bg-white/70'
          }`}
          style={{
            boxShadow: cardShadow,
            borderColor,
          }}
          // Breathing scale for "update" only; "upcoming" stays still
          animate={
            shouldAnimate && cardType === 'update'
              ? { scale: [1, breatheScale, 1] }
              : { scale: 1 }
          }
          transition={
            shouldAnimate && cardType === 'update'
              ? {
                  duration: pulseDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : undefined
          }
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Shimmer sweep — only for "upcoming" type */}
          {shouldAnimate && cardType === 'upcoming' && (
            <motion.div
              className="absolute inset-0 -z-0 pointer-events-none"
              style={{
                background: `linear-gradient(
                  105deg,
                  transparent 0%,
                  transparent 35%,
                  ${accentColor} 50%,
                  transparent 65%,
                  transparent 100%
                )`,
                opacity: shimmerOpacity,
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{
                duration: shimmerDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: shimmerDuration * 0.3,
              }}
            />
          )}

          {/* Card content (above shimmer layer) */}
          <div className="relative z-10">
            {/* Name + optional fresh dot + arrow */}
            <span className="flex items-center justify-center gap-2">
              {intensity > 0 && cardType === 'update' && (
                <motion.span
                  className="relative flex h-2 w-2 mr-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: pulseDuration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span
                    className="animate-ping absolute h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: accentColor }}
                  />
                  <span
                    className="relative rounded-full h-2 w-2"
                    style={{ backgroundColor: accentColor }}
                  />
                </motion.span>
              )}
              <span
                className={`text-xl font-black tracking-tight ${textPrimary}`}
                style={{
                  textShadow: isDark
                    ? `0 1px 2px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.5), 0 0 20px ${accentColor}, 0 0 40px ${accentColor}80`
                    : `0 1px 2px rgba(0,0,0,0.15), 0 0 20px ${accentColor}, 0 0 40px ${accentColor}80`,
                }}
              >
                {project.name}
              </span>
              <svg
                className={`w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform ${textPrimary}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </span>

            {/* Description */}
            {project.description && (
              <p
                className={`text-sm mt-1 text-center whitespace-pre-line font-medium ${textSecondary}`}
                style={{
                  textShadow: isDark
                    ? '0 1px 2px rgba(0,0,0,0.3)'
                    : 'none',
                }}
              >
                {project.description}
              </p>
            )}

            {/* Collapsible toggle — icon-only with badge */}
            {hasImprovements && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className={`mt-3 flex items-center justify-center gap-2 w-full ${
                  isDark
                    ? 'text-white/50 hover:text-white/80'
                    : 'text-gray-400 hover:text-gray-600'
                } transition-colors`}
              >
                {!expanded && intensity > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor: `${accentColor}30`,
                      color: accentColor,
                    }}
                  >
                    {badgeLabel}
                  </span>
                )}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>
            )}

            {/* Collapsible content */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="collapsible"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    },
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <div
                    className={`pt-3 mt-3 border-t space-y-2 ${
                      isDark ? 'border-white/10' : 'border-gray-200/60'
                    }`}
                  >
                    {project.recentImprovements?.map((imp, i) => {
                      const itemIntensity = getItemIntensity(imp);
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 text-xs"
                        >
                          <span
                            className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                itemIntensity > 0
                                  ? accentColor
                                  : 'currentColor',
                              opacity:
                                itemIntensity > 0
                                  ? 0.4 + itemIntensity * 0.6
                                  : 0.3,
                            }}
                          />
                          <span
                            className={`${textSecondary} ${
                              itemIntensity > 0
                                ? 'font-semibold'
                                : 'opacity-70'
                            }`}
                          >
                            {imp.text}
                          </span>
                          <span
                            className={`${textMuted} ml-auto shrink-0`}
                          >
                            {new Date(imp.date).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' },
                            )}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
}
