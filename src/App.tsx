import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Route, Server, Users, ShieldCheck, Settings,
  Menu, Zap, Bell, ChevronDown, BarChart3, Terminal, Search, Keyboard
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Routing from './components/Routing';
import Providers from './components/Providers';
import Teams from './components/Teams';
import Validation from './components/Validation';
import SettingsPage from './components/Settings';
import Playground from './components/Playground';
import CostAnalysis from './components/CostAnalysis';
import CommandPalette from './components/CommandPalette';
import { ToastProvider, useToast } from './components/ui/Toast';
import CursorParticles from './components/ui/CursorParticles';
import { KeyboardShortcutsOverlay } from './components/ui/Effects';
import { recentAlerts } from './data/mockData';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'D' },
  { id: 'routing', label: 'Routing', icon: Route, shortcut: 'R' },
  { id: 'providers', label: 'Providers', icon: Server, shortcut: 'P' },
  { id: 'teams', label: 'Teams & Budgets', icon: Users, shortcut: 'T' },
  { id: 'validation', label: 'Validation', icon: ShieldCheck, shortcut: 'V' },
  { id: 'cost-analysis', label: 'Cost Analysis', icon: BarChart3, shortcut: 'C' },
  { id: 'playground', label: 'API Playground', icon: Terminal, shortcut: 'A' },
  { id: 'settings', label: 'Settings', icon: Settings, shortcut: 'S' },
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { addToast } = useToast();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      // Cmd+K - Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
        return;
      }

      // Cmd+/ - Shortcuts overlay
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
        return;
      }

      // Cmd+B - Toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
        return;
      }

      // Escape - Close overlays
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setShortcutsOpen(false);
        setAlertsOpen(false);
        return;
      }

      // G + key navigation (sequential press)
      if (e.key === 'g' || e.key === 'G') {
        // Set a flag for next key
        (window as any).__gPressed = Date.now();
        return;
      }

      // Check if G was pressed recently
      if ((window as any).__gPressed && Date.now() - (window as any).__gPressed < 1000) {
        const key = e.key.toUpperCase();
        const item = navItems.find(n => n.shortcut === key);
        if (item) {
          e.preventDefault();
          setActiveTab(item.id);
          addToast({
            type: 'info',
            title: `Navigated to ${item.label}`,
            message: `Using keyboard shortcut G + ${key}`,
            duration: 2000,
          });
        }
        (window as any).__gPressed = null;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToast]);

  // Welcome toast on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast({
        type: 'success',
        title: 'System Online',
        message: 'LLM Cost Autopilot is running. Press ⌘K for commands.',
        duration: 4000,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'routing': return <Routing />;
      case 'providers': return <Providers />;
      case 'teams': return <Teams />;
      case 'validation': return <Validation />;
      case 'cost-analysis': return <CostAnalysis />;
      case 'playground': return <Playground />;
      case 'settings': return <SettingsPage />;
      default: return <Dashboard />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0b0f] text-white flex">
        {/* Cursor Particles */}
        <CursorParticles />

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0f1117]/95 backdrop-blur-xl border-r border-white/5 flex flex-col transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0f1117] animate-pulse" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight">Cost Autopilot</h1>
                <p className="text-xs text-gray-500">LLM Routing Engine</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-cyan-400/10 text-white border border-violet-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-violet-400' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {activeTab === item.id ? (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 rounded-full bg-violet-400"
                  />
                ) : (
                  <kbd className="opacity-0 group-hover:opacity-100 transition-opacity px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-gray-500 font-mono">
                    G {item.shortcut}
                  </kbd>
                )}
              </motion.button>
            ))}
          </nav>

          {/* Status */}
          <div className="p-4 border-t border-white/5">
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">System Active</span>
              </div>
              <p className="text-xs text-gray-400">5 providers • 13 models • 99.8% uptime</p>
              <button
                onClick={() => setShortcutsOpen(true)}
                className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 hover:text-white transition-colors"
              >
                <Keyboard className="w-3 h-3" />
                View keyboard shortcuts
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-[#0a0b0f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/5"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-xl font-semibold capitalize">
                    {navItems.find(n => n.id === activeTab)?.label}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeTab === 'dashboard' && 'Overview of cost savings, architecture, and routing performance'}
                    {activeTab === 'routing' && 'Real-time routing decisions and complexity analysis'}
                    {activeTab === 'providers' && 'Provider health, pricing, and model management'}
                    {activeTab === 'teams' && 'Budget tracking and spend attribution by team'}
                    {activeTab === 'validation' && 'Quality validation and routing accuracy monitoring'}
                    {activeTab === 'cost-analysis' && 'Detailed cost breakdowns, forecasting, and optimization metrics'}
                    {activeTab === 'playground' && 'Test routing decisions interactively with live pipeline visualization'}
                    {activeTab === 'settings' && 'Configure routing policies, budgets, and system settings'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Command Palette Trigger */}
                <button
                  onClick={() => setCommandPaletteOpen(true)}
                  className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search...</span>
                  <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-gray-500">⌘K</kbd>
                </button>

                {/* Shortcuts Button */}
                <button
                  onClick={() => setShortcutsOpen(true)}
                  className="hidden md:flex items-center gap-1.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                  title="Keyboard shortcuts (⌘/)"
                >
                  <Keyboard className="w-4 h-4 text-gray-400" />
                </button>

                {/* Alerts */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAlertsOpen(!alertsOpen)}
                    className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
                  >
                    <Bell className="w-4 h-4 text-gray-400" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-[10px] flex items-center justify-center font-bold">
                      {recentAlerts.length}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {alertsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-80 bg-[#151720] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/5">
                          <h3 className="font-semibold text-sm">Recent Alerts</h3>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {recentAlerts.map((alert) => (
                            <div key={alert.id} className="px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                              <div className="flex items-start gap-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                  alert.type === 'warning' ? 'bg-amber-400' :
                                  alert.type === 'success' ? 'bg-emerald-400' : 'bg-blue-400'
                                }`} />
                                <div>
                                  <p className="text-xs text-gray-300">{alert.message}</p>
                                  <p className="text-[10px] text-gray-500 mt-1">{alert.time}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User */}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center text-xs font-bold">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-medium">Admin</p>
                    <p className="text-[10px] text-gray-500">autopilot@company.io</p>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Command Palette */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={(tab) => {
            setActiveTab(tab);
            addToast({
              type: 'info',
              title: `Navigated to ${navItems.find(n => n.id === tab)?.label}`,
              message: 'Using command palette',
              duration: 2000,
            });
          }}
        />

        {/* Keyboard Shortcuts Overlay */}
        <KeyboardShortcutsOverlay
          isOpen={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
        />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
