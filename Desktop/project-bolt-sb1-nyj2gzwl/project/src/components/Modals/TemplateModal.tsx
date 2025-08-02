import React from 'react';
import { X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ 
  isOpen, 
  onClose, 
  currentTemplateId 
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
    onClose();
  };

  if (!isOpen) return null;

  // Group templates by category for the modal display
  const templatesByCategory = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Select a template</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categoryTemplates.map((template) => (
                  <div key={template.id} className="relative group">
                    <button
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`w-full p-3 border-2 rounded-lg transition-all hover:border-teal-300 hover:shadow-md ${
                        currentTemplateId === template.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-gray-100 rounded mb-3 overflow-hidden">
                        <img
                          src={template.thumbnail}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {template.name}
                      </h4>
                      <p className="text-xs text-gray-500">{template.description}</p>
                      {template.isPremium && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
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

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Document size: 
              <button className="ml-2 px-3 py-1 bg-gray-200 rounded text-gray-700 text-xs">
                A4
              </button>
              <button className="ml-2 px-3 py-1 bg-teal-500 text-white rounded text-xs">
                US Letter
              </button>
            </div>
            <button
              onClick={onClose}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              Continue Editing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;