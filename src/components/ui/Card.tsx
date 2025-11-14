import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  hoverable = false,
  onClick,
  className = '',
}: CardProps) {
  const baseClasses = 'bg-white rounded-xl p-6 shadow-sm';

  const interactionClasses = hoverable || onClick
    ? 'transition-shadow duration-300 hover:shadow-md'
    : '';

  const clickableClasses = onClick
    ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
    : '';

  const combinedClasses = `${baseClasses} ${interactionClasses} ${clickableClasses} ${className}`;

  const CardContent = (
    <div className="w-full h-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-neutral-900 font-primary mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-500 font-primary">{subtitle}</p>
          )}
        </div>
      )}

      <div className="text-neutral-700">{children}</div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );

  if (hoverable || onClick) {
    return (
      <motion.div
        className={combinedClasses}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClick();
                }
              }
            : undefined
        }
      >
        {CardContent}
      </motion.div>
    );
  }

  return <div className={combinedClasses}>{CardContent}</div>;
}
