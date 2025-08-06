import React, { useState } from 'react';
import { Resume, ResumeSection, SectionType } from '../../types';
import { generateId } from '../../utils/helpers';

interface AddSectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    resume: Resume;
    onAddSection: (newSection: ResumeSection) => void;
}

const sectionTypes: { type: SectionType; label: string; description: string; icon: string }[] = [
    { type: 'experience', label: 'Experience', description: 'Work history and professional experience', icon: '💼' },
    { type: 'education', label: 'Education', description: 'Academic background and qualifications', icon: '🎓' },
    { type: 'skills', label: 'Skills', description: 'Technical and soft skills', icon: '⚡' },
    { type: 'projects', label: 'Projects', description: 'Portfolio of work and achievements', icon: '🚀' },
    { type: 'certifications', label: 'Certifications', description: 'Professional certifications and licenses', icon: '🏆' },
    { type: 'languages', label: 'Languages', description: 'Language proficiencies', icon: '🌍' },
    { type: 'awards', label: 'Awards', description: 'Recognition and achievements', icon: '🏅' },
    { type: 'publications', label: 'Publications', description: 'Research papers and publications', icon: '📚' },
    { type: 'volunteer', label: 'Volunteer', description: 'Community service and volunteer work', icon: '🤝' },
    { type: 'interests', label: 'Interests', description: 'Personal interests and hobbies', icon: '🎯' },
    { type: 'references', label: 'References', description: 'Professional references', icon: '👥' },
    { type: 'courses', label: 'Courses', description: 'Relevant coursework and training', icon: '📖' },
    { type: 'organizations', label: 'Organizations', description: 'Professional memberships and affiliations', icon: '🏢' },
    { type: 'patents', label: 'Patents', description: 'Intellectual property and patents', icon: '🔬' },
    { type: 'custom', label: 'Custom', description: 'Custom section for specific needs', icon: '✨' },
];

const AddSectionModal: React.FC<AddSectionModalProps> = ({ isOpen, onClose, resume, onAddSection }) => {
    const [selectedType, setSelectedType] = useState<SectionType | null>(null);
    const [customTitle, setCustomTitle] = useState('');

    if (!isOpen) return null;

    const handleAddSection = () => {
        if (!selectedType) return;

        const newSection: ResumeSection = {
            id: generateId(),
            type: selectedType,
            title: selectedType === 'custom' ? customTitle : sectionTypes.find(s => s.type === selectedType)?.label || '',
            visible: true,
            order: resume.content.sections.length + 1,
            content: [],
        };

        // Call the callback to add the section to the resume
        onAddSection(newSection);

        // Close the modal and reset state
        onClose();
        setSelectedType(null);
        setCustomTitle('');
    };

    const handleClose = () => {
        setSelectedType(null);
        setCustomTitle('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Section</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6">
                        Choose a section type to add to your resume. You can customize the title and content later.
                    </p>

                    {/* Section Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {sectionTypes.map((section) => (
                            <button
                                key={section.type}
                                onClick={() => setSelectedType(section.type)}
                                className={`p-4 rounded-lg border-2 text-left transition-all hover:shadow-md ${selectedType === section.type
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{section.icon}</span>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{section.label}</h3>
                                        <p className="text-sm text-gray-600">{section.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Custom Title Input */}
                    {selectedType === 'custom' && (
                        <div className="mb-6">
                            <label htmlFor="customTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                Section Title
                            </label>
                            <input
                                type="text"
                                id="customTitle"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder="Enter section title..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddSection}
                            disabled={!selectedType || (selectedType === 'custom' && !customTitle.trim())}
                            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add Section
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSectionModal; 