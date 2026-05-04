import React, { useEffect, useMemo, useState } from 'react';
import { Undo2, Redo2, Plus, GripVertical, MoreHorizontal, Video, BookOpen, HelpCircle, PenTool, ClipboardList, Target, RefreshCcw, Dumbbell, Sparkles, CheckCircle, Circle, LayoutGrid, Rows3 } from 'lucide-react';
import { LearningSystem, Module, Task } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';

const TYPE_CONFIG = {
  Reading: { color: 'bg-blue-500 text-white', icon: BookOpen },
  Video: { color: 'bg-purple-500 text-white', icon: Video },
  'Chapter Quiz': { color: 'bg-amber-500 text-white', icon: HelpCircle },
  Notes: { color: 'bg-emerald-500 text-white', icon: PenTool },
  Assignment: { color: 'bg-red-500 text-white', icon: ClipboardList },
  Write: { color: 'bg-indigo-500 text-white', icon: Target },
  Revision: { color: 'bg-orange-500 text-white', icon: RefreshCcw },
  Practice: { color: 'bg-teal-500 text-white', icon: Dumbbell }
} as const;

export function Workspace({
  system,
  selectedModuleId,
  onSelectModule,
  onUpdateSystem,
  viewMode,
  onChangeViewMode,
}: {
  system: LearningSystem;
  selectedModuleId?: string | null;
  onSelectModule?: (id: string | null) => void;
  onUpdateSystem?: (s: LearningSystem) => void;
  viewMode: 'canvas' | 'list';
  onChangeViewMode: (next: 'canvas' | 'list') => void;
}) {
  const [zoom, setZoom] = useState<'overview' | 'default' | 'detail'>('default');
  const [zoomDelta, setZoomDelta] = useState(0);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  // Drag-to-pan state
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const boardRef = React.useRef<HTMLDivElement>(null);
  const minimapRef = React.useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [minimapDragging, setMinimapDragging] = useState(false);
  const [viewportRect, setViewportRect] = useState({ left: 0, top: 0, width: 28, height: 18 });

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only accept left clicks without modifiers (like shift for multi-select)
    if (e.button !== 0 || e.shiftKey) return;

    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Don't start panning when user interacts with controls/cards.
    const interactiveAncestor = target.closest(
      'button, input, textarea, select, a, [role="button"], [data-no-pan="true"]'
    );
    if (interactiveAncestor) return;

    e.preventDefault(); // Prevent accidental text selection while panning.
    setIsPanning(true);
    const rect = scrollContainerRef.current?.getBoundingClientRect();
    setStartX(e.clientX - (rect?.left || 0));
    setStartY(e.clientY - (rect?.top || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
    setScrollTop(scrollContainerRef.current?.scrollTop || 0);
  };

  const handleMouseLeave = () => {
    setIsPanning(false);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !scrollContainerRef.current) return;
    e.preventDefault();
    const rect = scrollContainerRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left || 0);
    const y = e.clientY - (rect.top || 0);
    const walkX = (x - startX) * 1.5; // Scroll speed multiplier
    const walkY = (y - startY) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft - walkX;
    scrollContainerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleTaskClick = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.shiftKey) {
      const newSet = new Set(selectedTasks);
      if (newSet.has(taskId)) newSet.delete(taskId);
      else newSet.add(taskId);
      setSelectedTasks(newSet);
    } else {
      const fromPath = `${location.pathname}?view=${viewMode}`;
      navigate(`/teacher/systems/new/systems/${system.id}/build/tasks/${taskId}`, {
        state: { from: fromPath },
      });
    }
  };

  const handleModuleClick = (moduleId: string) => {
    if (onSelectModule) {
      onSelectModule(selectedModuleId === moduleId ? null : moduleId);
    }
  };

  const zoomBase: Record<'overview' | 'default' | 'detail', number> = {
    overview: 0.82,
    default: 1,
    detail: 1.18,
  };
  const boardScale = Math.max(0.65, Math.min(1.55, zoomBase[zoom] + zoomDelta));
  const zoomPercent = Math.round(boardScale * 100);

  const nudgeZoom = (delta: number) => {
    setZoomDelta((prev) => Math.max(-0.35, Math.min(0.55, prev + delta)));
  };

  const resetZoom = () => {
    setZoom('default');
    setZoomDelta(0);
  };

  useEffect(() => {
    const onZoomIn = () => setZoomDelta((prev) => Math.max(-0.35, Math.min(0.55, prev + 0.08)));
    const onZoomOut = () => setZoomDelta((prev) => Math.max(-0.35, Math.min(0.55, prev - 0.08)));
    const onZoomReset = () => {
      setZoom('default');
      setZoomDelta(0);
    };

    window.addEventListener('gyanie-canvas-zoom-in', onZoomIn as EventListener);
    window.addEventListener('gyanie-canvas-zoom-out', onZoomOut as EventListener);
    window.addEventListener('gyanie-canvas-zoom-reset', onZoomReset as EventListener);
    return () => {
      window.removeEventListener('gyanie-canvas-zoom-in', onZoomIn as EventListener);
      window.removeEventListener('gyanie-canvas-zoom-out', onZoomOut as EventListener);
      window.removeEventListener('gyanie-canvas-zoom-reset', onZoomReset as EventListener);
    };
  }, []);

  const modulePreviewLayout = useMemo(() => {
    const widths = system.modules.map((mod) => 90 + mod.tasks.length * 5);
    const maxHeight = Math.max(65, ...system.modules.map((mod) => 40 + mod.tasks.length * 9));
    return { widths, maxHeight };
  }, [system.modules]);

  const syncMinimapViewport = React.useCallback(() => {
    const container = scrollContainerRef.current;
    const minimap = minimapRef.current;
    if (!container || !minimap) return;

    const miniRect = minimap.getBoundingClientRect();
    const contentWidth = container.scrollWidth || 1;
    const contentHeight = container.scrollHeight || 1;
    const scaleX = miniRect.width / contentWidth;
    const scaleY = miniRect.height / contentHeight;

    const nextRect = {
      left: container.scrollLeft * scaleX,
      top: container.scrollTop * scaleY,
      width: Math.max(18, container.clientWidth * scaleX),
      height: Math.max(14, container.clientHeight * scaleY),
    };
    setViewportRect(nextRect);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => syncMinimapViewport();
    container.addEventListener('scroll', onScroll, { passive: true });

    const onWindowResize = () => syncMinimapViewport();
    window.addEventListener('resize', onWindowResize);

    const resizeObserver = new ResizeObserver(() => syncMinimapViewport());
    resizeObserver.observe(container);
    if (boardRef.current) resizeObserver.observe(boardRef.current);

    syncMinimapViewport();
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onWindowResize);
      resizeObserver.disconnect();
    };
  }, [system.modules.length, boardScale, syncMinimapViewport]);

  const scrollFromMinimapPointer = (clientX: number, clientY: number) => {
    const container = scrollContainerRef.current;
    const minimap = minimapRef.current;
    if (!container || !minimap) return;

    const miniRect = minimap.getBoundingClientRect();
    if (miniRect.width <= 0 || miniRect.height <= 0) return;

    const ratioX = Math.max(0, Math.min(1, (clientX - miniRect.left) / miniRect.width));
    const ratioY = Math.max(0, Math.min(1, (clientY - miniRect.top) / miniRect.height));

    const targetLeft = ratioX * container.scrollWidth - container.clientWidth / 2;
    const targetTop = ratioY * container.scrollHeight - container.clientHeight / 2;
    const boundedLeft = Math.max(0, Math.min(targetLeft, container.scrollWidth - container.clientWidth));
    const boundedTop = Math.max(0, Math.min(targetTop, container.scrollHeight - container.clientHeight));
    container.scrollTo({ left: boundedLeft, top: boundedTop, behavior: minimapDragging ? 'auto' : 'smooth' });
  };

  const handleMinimapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setMinimapDragging(true);
    scrollFromMinimapPointer(e.clientX, e.clientY);
  };

  useEffect(() => {
    if (!minimapDragging) return;
    const onMove = (e: MouseEvent) => scrollFromMinimapPointer(e.clientX, e.clientY);
    const onUp = () => setMinimapDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [minimapDragging]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative text-neutral-900 bg-neutral-50/80">
      {/* Top Toolbar */}
      <header
        className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shrink-0 relative z-10"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <div className="text-neutral-400">
            <Undo2 className="w-4 h-4 scale-x-[-1]" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold flex items-center gap-2">
              <input
                type="text"
                defaultValue={system.title}
                className="font-extrabold text-sm bg-transparent border-none outline-none focus:ring-0 truncate w-48 hover:bg-neutral-50 rounded px-1 -ml-1"
              />
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 -mt-1">Systems › CBSE Maths Class 10</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-neutral-100 p-1 rounded-lg gap-1 border border-neutral-200/50">
            <button
              onClick={() => onChangeViewMode('canvas')}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-1",
                viewMode === 'canvas' ? "bg-white shadow-sm border border-neutral-200 text-neutral-900" : "text-neutral-400 hover:text-neutral-800"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Canvas
            </button>
            <button
              onClick={() => onChangeViewMode('list')}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md transition-all inline-flex items-center gap-1",
                viewMode === 'list' ? "bg-white shadow-sm border border-neutral-200 text-neutral-900" : "text-neutral-400 hover:text-neutral-800"
              )}
            >
              <Rows3 className="w-3.5 h-3.5" />
              List
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[10px] font-bold text-neutral-400 bg-neutral-50 px-2 py-1 rounded border border-neutral-200">Saved 2m ago</span>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-1.5 rounded-lg shadow-md shadow-amber-500/20 transition-all active:scale-95 uppercase tracking-wide">
              Publish System
            </button>
          </div>
        </div>
      </header>

      {/* Swimlane Board Canvas */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={(e) => {
          if (!e.ctrlKey) return;
          e.preventDefault();
          nudgeZoom(e.deltaY > 0 ? -0.02 : 0.02);
        }}
        onClick={() => onSelectModule && onSelectModule(null)}
        className={cn(
          "flex-1 overflow-x-auto overflow-y-auto hide-scrollbar p-8",
          isPanning ? "cursor-grabbing select-none" : "cursor-grab"
        )}
      >
        <div
          ref={boardRef}
          className="flex items-start gap-8 min-w-max origin-top-left pb-2"
          style={{
            transform: `scale(${boardScale})`,
            transformOrigin: 'top left',
            transition: isPanning ? 'none' : 'transform 140ms ease-out',
            willChange: 'transform',
          }}
        >
        {system.modules.map((mod) => {
          const isModuleSelected = selectedModuleId === mod.id;
          return (
            <motion.div
              key={mod.id}
              onClick={(e) => { e.stopPropagation(); handleModuleClick(mod.id); }}
              onMouseDown={(e) => e.stopPropagation()}
              whileHover={isPanning ? undefined : { y: -2 }}
              transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
              className={cn("w-72 lg:w-72 shrink-0 flex flex-col gap-4 transition-all duration-200 cursor-default", isModuleSelected ? "scale-[1.02]" : "scale-100")}
            >
              {/* Module Header Header */}
              <div className={cn("bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col group transition-colors", isModuleSelected ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md" : "border-neutral-200")}>
                <div className={cn("h-1.5 w-full", mod.color)}></div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <input
                      defaultValue={mod.title}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="font-extrabold text-sm text-neutral-900 bg-transparent outline-none w-full hover:bg-neutral-50 rounded px-1 -ml-1 text-ellipsis text-cursor-text cursor-text"
                    />
                    <button className="text-neutral-300 hover:text-neutral-500 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                    <span>{mod.tasks.length} tasks</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
                    <span>{mod.tasks.reduce((sum, t) => sum + t.minutes, 0)} Mins</span>
                    <div className="flex gap-0.5 ml-auto">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-4 space-y-2 min-h-[40px]">
                  {mod.tasks.map(task => {
                    const isSelected = selectedTasks.has(task.id);
                    const TypeIcon = TYPE_CONFIG[task.type].icon;
                    return (
                      <motion.div
                        layoutId={`task-${task.id}`}
                        key={task.id}
                        onClick={(e) => handleTaskClick(task.id, e as any)}
                        whileHover={isPanning ? undefined : { y: -1 }}
                        whileTap={isPanning ? undefined : { scale: 0.992 }}
                        transition={{ type: 'tween', duration: 0.1, ease: 'easeOut' }}
                        className={cn("group cursor-pointer p-3 border rounded-lg bg-white shadow-sm ring-2 ring-transparent transition-all relative", isSelected ? "border-amber-400 ring-amber-400" : "border-neutral-200 hover:ring-amber-400")}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-grab z-10 transition-opacity">
                          <GripVertical className="w-3 h-3 text-neutral-400 bg-white/80 rounded" />
                        </div>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white", TYPE_CONFIG[task.type].color)}>
                            <TypeIcon className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden pr-2">
                            <h4 className="text-xs font-bold leading-tight truncate">{task.name}</h4>
                            <p className="text-[10px] text-neutral-400 truncate mt-[1px]">{task.description}</p>
                            <div className="flex gap-1.5 mt-2">
                              <span className={cn("px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded",
                                task.type === 'Reading' ? 'bg-blue-50 text-blue-600' :
                                  task.type === 'Chapter Quiz' ? 'bg-amber-50 text-amber-600' :
                                    task.type === 'Video' ? 'bg-purple-50 text-purple-600' : 'bg-neutral-100 text-neutral-600'
                              )}>
                                {task.type}
                              </span>
                              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[9px] font-extrabold uppercase rounded">
                                {task.minutes}m
                              </span>
                            </div>
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-3 flex flex-col gap-1 border-t border-neutral-100 pt-2.5">
                                {task.subtasks.map((sub, subIdx) => (
                                  <div key={sub.id} className="flex items-center gap-2 py-0.5">
                                    <span className="text-[9px] font-bold text-neutral-300 w-3.5 text-right shrink-0">{subIdx + 1}.</span>
                                    <span className="text-[10px] font-medium text-neutral-600 truncate flex-1">{sub.name}</span>
                                    <span className="text-[8px] font-bold text-neutral-400">{sub.minutes}m</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}

                  {/* Add Task Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onUpdateSystem) {
                        const newTask: Task = {
                          id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                          name: 'New Task',
                          type: 'Reading',
                          minutes: 15,
                          description: 'Task description...',
                          difficulty: 'Medium',
                        };
                        const updatedModules = system.modules.map(m => {
                          if (m.id === mod.id) {
                            return { ...m, tasks: [...m.tasks, newTask] };
                          }
                          return m;
                        });
                        onUpdateSystem({ ...system, modules: updatedModules });
                      }
                    }}
                    className="w-full mt-2 py-2 bg-neutral-50 border border-neutral-200 border-dashed rounded-lg text-[10px] font-bold text-neutral-400 uppercase tracking-widest hover:bg-neutral-100 transition-colors text-center"
                  >
                    + Add task
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Add module */}
        <motion.div
          className="w-72 shrink-0 flex flex-col gap-4"
          onMouseDown={(e) => e.stopPropagation()}
          whileHover={isPanning ? undefined : { y: -2 }}
          transition={{ type: 'tween', duration: 0.14, ease: 'easeOut' }}
        >
          <button
            type="button"
            className="bg-white rounded-xl border border-dashed border-neutral-200 overflow-hidden text-left hover:border-amber-300 hover:bg-amber-50/30 transition-colors"
          >
            <div className="h-1.5 bg-neutral-200 w-full" />
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 border-2 border-dashed border-neutral-200 rounded-2xl flex items-center justify-center text-neutral-300 mb-3">
                <Plus className="w-7 h-7" strokeWidth={2} />
              </div>
              <h3 className="font-extrabold text-sm text-neutral-800">New module</h3>
              <p className="text-[11px] text-neutral-400 font-medium px-2 mt-1">Appendix A1 is the final authored module. Add another column to extend the system.</p>
            </div>
          </button>
        </motion.div>
        </div>
      </div>

      {/* Floating Action Bar for Multi Select */}
      <AnimatePresence>
        {selectedTasks.size >= 2 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-neutral-900 text-white rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl z-40"
          >
            <div className="text-sm font-bold bg-white/20 px-2 py-1 rounded">{selectedTasks.size} Selected</div>
            <div className="w-px h-6 bg-white/20"></div>
            <button className="text-sm font-semibold hover:text-amber-400 transition-colors">Move to module ▾</button>
            <button className="text-sm font-semibold hover:text-amber-400 transition-colors">Change difficulty ▾</button>
            <button className="text-sm font-semibold hover:text-amber-400 transition-colors">Duplicate</button>
            <button className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors">Delete</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimap */}
      <div
        className="hidden lg:block absolute bottom-8 right-8 w-44 h-28 bg-white/95 border border-neutral-200 rounded-lg shadow-xl p-2.5 overflow-hidden cursor-pointer select-none"
        data-no-pan="true"
      >
        <div
          ref={minimapRef}
          onMouseDown={handleMinimapMouseDown}
          className="relative w-full h-full rounded border border-neutral-200 bg-neutral-50 overflow-hidden"
          title="Minimap navigator"
        >
          <div className="absolute inset-0 px-1.5 py-1.5 flex items-end gap-1">
            {system.modules.map((mod, idx) => (
              <div
                key={mod.id}
                className={cn(
                  "rounded-sm border transition-colors",
                  selectedModuleId === mod.id
                    ? "border-emerald-500 bg-emerald-100"
                    : "border-neutral-200 bg-white"
                )}
                style={{
                  width: `${modulePreviewLayout.widths[idx]}px`,
                  minWidth: '10px',
                  height: `${Math.min(modulePreviewLayout.maxHeight, 40 + mod.tasks.length * 9)}px`,
                }}
              />
            ))}
            <div className="rounded-sm border border-dashed border-amber-300 bg-amber-50 h-8 w-8 shrink-0" />
          </div>

          <div
            className="absolute border-2 border-emerald-500/90 bg-emerald-200/20 rounded-sm shadow-[0_0_0_1px_rgba(16,185,129,0.15)]"
            style={{
              left: `${viewportRect.left}px`,
              top: `${viewportRect.top}px`,
              width: `${viewportRect.width}px`,
              height: `${viewportRect.height}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
