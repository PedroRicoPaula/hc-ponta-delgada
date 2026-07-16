import { useEffect, useRef, useState } from 'react';

export const CursorRing = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    const onEnter = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('a,button,[data-hover]')) setHovering(true);
    };
    const onLeave = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('a,button,[data-hover]')) setHovering(false);
    };

    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border-2 transition-all duration-150"
      style={{
        width: hovering ? 44 : 32,
        height: hovering ? 44 : 32,
        borderColor: hovering ? '#D4A017' : 'transparent',
        boxShadow: hovering ? '0 0 8px 2px rgba(212,160,23,0.45)' : 'none',
        opacity: hovering ? 1 : 0,
        willChange: 'transform',
      }}
    />
  );
};
