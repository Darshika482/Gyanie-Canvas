import React from 'react';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { colorPalette } from '../../utils/helpers';

interface DesignPanelProps {
  resume: Resume;
}

const DesignPanel: React.FC<DesignPanelProps> = ({ resume }) => {
  const { updateResume } = useResumeStore();

  const updateDesign = (updates: any) => {
    updateResume(resume.id, {
      content: {
        ...resume.content,
        design: {
          ...resume.content.design,
          ...updates,
        },
      },
    });
  };

  const colors = [
    '#00bcd4', '#1b1e27', '#009688', '#ff6b35', '#4a90e2',
    '#2196f3', '#ff9800', '#9c27b0', '#00bcd4', '#ffc107'
  ];

  return (
    <div className="h-screen flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Design & Font</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Page Margins */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAGE MARGINS: {resume.content.design.margins}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">narrow</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={resume.content.design.margins}
                  onChange={(e) => updateDesign({ margins: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-500">wide</span>
            </div>
          </div>

          {/* Section Spacing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SECTION SPACING: {resume.content.design.spacing}
            </label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">compact</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={resume.content.design.spacing}
                  onChange={(e) => updateDesign({ spacing: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-teal-500 rounded-full"></div>
              </div>
              <span className="text-sm text-gray-500">more space</span>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">COLORS</label>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => updateDesign({ primaryColor: color })}
                  className={`w-10 h-10 rounded-full border-2 ${
                    resume.content.design.primaryColor === color
                      ? 'border-gray-800'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {resume.content.design.primaryColor === color && (
                    <div className="w-4 h-4 bg-white rounded-full mx-auto mt-2.5">
                      <div className="w-2 h-2 bg-gray-800 rounded-full mx-auto mt-1"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
              Use custom color
            </button>
          </div>

          {/* Font Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FONT STYLE</label>
            <div className="relative">
              <select
                value={resume.content.design.fontFamily}
                onChange={(e) => updateDesign({ fontFamily: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none appearance-none bg-white"
                style={{ fontSize: '24px', fontFamily: resume.content.design.fontFamily }}
              >
                <option value="Inter">Rubik</option>
                <option value="Georgia">Georgia</option>
                <option value="Times">Times</option>
                <option value="Helvetica">Helvetica</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">FONT SIZE: SMALL</label>
            <div className="text-sm text-gray-500">
              Adjust font size to fit more content or improve readability
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPanel;