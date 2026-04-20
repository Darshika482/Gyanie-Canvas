import { useState } from 'react';
import { LeftRail } from '../components/LeftRail';
import { Workspace } from '../components/Workspace';
import { RightRail } from '../components/RightRail';
import { AICopilot } from '../components/AICopilot';
import { mockSystem } from '../data/mock';
import { LearningSystem } from '../types';
import { Library, LayoutGrid, Sparkles, SlidersHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function BlueprintStage() {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [system, setSystem] = useState<LearningSystem>(mockSystem);
  
  // Mobile bottom tab state
  const [activeTabMobile, setActiveTabMobile] = useState<'canvas' | 'library' | 'inspector' | 'ai'>('canvas');

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden relative">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Left Rail */}
        <div className={cn("hidden lg:block border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out shrink-0", leftOpen ? "w-[280px]" : "w-[48px]")}>
          <LeftRail isOpen={leftOpen} onToggle={() => setLeftOpen(!leftOpen)} />
        </div>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 relative h-full overflow-hidden">
          <Workspace system={system} onUpdateSystem={setSystem} selectedModuleId={selectedModuleId} onSelectModule={setSelectedModuleId} />
          
          {/* AICopilot Floating (Desktop) */}
          <div className="hidden lg:flex absolute bottom-6 left-0 right-0 justify-center z-30 pointer-events-none">
             <div className="pointer-events-auto">
               <AICopilot />
             </div>
          </div>
        </div>

        {/* Desktop Right Rail */}
        <div className={cn("hidden lg:block border-l border-neutral-200 bg-white transition-all duration-300 ease-in-out shrink-0", rightOpen ? "w-[320px]" : "w-[48px]")}>
          <RightRail isOpen={rightOpen} onToggle={() => setRightOpen(!rightOpen)} system={system} selectedModuleId={selectedModuleId} onSelectModule={setSelectedModuleId} />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden flex-none h-[60px] bg-white border-t border-neutral-200 flex items-center justify-around px-2 z-40">
        <button 
          onClick={() => setActiveTabMobile('library')}
          className={cn("flex flex-col items-center gap-1 w-16", activeTabMobile === 'library' ? "text-emerald-600" : "text-neutral-500")}
        >
          <Library className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Library</span>
        </button>
        <button 
          onClick={() => setActiveTabMobile('canvas')}
          className={cn("flex flex-col items-center gap-1 w-16", activeTabMobile === 'canvas' ? "text-emerald-600" : "text-neutral-500")}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Canvas</span>
        </button>
        <button 
          onClick={() => setActiveTabMobile('inspector')}
          className={cn("flex flex-col items-center gap-1 w-16", activeTabMobile === 'inspector' ? "text-emerald-600" : "text-neutral-500")}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Inspect</span>
        </button>
        <button 
          onClick={() => setActiveTabMobile('ai')}
          className={cn("flex flex-col items-center gap-1 w-16", activeTabMobile === 'ai' ? "text-amber-500" : "text-neutral-500")}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-wider font-bold">Ask AI</span>
        </button>
      </div>

      {/* Mobile Bottom Sheets */}
      <AnimatePresence>
        {activeTabMobile === 'library' && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute lg:hidden inset-x-0 bottom-[60px] top-0 bg-white z-30 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.1)]"
          >
            <LeftRail isOpen={true} onToggle={() => setActiveTabMobile('canvas')} isMobile />
          </motion.div>
        )}
        
        {activeTabMobile === 'inspector' && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute lg:hidden inset-x-0 bottom-[60px] top-0 bg-white z-30 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.1)]"
          >
            <div className="flex-1 overflow-hidden">
               <RightRail isOpen={true} onToggle={() => setActiveTabMobile('canvas')} system={system} selectedModuleId={selectedModuleId} onSelectModule={setSelectedModuleId} />
            </div>
          </motion.div>
        )}
        
        {activeTabMobile === 'ai' && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="absolute lg:hidden inset-x-0 bottom-[60px] p-4 bg-white z-30 shadow-[-4px_0_24px_rgba(0,0,0,0.1)] rounded-t-3xl border-t border-neutral-200"
          >
            <div className="w-12 h-1.5 bg-neutral-200 rounded-full mx-auto mb-6"></div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-amber-500"/> Ask AI Copilot</h3>
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3">
               <input type="text" placeholder="Generate a quick quiz for week 2..." className="w-full bg-transparent outline-none text-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
