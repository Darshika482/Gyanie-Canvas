import { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';
import { HelpCircle, ChevronRight, X, ChevronLeft, Type, Image as ImageIcon, Link as LinkIcon, List, Video as VideoIcon, CheckCircle2, Circle, Plus, AlignLeft, PlaySquare, GraduationCap, PenTool, LayoutGrid, RotateCcw, Target, Settings, Trash2, GripVertical, ChevronUp, ChevronDown, Library, SlidersHorizontal, Eye, Maximize, Minimize, Bold, Italic, Underline, Highlighter, Upload } from 'lucide-react';
import { mockSystem } from '../data/mock';
import { Task, TaskType } from '../types';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// ── Helpers ─────────────────────────────────────────────
const TYPE_COLORS: Record<TaskType, { bg: string; text: string; badge: string; rail: string }> = {
  Reading:      { bg: 'bg-blue-500',    text: 'text-blue-600',    badge: 'bg-blue-50 text-blue-600',       rail: 'bg-blue-500' },
  Video:        { bg: 'bg-purple-500',  text: 'text-purple-600',  badge: 'bg-purple-50 text-purple-600',   rail: 'bg-purple-500' },
  'Chapter Quiz': { bg: 'bg-amber-500', text: 'text-amber-600',   badge: 'bg-amber-50 text-amber-600',     rail: 'bg-amber-500' },
  Notes:        { bg: 'bg-emerald-500', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600', rail: 'bg-emerald-500' },
  Assignment:   { bg: 'bg-red-500',     text: 'text-red-600',     badge: 'bg-red-50 text-red-600',         rail: 'bg-red-500' },
  Write:        { bg: 'bg-indigo-500',  text: 'text-indigo-600',  badge: 'bg-indigo-50 text-indigo-600',   rail: 'bg-indigo-500' },
  Revision:     { bg: 'bg-orange-500',  text: 'text-orange-600',  badge: 'bg-orange-50 text-orange-600',   rail: 'bg-orange-500' },
  Practice:     { bg: 'bg-teal-500',    text: 'text-teal-600',    badge: 'bg-teal-50 text-teal-600',       rail: 'bg-teal-500' },
};

const COPILOT_COLORS: Record<TaskType, string> = {
  Reading: 'emerald', Video: 'emerald', Practice: 'emerald', Write: 'emerald',
  Notes: 'emerald', Assignment: 'emerald', Revision: 'emerald', 'Chapter Quiz': 'emerald',
};

function uid() { return `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

// ── Block Editor Types & Components ─────────────────────
type BlockType = 'text' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'quote' | 'callout' | 'divider' | 'image' | 'code';
interface Block { id: string; type: BlockType; content: string; imageUrl?: string; imageScale?: number }

const BLOCK_MENU: { type: BlockType; label: string; icon: string; desc: string }[] = [
  { type: 'text',         label: 'Text',           icon: 'T',  desc: 'Plain text block' },
  { type: 'heading1',     label: 'Heading 1',      icon: 'H1', desc: 'Large section heading' },
  { type: 'heading2',     label: 'Heading 2',      icon: 'H2', desc: 'Medium heading' },
  { type: 'heading3',     label: 'Heading 3',      icon: 'H3', desc: 'Small heading' },
  { type: 'bulletList',   label: 'Bullet List',    icon: '•',  desc: 'Unordered list item' },
  { type: 'numberedList', label: 'Numbered List',  icon: '1.', desc: 'Ordered list item' },
  { type: 'quote',        label: 'Quote',          icon: '"',  desc: 'Blockquote' },
  { type: 'callout',      label: 'Callout',        icon: '💡', desc: 'Highlighted info box' },
  { type: 'divider',      label: 'Divider',        icon: '—',  desc: 'Horizontal line' },
  { type: 'image',        label: 'Image',          icon: '🖼', desc: 'Image placeholder' },
  { type: 'code',         label: 'Code',           icon: '<>', desc: 'Code snippet' },
];

function BlockInserterMenu({ onSelect, onClose }: { onSelect: (t: BlockType) => void; onClose: () => void }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-50 mt-1 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-1.5 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
      {BLOCK_MENU.map(b => (
        <button key={b.type} onClick={() => { onSelect(b.type); onClose(); }} className="w-full px-3 py-2 flex items-center gap-3 hover:bg-neutral-50 transition-colors text-left group">
          <div className="w-8 h-8 bg-neutral-100 group-hover:bg-amber-50 rounded-lg flex items-center justify-center text-xs font-bold text-neutral-500 group-hover:text-amber-600 shrink-0">{b.icon}</div>
          <div>
            <div className="text-xs font-semibold text-neutral-800">{b.label}</div>
            <div className="text-[10px] text-neutral-400">{b.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function SingleBlock({ block, idx, totalBlocks, onUpdate, onUpdateImage, onUpdateBlock, onDelete, onMoveUp, onMoveDown, dragHandleProps, autoFocus, onActive }: {
  block: Block; idx: number; totalBlocks: number;
  onUpdate: (content: string) => void; onDelete: () => void;
  onUpdateImage: (imageUrl: string | undefined) => void;
  onUpdateBlock: (partial: Partial<Block>) => void;
  onMoveUp: () => void; onMoveDown: () => void;
  dragHandleProps?: any;
  autoFocus?: boolean;
  onActive?: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevHeight = useRef<number>(0);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (autoFocus && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (textareaRef.current) {
          textareaRef.current.focus();
          const valLen = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(valLen, valLen);
        }
      }, 50);
    }
  }, [autoFocus]);

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${newHeight}px`;
      
      if (document.activeElement === textareaRef.current && prevHeight.current > 0 && newHeight > prevHeight.current) {
        const scrollContainer = textareaRef.current.closest('.overflow-y-auto');
        if (scrollContainer) {
          scrollContainer.scrollTop += (newHeight - prevHeight.current);
        }
      }
      prevHeight.current = newHeight;
    }
  }, [block.content]);

  if (block.type === 'divider') {
    return (
      <div ref={containerRef} className="group relative flex items-center py-2 px-1 -mx-1 rounded-lg hover:bg-neutral-50/80 transition-colors">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-60 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
          <div
            {...dragHandleProps}
            className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="w-full border-t border-neutral-200 my-2" />
        <div className="absolute -right-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button onClick={onMoveUp} disabled={idx === 0} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
          <button onClick={onMoveDown} disabled={idx === totalBlocks - 1} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
          <button onClick={onDelete} className="text-neutral-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
    );
  }

  if (block.type === 'image') {
    const handleSelectFile = (file?: File) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdateImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    };

    const inputId = `img-upload-${block.id}`;

    return (
      <div ref={containerRef} className="group relative py-2 px-1 -mx-1 rounded-lg hover:bg-neutral-50/80 transition-colors">
        <div className="absolute -left-8 top-4 opacity-60 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
          <div
            {...dragHandleProps}
            className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
        </div>
        <label
          htmlFor={inputId}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            e.preventDefault();
            handleSelectFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "w-full border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-300 transition-colors cursor-pointer overflow-hidden",
            block.imageUrl ? "bg-white" : "h-52 bg-neutral-100"
          )}
        >
          {block.imageUrl ? (
            <div style={{ width: `${block.imageScale || 100}%`, transition: 'width 0.2s' }}>
              <img src={block.imageUrl} alt="Uploaded block visual" className="w-full h-auto object-contain" />
            </div>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-neutral-300" />
              <span className="text-xs font-semibold text-neutral-400">Click to upload or drag an image</span>
            </>
          )}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleSelectFile(e.target.files?.[0])}
        />
        <div className="flex flex-col gap-2 mt-2">
          {block.imageUrl && (
             <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200">
               <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Size</span>
               <input 
                 type="range" 
                 min="20" max="100" 
                 value={block.imageScale || 100} 
                 onChange={e => onUpdateBlock({ imageScale: parseInt(e.target.value) })}
                 className="flex-1 accent-amber-500 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
               />
               <span className="text-[10px] font-bold text-neutral-500 w-8 text-right">{block.imageScale || 100}%</span>
             </div>
          )}
          <div className="flex items-center gap-2">
            <input type="text" value={block.content} onChange={e => onUpdate(e.target.value)} placeholder="Add a caption..." className="w-full text-xs text-neutral-500 text-center outline-none bg-transparent italic" />
            {block.imageUrl && (
              <button
                onClick={() => onUpdateImage(undefined)}
                className="text-[10px] font-semibold text-rose-500 hover:text-rose-600 shrink-0"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <div className="absolute -right-7 top-4 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
          <button onClick={onMoveUp} disabled={idx === 0} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
          <button onClick={onMoveDown} disabled={idx === totalBlocks - 1} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
          <button onClick={onDelete} className="text-neutral-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
    );
  }

  const textClass = cn(
    "w-full outline-none resize-none bg-transparent leading-relaxed placeholder:text-neutral-300",
    block.type === 'heading1' && "text-2xl font-black text-neutral-900",
    block.type === 'heading2' && "text-xl font-bold text-neutral-800",
    block.type === 'heading3' && "text-lg font-semibold text-neutral-800",
    block.type === 'text' && "text-sm text-neutral-700",
    block.type === 'bulletList' && "text-sm text-neutral-700",
    block.type === 'numberedList' && "text-sm text-neutral-700",
    block.type === 'quote' && "text-sm text-neutral-600 italic",
    block.type === 'callout' && "text-sm text-amber-800",
    block.type === 'code' && "text-xs font-mono text-neutral-800",
  );

  const wrapperClass = cn(
    "relative",
    block.type === 'quote' && "pl-4 border-l-[3px] border-neutral-300",
    block.type === 'callout' && "bg-amber-50 border border-amber-200 rounded-lg p-3",
    block.type === 'code' && "bg-neutral-50 border border-neutral-200 rounded-lg p-4 pt-10",
  );

  const placeholder =
    block.type === 'heading1' ? 'Heading 1' :
    block.type === 'heading2' ? 'Heading 2' :
    block.type === 'heading3' ? 'Heading 3' :
    block.type === 'quote' ? 'Write a quote…' :
    block.type === 'callout' ? 'Callout text…' :
    block.type === 'code' ? 'Write code…' :
    'Type something…';

  return (
    <div ref={containerRef} className="group relative flex items-start py-1 px-1 -mx-1 rounded-lg hover:bg-neutral-50/80 transition-colors">
      <div className="absolute -left-8 top-2.5 opacity-60 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-0.5">
        <div
          {...dragHandleProps}
          className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {(block.type === 'callout') && <span className="mr-2 shrink-0 mt-px">💡</span>}

      <div className={cn("flex-1 min-w-0", wrapperClass)}>
        {block.type === 'code' && (
          <div className="absolute top-2.5 left-4 right-2 flex items-center justify-between">
            <div className="flex gap-1.5 opacity-50">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(block.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded transition-all shadow-sm border",
                copied
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-white border-neutral-200 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700"
              )}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        )}
        <textarea
          value={block.content}
          onFocus={onActive}
          onChange={e => onUpdate(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (block.type === 'bulletList') {
                e.preventDefault();
                const target = e.target as HTMLTextAreaElement;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const val = target.value;
                const prefix = '\n• ';
                const nextVal = val.substring(0, start) + prefix + val.substring(end);
                onUpdate(nextVal);
                setTimeout(() => { target.selectionStart = target.selectionEnd = start + prefix.length; }, 0);
              } else if (block.type === 'numberedList') {
                e.preventDefault();
                const target = e.target as HTMLTextAreaElement;
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const val = target.value;
                const linesBefore = val.substring(0, start).split('\n');
                const lastLine = linesBefore[linesBefore.length - 1];
                const match = lastLine.match(/^(\d+)\./);
                let nextNum = linesBefore.length + 1;
                if (match) {
                  nextNum = parseInt(match[1], 10) + 1;
                }
                const prefix = `\n${nextNum}. `;
                const nextVal = val.substring(0, start) + prefix + val.substring(end);
                onUpdate(nextVal);
                setTimeout(() => { target.selectionStart = target.selectionEnd = start + prefix.length; }, 0);
              }
            }
          }}
          placeholder={placeholder}
          rows={1}
          ref={textareaRef}
          className={cn(textClass, "overflow-hidden")}
          style={{ minHeight: block.type.startsWith('heading') ? '36px' : '24px' }}
        />
      </div>

      <div className="absolute -right-7 top-2.5 flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <button onClick={onMoveUp} disabled={idx === 0} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
        <button onClick={onMoveDown} disabled={idx === totalBlocks - 1} className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
        <button onClick={onDelete} className="text-neutral-300 hover:text-rose-500"><Trash2 className="w-3 h-3" /></button>
      </div>
    </div>
  );
}

function ReadingWorkspace({ blocks, onUpdateBlocks }: { blocks: Block[]; onUpdateBlocks: (b: Block[]) => void }) {
  const [inserterIdx, setInserterIdx] = useState<number | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const addBlock = useCallback((type: BlockType, afterIdx?: number) => {
    let targetIdx = blocks.length - 1;
    if (afterIdx !== undefined && afterIdx !== null) {
      targetIdx = afterIdx;
    } else if (activeBlockId) {
      const found = blocks.findIndex(b => b.id === activeBlockId);
      if (found >= 0) targetIdx = found;
    }

    const initialContent = type === 'bulletList' ? '• ' : type === 'numberedList' ? '1. ' : '';
    const newId = uid();
    const newBlock: Block = { id: newId, type, content: initialContent };
    const next = [...blocks];
    next.splice(targetIdx + 1, 0, newBlock);
    onUpdateBlocks(next);
    setInserterIdx(null);
    setLastAddedId(newId);
    setActiveBlockId(newId);
  }, [blocks, onUpdateBlocks, activeBlockId]);

  const updateBlock = useCallback((id: string, content: string) => {
    onUpdateBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
  }, [blocks, onUpdateBlocks]);

  const updateBlockImage = useCallback((id: string, imageUrl: string | undefined) => {
    onUpdateBlocks(blocks.map(b => b.id === id ? { ...b, imageUrl } : b));
  }, [blocks, onUpdateBlocks]);

  const updateBlockPartial = useCallback((id: string, partial: Partial<Block>) => {
    onUpdateBlocks(blocks.map(b => b.id === id ? { ...b, ...partial } : b));
  }, [blocks, onUpdateBlocks]);

  const deleteBlock = useCallback((id: string) => {
    if (blocks.length <= 1) return;
    onUpdateBlocks(blocks.filter(b => b.id !== id));
  }, [blocks, onUpdateBlocks]);

  const moveBlock = useCallback((fromIdx: number, dir: -1 | 1) => {
    const toIdx = fromIdx + dir;
    if (toIdx < 0 || toIdx >= blocks.length) return;
    const next = [...blocks];
    [next[fromIdx], next[toIdx]] = [next[toIdx], next[fromIdx]];
    onUpdateBlocks(next);
  }, [blocks, onUpdateBlocks]);

  const moveBlockToPosition = useCallback((fromIdx: number, insertAt: number) => {
    if (fromIdx < 0 || insertAt < 0 || fromIdx >= blocks.length || insertAt > blocks.length) return;
    const next = [...blocks];
    const [moved] = next.splice(fromIdx, 1);
    const normalizedInsert = insertAt > fromIdx ? insertAt - 1 : insertAt;
    next.splice(normalizedInsert, 0, moved);
    onUpdateBlocks(next);
  }, [blocks, onUpdateBlocks]);

  const onDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    const fromIdx = result.source.index;
    const toIdx = result.destination.index;
    if (fromIdx === toIdx) return;
    
    const next = [...blocks];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onUpdateBlocks(next);
  }, [blocks, onUpdateBlocks]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ── Top Toolbar ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-3 sm:px-6 py-1.5 flex items-center gap-0.5 overflow-x-auto">
        {BLOCK_MENU.slice(0, 4).map(b => (
          <button
            key={b.type}
            onClick={() => addBlock(b.type)}
            title={b.label}
            className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all"
          >
            {b.icon}
          </button>
        ))}
        <div className="w-px h-4 bg-neutral-200/80 mx-1" />
        {BLOCK_MENU.slice(4, 8).map(b => (
          <button
            key={b.type}
            onClick={() => addBlock(b.type)}
            title={b.label}
            className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all"
          >
            {b.icon}
          </button>
        ))}
        <div className="w-px h-4 bg-neutral-200/80 mx-1" />
        <button onClick={() => addBlock('divider')} title="Divider" className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all">—</button>
        <button onClick={() => addBlock('image')} title="Image" className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all">🖼</button>
        <button onClick={() => addBlock('code')} title="Code" className="px-2 py-1.5 text-[10px] font-semibold text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all">&lt;/&gt;</button>
      </div>

      {/* ── Blocks ── */}
      <div className="flex-1 min-h-0 overflow-y-auto show-scrollbar px-2 sm:px-8 lg:px-12 py-6 sm:py-8 w-full">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reading-blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full pl-6 pr-8 sm:pl-10 sm:pr-10"
              >
                {blocks.map((block, idx) => (
                  <Draggable key={block.id} draggableId={block.id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn("relative rounded-lg transition-all", snapshot.isDragging && "opacity-90 shadow-2xl bg-white z-50 pointer-events-auto")}
                        style={provided.draggableProps.style}
                      >
                        <SingleBlock
                          block={block}
                          idx={idx}
                          totalBlocks={blocks.length}
                          onUpdate={c => updateBlock(block.id, c)}
                          onUpdateImage={url => updateBlockImage(block.id, url)}
                          onUpdateBlock={partial => updateBlockPartial(block.id, partial)}
                          onDelete={() => deleteBlock(block.id)}
                          onMoveUp={() => moveBlock(idx, -1)}
                          onMoveDown={() => moveBlock(idx, 1)}
                          dragHandleProps={provided.dragHandleProps}
                          autoFocus={block.id === lastAddedId}
                          onActive={() => setActiveBlockId(block.id)}
                        />

                        {/* Inserter line between blocks */}
                        <div className="relative h-0 group/ins flex items-center justify-center pointer-events-auto" style={{ marginTop: '2px', marginBottom: '2px', zIndex: 10 }}>
                          <button
                            onClick={() => setInserterIdx(inserterIdx === idx ? null : idx)}
                            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-neutral-200 bg-white flex items-center justify-center opacity-0 group-hover/ins:opacity-100 hover:!opacity-100 hover:border-amber-400 hover:text-amber-500 transition-all z-20 text-neutral-400"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover/ins:bg-neutral-200 transition-colors" />
                          {inserterIdx === idx && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setInserterIdx(null)} />
                              <BlockInserterMenu onSelect={t => addBlock(t, idx)} onClose={() => setInserterIdx(null)} />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

function VideoWorkspace({ videoUrl }: { videoUrl: string }) {
  const isYT = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const embedUrl = isYT
    ? videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')
    : '';

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-10 bg-neutral-50/50">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full max-w-2xl aspect-video rounded-xl shadow-xl border-4 border-neutral-800"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="w-full max-w-xl aspect-video bg-neutral-900 rounded-xl flex items-center justify-center text-neutral-500 relative border-4 border-neutral-800 shadow-xl overflow-hidden group">
          <PlaySquare className="w-16 h-16 group-hover:scale-110 transition-transform duration-300 group-hover:text-amber-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="h-1 bg-neutral-600 w-full rounded-full overflow-hidden mr-4"><div className="h-full bg-amber-500 w-1/3" /></div>
            <span className="text-xs font-bold text-white shrink-0">10:00</span>
          </div>
        </div>
      )}
      <p className="mt-6 text-sm font-semibold text-neutral-400">
        {embedUrl ? 'Video loaded from URL' : 'Enter a video URL in the right rail to preview.'}
      </p>
    </div>
  );
}

function SimpleRichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentEditableRef.current && contentEditableRef.current.innerHTML !== value) {
      contentEditableRef.current.innerHTML = value;
    }
  }, [value]);

  const handleCommand = (command: string, arg?: string) => {
    if (command === 'highlight') {
      // Toggle highlight specifically
      const bg = document.queryCommandValue('backColor');
      const isHighlighted = bg === 'rgb(255, 255, 0)' || bg === 'rgba(255, 255, 0, 1)' || bg === 'yellow' || bg === '#ffff00';
      // Use 'white' instead of 'transparent' as some browsers parse 'transparent' as #000000 in execCommand
      document.execCommand('hiliteColor', false, isHighlighted ? 'white' : 'yellow');
      document.execCommand('backColor', false, isHighlighted ? 'white' : 'yellow');
    } else {
      document.execCommand(command, false, arg);
    }
    if (contentEditableRef.current) {
        onChange(contentEditableRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white focus-within:border-teal-200 focus-within:ring-1 focus-within:ring-teal-200 transition-all">
      <div className="flex items-center gap-1 p-2 bg-neutral-50 border-b border-neutral-200">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('bold'); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('italic'); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('underline'); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
        <div className="w-px h-4 bg-neutral-300 mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('highlight'); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors" title="Highlight"><Highlighter className="w-3.5 h-3.5" /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); handleCommand('insertUnorderedList'); }} className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200 rounded transition-colors" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
      </div>
      <div
        ref={contentEditableRef}
        contentEditable
        className="w-full text-sm outline-none p-3 min-h-[80px] empty:before:content-[attr(data-placeholder)] empty:before:text-neutral-300"
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        data-placeholder={placeholder}
      />
    </div>
  );
}

interface ProblemItem { id: string; text: string; answer?: string; explanation?: string; }
function PracticeProblemViewer({ problem, index }: { problem: ProblemItem, index: number }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [studentAnswer, setStudentAnswer] = useState('');

  return (
    <div className="p-6 border border-neutral-200 rounded-2xl bg-white shadow-sm space-y-6">
      <div className="flex gap-4 items-start border-b border-neutral-100 pb-6">
        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">{index + 1}</div>
        <div className="flex-1 pt-1 text-sm font-medium text-neutral-800 whitespace-pre-wrap leading-relaxed">
          {problem.text}
        </div>
      </div>
      
      {!showAnswer ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Your Answer</label>
            <textarea 
              rows={3} 
              placeholder="Work through the problem and type your answer here..." 
              value={studentAnswer}
              onChange={e => setStudentAnswer(e.target.value)}
              className="w-full resize-none outline-none border border-neutral-200 rounded-xl p-4 text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 transition-all bg-neutral-50/50"
            />
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setShowAnswer(true)}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Reveal Solution <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 opacity-60">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Your Answer</label>
            <p className="text-sm text-neutral-600 whitespace-pre-wrap">{studentAnswer || <span className="italic text-neutral-400">No answer provided.</span>}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem.answer && (
              <div className="p-5 bg-teal-50/50 border border-teal-100 rounded-xl">
                <label className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer
                </label>
                <div className="text-sm font-medium text-teal-900 whitespace-pre-wrap">{problem.answer}</div>
              </div>
            )}
            
            {problem.explanation && (
              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-xl md:col-span-2">
                <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                  <Library className="w-3.5 h-3.5" /> Explanation
                </label>
                <div 
                  className="text-sm text-blue-900 leading-relaxed prose prose-sm prose-blue max-w-none"
                  dangerouslySetInnerHTML={{ __html: problem.explanation }}
                />
              </div>
            )}
          </div>
          
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400">How did you do?</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs rounded-lg transition-colors">Needs Work</button>
              <button className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-xs rounded-lg transition-colors">Got It Right</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PracticeWorkspace({ problems, onUpdate }: { problems: ProblemItem[]; onUpdate: (p: ProblemItem[]) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-10">
      <div className="space-y-6 max-w-3xl mx-auto">
        {problems.map((p, i) => (
          <div key={p.id} className="p-6 border border-neutral-200 rounded-2xl bg-white shadow-sm flex gap-4 items-start group relative">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">{i + 1}</div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-2 block">Question</label>
                <textarea
                  className="w-full text-sm outline-none resize-none bg-transparent font-medium"
                  rows={2}
                  value={p.text}
                  onChange={e => {
                    const next = [...problems];
                    next[i] = { ...p, text: e.target.value };
                    onUpdate(next);
                  }}
                  placeholder="Enter the practice question here..."
                />
              </div>
              
              <div className="pt-4 border-t border-neutral-100 space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-2 flex items-center gap-1">
                    Correct Answer
                    <span className="text-neutral-300 font-normal lowercase">(hidden from student)</span>
                  </label>
                  <textarea
                    className="w-full text-sm outline-none resize-none bg-neutral-50/50 rounded-lg p-3 border border-neutral-100 placeholder:text-neutral-300 focus:bg-white focus:border-teal-200 transition-colors"
                    rows={2}
                    value={p.answer || ''}
                    onChange={e => {
                      const next = [...problems];
                      next[i] = { ...p, answer: e.target.value };
                      onUpdate(next);
                    }}
                    placeholder="E.g., x = 5"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 mb-2 flex items-center gap-1">
                    Explanation
                    <span className="text-neutral-300 font-normal lowercase">(shown after attempt)</span>
                  </label>
                  <SimpleRichTextEditor
                    value={p.explanation || ''}
                    onChange={(v) => {
                      const next = [...problems];
                      next[i] = { ...p, explanation: v };
                      onUpdate(next);
                    }}
                    placeholder="Step-by-step solution..."
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => onUpdate(problems.filter(x => x.id !== p.id))} 
              className="text-neutral-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 absolute top-4 right-4"
              title="Remove Problem"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => onUpdate([...problems, { id: uid(), text: '', answer: '', explanation: '' }])}
          className="w-full py-4 border-2 border-dashed border-teal-200 text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Problem
        </button>
      </div>
    </div>
  );
}

function WriteWorkspace({ prompt, onPromptChange }: { prompt: string; onPromptChange: (v: string) => void }) {
  return (
    <div className="flex-1 flex flex-col p-10">
      <div className="mb-8">
        <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block">Prompt / Instructions</label>
        <textarea
          value={prompt}
          onChange={e => onPromptChange(e.target.value)}
          placeholder="Write your prompt here…"
          className="w-full p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl text-sm font-medium resize-none outline-none focus:border-indigo-300"
          rows={4}
        />
      </div>
      <div className="flex-1 border-t border-neutral-100 pt-8">
        <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4 block">Student Writing Area (Preview)</label>
        <div className="w-full h-full min-h-[200px] border border-neutral-200 rounded-xl bg-neutral-50 p-6 opacity-60">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-400">Rich Text Editor Placeholder</span>
          </div>
          <div className="space-y-3">
            <div className="h-2 bg-neutral-200 rounded w-full" />
            <div className="h-2 bg-neutral-200 rounded w-5/6" />
            <div className="h-2 bg-neutral-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotesWorkspace({ instructions, onChange }: { instructions: string; onChange: (v: string) => void }) {
  return (
    <div className="flex-1 p-10 flex flex-col items-center justify-center bg-emerald-50/20">
      <div className="max-w-md w-full bg-white border border-emerald-100 rounded-2xl p-8 shadow-lg shadow-emerald-500/5 text-center">
        <PenTool className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-neutral-800 mb-2">Cornell Notes Template</h3>
        <p className="text-sm text-neutral-500 mb-6">Students will see a structured template for taking notes. Leave instructions below.</p>
        <textarea
          value={instructions}
          onChange={e => onChange(e.target.value)}
          className="w-full p-4 border border-neutral-200 rounded-xl text-sm outline-none resize-none focus:border-emerald-400"
          placeholder="Instructions for notes…"
          rows={4}
        />
      </div>
    </div>
  );
}

interface Deliverable { id: string; text: string; done: boolean; fileType: 'Document' | 'PDF' | 'Image' | 'Presentation' | 'Spreadsheet' | 'Any' }
function AssignmentWorkspace({ deliverables, onUpdate }: { deliverables: Deliverable[]; onUpdate: (d: Deliverable[]) => void }) {
  return (
    <div className="flex-1 p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="p-6 bg-red-50/30 border border-red-100 rounded-xl">
          <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4">Deliverables</h4>
          <div className="space-y-3">
            {deliverables.map((d, i) => (
              <div key={d.id} className="flex flex-col gap-2 p-3 bg-white border border-neutral-200 rounded-lg group">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={d.done}
                    onChange={() => {
                      const next = [...deliverables];
                      next[i] = { ...d, done: !d.done };
                      onUpdate(next);
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-red-600 accent-red-500"
                  />
                  <input
                    type="text"
                    value={d.text}
                    onChange={e => {
                      const next = [...deliverables];
                      next[i] = { ...d, text: e.target.value };
                      onUpdate(next);
                    }}
                    placeholder="Deliverable description..."
                    className="text-sm font-semibold flex-1 outline-none bg-transparent"
                  />
                  <button onClick={() => onUpdate(deliverables.filter(x => x.id !== d.id))} className="text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                <div className="pl-7">
                  <select
                    value={d.fileType || 'Any'}
                    onChange={e => {
                      const next = [...deliverables];
                      next[i] = { ...d, fileType: e.target.value as Deliverable['fileType'] };
                      onUpdate(next);
                    }}
                    className="text-xs font-medium text-neutral-500 bg-neutral-50 border border-neutral-200 rounded px-2 py-1 outline-none focus:border-red-300 transition-colors"
                  >
                    <option value="Any">Any File Type</option>
                    <option value="Document">Word / Document</option>
                    <option value="PDF">PDF</option>
                    <option value="Image">Image (JPG, PNG)</option>
                    <option value="Presentation">Presentation (PPT)</option>
                    <option value="Spreadsheet">Spreadsheet (Excel)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => onUpdate([...deliverables, { id: uid(), text: 'New deliverable', done: false, fileType: 'Any' }])}
            className="mt-4 flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Deliverable Requirement
          </button>
        </div>
      </div>
    </div>
  );
}

interface FlashCard { id: string; front: string; back: string }
function RevisionWorkspace({ cards, onUpdate, activeIdx, setActiveIdx }: { cards: FlashCard[]; onUpdate: (c: FlashCard[]) => void; activeIdx: number; setActiveIdx: (n: number) => void }) {
  const card = cards[activeIdx] || { id: '', front: '', back: '' };
  return (
    <div className="flex-1 flex flex-col items-center p-10 overflow-y-auto bg-neutral-50/50">
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Card {activeIdx + 1} of {cards.length}</span>
        <div className="flex gap-2">
          <button disabled={activeIdx <= 0} onClick={() => setActiveIdx(activeIdx - 1)} className="px-2 py-1 rounded bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 text-xs font-bold transition-colors">‹ Prev</button>
          <button disabled={activeIdx >= cards.length - 1} onClick={() => setActiveIdx(activeIdx + 1)} className="px-2 py-1 rounded bg-neutral-100 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 text-xs font-bold transition-colors">Next ›</button>
        </div>
      </div>

      <div className="w-full max-w-lg aspect-[4/3] bg-white border-2 border-orange-100 rounded-2xl shadow-xl flex flex-col p-8 mb-6 relative">
        <div className="absolute top-4 left-4 text-[10px] font-extrabold uppercase text-orange-400 tracking-widest">Front</div>
        <textarea
          className="flex-1 w-full text-center text-2xl font-black text-neutral-800 outline-none resize-none bg-transparent mt-6"
          placeholder="Term or concept…"
          value={card.front}
          onChange={e => { const next = [...cards]; next[activeIdx] = { ...card, front: e.target.value }; onUpdate(next); }}
        />
      </div>

      <div className="w-full max-w-lg aspect-[4/3] bg-neutral-900 border-2 border-neutral-800 rounded-2xl shadow-xl flex flex-col p-8 mb-6 relative">
        <div className="absolute top-4 left-4 text-[10px] font-extrabold uppercase text-neutral-500 tracking-widest">Back</div>
        <textarea
          className="flex-1 w-full text-center text-xl font-medium text-white outline-none resize-none bg-transparent mt-6"
          placeholder="Definition…"
          value={card.back}
          onChange={e => { const next = [...cards]; next[activeIdx] = { ...card, back: e.target.value }; onUpdate(next); }}
        />
      </div>

      <div className="flex gap-3 w-full max-w-lg">
        <button
          onClick={() => { onUpdate([...cards, { id: uid(), front: '', back: '' }]); setActiveIdx(cards.length); }}
          className="flex-1 py-3 border-2 border-dashed border-orange-200 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Card
        </button>
        {cards.length > 1 && (
          <button
            onClick={() => { const next = cards.filter((_, i) => i !== activeIdx); onUpdate(next); setActiveIdx(Math.min(activeIdx, next.length - 1)); }}
            className="py-3 px-4 border border-rose-200 text-rose-500 font-bold rounded-xl hover:bg-rose-50 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>
    </div>
  );
}

interface QuizQuestion { id: string; text: string; type: 'MCQ' | 'TrueFalse' | 'Short'; options: string[]; correctIdx: number }
function ChapterQuizWorkspace({ questions, onUpdate }: { questions: QuizQuestion[]; onUpdate: (q: QuizQuestion[]) => void }) {
  return (
    <div className="flex-1 overflow-y-auto p-10 bg-neutral-50/30">
      <div className="max-w-2xl mx-auto space-y-6">
        {questions.map((q, qi) => (
          <div key={q.id} className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden group">
            <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Question {qi + 1}</span>
                <select
                  value={q.type}
                  onChange={e => {
                    const next = [...questions];
                    const newType = e.target.value as QuizQuestion['type'];
                    next[qi] = { ...q, type: newType, options: newType === 'MCQ' ? (q.options.length ? q.options : ['', '', '', '']) : newType === 'TrueFalse' ? ['True', 'False'] : [], correctIdx: 0 };
                    onUpdate(next);
                  }}
                  className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 outline-none"
                >
                  <option value="MCQ">MCQ</option>
                  <option value="TrueFalse">True / False</option>
                  <option value="Short">Short Answer</option>
                </select>
              </div>
              <button onClick={() => onUpdate(questions.filter((_, i) => i !== qi))} className="text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="p-5">
              <textarea
                className="w-full text-sm font-semibold outline-none resize-none mb-4"
                rows={2}
                placeholder="Question text…"
                value={q.text}
                onChange={e => { const next = [...questions]; next[qi] = { ...q, text: e.target.value }; onUpdate(next); }}
              />

              {q.type === 'MCQ' && (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => (
                    <div key={oi} className={cn("flex items-center gap-3 p-2 border rounded-lg cursor-pointer transition-colors", oi === q.correctIdx ? "border-amber-400 bg-amber-50/30" : "border-neutral-200 hover:border-neutral-300")} onClick={() => { const next = [...questions]; next[qi] = { ...q, correctIdx: oi }; onUpdate(next); }}>
                      <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors", oi === q.correctIdx ? "border-amber-500 bg-amber-500" : "border-neutral-300")}>
                        {oi === q.correctIdx && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <input
                        type="text"
                        className="text-xs font-medium w-full bg-transparent outline-none"
                        value={opt}
                        onChange={e => { const next = [...questions]; const opts = [...q.options]; opts[oi] = e.target.value; next[qi] = { ...q, options: opts }; onUpdate(next); }}
                        onClick={e => e.stopPropagation()}
                        placeholder={`Option ${oi + 1}`}
                      />
                      {q.options.length > 2 && (
                        <button onClick={e => { e.stopPropagation(); const next = [...questions]; const opts = q.options.filter((_, j) => j !== oi); next[qi] = { ...q, options: opts, correctIdx: Math.min(q.correctIdx, opts.length - 1) }; onUpdate(next); }} className="text-neutral-300 hover:text-rose-500"><X className="w-3 h-3" /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={() => { const next = [...questions]; next[qi] = { ...q, options: [...q.options, ''] }; onUpdate(next); }} className="text-[10px] font-bold text-amber-600 hover:text-amber-800 mt-1">+ Add Option</button>
                </div>
              )}

              {q.type === 'TrueFalse' && (
                <div className="flex gap-3">
                  {['True', 'False'].map((label, oi) => (
                    <button key={label} onClick={() => { const next = [...questions]; next[qi] = { ...q, correctIdx: oi }; onUpdate(next); }} className={cn("flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all", oi === q.correctIdx ? "border-amber-400 bg-amber-50 text-amber-700" : "border-neutral-200 text-neutral-500 hover:border-neutral-300")}>{label}</button>
                  ))}
                </div>
              )}

              {q.type === 'Short' && (
                <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <span className="text-xs text-neutral-400 font-medium">Students will type a short answer here</span>
                </div>
              )}
            </div>
          </div>
        ))}
        <button
          onClick={() => onUpdate([...questions, { id: uid(), text: '', type: 'MCQ', options: ['', '', '', ''], correctIdx: 0 }])}
          className="w-full py-4 border-2 border-dashed border-amber-200 text-amber-600 font-bold rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Question
        </button>
      </div>
    </div>
  );
}

function RevisionPreviewViewer({ flashCards }: { flashCards: FlashCard[] }) {
  const [idx, setIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (flashCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full">
          <Library className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Flashcards: 0</span>
        </div>
        <div className="w-full max-w-xl aspect-[3/2] bg-neutral-50/50 border-2 border-dashed border-neutral-200 rounded-3xl flex items-center justify-center"><p className="text-neutral-400 italic">No flashcards added.</p></div>
      </div>
    );
  }

  const currentCard = flashCards[idx];

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-8">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full">
        <Library className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Flashcards: {flashCards.length}</span>
      </div>
      
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className={cn(
          "w-full max-w-xl aspect-[3/2] border-2 rounded-3xl flex items-center justify-center p-12 cursor-pointer hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden",
          isFlipped 
            ? "bg-neutral-900 border-neutral-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]" 
            : "bg-white border-orange-200 shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]"
        )}
      >
        {!isFlipped && <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-transparent" />}
        <span className={cn(
          "absolute top-5 right-5 text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded",
          isFlipped ? "text-neutral-400 bg-neutral-800" : "text-orange-400 bg-orange-50"
        )}>
          Click to flip
        </span>
        <div className="absolute top-5 left-5">
           <span className={cn(
            "text-[10px] font-extrabold uppercase tracking-widest",
            isFlipped ? "text-neutral-500" : "text-orange-400"
          )}>
            {isFlipped ? 'Back' : 'Front'}
          </span>
        </div>

        <p className={cn(
          "text-3xl font-bold text-center relative z-10 leading-snug",
          isFlipped ? "text-white" : "text-neutral-800"
        )}>
          {isFlipped ? currentCard.back : currentCard.front}
        </p>
      </div>
      
      <div className="flex items-center gap-6 mt-4">
        <button 
          onClick={() => { setIdx(Math.max(0, idx - 1)); setIsFlipped(false); }}
          disabled={idx === 0}
          className="p-4 bg-white hover:bg-orange-50 hover:text-orange-500 border border-neutral-200 rounded-full text-neutral-400 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-6 h-6"/>
        </button>
        <span className="text-sm font-bold text-neutral-400 font-mono">{idx + 1} / {flashCards.length}</span>
        <button 
          onClick={() => { setIdx(Math.min(flashCards.length - 1, idx + 1)); setIsFlipped(false); }}
          disabled={idx === flashCards.length - 1}
          className="p-4 bg-white hover:bg-orange-50 hover:text-orange-500 border border-neutral-200 rounded-full text-neutral-400 transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="w-6 h-6"/>
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN AUTHORING STAGE
// ══════════════════════════════════════════════════════════

export function AuthoringStage() {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const draftKey = `authoring-draft-${taskId ?? 'default'}`;

  const allTasks = mockSystem.modules.flatMap(m => m.tasks);
  const foundTask = allTasks.find(t => t.id === taskId) || allTasks[0];

  // ── Core task state ──
  const [taskName, setTaskName] = useState(foundTask?.name || 'New Task');
  const [taskType, setTaskType] = useState<TaskType>(foundTask?.type || 'Reading');
  const [taskDescription, setTaskDescription] = useState(foundTask?.description || '');
  const [taskMinutes, setTaskMinutes] = useState(foundTask?.minutes || 15);
  const [taskDifficulty, setTaskDifficulty] = useState(foundTask?.difficulty || 'Easy');

  // ── Steps (subtasks) state ──
  const [steps, setSteps] = useState<Task[]>(foundTask?.subtasks || []);

  // ── Workspace-specific state ──
  const [editorBlocks, setEditorBlocks] = useState<Block[]>([
    { id: uid(), type: 'heading2', content: 'Introduction' },
    { id: uid(), type: 'text', content: 'This is the reading assignment. Students will review this before moving on to the next step.' },
    { id: uid(), type: 'callout', content: 'Pay close attention to the key terms highlighted in the document.' },
    { id: uid(), type: 'heading3', content: 'Section 1: Foundations' },
    { id: uid(), type: 'text', content: 'The cosmos is everything that exists — all of space and time and their contents, including planets, moons, minor planets and stars.' },
    { id: uid(), type: 'bulletList', content: 'Stars are born in clouds of dust and gas called nebulae' },
    { id: uid(), type: 'bulletList', content: 'Gravity pulls the dust and gas together to form a protostar' },
    { id: uid(), type: 'bulletList', content: 'Nuclear fusion ignites in the core, and a star is born' },
    { id: uid(), type: 'divider', content: '' },
    { id: uid(), type: 'quote', content: 'The nitrogen in our DNA, the calcium in our teeth, the iron in our blood — were made in the interiors of collapsing stars. — Carl Sagan' },
  ]);
  const [videoUrl, setVideoUrl] = useState('');
  const [problems, setProblems] = useState<ProblemItem[]>([
    { id: uid(), text: 'Evaluate the expression for x = 3' },
    { id: uid(), text: 'Simplify the polynomial' },
    { id: uid(), text: 'Factor the quadratic equation' },
  ]);
  const [writePrompt, setWritePrompt] = useState('Write a 500 word essay on the topic…');
  const [notesInstructions, setNotesInstructions] = useState('');
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    { id: uid(), text: 'Rough Draft Document', done: false, fileType: 'Document' },
    { id: uid(), text: 'Final Submission (PDF)', done: false, fileType: 'PDF' },
  ]);
  const [flashCards, setFlashCards] = useState<FlashCard[]>([
    { id: uid(), front: 'Supernova', back: 'The brilliant explosion of a star.' },
    { id: uid(), front: 'Nebula', back: 'A giant cloud of dust and gas in space.' },
  ]);
  const [activeCardIdx, setActiveCardIdx] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([
    { id: uid(), text: 'What is the closest star to Earth?', type: 'MCQ', options: ['The Sun', 'Proxima Centauri', 'Sirius', 'Alpha Centauri A'], correctIdx: 0 },
    { id: uid(), text: 'The Moon is a star.', type: 'TrueFalse', options: ['True', 'False'], correctIdx: 1 },
  ]);
  const [passingPercent, setPassingPercent] = useState('70%');
  const [wordLimit, setWordLimit] = useState(500);

  // ── Resources state ──
  const [resources, setResources] = useState<{ id: string; type: string; title: string; source: string }[]>([
    { id: 'r1', type: 'pdf', title: 'Algebra Intro.pdf', source: 'NCERT Library' },
    { id: 'r2', type: 'video', title: 'Quadratic Visuals', source: 'YouTube' },
    { id: 'r3', type: 'note', title: 'Lecture Notes: Week 1', source: 'Your uploads' },
    { id: 'r4', type: 'pdf', title: 'HR Diagram blank', source: 'Drive' },
    { id: 'r5', type: 'image', title: 'Star Lifecycle Chart', source: 'Your uploads' },
    { id: 'r6', type: 'link', title: 'NASA Reference Link', source: 'Web' },
  ]);
  const [resourceSearch, setResourceSearch] = useState('');
  const [stepsExpanded, setStepsExpanded] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<'none' | 'resources' | 'config'>('none');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  
  const [stepBlocks, setStepBlocks] = useState<Record<string, Block[]>>({});
  const [stepVideoUrls, setStepVideoUrls] = useState<Record<string, string>>({});
  const [stepProblems, setStepProblems] = useState<Record<string, ProblemItem[]>>({});
  const [stepWritePrompts, setStepWritePrompts] = useState<Record<string, string>>({});
  const [stepNotesInstructions, setStepNotesInstructions] = useState<Record<string, string>>({});
  const [stepDeliverables, setStepDeliverables] = useState<Record<string, Deliverable[]>>({});
  const [stepFlashCards, setStepFlashCards] = useState<Record<string, FlashCard[]>>({});
  const [stepQuizQuestions, setStepQuizQuestions] = useState<Record<string, QuizQuestion[]>>({});

  const [previewMode, setPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewStepIdx, setPreviewStepIdx] = useState(-1);

  // ── Step toggling ──
  const toggleStep = useCallback((stepId: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, isCompleted: !s.isCompleted } : s));
  }, []);

  const addStep = useCallback(() => {
    setSteps(prev => [...prev, {
      id: uid(),
      name: 'New Step',
      type: taskType,
      description: '',
      minutes: 5,
      difficulty: 'Easy',
      isCompleted: false,
    }]);
  }, [taskType]);

  const updateStepName = useCallback((stepId: string, name: string) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, name } : s));
  }, []);

  const updateStepMinutes = useCallback((stepId: string, minutes: number) => {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, minutes } : s));
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setSteps(prev => prev.filter(s => s.id !== stepId));
  }, []);

  const onDragEndSteps = useCallback((result: any) => {
    if (!result.destination) return;
    const fromIdx = result.source.index;
    const toIdx = result.destination.index;
    if (fromIdx === toIdx) return;
    
    setSteps(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  }, []);

  const colors = TYPE_COLORS[taskType] || TYPE_COLORS.Reading;
  const completedSteps = steps.filter(s => s.isCompleted).length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<{
        taskName: string;
        taskDescription: string;
        taskMinutes: number;
        taskDifficulty: Task['difficulty'];
        steps: Task[];
        editorBlocks: Block[];
        videoUrl: string;
        problems: ProblemItem[];
        writePrompt: string;
        notesInstructions: string;
        deliverables: Deliverable[];
        flashCards: FlashCard[];
        quizQuestions: QuizQuestion[];
        wordLimit: number;
      }>;
      if (parsed.taskName !== undefined) setTaskName(parsed.taskName);
      if (parsed.taskDescription !== undefined) setTaskDescription(parsed.taskDescription);
      if (parsed.taskMinutes !== undefined) setTaskMinutes(parsed.taskMinutes);
      if (parsed.taskDifficulty !== undefined) setTaskDifficulty(parsed.taskDifficulty);
      if (parsed.steps) setSteps(parsed.steps);
      if (parsed.editorBlocks) setEditorBlocks(parsed.editorBlocks);
      if (parsed.videoUrl !== undefined) setVideoUrl(parsed.videoUrl);
      if (parsed.problems) setProblems(parsed.problems);
      if (parsed.writePrompt !== undefined) setWritePrompt(parsed.writePrompt);
      if (parsed.notesInstructions !== undefined) setNotesInstructions(parsed.notesInstructions);
      if (parsed.deliverables) setDeliverables(parsed.deliverables);
      if (parsed.flashCards) setFlashCards(parsed.flashCards);
      if (parsed.quizQuestions) setQuizQuestions(parsed.quizQuestions);
      if (parsed.wordLimit !== undefined) setWordLimit(parsed.wordLimit);
    } catch {
      // Ignore malformed draft payloads.
    }
  }, [draftKey]);

  useEffect(() => {
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        taskName,
        taskDescription,
        taskMinutes,
        taskDifficulty,
        steps,
        editorBlocks,
        videoUrl,
        problems,
        writePrompt,
        notesInstructions,
        deliverables,
        flashCards,
        quizQuestions,
        wordLimit,
      }));
      setLastSavedAt(Date.now());
    } catch {
      // Ignore storage write failures (e.g. quota exceeded).
    }
  }, [
    draftKey,
    taskName,
    taskDescription,
    taskMinutes,
    taskDifficulty,
    steps,
    editorBlocks,
    videoUrl,
    problems,
    writePrompt,
    notesInstructions,
    deliverables,
    flashCards,
    quizQuestions,
    wordLimit,
  ]);

  const renderStudentPreviewContent = () => {
    const isMain = previewStepIdx === -1;
    const currentStepId = isMain ? null : steps[previewStepIdx]?.id;
    
    const curBlocks = isMain ? editorBlocks : (currentStepId ? stepBlocks[currentStepId] : []) || [];
    const curVideoUrl = isMain ? videoUrl : (currentStepId ? stepVideoUrls[currentStepId] : '') || '';
    const curProblems = isMain ? problems : (currentStepId ? stepProblems[currentStepId] : []) || [];
    const curWritePrompt = isMain ? writePrompt : (currentStepId ? stepWritePrompts[currentStepId] : '') || '';
    const curNotesInstructions = isMain ? notesInstructions : (currentStepId ? stepNotesInstructions[currentStepId] : '') || '';
    const curDeliverables = isMain ? deliverables : (currentStepId ? stepDeliverables[currentStepId] : []) || [];
    const curFlashCards = isMain ? flashCards : (currentStepId ? stepFlashCards[currentStepId] : []) || [];
    const curQuizQuestions = isMain ? quizQuestions : (currentStepId ? stepQuizQuestions[currentStepId] : []) || [];

    const BlocksComponent = () => (
      <div className="space-y-4">
        {curBlocks.map((block) => (
          <div key={block.id} className={cn(block.type === 'callout' && "bg-amber-50 border border-amber-200 rounded-lg p-4", block.type === 'quote' && "pl-4 border-l-4 border-neutral-300 italic", block.type === 'code' && "bg-neutral-50 border border-neutral-200 rounded-lg p-5 font-mono text-xs text-neutral-800")}>
            {block.type === 'image' && block.imageUrl && <div style={{ width: `${block.imageScale || 100}%` }} className="mb-2"><img src={block.imageUrl} className="w-full h-auto object-contain rounded-lg" /></div>}
            {block.type === 'divider' && <hr className="my-8 border-neutral-200" />}
            {block.type !== 'image' && block.type !== 'divider' && (
              <p className={cn("whitespace-pre-wrap leading-relaxed", block.type === 'heading1' && "text-3xl font-black text-neutral-900 mt-8 mb-4", block.type === 'heading2' && "text-2xl font-bold text-neutral-800 mt-6 mb-3", block.type === 'heading3' && "text-xl font-semibold text-neutral-800 mt-4 mb-2", block.type.includes('List') && "ml-4")}>
                {block.content}
              </p>
            )}
            {block.type === 'image' && block.content && <p className="text-xs text-center text-neutral-500 italic mt-2">{block.content}</p>}
          </div>
        ))}
      </div>
    );

    switch (taskType) {
      case 'Practice':
        return (
          <div className="space-y-8">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mb-8 text-center">
              <h3 className="text-xl font-bold text-teal-800 mb-2">{isMain ? taskName : steps[previewStepIdx]?.name}</h3>
              <p className="text-sm font-medium text-teal-600">Complete the {curProblems.length} practice problems below.</p>
            </div>
            {curProblems.map((p, i) => <PracticeProblemViewer key={p.id} problem={p} index={i} />)}
          </div>
        );
      case 'Video':
        return (
          <div className="flex flex-col items-center">
            {curVideoUrl ? (
              <iframe
                src={curVideoUrl.includes('youtube.com') || curVideoUrl.includes('youtu.be') ? curVideoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') : curVideoUrl}
                className="w-full max-w-3xl aspect-video rounded-xl shadow-xl border-4 border-neutral-800"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full max-w-3xl aspect-video bg-neutral-900 rounded-xl flex flex-col items-center justify-center text-neutral-500 relative border-4 border-neutral-800 shadow-xl overflow-hidden">
                <PlaySquare className="w-16 h-16 text-neutral-600 mb-4" />
                <p>No video URL configured</p>
              </div>
            )}
          </div>
        );
      case 'Write':
        return (
          <div className="space-y-6">
            <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-xl mb-4">
              <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">Prompt</h3>
              <p className="text-sm text-indigo-900 whitespace-pre-wrap font-medium leading-relaxed">{curWritePrompt || 'No prompt provided.'}</p>
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Student Editor</label>
              <textarea className="w-full min-h-[300px] p-6 text-sm bg-neutral-50 border-2 border-neutral-200/60 rounded-xl resize-y outline-none focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 transition-all shadow-inner" placeholder="Begin writing here..." />
            </div>
          </div>
        );
      case 'Notes':
        return (
          <div className="space-y-6">
            {curNotesInstructions && (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-sm font-medium text-emerald-900 whitespace-pre-wrap leading-relaxed shadow-sm">
                <span className="font-bold flex items-center gap-2 mb-3 uppercase text-[10px] tracking-widest text-emerald-700 bg-emerald-100/50 w-fit px-3 py-1 rounded-full"><HelpCircle className="w-3.5 h-3.5"/> Instructions</span>
                {curNotesInstructions}
              </div>
            )}
            <textarea className="w-full min-h-[400px] bg-[#fffdf0] p-8 pb-12 text-sm outline-none resize-none mx-auto shadow-md border-l-[30px] border-l-red-400/20 rounded-r-xl" style={{ backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #e8e8e8 31px, #e8e8e8 32px)', lineHeight: '32px', backgroundAttachment: 'local' }} placeholder="Type your notes here..." />
          </div>
        );
      case 'Assignment':
        return (
          <div className="space-y-4 max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm">
            <h3 className="text-xl font-bold text-neutral-800 mb-6 flex items-center gap-3"><Target className="w-6 h-6 text-rose-500" /> Assessment Deliverables</h3>
            <div className="space-y-3">
              {curDeliverables.length === 0 && <p className="text-sm text-neutral-400 italic">No deliverables assigned.</p>}
              {curDeliverables.map(d => (
                <div key={d.id} className="p-5 border-2 border-neutral-100 rounded-xl flex flex-col gap-4 bg-white hover:border-rose-200 transition-all group">
                  <div className="flex items-center gap-4">
                    <label className="w-6 h-6 rounded border-2 border-neutral-300 group-hover:border-rose-400 flex items-center justify-center transition-colors bg-white cursor-pointer relative">
                      <input type="checkbox" className="opacity-0 absolute inset-0 cursor-pointer" />
                      <CheckCircle2 className="w-4 h-4 text-transparent" />
                    </label>
                    <span className="text-sm font-medium text-neutral-700 select-none group-hover:text-neutral-900 flex-1">{d.text}</span>
                  </div>
                  
                  <div className="ml-10 border-t border-dashed border-neutral-200 pt-4 mt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 bg-neutral-50 px-3 py-1.5 rounded-lg">
                        <Upload className="w-3.5 h-3.5 text-neutral-400" /> 
                        {d.fileType === 'Any' ? 'Any file format accepted' : `Required format: ${d.fileType}`}
                      </div>
                      <button className="px-4 py-2 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 text-xs font-bold rounded-lg transition-colors border border-neutral-200 hover:border-rose-200">
                        Select File
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]">Submit Assignment</button>
          </div>
        );
      case 'Revision':
        return <RevisionPreviewViewer flashCards={curFlashCards} />;
      case 'Chapter Quiz':
        return (
          <div className="space-y-6 max-w-3xl mx-auto">
            {curQuizQuestions.length === 0 && <p className="text-sm text-neutral-400 italic text-center py-10">No questions added to quiz.</p>}
            {curQuizQuestions.map((q, i) => (
              <div key={q.id} className="p-6 sm:p-8 border border-neutral-200 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400" />
                <h4 className="text-base sm:text-lg font-bold text-neutral-800 flex gap-4 leading-relaxed mb-6">
                  <span className="text-amber-500 shrink-0 font-black">{i + 1}.</span> {q.text}
                </h4>
                <div className="space-y-2.5">
                  {q.type === 'Short' ? (
                    <textarea 
                      className="w-full min-h-[120px] p-4 rounded-xl border-2 border-neutral-100 hover:border-amber-200 focus:border-amber-400 focus:bg-white bg-neutral-50/50 outline-none text-[15px] font-medium text-neutral-700 resize-none transition-all placeholder:text-neutral-400"
                      placeholder="Type your answer here..."
                    />
                  ) : (
                    q.options.map((opt, oIdx) => (
                      <label key={oIdx} className="flex items-start gap-4 p-4 rounded-xl border-2 border-neutral-100 hover:border-amber-200 hover:bg-amber-50/30 cursor-pointer transition-all group">
                        <div className="w-5 h-5 mt-0.5 rounded-full border-2 border-neutral-300 group-hover:border-amber-400 flex items-center justify-center shrink-0 bg-white" />
                        <span className="text-[15px] font-medium text-neutral-700 group-hover:text-neutral-900 select-none leading-snug pt-[1px]">{opt}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            ))}
            {curQuizQuestions.length > 0 && (
               <button className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]">Submit Quiz</button>
            )}
          </div>
        );
      case 'Reading':
      default:
        return <BlocksComponent />;
    }
  };

  // ── Render workspace by type ──
  const renderWorkspace = () => {
    switch (taskType) {
      case 'Reading':
        return <ReadingWorkspace 
          blocks={activeStepId ? (stepBlocks[activeStepId] || []) : editorBlocks} 
          onUpdateBlocks={b => activeStepId ? setStepBlocks(prev => ({ ...prev, [activeStepId]: b })) : setEditorBlocks(b)} 
        />;
      case 'Video':
        return <VideoWorkspace 
          videoUrl={activeStepId ? (stepVideoUrls[activeStepId] || '') : videoUrl} 
        />;
      case 'Practice':
        return <PracticeWorkspace 
          problems={activeStepId ? (stepProblems[activeStepId] || []) : problems} 
          onUpdate={p => activeStepId ? setStepProblems(prev => ({...prev, [activeStepId]: p})) : setProblems(p)} 
        />;
      case 'Write':
        return <WriteWorkspace 
          prompt={activeStepId ? (stepWritePrompts[activeStepId] || '') : writePrompt} 
          onPromptChange={p => activeStepId ? setStepWritePrompts(prev => ({...prev, [activeStepId]: p})) : setWritePrompt(p)} 
        />;
      case 'Notes':
        return <NotesWorkspace 
          instructions={activeStepId ? (stepNotesInstructions[activeStepId] || '') : notesInstructions} 
          onChange={i => activeStepId ? setStepNotesInstructions(prev => ({...prev, [activeStepId]: i})) : setNotesInstructions(i)} 
        />;
      case 'Assignment':
        return <AssignmentWorkspace 
          deliverables={activeStepId ? (stepDeliverables[activeStepId] || []) : deliverables} 
          onUpdate={d => activeStepId ? setStepDeliverables(prev => ({...prev, [activeStepId]: d})) : setDeliverables(d)} 
        />;
      case 'Revision':
        return <RevisionWorkspace 
          cards={activeStepId ? (stepFlashCards[activeStepId] || []) : flashCards} 
          onUpdate={c => activeStepId ? setStepFlashCards(prev => ({...prev, [activeStepId]: c})) : setFlashCards(c)} 
          activeIdx={activeCardIdx} 
          setActiveIdx={setActiveCardIdx} 
        />;
      case 'Chapter Quiz':
        return <ChapterQuizWorkspace 
          questions={activeStepId ? (stepQuizQuestions[activeStepId] || []) : quizQuestions} 
          onUpdate={q => activeStepId ? setStepQuizQuestions(prev => ({...prev, [activeStepId]: q})) : setQuizQuestions(q)} 
        />;
      default:
        return <ReadingWorkspace 
          blocks={activeStepId ? (stepBlocks[activeStepId] || []) : editorBlocks} 
          onUpdateBlocks={b => activeStepId ? setStepBlocks(prev => ({ ...prev, [activeStepId]: b })) : setEditorBlocks(b)} 
        />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ─── Left: Resources Panel (collapsible) ─── */}
      <div className={cn("hidden lg:flex bg-white border-r border-neutral-200/80 flex-col shrink-0 z-10 transition-all duration-300 ease-in-out", leftOpen ? "w-[260px]" : "w-11")}>
        {leftOpen ? (
          <>
            <div className="px-4 pt-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[11px] text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
                  </div>
                  Resources
                </h3>
                <button onClick={() => setLeftOpen(false)} className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" title="Collapse">
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-[9px] text-neutral-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" value={resourceSearch} onChange={e => setResourceSearch(e.target.value)} placeholder="Search resources…" className="w-full pl-8 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200/70 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 focus:bg-white transition-all placeholder:text-neutral-400" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1 hide-scrollbar">
              {resources.filter(r => r.title.toLowerCase().includes(resourceSearch.toLowerCase())).map(r => (
                <div key={r.id} className="group p-2.5 bg-white border border-transparent rounded-xl flex items-center gap-2.5 hover:bg-amber-50/50 hover:border-amber-200/60 transition-all cursor-pointer">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <GripVertical className="w-3 h-3 text-neutral-300" />
                  </div>
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                    r.type === 'pdf' ? "bg-blue-100 text-blue-600" : r.type === 'video' ? "bg-purple-100 text-purple-600" : r.type === 'image' ? "bg-pink-100 text-pink-600" : r.type === 'link' ? "bg-sky-100 text-sky-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {r.type === 'pdf' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>}
                    {r.type === 'video' && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>}
                    {r.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                    {r.type === 'link' && <LinkIcon className="w-3.5 h-3.5" />}
                    {r.type === 'note' && <PenTool className="w-3.5 h-3.5" />}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <h4 className="text-[11px] font-semibold truncate leading-tight text-neutral-800">{r.title}</h4>
                    <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-neutral-300 inline-block" />
                      {r.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-neutral-100 shrink-0">
              <button onClick={() => setResources(prev => [...prev, { id: uid(), type: 'note', title: `Note ${prev.length + 1}`, source: 'Your uploads' }])} className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/70 rounded-xl text-[10px] font-semibold text-neutral-500 hover:text-neutral-700 transition-all flex items-center justify-center gap-1.5">
                <Plus className="w-3 h-3" /> Add resource
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 gap-3 h-full">
            <button onClick={() => setLeftOpen(true)} className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Open">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[8px] font-bold text-neutral-300 uppercase tracking-[0.15em] mt-2" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              Resources
            </div>
            <div className="mt-auto">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── Main Authoring Area ─── */}
      <div className={cn("bg-gradient-to-b flex flex-col overflow-y-auto show-scrollbar relative min-w-0 transition-all", previewMode ? (isFullscreen ? "fixed inset-0 z-[100] bg-white" : "flex-1 from-neutral-100/80 to-neutral-50 px-2 sm:px-4 lg:px-6 py-6 lg:py-10") : "flex-1 from-neutral-100/80 to-neutral-50 py-6 lg:py-10 px-2 sm:px-4 lg:px-6")}>

        {!previewMode && (
          <div className="absolute top-3 lg:top-5 left-3 lg:left-5 z-20 flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-neutral-200/60 shadow-sm px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all group">
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Canvas
            </button>
          </div>
        )}

        <div className={cn("w-full bg-white shadow-neutral-900/[0.04] overflow-hidden flex flex-col relative z-20 transition-all duration-300", 
          previewMode ? (isFullscreen ? "h-screen min-h-screen border-none rounded-none shadow-none mt-0 fixed inset-0 z-[9999]" : "h-[calc(100vh-7.5rem)] min-h-[560px] lg:min-h-[640px] border border-neutral-200/60 rounded-2xl mt-0 shadow-lg") : "h-[calc(100vh-7.5rem)] min-h-[560px] lg:min-h-[640px] border border-neutral-200/60 rounded-2xl mt-12 lg:mt-0 shadow-lg")}>
          
          {/* Header */}
          {!previewMode && (
            <div className="px-4 sm:px-6 lg:px-10 pt-6 lg:pt-10 pb-4 lg:pb-5 bg-gradient-to-b from-white to-neutral-50/30 shrink-0">
              <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
                <span className={cn("px-3 py-1 text-[9px] font-bold uppercase rounded-full tracking-widest border", colors.badge,
                  taskType === 'Reading' && 'border-blue-200',
                  taskType === 'Video' && 'border-purple-200',
                  taskType === 'Chapter Quiz' && 'border-amber-200',
                  taskType === 'Notes' && 'border-emerald-200',
                  taskType === 'Assignment' && 'border-red-200',
                  taskType === 'Write' && 'border-indigo-200',
                  taskType === 'Revision' && 'border-orange-200',
                  taskType === 'Practice' && 'border-teal-200',
                )}>
                  {taskType}
                </span>
                <span className="text-[10px] text-neutral-300 font-medium">•</span>
                <span className="text-[10px] text-neutral-400 font-medium">{taskMinutes} min</span>
                <span className="text-[10px] text-neutral-300 font-medium">•</span>
                <span className="text-[10px] text-neutral-400 font-medium">{taskDifficulty}</span>
                {lastSavedAt && <span className="ml-auto text-[10px] text-emerald-600 font-semibold">Saved</span>}
              </div>
              <input type="text" value={activeStepId ? (steps.find(s => s.id === activeStepId)?.name || 'Step') : taskName} onChange={e => {
                if (activeStepId) {
                  updateStepName(activeStepId, e.target.value);
                } else {
                  setTaskName(e.target.value);
                }
              }} placeholder={activeStepId ? "Step Title…" : "Task Title…"} className="w-full text-2xl sm:text-3xl font-extrabold text-neutral-900 outline-none placeholder:text-neutral-300 bg-transparent tracking-tight block" />
              <input type="text" value={activeStepId ? `Step Content (${steps.find(s => s.id === activeStepId)?.minutes || 0}m)` : taskDescription} onChange={e => {
                if (!activeStepId) setTaskDescription(e.target.value);
              }} readOnly={!!activeStepId} placeholder={activeStepId ? "" : "Add a description…"} className="w-full mt-2 text-sm text-neutral-400 outline-none bg-transparent placeholder:text-neutral-300 font-medium block" />
              {activeStepId && (
                <button onClick={() => setActiveStepId(null)} className="mt-4 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center gap-1.5 transition-colors w-fit">
                  <ChevronLeft className="w-3 h-3" /> Back to Main Intro
                </button>
              )}
            </div>
          )}

          {/* Dynamic Content Area */}
          {previewMode ? (
            <div className={cn("flex-1 flex flex-col relative min-h-0 bg-white overflow-y-auto w-full transition-[position,z-index,inset,margin,padding,border-radius,opacity] duration-300", isFullscreen ? "fixed inset-0 z-[9999] h-screen w-screen m-0 p-0 rounded-none border-none shadow-none" : "rounded-b-2xl h-full")}>
              <div className="sticky top-0 z-30 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-neutral-800">Student Preview</h2>
                    <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">
                      {previewStepIdx === -1 ? 'Task Intro' : steps[previewStepIdx]?.name || 'Step'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg transition-colors group"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <Maximize className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                  </button>
                  <button 
                    onClick={() => { setPreviewMode(false); setIsFullscreen(false); }}
                    className="px-4 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                  >
                    Exit Preview
                  </button>
                </div>
              </div>
              <div className="flex-1 p-8 sm:p-12 max-w-4xl mx-auto w-full relative pb-24">
                {renderStudentPreviewContent()}
              </div>
              <div className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-neutral-100 p-4 flex justify-between items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] shrink-0 z-30">
                <button 
                  onClick={() => setPreviewStepIdx(Math.max(-1, previewStepIdx - 1))}
                  disabled={previewStepIdx === -1}
                  className="px-6 py-2.5 bg-neutral-100 text-neutral-500 text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1.5">
                  <div className={cn("w-2 h-2 rounded-full", previewStepIdx === -1 ? "bg-amber-500" : "bg-neutral-200")} />
                  {steps.map((_, i) => <div key={i} className={cn("w-2 h-2 rounded-full", previewStepIdx === i ? "bg-amber-500" : "bg-neutral-200")} />)}
                </div>
                <button 
                  onClick={() => {
                    if (previewStepIdx < steps.length - 1) setPreviewStepIdx(previewStepIdx + 1);
                    else { alert('Task completed!'); setPreviewMode(false); setIsFullscreen(false); }
                  }}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
                >
                  {previewStepIdx === -1 ? (steps.length === 0 ? 'Finish Task' : 'Start Steps') : previewStepIdx === steps.length - 1 ? 'Finish Task' : 'Next Step'}
                </button>
              </div>
            </div>
          ) : (
            renderWorkspace()
          )}
        </div>
      </div>

      {/* ─── Right Rail (collapsible) ─── */}
      <aside className={cn("hidden lg:flex bg-white border-l border-neutral-200/80 flex-col shrink-0 z-20 h-full transition-all duration-300 ease-in-out", rightOpen ? "w-[320px]" : "w-11")}>
        {rightOpen ? (
          <>
            <div className={cn("h-1 w-full shrink-0 bg-gradient-to-r", taskType === 'Reading' ? 'from-blue-400 to-blue-600' : taskType === 'Video' ? 'from-purple-400 to-purple-600' : taskType === 'Chapter Quiz' ? 'from-amber-400 to-amber-600' : taskType === 'Notes' ? 'from-emerald-400 to-emerald-600' : taskType === 'Assignment' ? 'from-red-400 to-red-600' : taskType === 'Write' ? 'from-indigo-400 to-indigo-600' : taskType === 'Revision' ? 'from-orange-400 to-orange-600' : 'from-teal-400 to-teal-600')} />
            <div className="p-4 flex-1 overflow-y-auto show-scrollbar">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm", colors.bg)}>
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="font-bold text-xs uppercase tracking-widest text-neutral-600">{taskType} Config</h2>
                </div>
                <button className="w-6 h-6 rounded-md flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" onClick={() => setRightOpen(false)} title="Collapse">
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Task Type */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Task Type</label>
                  <select value={taskType} onChange={e => setTaskType(e.target.value as TaskType)} className="w-full p-2.5 border border-neutral-200/70 rounded-xl text-xs font-semibold bg-neutral-50/50 focus:bg-white transition-all outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/10 cursor-pointer appearance-none">
                    <option value="Reading">Reading</option>
                    <option value="Video">Video</option>
                    <option value="Practice">Practice</option>
                    <option value="Chapter Quiz">Chapter Quiz</option>
                    <option value="Notes">Notes</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Revision">Revision</option>
                    <option value="Write">Write</option>
                  </select>
                </div>

                {/* Task Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Task Name</label>
                  <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} className="w-full p-2.5 border border-neutral-200/70 rounded-xl text-xs font-semibold bg-neutral-50/50 focus:bg-white transition-all outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/10 focus:shadow-sm" />
                </div>

                {/* Mins & Difficulty */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Mins</label>
                    <input type="number" value={taskMinutes} onChange={e => setTaskMinutes(Number(e.target.value))} className="w-full p-2 border border-neutral-200/70 rounded-xl text-xs font-semibold bg-neutral-50/50 text-neutral-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Difficulty</label>
                    <select value={taskDifficulty} onChange={e => setTaskDifficulty(e.target.value as Task['difficulty'])} className="w-full p-2 border border-neutral-200/70 rounded-xl text-xs font-semibold bg-neutral-50/50 text-neutral-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-500/10 transition-all appearance-none">
                      <option>Easy</option>
                      <option>Medium</option>
                      <option>Hard</option>
                    </select>
                  </div>
                </div>

                {/* Type-specific config */}
                {taskType === 'Chapter Quiz' && (
                  <div className="pt-4 border-t border-neutral-100 space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Passing %</label>
                      <select value={passingPercent} onChange={e => setPassingPercent(e.target.value)} className="w-full p-2 border border-neutral-200/70 rounded-xl text-xs font-semibold bg-neutral-50/50 text-neutral-900 outline-none">
                        <option>50%</option><option>60%</option><option>70%</option><option>80%</option><option>90%</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-amber-50/80 rounded-xl border border-amber-200/50">
                      <span className="text-[11px] font-semibold text-amber-700">Questions</span>
                      <span className="text-base font-black text-amber-600">{activeStepId ? (stepQuizQuestions[activeStepId] || []).length : quizQuestions.length}</span>
                    </div>
                  </div>
                )}

                {taskType === 'Video' && (
                  <div className="pt-4 border-t border-neutral-100">
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Video URL</label>
                    <input 
                      type="url" 
                      value={activeStepId ? (stepVideoUrls[activeStepId] || '') : videoUrl} 
                      onChange={e => activeStepId ? setStepVideoUrls(prev => ({...prev, [activeStepId]: e.target.value})) : setVideoUrl(e.target.value)} 
                      placeholder="https://youtube.com/watch?v=…" 
                      className="w-full p-2 border border-neutral-200/70 rounded-xl text-xs font-medium bg-neutral-50/50 text-neutral-900 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-500/10 transition-all" 
                    />
                  </div>
                )}

                {taskType === 'Write' && (
                  <div className="pt-4 border-t border-neutral-100">
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Word Limit</label>
                    <input type="number" value={wordLimit} onChange={e => setWordLimit(Number(e.target.value))} className="w-full p-2 border border-neutral-200/70 rounded-xl text-xs font-medium bg-neutral-50/50 text-neutral-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 transition-all" />
                  </div>
                )}

                {taskType === 'Practice' && (
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex justify-between items-center p-3 bg-teal-50/80 rounded-xl border border-teal-200/50">
                      <span className="text-[11px] font-semibold text-teal-700">Problems</span>
                      <span className="text-base font-black text-teal-600">{activeStepId ? (stepProblems[activeStepId] || []).length : problems.length}</span>
                    </div>
                  </div>
                )}

                {taskType === 'Revision' && (
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex justify-between items-center p-3 bg-orange-50/80 rounded-xl border border-orange-200/50">
                      <span className="text-[11px] font-semibold text-orange-700">Cards</span>
                      <span className="text-base font-black text-orange-600">{flashCards.length}</span>
                    </div>
                  </div>
                )}

                {taskType === 'Assignment' && (
                  <div className="pt-4 border-t border-neutral-100">
                    <div className="flex justify-between items-center p-3 bg-red-50/80 rounded-xl border border-red-200/50">
                      <span className="text-[11px] font-semibold text-red-700">Deliverables</span>
                      <span className="text-base font-black text-red-600">{deliverables.length}</span>
                    </div>
                  </div>
                )}

                {/* Task Steps */}
                <div className="pt-4 border-t border-neutral-100 flex-1 min-h-0 flex flex-col">
                  <button onClick={() => setStepsExpanded(!stepsExpanded)} className="w-full flex items-center justify-between mb-3 group shrink-0">
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                      <List className="w-3.5 h-3.5" />Task Steps <span className="text-neutral-300 font-medium normal-case">({steps.length})</span>
                    </span>
                    <ChevronRight className={cn("w-3 h-3 text-neutral-400 transition-transform duration-200", stepsExpanded && "rotate-90")} />
                  </button>
                  {stepsExpanded && (
                    <div className="flex-1 overflow-y-auto show-scrollbar space-y-1.5 -mx-2 px-2 pb-4">
                      <DragDropContext onDragEnd={onDragEndSteps}>
                        <Droppable droppableId="task-steps">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1.5 min-h-[50px]">
                              {steps.map((step, idx) => (
                                <Draggable key={step.id} draggableId={step.id} index={idx}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={cn(
                                        "group flex items-center gap-2 p-2 border rounded-xl transition-all relative cursor-pointer",
                                        snapshot.isDragging ? "bg-white shadow-xl opacity-95 border-amber-200 z-50" : "bg-neutral-50/50 border-transparent hover:bg-white hover:border-neutral-200/70 hover:shadow-sm",
                                        activeStepId === step.id && !snapshot.isDragging && "bg-amber-50/50 border-amber-200/60 shadow-sm"
                                      )}
                                      onClick={() => {
                                        if (editingStepId !== step.id) {
                                          setActiveStepId(activeStepId === step.id ? null : step.id);
                                        }
                                      }}
                                    >
                                      <div
                                        {...provided.dragHandleProps}
                                        className="text-neutral-300 hover:text-neutral-500 p-0.5 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        onClick={e => e.stopPropagation()}
                                      >
                                        <GripVertical className="w-3 h-3" />
                                      </div>
                                      <span className={cn("text-[9px] font-bold w-4 text-center shrink-0 rounded-full py-0.5", activeStepId === step.id ? "bg-amber-500 text-white" : "text-neutral-400 bg-neutral-200/50")}>{idx + 1}</span>
                                      
                                      {editingStepId === step.id ? (
                                        <input 
                                          type="text" 
                                          value={step.name} 
                                          onChange={e => updateStepName(step.id, e.target.value)} 
                                          onBlur={() => setEditingStepId(null)}
                                          onKeyDown={e => e.key === 'Enter' && setEditingStepId(null)}
                                          autoFocus
                                          onClick={e => e.stopPropagation()}
                                          className={cn("text-[11px] font-medium flex-1 outline-none min-w-0 bg-transparent", activeStepId === step.id ? "text-amber-900" : "text-neutral-700")} 
                                        />
                                      ) : (
                                        <span className={cn("flex-1 text-[11px] font-medium truncate select-none", activeStepId === step.id ? "text-amber-900" : "text-neutral-700")}>
                                          {step.name}
                                        </span>
                                      )}
                                      
                                      <button 
                                        onClick={(e) => { 
                                          e.stopPropagation(); 
                                          setEditingStepId(step.id);
                                        }} 
                                        className={cn("text-neutral-300 hover:text-amber-600 transition-all shrink-0 p-1", editingStepId === step.id ? "hidden" : "opacity-0 group-hover:opacity-100")}
                                      >
                                        <PenTool className="w-3 h-3" />
                                      </button>

                                      <button onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }} className="text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-1"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                      <button onClick={addStep} className="w-full py-2 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/50 rounded-xl text-[10px] font-semibold text-neutral-400 hover:text-neutral-600 transition-all flex items-center justify-center gap-1 mt-2 mb-4">
                        <Plus className="w-3 h-3" /> Add Step
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Copilot Actions */}
                <div className="p-3.5 bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl border border-violet-200/40 mt-1">
                  <h4 className="text-[10px] font-bold text-violet-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    AI Copilot
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button className="p-2 bg-white/80 backdrop-blur-sm border border-violet-200/40 rounded-xl text-[9px] font-semibold text-violet-700 hover:bg-violet-100/60 hover:border-violet-300/60 transition-all">Rewrite</button>
                    <button className="p-2 bg-white/80 backdrop-blur-sm border border-violet-200/40 rounded-xl text-[9px] font-semibold text-violet-700 hover:bg-violet-100/60 hover:border-violet-300/60 transition-all">Difficulty</button>
                    <button className="p-2 bg-white/80 backdrop-blur-sm border border-violet-200/40 rounded-xl text-[9px] font-semibold text-violet-700 hover:bg-violet-100/60 hover:border-violet-300/60 transition-all">Translate</button>
                    <button className="p-2 bg-white/80 backdrop-blur-sm border border-violet-200/40 rounded-xl text-[9px] font-semibold text-violet-700 hover:bg-violet-100/60 hover:border-violet-300/60 transition-all">Generate</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-100 shrink-0">
              <button 
                onClick={() => { setPreviewMode(true); setPreviewStepIdx(-1); setIsFullscreen(false); }}
                className="w-full py-3 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl text-[11px] font-bold tracking-widest uppercase shadow-lg shadow-neutral-900/20 hover:shadow-xl hover:shadow-neutral-900/30 hover:from-neutral-800 hover:to-neutral-700 transition-all active:scale-[0.98]">
                Preview as Student
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-4 gap-3 h-full">
            <button onClick={() => setRightOpen(true)} className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm", colors.bg)} title="Open">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="text-[8px] font-bold text-neutral-300 uppercase tracking-[0.15em] mt-2" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              {taskType} Config
            </div>
            <div className="mt-auto">
              <div className={cn("w-5 h-5 rounded-md flex items-center justify-center text-white shadow-sm", colors.bg)}>
                <Settings className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile editor controls */}
      <div className="lg:hidden absolute left-3 right-3 bottom-3 z-40 rounded-xl bg-white/95 backdrop-blur border border-neutral-200 shadow-lg p-2 flex items-center justify-between">
        <button onClick={() => setMobilePanel('resources')} className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Library className="w-4 h-4" /> Resources
        </button>
        <button className="mx-2 py-2 px-3 rounded-lg bg-neutral-900 text-white text-[10px] font-bold tracking-wide">
          Preview
        </button>
        <button onClick={() => setMobilePanel('config')} className="flex items-center justify-center gap-1.5 flex-1 py-2 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition-colors">
          <SlidersHorizontal className="w-4 h-4" /> Config
        </button>
      </div>

      {mobilePanel !== 'none' && (
        <div className="lg:hidden absolute inset-0 z-50 bg-neutral-900/35 backdrop-blur-[1px]" onClick={() => setMobilePanel('none')} />
      )}

      {mobilePanel === 'resources' && (
        <div className="lg:hidden absolute inset-x-0 bottom-0 top-20 z-50 bg-white rounded-t-2xl border-t border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-700">Resources</h3>
            <button onClick={() => setMobilePanel('none')} className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-100"><X className="w-4 h-4" /></button>
          </div>
          <div className="p-3 border-b border-neutral-100">
            <input type="text" value={resourceSearch} onChange={e => setResourceSearch(e.target.value)} placeholder="Search resources…" className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg outline-none focus:border-amber-400" />
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {resources.filter(r => r.title.toLowerCase().includes(resourceSearch.toLowerCase())).map(r => (
              <div key={`mobile-${r.id}`} className="p-3 border border-neutral-200 rounded-xl bg-white">
                <h4 className="text-sm font-semibold text-neutral-800 truncate">{r.title}</h4>
                <p className="text-xs text-neutral-400 mt-1">{r.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {mobilePanel === 'config' && (
        <div className="lg:hidden absolute inset-x-0 bottom-0 top-20 z-50 bg-white rounded-t-2xl border-t border-neutral-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-neutral-700">Task Config</h3>
            <button onClick={() => setMobilePanel('none')} className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-400 hover:bg-neutral-100"><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Task Name</label>
              <input type="text" value={taskName} onChange={e => setTaskName(e.target.value)} className="w-full p-2.5 border border-neutral-200 rounded-xl text-sm font-semibold bg-neutral-50/50 outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">Description</label>
              <input type="text" value={taskDescription} onChange={e => setTaskDescription(e.target.value)} className="w-full p-2.5 border border-neutral-200 rounded-xl text-sm font-medium bg-neutral-50/50 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <input type="number" value={taskMinutes} onChange={e => setTaskMinutes(Number(e.target.value))} className="w-full p-2.5 border border-neutral-200 rounded-xl text-sm font-semibold bg-neutral-50/50 outline-none" />
              <select value={taskDifficulty} onChange={e => setTaskDifficulty(e.target.value as Task['difficulty'])} className="w-full p-2.5 border border-neutral-200 rounded-xl text-sm font-semibold bg-neutral-50/50 outline-none">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <button onClick={addStep} className="w-full py-2.5 border border-dashed border-neutral-300 rounded-xl text-xs font-semibold text-neutral-500">
              Add Step
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
