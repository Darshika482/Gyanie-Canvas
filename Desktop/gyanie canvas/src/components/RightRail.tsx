import { useState } from 'react';
import { Settings, BarChart2, CheckCircle, Clock } from 'lucide-react';
import { LearningSystem, Module, Task } from '../types';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, Settings2, Trash2, ArrowUpCircle, ArrowDownCircle, Copy, Sparkles } from 'lucide-react';

export function RightRail({ isOpen, onToggle, system, selectedModuleId, onSelectModule, onUpdateSystem }: { isOpen: boolean, onToggle: () => void, system: LearningSystem, selectedModuleId?: string | null, onSelectModule?: (id: string | null) => void, onUpdateSystem?: (s: LearningSystem) => void }) {
  if (!isOpen) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-6 bg-white border-l border-neutral-200">
        <button onClick={onToggle} className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <BarChart2 className="w-5 h-5 text-neutral-400" />
      </div>
    );
  }

  const totalTasks = system.modules.reduce((acc, m) => acc + m.tasks.length, 0);
  const totalMinutes = system.modules.reduce((acc, m) => acc + m.tasks.reduce((mAcc, t) => mAcc + t.minutes, 0), 0);
  
  const selectedModuleIndex = system.modules.findIndex(m => m.id === selectedModuleId);
  const selectedModule = selectedModuleIndex >= 0 ? system.modules[selectedModuleIndex] : null;

  return (
    <div className="h-full flex flex-col w-full lg:w-[320px] bg-white lg:border-l border-neutral-200 shadow-[-10px_0_30px_rgba(0,0,0,0.03)] relative shrink-0">
      <div className="p-4 border-b border-neutral-200 shrink-0 flex items-center justify-between">
        <button onClick={onToggle} className="p-1 text-neutral-400 hover:text-neutral-800 rounded hover:bg-neutral-100 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <h2 className="font-bold text-neutral-800 text-sm tracking-wide uppercase">Inspector</h2>
        <div className="w-6" /> {/* spacer */}
      </div>
      
      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col">
          {selectedModule ? (
             <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Module Selected</span>
                  </div>
                  <div className="flex gap-1 text-neutral-400">
                     <button 
                       disabled={selectedModuleIndex === 0}
                       onClick={() => onSelectModule && onSelectModule(system.modules[selectedModuleIndex - 1]?.id)}
                       className="p-1 hover:text-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                     >
                       <ChevronLeft className="w-4 h-4" />
                     </button>
                     <button 
                       disabled={selectedModuleIndex === system.modules.length - 1}
                       onClick={() => onSelectModule && onSelectModule(system.modules[selectedModuleIndex + 1]?.id)}
                       className="p-1 hover:text-neutral-800 disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                     >
                       <ChevronRight className="w-4 h-4" />
                     </button>
                  </div>
                </div>

                <input 
                  type="text" 
                  defaultValue={selectedModule.title} 
                  className="text-xl font-extrabold text-neutral-900 mb-6 w-full outline-none hover:bg-neutral-50 px-1 -mx-1 rounded transition-colors" 
                />

                {selectedModule.objectives && selectedModule.objectives.length > 0 && (
                  <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Outcomes</h4>
                    <ul className="space-y-2 text-xs font-medium text-neutral-700 leading-snug list-disc pl-4">
                      {selectedModule.objectives.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">Time Limit</label>
                    <select className="w-full text-xs font-bold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400">
                      <option>1 Week</option>
                      <option>2 Weeks</option>
                      <option>No Limit</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1 block">Color</label>
                    <div className="flex gap-1 h-[34px] items-center bg-neutral-50 border border-neutral-200 rounded-lg px-2">
                       <button className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-offset-1 ring-blue-500/20"></button>
                       <button className="w-4 h-4 rounded-full bg-emerald-500 hover:scale-110 transition-transform"></button>
                       <button className="w-4 h-4 rounded-full bg-amber-500 hover:scale-110 transition-transform"></button>
                       <button className="w-4 h-4 rounded-full bg-rose-500 hover:scale-110 transition-transform"></button>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">Module Actions</h4>
                  <div className="space-y-2">
                     <button className="w-full text-left text-xs font-semibold text-neutral-700 hover:bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                       <Copy className="w-4 h-4 text-neutral-400" /> Duplicate Module
                     </button>
                     <div className="flex gap-2">
                       <button className="flex-1 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 flex justify-center items-center gap-1 transition-colors">
                         <ArrowUpCircle className="w-4 h-4 text-neutral-400" /> Move Left
                       </button>
                       <button className="flex-1 text-center text-xs font-semibold text-neutral-700 hover:bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 flex justify-center items-center gap-1 transition-colors">
                         Move Right <ArrowDownCircle className="w-4 h-4 text-neutral-400" />
                       </button>
                     </div>
                     <button className="w-full text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-100 rounded-lg p-2.5 flex items-center gap-2 transition-colors mt-2">
                       <Trash2 className="w-4 h-4 text-rose-400" /> Delete Module
                     </button>
                  </div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-500/20 rounded-xl p-4">
                  <h4 className="text-[10px] font-extrabold uppercase text-emerald-600 tracking-widest mb-3 flex items-center gap-1">
                    <BarChart2 className="w-3 h-3" />
                    AI Module Generator
                  </h4>
                  <p className="text-xs font-semibold leading-relaxed text-neutral-700 mb-4">
                    Describe the outcome for this module to instantly generate 3-5 tasks combining reading, video, and assignments.
                  </p>
                  <textarea 
                    placeholder="e.g. Students should understand quadratic roots..."
                    className="w-full h-20 text-xs bg-white border border-emerald-200 rounded-lg p-2 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 resize-none font-medium mb-3 placeholder:text-neutral-300"
                  ></textarea>
                  <button 
                    onClick={() => {
                      if (onUpdateSystem && selectedModule) {
                        const newTasks: Task[] = [
                        { id: `task-ai1-${Date.now()}`, name: 'AI Gen: Quadratic Theory', type: 'Reading', minutes: 15, description: 'Generated reading...', difficulty: 'Medium' },
                        { id: `task-ai2-${Date.now()}`, name: 'AI Gen: Root Formula', type: 'Video', minutes: 10, description: 'Generated video...', difficulty: 'Easy' },
                        { id: `task-ai3-${Date.now()}`, name: 'AI Gen: Practice', type: 'Write', minutes: 20, description: 'Generated practice...', difficulty: 'Hard' },
                        ];
                        const updatedModules = system.modules.map(m => m.id === selectedModule.id ? { ...m, tasks: [...m.tasks, ...newTasks] } : m);
                        onUpdateSystem({ ...system, modules: updatedModules });
                      }
                    }}
                    className="w-full py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3 h-3" /> Generate Tasks
                  </button>
                </div>
             </div>
          ) : (
            <div className="p-6">
              <h3 className="text-xl font-extrabold text-neutral-900 mb-6 leading-tight">{system.title}</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="text-neutral-400 mb-1"><CheckCircle className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-neutral-800">{totalTasks}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Total Tasks</div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <div className="text-neutral-400 mb-1"><Clock className="w-5 h-5"/></div>
                  <div className="text-2xl font-black text-neutral-800">
                    {Math.floor(totalMinutes / 60)}<span className="text-sm font-medium text-neutral-400 ml-1">hrs</span> 
                    {totalMinutes % 60}<span className="text-sm font-medium text-neutral-400 ml-1">m</span>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Est. Time</div>
                </div>
              </div>

            <div className="mb-8">
              <h4 className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest mb-4">Difficulty Mix</h4>
              <div className="flex items-end gap-1 h-20">
                <div className="bg-emerald-400 w-1/3 rounded-t-sm" style={{ height: '40%' }}></div>
                <div className="bg-amber-400 w-1/3 rounded-t-sm" style={{ height: '80%' }}></div>
                <div className="bg-red-400 w-1/3 rounded-t-sm" style={{ height: '30%' }}></div>
              </div>
              <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-neutral-500">
                <span>Easy</span>
                <span>Med</span>
                <span>Hard</span>
              </div>
            </div>

            <div className="bg-amber-50/40 border border-amber-300 rounded-lg p-4 relative">
              <h4 className="text-[10px] font-extrabold uppercase text-amber-600 tracking-widest mb-3 flex items-center gap-1">
                <BarChart2 className="w-3 h-3" />
                AI Insights
              </h4>
              <ul className="space-y-3">
                <li className="text-xs font-semibold leading-relaxed text-neutral-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                  Consider adding a revision module around Week 3 to solidify understanding.
                </li>
                <li className="text-xs font-semibold leading-relaxed text-neutral-700 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                  Week 2 is heavy on Reading tasks. Adding a Video breaks up the monotony.
                </li>
              </ul>
              <button className="mt-4 w-full py-2 bg-white rounded-lg border border-amber-200 text-amber-600 text-[10px] font-bold hover:bg-amber-50 transition-colors uppercase tracking-widest">
                Optimize System
              </button>
            </div>
            </div>
          )}
      </div>
    </div>
  );
}
