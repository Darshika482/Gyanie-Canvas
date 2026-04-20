import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Command, Undo2, X, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');

  // Keyboard shortcut listener (⌘K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    }
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-full shadow-2xl transition-transform hover:-translate-y-1 active:translate-y-0 group"
      >
        <Sparkles className="w-4 h-4 text-amber-400 group-hover:animate-pulse" />
        <span className="font-bold text-sm tracking-wide">Ask AI</span>
        <div className="flex items-center gap-1 opacity-50 bg-neutral-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">
          <Command className="w-3 h-3" /> K
        </div>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-neutral-900/20 backdrop-blur-sm z-50 rounded-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-1/4 left-1/2 -translate-x-1/2 w-full max-w-xl bg-white border border-neutral-200 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Sparkles className="w-4 h-4" /></div>
                     <span className="font-extrabold text-neutral-900 text-lg">AI Co-pilot</span>
                   </div>
                   <button onClick={() => setIsOpen(false)} className="p-2 text-neutral-400 hover:text-neutral-800 bg-neutral-50 hover:bg-neutral-100 rounded-full transition-colors">
                     <X className="w-4 h-4" />
                   </button>
                </div>
                
                <div className="p-4">
                  <input 
                    autoFocus
                    type="text" 
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder="e.g. Generate 3 reading tasks for Week 2..." 
                    className="w-full text-lg font-medium bg-transparent border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 placeholder:text-neutral-300"
                  />
                </div>

                <div className="px-4 pb-4 bg-neutral-50 border-t border-neutral-100/50">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-4 mb-3">Context</h4>
                   <div className="flex gap-2">
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-neutral-200 rounded text-neutral-600">Selected: <span className="font-bold text-neutral-900">0 tasks</span></span>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-neutral-200 rounded text-neutral-600">Active Module: <span className="font-bold text-neutral-900">None</span></span>
                   </div>

                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-5 mb-2">Suggested Actions</h4>
                   <ul className="space-y-1">
                      <li className="text-sm font-medium text-neutral-600 hover:bg-neutral-100 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2">
                         <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                         Add a revision week to the end
                      </li>
                      <li className="text-sm font-medium text-neutral-600 hover:bg-neutral-100 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2">
                         <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                         Balance difficulty in Week 1
                      </li>
                   </ul>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
