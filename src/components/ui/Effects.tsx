import { useEffect, useState, ReactNode, useRef } from 'react';
import { motion } from 'framer-motion';

export function useKeyboardShortcuts(shortcuts: Record<string, () => void>) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = [
        e.ctrlKey || e.metaKey ? 'mod' : '',
        e.shiftKey ? 'shift' : '',
        e.altKey ? 'alt' : '',
        e.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [shortcuts]);
}

// 3D Tilt Card Component
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function TiltCard({ children, className = '', intensity = 15 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -intensity;
    const rotateY = (x - centerX) / centerX * intensity;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
      {/* Glare overlay */}
      <div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 50%)`,
          transition: 'opacity 0.2s ease-out',
        }}
      />
    </div>
  );
}

// Holographic Card Effect
export function HoloCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated border gradient */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
      <div className="relative bg-[#12141c] rounded-2xl">
        {children}
      </div>
    </div>
  );
}

// Animated number display
export function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      start = end * eased;
      setDisplay(start);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    tick();
  }, [value]);

  return <span>{prefix}{display >= 100 ? Math.round(display).toLocaleString() : display.toFixed(1)}{suffix}</span>;
}

// Keyboard Shortcuts Overlay
export function KeyboardShortcutsOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['⌘', 'K'], action: 'Command palette' },
    { keys: ['⌘', 'B'], action: 'Toggle sidebar' },
    { keys: ['⌘', '/'], action: 'Keyboard shortcuts' },
    { keys: ['G', 'D'], action: 'Go to Dashboard' },
    { keys: ['G', 'R'], action: 'Go to Routing' },
    { keys: ['G', 'P'], action: 'Go to Providers' },
    { keys: ['G', 'T'], action: 'Go to Teams' },
    { keys: ['G', 'V'], action: 'Go to Validation' },
    { keys: ['G', 'C'], action: 'Go to Cost Analysis' },
    { keys: ['G', 'A'], action: 'Go to Playground' },
    { keys: ['G', 'S'], action: 'Go to Settings' },
    { keys: ['Esc'], action: 'Close overlays' },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#151720] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
      >
        <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5">
              <span className="text-sm text-gray-300">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <kbd key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300 font-mono">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
