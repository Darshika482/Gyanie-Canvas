import React from 'react';
import { X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

interface TemplatePanelProps {
  currentTemplateId: string;
  onClose: () => void;
}

const TemplatePanel: React.FC<TemplatePanelProps> = ({
  currentTemplateId,
  onClose
}) => {
  const { templates, updateResume, currentResume } = useResumeStore();

  const handleTemplateSelect = (templateId: string) => {
    if (currentResume) {
      updateResume(currentResume.id, {
        templateId,
        content: {
          ...currentResume.content,
          design: {
            ...currentResume.content.design,
            templateId,
          },
        },
      });
    }
  };

  // Group templates by category
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  // Debug: Log all templates and categories
  console.log('All templates:', templates.length, templates.map(t => `${t.name} (${t.category})`));
  console.log('Templates by category:', Object.keys(templatesByCategory).map(cat => `${cat}: ${templatesByCategory[cat].length} templates`));

  return (
    <div className="w-80 h-screen flex flex-col bg-white border-l border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Templates</h3>
            <p className="text-xs text-gray-500">{templates.length} available</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">


        {/* Show all templates in a single grid without categories for better visibility */}
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-700 mb-2">All Templates ({templates.length})</h4>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <div key={template.id} className="relative">
                <button
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`w-full p-1 border rounded transition-all hover:border-teal-300 hover:shadow-sm ${currentTemplateId === template.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200'
                    }`}
                >
                  <div className="aspect-[1/1] bg-gray-100 rounded mb-1 overflow-hidden">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h5 className="font-medium text-gray-900 text-xs">
                    {template.name}
                  </h5>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {template.description}
                  </p>
                  {template.isPremium && (
                    <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                      PRO
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Original categorized view (hidden for now) */}
        <div className="hidden">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-8">
              <h4 className="text-sm font-medium text-gray-700 mb-4">{category} ({categoryTemplates.length})</h4>
              <div className="grid grid-cols-2 gap-4">
                {categoryTemplates.map((template) => (
                  <div key={template.id} className="relative">
                    <button
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`w-full p-2 border-2 rounded-lg transition-all hover:border-teal-300 hover:shadow-sm ${currentTemplateId === template.id
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200'
                        }`}
                    >
                      <div className="aspect-[3/4] bg-gray-100 rounded mb-2 overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h5 className="font-medium text-gray-900 text-xs mb-1">
                        {template.name}
                      </h5>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.description}
                      </p>
                      {template.isPremium && (
                        <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded">
                          PRO
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-500 mb-2">Document size:</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-200 rounded text-gray-700 text-xs">
            A4
          </button>
          <button className="px-3 py-1 bg-teal-500 text-white rounded text-xs">
            US Letter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePanel;