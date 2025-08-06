import React from 'react';
import { Resume, DesignSettings } from '../../types';
import { useResumeStore } from '../../store/resumeStore';

interface DesignPanelProps {
  resume: Resume;
}

const templates = [
  { id: 'enhanced', name: 'Enhanced', description: 'Modern 2-column layout with sidebar', icon: '🎨' },
  { id: 'double-column', name: 'Double Column', description: 'Classic two-column layout', icon: '📄' },
  { id: 'single-column', name: 'Single Column', description: 'Clean single-column layout', icon: '📝' },
  { id: 'ivy-league', name: 'Ivy League', description: 'Classic academic format', icon: '🎓' },
  { id: 'modern', name: 'Modern', description: 'Contemporary design with bold typography', icon: '✨' },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated and professional', icon: '💎' },
  { id: 'multi-column', name: 'Multi Column', description: 'Multi-column layout', icon: '📊' },
  { id: 'creative', name: 'Creative', description: 'Artistic and expressive design', icon: '🎭' },
  { id: 'timeline', name: 'Timeline', description: 'Timeline-based design', icon: '📅' },
];

const fontFamilies = [
  { value: 'Inter', label: 'Inter', preview: 'Inter' },
  { value: 'Helvetica', label: 'Helvetica', preview: 'Helvetica' },
  { value: 'Arial', label: 'Arial', preview: 'Arial' },
  { value: 'Georgia', label: 'Georgia', preview: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman', preview: 'Times New Roman' },
];

const fontSizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const pageSizes = [
  { value: 'A4', label: 'A4' },
  { value: 'US Letter', label: 'US Letter' },
  { value: 'Legal', label: 'Legal' },
];

const colorThemes = [
  {
    id: 'professional',
    name: 'Professional',
    primaryColor: '#2c3e50',
    secondaryColor: '#34495e',
    description: 'Classic blue-gray theme'
  },
  {
    id: 'modern',
    name: 'Modern',
    primaryColor: '#3498db',
    secondaryColor: '#2980b9',
    description: 'Clean blue theme'
  },
  {
    id: 'creative',
    name: 'Creative',
    primaryColor: '#e74c3c',
    secondaryColor: '#c0392b',
    description: 'Bold red theme'
  },
  {
    id: 'elegant',
    name: 'Elegant',
    primaryColor: '#8e44ad',
    secondaryColor: '#7d3c98',
    description: 'Sophisticated purple'
  },
  {
    id: 'nature',
    name: 'Nature',
    primaryColor: '#27ae60',
    secondaryColor: '#229954',
    description: 'Fresh green theme'
  },
  {
    id: 'warm',
    name: 'Warm',
    primaryColor: '#f39c12',
    secondaryColor: '#e67e22',
    description: 'Cozy orange theme'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    primaryColor: '#2c3e50',
    secondaryColor: '#95a5a6',
    description: 'Clean black and gray'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    primaryColor: '#1a5276',
    secondaryColor: '#2874a6',
    description: 'Trustworthy navy blue'
  },
  // New, unique, professional color themes
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    primaryColor: '#0093E9',
    secondaryColor: '#80D0C7',
    description: 'Refreshing blue and teal for a modern look'
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    primaryColor: '#ff5858',
    secondaryColor: '#f09819',
    description: 'Vibrant red and orange for energetic resumes'
  },
  {
    id: 'forest-haze',
    name: 'Forest Haze',
    primaryColor: '#11998e',
    secondaryColor: '#38ef7d',
    description: 'Natural green tones for a calm, professional feel'
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    primaryColor: '#b76e79',
    secondaryColor: '#f7cac9',
    description: 'Elegant rose and blush for a refined touch'
  },
  {
    id: 'slate',
    name: 'Slate',
    primaryColor: '#232526',
    secondaryColor: '#414345',
    description: 'Modern dark and gray for a sleek appearance'
  }
];

const DesignPanel: React.FC<DesignPanelProps> = ({ resume }) => {
  const { updateResume } = useResumeStore();

  const updateDesignSettings = (field: keyof DesignSettings, value: any) => {
    console.log(`Updating design field: ${field} = ${value}`);
    const updatedDesign = {
      ...resume.content.design,
      [field]: value,
    };

    updateResume(resume.id, {
      content: {
        ...resume.content,
        design: updatedDesign,
      },
    });
  };

  // Auto-fix: Force the template to match what's being displayed
  React.useEffect(() => {
    // If we're seeing a gradient header, we should be using Modern template
    if (resume.content.design.templateId === 'enhanced' && resume.templateId === 'enhanced') {
      console.log('Auto-fixing template mismatch...');
      updateResume(resume.id, {
        templateId: 'modern',
        content: {
          ...resume.content,
          design: {
            ...resume.content.design,
            templateId: 'modern',
          },
        },
      });
    }
  }, [resume.content.design.templateId, resume.templateId]);

  return (
    <div className="w-80 h-screen flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Design & Layout</h3>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Template Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Template</h4>
          <div className="grid grid-cols-1 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  // Update both the resume-level templateId and the design templateId
                  updateResume(resume.id, {
                    templateId: template.id,
                    content: {
                      ...resume.content,
                      design: {
                        ...resume.content.design,
                        templateId: template.id,
                      },
                    },
                  });
                }}
                className={`p-3 text-left border rounded-lg transition-colors ${resume.templateId === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{template.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Themes */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Color Themes</h4>

          <div className="grid grid-cols-2 gap-2">
            {colorThemes.map((theme) => {
              const isSelected = resume.content.design.primaryColor === theme.primaryColor &&
                resume.content.design.secondaryColor === theme.secondaryColor;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    // Update BOTH primaryColor and secondaryColor at once
                    updateResume(resume.id, {
                      content: {
                        ...resume.content,
                        design: {
                          ...resume.content.design,
                          primaryColor: theme.primaryColor,
                          secondaryColor: theme.secondaryColor,
                        },
                      },
                    });
                  }}
                  className={`p-3 text-left border rounded-lg transition-colors ${isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex space-x-1">
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: theme.primaryColor }}
                      />
                      <div
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: theme.secondaryColor }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">{theme.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Typography</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Font Family</label>
              <select
                value={resume.content.design.fontFamily}
                onChange={(e) => updateDesignSettings('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Font Size</label>
              <select
                value={resume.content.design.fontSize}
                onChange={(e) => updateDesignSettings('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {fontSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-700 mb-3">Layout</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Page Size</label>
              <select
                value={resume.content.design.pageSize}
                onChange={(e) => updateDesignSettings('pageSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {pageSizes.map((size) => (
                  <option key={size.value} value={size.value}>
                    {size.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Spacing</label>
              <input
                type="range"
                min="1"
                max="8"
                value={resume.content.design.spacing}
                onChange={(e) => updateDesignSettings('spacing', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Value: {resume.content.design.spacing}</div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Margins</label>
              <input
                type="range"
                min="1"
                max="5"
                value={resume.content.design.margins}
                onChange={(e) => updateDesignSettings('margins', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Value: {resume.content.design.margins}</div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Preview</h4>
          <div
            className="w-full h-32 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center"
            style={{
              fontFamily: resume.content.design.fontFamily,
              fontSize: resume.content.design.fontSize === 'small' ? '12px' :
                resume.content.design.fontSize === 'large' ? '18px' : '14px',
              color: resume.content.design.primaryColor,
            }}
          >
            <div className="text-center">
              <div className="font-bold">Sample Text</div>
              <div className="text-sm opacity-75">Preview of your selected styling</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignPanel;