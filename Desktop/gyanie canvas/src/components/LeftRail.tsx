import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText, Video, PenTool } from 'lucide-react';
import { cn } from '../lib/utils';

export function LeftRail({ isOpen, onToggle, isMobile = false }: { isOpen: boolean, onToggle: () => void, isMobile?: boolean }) {
  const [tab, setTab] = useState('resources');

  if (!isOpen) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-6 bg-white border-r border-neutral-200">
        <button onClick={onToggle} className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <FileText className="w-5 h-5 text-neutral-400" />
        <Video className="w-5 h-5 text-neutral-400" />
        <PenTool className="w-5 h-5 text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col w-full lg:w-60 bg-white lg:border-r border-neutral-200 relative shrink-0">
      <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
            <span className="font-bold text-lg tracking-tight">Gyanie</span>
          </div>
          {!isMobile && (
            <button onClick={onToggle} className="p-1 text-neutral-400 hover:text-neutral-800 rounded hover:bg-neutral-100">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {isMobile && (
            <button onClick={onToggle} className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Close</button>
          )}
        </div>

        <div className="flex bg-neutral-200/50 p-1 rounded-md text-[11px] font-semibold uppercase tracking-wider mb-3">
          {['resources', 'web', 'uploads'].map(t => (
            <button 
              key={t}
              onClick={() => setTab(t)}
              className={cn("flex-1 py-1 rounded transition-colors", tab === t ? "bg-white shadow-sm border border-neutral-200 text-neutral-900" : "text-neutral-500 hover:text-neutral-700")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search materials..." 
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 hide-scrollbar">
        {/* Mock Resource Cards */}
        {[
          { id: 1, type: 'pdf', title: 'Algebra Intro.pdf', source: 'NCERT Library' },
          { id: 2, type: 'video', title: 'Quadratic Visuals', source: 'YouTube' },
          { id: 3, type: 'note', title: 'Lecture Notes: Week 1', source: 'Your uploads' },
          { id: 4, type: 'pdf', title: 'HR Diagram blank', source: 'Drive' },
        ].map((r) => (
          <div key={r.id} className="group p-2 bg-white border border-neutral-200 rounded-lg flex items-center gap-3 hover:border-emerald-200 hover:shadow-sm transition-all cursor-grab active:cursor-grabbing text-neutral-900">
            <div className={cn("w-8 h-8 rounded flex items-center justify-center shrink-0", 
              r.type === 'pdf' ? "bg-blue-50 text-blue-600" : 
              r.type === 'video' ? "bg-purple-50 text-purple-600" : 
              "bg-emerald-50 text-emerald-600"
            )}>
              {r.type === 'pdf' ? <FileText className="w-5 h-5" /> : 
               r.type === 'video' ? <Video className="w-5 h-5" /> : 
               <PenTool className="w-5 h-5" />}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold truncate leading-tight">{r.title}</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">{r.source}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-neutral-200 shrink-0">
        <button className="w-full py-2 border-2 border-dashed border-neutral-300 rounded-lg text-[11px] font-bold text-neutral-500 shadow-sm hover:bg-neutral-50 transition-colors uppercase tracking-wider">
          + Upload resource
        </button>
      </div>
    </div>
  );
}
