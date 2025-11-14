/**
 * Animation Hook
 * Mulika Ufisadi - Corruption Reporting Platform
 */

import { useMemo } from 'react';
import type { Variants, Transition } from 'framer-motion';

interface AnimationVariants {
  fadeIn: Variants;
  fadeInUp: Variants;
  fadeInDown: Variants;
  fadeInLeft: Variants;
  fadeInRight: Variants;
  slideIn: Variants;
  slideInLeft: Variants;
  slideInRight: Variants;
  slideInUp: Variants;
  slideInDown: Variants;
  scaleUp: Variants;
  scaleDown: Variants;
  rotate: Variants;
  stagger: Variants;
  bounce: Variants;
}

interface UseAnimationOptions {
  duration?: number;
  delay?: number;
  staggerDelay?: number;
}

/**
 * Custom hook for Framer Motion animation variants
 * @param options - Animation configuration options
 * @returns Object containing reusable animation variants
 */
export function useAnimation(options: UseAnimationOptions = {}): AnimationVariants {
  const {
    duration = 0.3,
    delay = 0,
    staggerDelay = 0.1,
  } = options;

  const variants = useMemo<AnimationVariants>(
    () => ({
      // Fade animations
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration, delay },
      },

      fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration, delay },
      },

      fadeInDown: {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { duration, delay },
      },

      fadeInLeft: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
        transition: { duration, delay },
      },

      fadeInRight: {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { duration, delay },
      },

      // Slide animations
      slideIn: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 },
        transition: { type: 'spring', stiffness: 100, damping: 15 },
      },

      slideInLeft: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
        transition: { type: 'spring', stiffness: 100, damping: 15 },
      },

      slideInRight: {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 },
        transition: { type: 'spring', stiffness: 100, damping: 15 },
      },

      slideInUp: {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 },
        transition: { type: 'spring', stiffness: 100, damping: 15 },
      },

      slideInDown: {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 },
        transition: { type: 'spring', stiffness: 100, damping: 15 },
      },

      // Scale animations
      scaleUp: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.8, opacity: 0 },
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration, delay },
      },

      scaleDown: {
        initial: { scale: 1.2, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 },
        transition: { duration, delay },
      },

      // Rotate animation
      rotate: {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        exit: { rotate: 180, opacity: 0 },
        transition: { duration, delay },
      },

      // Stagger animation (for lists/groups)
      stagger: {
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      },

      // Bounce animation
      bounce: {
        initial: { y: 0 },
        animate: {
          y: [0, -20, 0],
          transition: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: 'loop' as const,
            ease: 'easeInOut',
          },
        },
      },
    }),
    [duration, delay, staggerDelay]
  );

  return variants;
}

/**
 * Common transition presets
 */
export const transitions: Record<string, Transition> = {
  smooth: {
    duration: 0.3,
    ease: 'easeInOut',
  },
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15,
  },
  bouncy: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
  slow: {
    duration: 0.6,
    ease: 'easeInOut',
  },
  fast: {
    duration: 0.15,
    ease: 'easeInOut',
  },
};

/**
 * Hover animation presets
 */
export const hoverAnimations = {
  lift: {
    whileHover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  },
  scale: {
    whileHover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
  },
  glow: {
    whileHover: {
      boxShadow: '0 0 20px rgba(74, 144, 226, 0.3)',
      transition: { duration: 0.2 },
    },
  },
  rotate: {
    whileHover: {
      rotate: 5,
      transition: { duration: 0.2 },
    },
  },
};

/**
 * Tap animation presets
 */
export const tapAnimations = {
  shrink: {
    whileTap: {
      scale: 0.95,
    },
  },
  grow: {
    whileTap: {
      scale: 1.05,
    },
  },
};
