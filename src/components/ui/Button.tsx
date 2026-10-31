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
  /*
   * `active:scale-[0.97]` + `active:duration-75` implement the §1 rule of
   * `apple-design`: the feedback lands on pointer-DOWN (the `:active`
   * pseudo-class), not on release, and it lands fast (75 ms). The
   * `transition` is only on `transform`, so the press never repaints.
   *
   * `motion-reduce:active:scale-100` cancels the movement when the user
   * asked for reduced motion: the button still changes state, it just
   * doesn't move (§14).
   */
  const baseStyles =
    'inline-flex items-center justify-center rounded-full font-medium transition-[transform,opacity,background-color,border-color,color,box-shadow] duration-300 active:scale-[0.97] active:duration-75 motion-reduce:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-brand-dark text-white hover:bg-brand-primary focus:ring-brand-dark shadow-md hover:shadow-lg',
    secondary: 'bg-brand-muted text-brand-dark hover:bg-brand-muted/80 focus:ring-brand-muted shadow-sm',
    accent: 'bg-brand-warm text-brand-dark hover:bg-brand-warm/90 focus:ring-brand-warm shadow-lg hover:shadow-xl font-semibold',
    outline: 'border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white focus:ring-brand-dark',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[44px]',
    md: 'px-6 py-3 text-base min-h-[44px]',
    lg: 'px-8 py-4 text-lg min-h-[44px]',
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
