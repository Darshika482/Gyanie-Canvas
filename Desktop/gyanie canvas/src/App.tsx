import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { IntentStage } from './pages/IntentStage';
import { BlueprintStage } from './pages/BlueprintStage';
import { AuthoringStage } from './pages/AuthoringStage';

function AppLayout() {
  const location = useLocation();
  const isIntent = location.pathname.includes('/new');

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-neutral-50">
      {/* Top Bar */}
      <header className="flex-none h-14 bg-white border-b border-neutral-200 px-4 md:px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-extrabold text-lg tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-inner">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
            </div>
            <span className="hidden sm:inline text-neutral-900">Gyanie</span>
          </Link>
          <div className="h-4 w-px bg-neutral-300 mx-2 hidden sm:block"></div>
          <nav className="flex items-center gap-2 text-sm text-neutral-500 font-medium font-sans">
            <Link to="/" className="hover:text-neutral-900 transition-colors">Systems</Link>
            <span className="text-neutral-300">›</span>
            <span className="text-neutral-900 font-semibold">{isIntent ? 'New' : 'Build Mode'}</span>
          </nav>
        </div>
        <div className="flex items-center">
          {isIntent ? (
            <Link to="/systems/sys-123/build" className="text-sm font-medium text-neutral-400 hover:text-neutral-700 transition-colors">
              Skip to manual build
            </Link>
          ) : (
            <div className="hidden lg:flex items-center gap-4 text-sm font-bold text-neutral-500 mr-4">
              <span className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full"><div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Auto-saved</span>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden relative flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/systems/new" replace />} />
          <Route path="/systems/new" element={<IntentStage />} />
          <Route path="/systems/:id/build" element={<BlueprintStage />} />
          <Route path="/systems/:id/build/tasks/:taskId" element={<AuthoringStage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
