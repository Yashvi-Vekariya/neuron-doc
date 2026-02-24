'use client';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => { setPos({ x: e.clientX, y: e.clientY }); setVisible(true); };
    const leave = () => setVisible(false);
    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    document.addEventListener('mouseenter', () => setVisible(true));
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave); };
  }, []);

  if (!visible) return null;
  return (
    <div className="fixed pointer-events-none z-[9999] w-2 h-2 bg-[#00ff41]"
      style={{ left: pos.x - 4, top: pos.y - 4, boxShadow: '0 0 8px #00ff41, 0 0 16px #00ff41' }} />
  );
}
