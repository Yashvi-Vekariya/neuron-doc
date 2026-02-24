import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-mono text-xs transition-all disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[#00ff41] text-black hover:bg-[#00cc33] border border-[#00ff41]',
        outline: 'border border-[#00ff41]/40 text-[#00ff41] hover:bg-[#00ff41]/10 bg-transparent',
        ghost: 'text-[#1a5c26] hover:text-[#00ff41] hover:bg-[#00ff41]/5 bg-transparent border border-transparent',
        destructive: 'bg-red-500/10 text-red-500 border border-red-500/40 hover:bg-red-500/20',
        secondary: 'bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/30 hover:bg-[#00ff41]/20',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-11 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };

