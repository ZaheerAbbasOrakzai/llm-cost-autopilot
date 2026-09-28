import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, Route, Server, Users, ShieldCheck, Settings, Sparkles, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

const commands = [
  { id: 'dashboard', label: 'Go to Dashboard', description: 'View cost savings and routing overview', icon: LayoutDashboard, tab: 'dashboard' },
  { id: 'routing', label: 'Go to Routing', description: 'View routing decisions and policies', icon: Route, tab: 'routing' },
  { id: 'providers', label: 'Go to Providers', description: 'Manage LLM providers and models', icon: Server, tab: 'providers' },
  { id: 'teams', label: 'Go to Teams', description: 'View team budgets and spending', icon: Users, tab: 'teams' },
  { id: 'validation', label: 'Go to Validation', description: 'Monitor quality validation', icon: ShieldCheck, tab: 'validation' },
  { id: 'architecture', label: 'Go to Architecture', description: 'System architecture and tech stack', icon: Sparkles, tab: 'architecture' },
  { id: 'cost-analysis', label: 'Go to Cost Analysis', description: 'Detailed cost breakdowns and forecasting', icon: Sparkles, tab: 'cost-analysis' },
  { id: 'playground', label: 'Go to API Playground', description: 'Test routing decisions interactively', icon: Sparkles, tab: 'playground' },
  { id: 'settings', label: 'Go to Settings', description: 'Configure routing policies', icon: Settings, tab: 'settings' },
];

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          onNavigate(filtered[selectedIndex].tab);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onNavigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-[#151720] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
                <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filtered.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-gray-500">No results found</p>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    {filtered.map((cmd, i) => (
                      <motion.button
                        key={cmd.id}
                        onClick={() => { onNavigate(cmd.tab); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                          i === selectedIndex
                            ? 'bg-violet-500/10 border border-violet-500/20'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          i === selectedIndex ? 'bg-violet-500/20' : 'bg-white/5'
                        }`}>
                          <cmd.icon className={`w-4 h-4 ${i === selectedIndex ? 'text-violet-400' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${i === selectedIndex ? 'text-white' : 'text-gray-300'}`}>
                            {cmd.label}
                          </p>
                          <p className="text-[10px] text-gray-500">{cmd.description}</p>
                        </div>
                        {i === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-violet-400" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↑</kbd>
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↓</kbd>
                    <span className="text-[10px] text-gray-500 ml-1">Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">↵</kbd>
                    <span className="text-[10px] text-gray-500 ml-1">Select</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500">{filtered.length} commands</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
