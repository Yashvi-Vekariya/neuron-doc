import type { Metadata } from 'next';
import { JetBrains_Mono, Share_Tech_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/ui/cursor';
import { Toaster } from 'sonner';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});
const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NEURON-DOC | AI-Powered Document Intelligence',
  description: 'Advanced RAG system for intelligent document Q&A',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${shareTechMono.variable}`}>
      <body className="bg-black text-[#00ff41] font-mono antialiased">
        <CustomCursor />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#050505',
              color: '#00ff41',
              border: '1px solid rgba(0,255,65,0.3)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              borderRadius: '0',
            },
          }}
        />
      </body>
    </html>
  );
}

