import React from 'react';
import { 
  PlusCircle, 
  Move, 
  Palette, 
  Wand2, 
  CheckCircle, 
  Download, 
  Share2, 
  Clock, 
  Tag,
  LayoutTemplate
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  improveScore?: number;
  onDownload?: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
  color?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  improveScore = 9,
  onDownload
}) => {
  const sidebarItems: SidebarItem[] = [
    { id: 'add-section', label: 'Add section', icon: PlusCircle },
    { id: 'rearrange', label: 'Rearrange', icon: Move },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate, color: 'text-purple-600' },
    { id: 'design-font', label: 'Design & Font', icon: Palette },
    { id: 'improve', label: 'Improve', icon: Wand2, badge: improveScore, color: 'text-red-500' },
    { id: 'checker', label: 'Checker', icon: CheckCircle },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'share', label: 'Share', icon: Share2 },
    { id: 'history', label: 'History', icon: Clock, color: 'text-orange-500' },
    { id: 'branding', label: 'Branding', icon: Tag, color: 'text-orange-500' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Back button */}
      <div className="p-4 border-b border-gray-200">
        <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Sidebar items */}
      <div className="flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          // Handle download action
          if (item.id === 'download') {
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onDownload) {
                    onDownload();
                  }
                }}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 mr-3 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {item.label}
                </span>
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                isActive ? 'bg-gray-50 border-r-2 border-teal-500' : ''
              }`}
            >
              <Icon 
                className={`w-5 h-5 mr-3 ${
                  item.color || (isActive ? 'text-teal-600' : 'text-gray-500')
                }`} 
              />
              <span className={`text-sm font-medium ${
                isActive ? 'text-teal-900' : 'text-gray-700'
              }`}>
                {item.label}
              </span>
              {item.badge && (
                <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  item.color?.includes('red') 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Branding toggle */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Tag className="w-5 h-5 mr-3 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Branding</span>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              defaultChecked
              className="sr-only"
            />
            <div className="w-10 h-6 bg-teal-500 rounded-full shadow-inner"></div>
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform translate-x-4 transition-transform"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;