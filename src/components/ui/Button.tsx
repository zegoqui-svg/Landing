import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-brand-dark text-white hover:bg-brand-primary focus:ring-brand-dark shadow-md hover:shadow-lg',
    secondary: 'bg-brand-muted text-brand-dark hover:bg-brand-muted/80 focus:ring-brand-muted shadow-sm',
    accent: 'bg-brand-warm text-brand-dark hover:bg-brand-warm/90 focus:ring-brand-warm shadow-lg hover:shadow-xl font-semibold',
    outline: 'border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white focus:ring-brand-dark',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}