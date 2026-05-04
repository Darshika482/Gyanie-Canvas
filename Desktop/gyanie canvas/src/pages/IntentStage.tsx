import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, LayoutTemplate, ArrowRight, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const TABS = [
  { id: 'describe', label: 'Describe', icon: Sparkles },
  { id: 'form', label: 'Structured form', icon: FileText },
  { id: 'template', label: 'From template', icon: LayoutTemplate },
];

const TEMPLATES = [
  { id: 't1', title: 'CBSE Class 10 Maths', modules: 14, popular: true, color: 'bg-indigo-100 text-indigo-700' },
  { id: 't2', title: 'ICSE Science', modules: 10, popular: false, color: 'bg-emerald-100 text-emerald-700' },
  { id: 't3', title: 'IIT Foundation', modules: 24, popular: false, color: 'bg-orange-100 text-orange-700' },
  { id: 't4', title: 'NEET Biology', modules: 18, popular: false, color: 'bg-rose-100 text-rose-700' },
  { id: 't5', title: 'Grade 8 English', modules: 8, popular: false, color: 'bg-blue-100 text-blue-700' },
];

export function IntentStage() {
  const [activeTab, setActiveTab] = useState('describe');
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate('/teacher/systems/new/systems/sys-123/build');
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center bg-transparent overflow-y-auto overflow-x-hidden p-6">
      <div className="w-full max-w-3xl mx-auto flex flex-col pt-10 pb-20">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            What do you want to teach?
          </h1>
          <p className="text-lg text-neutral-500 font-medium max-w-xl mx-auto">
            Design a multi-week learning system. Use AI to generate a structural blueprint, or start from a proven template.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex bg-neutral-100 p-1.5 rounded-full">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200",
                    isActive 
                      ? "bg-white text-neutral-900 shadow-sm ring-1 ring-neutral-200" 
                      : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Area */}
        <div className="relative group mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 rounded-3xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white border border-neutral-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col transition-all focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the system you want to build for your students... (e.g. 'A 4-week introductory course on Photosynthesis for Grade 7, including weekly quizzes and a final project.')"
              className="w-full min-h-[160px] resize-none p-6 text-lg bg-transparent border-none focus:outline-none focus:ring-0 text-neutral-800 placeholder:text-neutral-400 font-medium"
              style={{ paddingBottom: '80px' }}
            />
            
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <span className="text-xs font-semibold text-neutral-400 hidden sm:inline uppercase tracking-widest hidden">Press Enter ↵</span>
              <button 
                onClick={handleGenerate}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-bold shadow-sm shadow-amber-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                Generate with AI
              </button>
            </div>
          </div>
        </div>

        {/* Templates Area */}
        <div className="flex flex-col">
          <div className="flex justify-between items-end mb-4 px-2">
            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Or start from a template</h3>
            <button className="text-sm font-semibold text-emerald-600 flex items-center gap-1 hover:text-emerald-700">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-6 px-2 hide-scrollbar -mx-2">
            {TEMPLATES.map((tmpl) => (
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                key={tmpl.id}
                className="flex-shrink-0 w-64 bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-neutral-300 transition-all text-left flex flex-col group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={cn("p-2.5 rounded-xl flex items-center justify-center", tmpl.color)}>
                    <Layers className="w-6 h-6" />
                  </div>
                  {tmpl.popular && (
                    <span className="text-[10px] uppercase tracking-widest font-bold bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900 text-lg mb-1">{tmpl.title}</h4>
                  <p className="text-sm text-neutral-500 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                    {tmpl.modules} Modules layout
                  </p>
                </div>
                
                {/* Mini preview illustration inside card */}
                <div className="mt-6 flex flex-col gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-400 w-1/4"></div>
                  </div>
                  <div className="h-1.5 w-5/6 bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-400 w-1/3"></div>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-amber-400 w-1/2"></div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
