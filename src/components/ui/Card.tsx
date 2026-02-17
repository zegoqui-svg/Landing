import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outline';
  hover?: boolean;
}

export function Card({ children, className = '', variant = 'elevated', hover = true }: CardProps) {
  const baseStyles = "bg-white rounded-2xl overflow-hidden transition-all duration-300";

  const variants = {
    default: "border border-brand-dark/5",
    elevated: "shadow-md hover:shadow-xl border-t border-white/50",
    outline: "border border-brand-dark/10 bg-transparent",
  };

  const hoverEffects = hover
    ? "transform hover:-translate-y-1 hover:border-brand-warm/30"
    : "";

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverEffects} ${className}`}
    >
      {children}
    </div>
  );
}