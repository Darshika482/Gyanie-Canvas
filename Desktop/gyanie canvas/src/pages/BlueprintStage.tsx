import { useEffect, useState } from 'react';
import { LeftRail } from '../components/LeftRail';
import { Workspace } from '../components/Workspace';
import { RightRail } from '../components/RightRail';
import { AICopilot } from '../components/AICopilot';
import { mockSystem } from '../data/mock';
import { LearningSystem, Task } from '../types';
import { Library, LayoutGrid, Rows3, Sparkles, SlidersHorizontal, Clock3, Pencil, Trash2, Plus, ChevronDown, GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';

export function BlueprintStage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [system, setSystem] = useState<LearningSystem>(mockSystem);
  const viewFromQuery = searchParams.get('view') === 'list' ? 'list' : 'canvas';
  const [viewMode, setViewModeState] = useState<'canvas' | 'list'>(viewFromQuery);
  const [collapsedModules, setCollapsedModules] = useState<Set<string>>(new Set());
  
  // Mobile bottom tab state
  const [activeTabMobile, setActiveTabMobile] = useState<'canvas' | 'library' | 'inspector' | 'ai'>('canvas');

  const toggleModuleCollapsed = (moduleId: string) => {
    setCollapsedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const addTaskToModule = (moduleId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: 'New Task',
      type: 'Reading',
      minutes: 15,
      description: 'Task description...',
      difficulty: 'Medium',
    };
    setSystem((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, tasks: [...m.tasks, newTask] } : m)),
    }));
  };

  const removeTask = (moduleId: string, taskId: string) => {
    setSystem((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) } : m)),
    }));
  };

  useEffect(() => {
    if (viewMode !== viewFromQuery) setViewModeState(viewFromQuery);
  }, [viewFromQuery, viewMode]);

  const setViewMode = (next: 'canvas' | 'list') => {
    setViewModeState(next);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('view', next);
    setSearchParams(nextParams, { replace: true });
  };

  const handleListDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    setSystem((prev) => {
      const modules = prev.modules.map((m) => ({ ...m, tasks: [...m.tasks] }));
      const sourceModule = modules.find((m) => m.id === source.droppableId);
      const destinationModule = modules.find((m) => m.id === destination.droppableId);
      if (!sourceModule || !destinationModule) return prev;

      const [movedTask] = sourceModule.tasks.splice(source.index, 1);
      if (!movedTask) return prev;
      destinationModule.tasks.splice(destination.index, 0, movedTask);

      return { ...prev, modules };
    });
  };

  const openTask = (taskId: string) => {
    const fromPath = `${location.pathname}?view=${viewMode}`;
    navigate(`/teacher/systems/new/systems/${system.id}/build/tasks/${taskId}`, {
      state: { from: fromPath },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-100 overflow-hidden relative">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Left Rail */}
        <div className={cn("hidden lg:block border-r border-neutral-200 bg-white transition-all duration-300 ease-in-out shrink-0", leftOpen ? "w-[240px]" : "w-[48px]")}>
          <LeftRail isOpen={leftOpen} onToggle={() => setLeftOpen(!leftOpen)} />
        </div>

        {/* Center Workspace */}
        <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 relative h-full overflow-hidden">
          {viewMode === 'canvas' ? (
            <Workspace
              system={system}
              onUpdateSystem={setSystem}
              selectedModuleId={selectedModuleId}
              onSelectModule={setSelectedModuleId}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
            />
          ) : (
            <div className="h-full flex flex-col">
              <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 relative z-10">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-sm font-extrabold">{system.title}</h1>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 -mt-1">Systems › CBSE Maths Class 10</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden lg:flex items-center bg-neutral-100 p-1 rounded-lg gap-1 border border-neutral-200/50">
                    <button
                      onClick={() => setViewMode('canvas')}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-1",
                        "text-neutral-400 hover:text-neutral-800"
                      )}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      Canvas
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-1",
                        "bg-white shadow-sm border border-neutral-200 text-neutral-900"
                      )}
                    >
                      <Rows3 className="w-3.5 h-3.5" />
                      List
                    </button>
                    <div className="h-4 w-px bg-neutral-200 mx-1" />
                    {(['overview', 'default', 'detail'] as const).map(z => (
                      <button
                        key={z}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md text-neutral-400 hover:text-neutral-800"
                      >
                        {z}
                      </button>
                    ))}
                  </div>
                  <div className="hidden xl:flex items-center rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Drag & drop in Canvas view
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                <DragDropContext onDragEnd={handleListDragEnd}>
                {system.modules.map((mod) => {
                  const collapsed = collapsedModules.has(mod.id);
                  return (
                    <div key={mod.id} className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                      <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-3">
                          <button
                            onClick={() => toggleModuleCollapsed(mod.id)}
                            className="text-neutral-500 hover:text-neutral-800 transition-colors"
                            title={collapsed ? 'Expand module' : 'Collapse module'}
                          >
                            <ChevronDown className={cn('w-4 h-4 transition-transform', collapsed ? '-rotate-90' : 'rotate-0')} />
                          </button>
                          <div className="min-w-0">
                            <h3 className="truncate font-extrabold text-neutral-900">{mod.title}</h3>
                            <p className="text-xs text-neutral-500 font-medium">{mod.tasks.length} tasks</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                            <Pencil className="inline w-4 h-4 mr-1" />
                            Rename
                          </button>
                          <button className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50">
                            <Trash2 className="inline w-4 h-4 mr-1" />
                            Delete
                          </button>
                          <button
                            onClick={() => addTaskToModule(mod.id)}
                            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 hover:bg-emerald-100"
                          >
                            <Plus className="inline w-4 h-4 mr-1" />
                            Add Task
                          </button>
                        </div>
                      </div>

                      {!collapsed && (
                        <Droppable droppableId={mod.id}>
                          {(dropProvided) => (
                            <div
                              ref={dropProvided.innerRef}
                              {...dropProvided.droppableProps}
                              className="p-3 space-y-2"
                            >
                              {mod.tasks.map((task, index) => (
                                <Draggable
                                  key={`${mod.id}-${task.id}`}
                                  draggableId={`${mod.id}:${task.id}`}
                                  index={index}
                                >
                                  {(dragProvided, dragSnapshot) => (
                                    <div
                                      ref={dragProvided.innerRef}
                                      {...dragProvided.draggableProps}
                                      onClick={() => openTask(task.id)}
                                      className={cn(
                                        "rounded-xl border border-neutral-200 bg-white px-4 py-3 flex items-start justify-between gap-3 cursor-pointer hover:border-emerald-300 hover:shadow-sm transition-colors",
                                        dragSnapshot.isDragging && "border-emerald-400 shadow-md"
                                      )}
                                      title="Open task editor"
                                    >
                                      <div className="min-w-0 flex items-start gap-3">
                                        <button
                                          {...dragProvided.dragHandleProps}
                                          onClick={(e) => e.stopPropagation()}
                                          className="mt-0.5 text-neutral-400 hover:text-neutral-700 cursor-grab active:cursor-grabbing"
                                          title="Drag to reorder"
                                        >
                                          <GripVertical className="w-4 h-4" />
                                        </button>
                                        <div className="min-w-0">
                                          <h4 className="font-bold text-neutral-900 truncate">{task.name}</h4>
                                          <p className="text-sm text-neutral-500 mt-0.5">{task.type} · {task.difficulty}</p>
                                          <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{task.description}</p>
                                        </div>
                                      </div>
                                      <div className="shrink-0 flex items-center gap-3 text-neutral-500">
                                        <span className="inline-flex items-center gap-1 text-sm font-semibold">
                                          <Clock3 className="w-4 h-4" />
                                          {task.minutes} min
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openTask(task.id);
                                          }}
                                          className="hover:text-neutral-800"
                                          title="Edit task"
                                        >
                                          <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            removeTask(mod.id, task.id);
                                          }}
                                          className="hover:text-rose-600"
                                          title="Delete task"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {dropProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      )}
                    </div>
                  );
                })}
                </DragDropContext>
              </div>
            </div>
          )}
          
          {/* AICopilot Floating (Desktop) */}
          <div className={cn("hidden lg:flex absolute bottom-6 left-0 right-0 justify-center z-30 pointer-events-none", viewMode === 'list' && "bottom-3")}>
             <div className="pointer-events-auto">
               <AICopilot />
             </div>
          </div>
        </div>

        {/* Desktop Right Rail */}
        <div
          className={cn(
            "hidden lg:block transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
            rightOpen ? "w-[320px] border-l border-neutral-200 bg-white" : "w-[18px] border-0 bg-transparent"
          )}
        >
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
