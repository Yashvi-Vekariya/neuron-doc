'use client';
// Toast is handled by 'sonner' library in root layout.
// This file re-exports for compatibility with shadcn imports.
export { toast } from 'sonner';

export function Toaster() {
  // Already included in root layout via sonner's Toaster
  return null;
}

