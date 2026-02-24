'use client';
import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogContextType { open: boolean; onOpenChange: (v: boolean) => void; }
const DialogContext = createContext<DialogContextType>({ open: false, onOpenChange: () => {} });

interface DialogProps { open?: boolean; onOpenChange?: (v: boolean) => void; children: React.ReactNode; }

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const handleChange = onOpenChange || setInternalOpen;
  return <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleChange }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  const { onOpenChange } = useContext(DialogContext);
  const child = asChild ? React.Children.only(children) as React.ReactElement : children;
  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, { onClick: () => onOpenChange(true) } as any);
  }
  return <button onClick={() => onOpenChange(true)}>{children}</button>;
}

function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, onOpenChange } = useContext(DialogContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className={cn('relative border border-[#00ff41]/30 bg-black p-6 shadow-lg max-w-lg w-full mx-4', className)}>
        <button onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-[#1a5c26] hover:text-[#00ff41] transition-colors">
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props} />;
}
function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('font-mono text-lg text-[#00ff41]', className)} {...props} />;
}
function DialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-[#1a5c26] font-mono', className)} {...props} />;
}
function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex justify-end gap-2 mt-4', className)} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };

