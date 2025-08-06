import React, { useState } from 'react';
import { ResumeSection, SectionType } from '../../types';
import { generateId } from '../../utils/helpers';

interface SectionManagerProps {
    sections: ResumeSection[];
    onAddSection: (section: ResumeSection) => void;
    onReorderSections: (sections: ResumeSection[]) => void;
    onToggleSection: (sectionId: string, visible: boolean) => void;
    onDeleteSection: (sectionId: string) => void;
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

const SectionManager: React.FC<SectionManagerProps> = ({
    sections,
    onAddSection,
    onReorderSections,
    onToggleSection,
    onDeleteSection
}) => {
    const [showAddSection, setShowAddSection] = useState(false);
    const [customTitle, setCustomTitle] = useState('');

    const handleAddSection = (type: SectionType) => {
        const newSection: ResumeSection = {
            id: generateId(),
            type,
            title: type === 'custom' ? customTitle : sectionTypes.find(s => s.type === type)?.label || '',
            visible: true,
            order: sections.length + 1,
            content: [],
        };

        onAddSection(newSection);
        setShowAddSection(false);
        setCustomTitle('');
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));

        if (dragIndex !== dropIndex) {
            const newSections = [...sections];
            const [draggedSection] = newSections.splice(dragIndex, 1);
            newSections.splice(dropIndex, 0, draggedSection);

            // Update order numbers
            newSections.forEach((section, index) => {
                section.order = index + 1;
            });

            onReorderSections(newSections);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Section Manager</h3>
                <button
                    onClick={() => setShowAddSection(!showAddSection)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    + Add Section
                </button>
            </div>

            {/* Add Section Dropdown */}
            {showAddSection && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sectionTypes.map((section) => (
                            <button
                                key={section.type}
                                onClick={() => handleAddSection(section.type)}
                                className="p-2 text-left border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{section.icon}</span>
                                    <div>
                                        <div className="font-medium text-gray-900">{section.label}</div>
                                        <div className="text-xs text-gray-600">{section.description}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {customTitle && (
                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Custom Section Title
                            </label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                placeholder="Enter section title..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Section List */}
            <div className="space-y-2">
                <h4 className="font-medium text-gray-700 mb-2">Current Sections</h4>
                <div className="max-h-96 overflow-y-auto pr-2">
                    {sections.map((section, index) => (
                        <div
                            key={section.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-move mb-2"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-400">⋮⋮</span>
                                <div>
                                    <div className="font-medium text-gray-900">{section.title}</div>
                                    <div className="text-sm text-gray-600">{section.type}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => onToggleSection(section.id, !section.visible)}
                                    className={`px-2 py-1 text-xs rounded ${section.visible
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}
                                >
                                    {section.visible ? 'Visible' : 'Hidden'}
                                </button>

                                <button
                                    onClick={() => onDeleteSection(section.id)}
                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SectionManager; 