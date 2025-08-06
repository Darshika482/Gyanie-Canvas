import React, { useState } from 'react';
import { ResumeSection } from '../../types';
import EditableText from './EditableText';
import EditableList from './EditableList';
import { Plus, ArrowUp, Type, Calendar, Trash2, Settings } from 'lucide-react';
import { getTextColorClass } from '../../utils/helpers';

interface SectionRendererProps {
    section: ResumeSection;
    onUpdate: (sectionId: string, updates: Partial<ResumeSection>) => void;
    className?: string;
    design?: any;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ section, onUpdate, className = '', design }) => {
    // Helper function to get dynamic text color
    const getDynamicTextColor = (isPrimary = true) => {
        if (design) {
            return getTextColorClass(design, isPrimary);
        }
        return isPrimary ? { color: '#111827' } : { color: '#6b7280' };
    };

    const renderSectionContent = () => {
        switch (section.type) {
            case 'summary':
                return (
                    <div className="resume-section">
                        <h2
                            className="resume-section-header text-lg font-bold mb-3"
                            style={design ? getTextColorClass(design, true) : { color: '#111827' }}
                        >
                            {section.title}
                        </h2>
                        <EditableText
                            value={section.content as string || ''}
                            onChange={(value) => onUpdate(section.id, { content: value })}
                            className="leading-relaxed"
                            style={design ? getTextColorClass(design, false) : { color: '#374151' }}
                            placeholder="Write a compelling summary of your professional background and key strengths..."
                            multiline
                            tag="p"
                        />
                    </div>
                );

            case 'experience':
                return (
                    <div className="resume-section">
                        <h2
                            className="resume-section-header text-lg font-bold mb-4"
                            style={design ? getTextColorClass(design, true) : { color: '#111827' }}
                        >
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((job: any, index: number) => (
                                <div key={job.id || index} className="mb-4 relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={job.position || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], position: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold"
                                                style={design ? getTextColorClass(design, true) : { color: '#111827' }}
                                                placeholder="Job Title"
                                            />
                                            <EditableText
                                                value={job.company || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], company: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="font-medium"
                                                style={design ? getTextColorClass(design, true) : { color: '#2563eb' }}
                                                placeholder="Company"
                                            />
                                        </div>
                                        <div className="text-sm" style={design ? getTextColorClass(design, false) : { color: '#6b7280' }}>
                                            <EditableText
                                                value={job.startDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], startDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Start Date"
                                            />
                                            {' - '}
                                            <EditableText
                                                value={job.current ? 'Present' : job.endDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], endDate: value, current: value === 'Present' };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="End Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={job.location || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], location: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-sm mb-2"
                                        style={design ? getTextColorClass(design, false) : { color: '#6b7280' }}
                                        placeholder="Location"
                                    />
                                    <EditableList
                                        items={job.description || []}
                                        onChange={(items) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: items };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        placeholder="Add achievement"
                                        className="text-sm"
                                        style={design ? getTextColorClass(design, false) : { color: '#374151' }}
                                    />

                                    {/* Floating Toolbar */}
                                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        <div className="bg-green-500 text-white rounded-lg shadow-lg px-3 py-2 flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    const newJob = {
                                                        id: `job-${Date.now()}`,
                                                        position: '',
                                                        company: '',
                                                        startDate: '',
                                                        endDate: '',
                                                        location: '',
                                                        description: []
                                                    };
                                                    const updatedContent = [...(section.content as any[]), newJob];
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="flex items-center space-x-1 hover:bg-green-600 rounded px-2 py-1 transition-colors"
                                                title="Add Entry"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span className="text-sm font-medium">Entry</span>
                                            </button>
                                            <div className="w-px h-4 bg-white opacity-30"></div>
                                            <button className="p-1 hover:bg-green-600 rounded transition-colors" title="Move Up">
                                                <ArrowUp className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-green-600 rounded transition-colors" title="Text Formatting">
                                                <Type className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-green-600 rounded transition-colors" title="Date">
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-green-600 rounded transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-1 hover:bg-green-600 rounded transition-colors" title="Settings">
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'education':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((edu: any, index: number) => (
                                <div key={edu.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={edu.degree || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], degree: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="font-semibold text-gray-900"
                                                placeholder="Degree"
                                            />
                                            <EditableText
                                                value={edu.field || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], field: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="font-medium"
                                                style={design ? getTextColorClass(design, true) : { color: '#059669' }}
                                                placeholder="Field of Study"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={edu.startDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], startDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Start"
                                            />
                                            {' - '}
                                            <EditableText
                                                value={edu.endDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], endDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={edu.institution || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], institution: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Institution"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'skills':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((skillGroup: any, index: number) => (
                                <div key={skillGroup.id || index} className="mb-4">
                                    <EditableText
                                        value={skillGroup.category || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], category: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="font-semibold mb-2"
                                        style={design ? getTextColorClass(design, true) : { color: '#9333ea' }}
                                        placeholder="Category"
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {(skillGroup.skills || []).map((skill: string, skillIndex: number) => (
                                            <EditableText
                                                key={skillIndex}
                                                value={skill}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = {
                                                        ...updatedContent[index],
                                                        skills: updatedContent[index].skills.map((s: string, i: number) =>
                                                            i === skillIndex ? value : s
                                                        )
                                                    };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-purple-800"
                                                placeholder="Skill"
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((project: any, index: number) => (
                                <div key={project.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={project.name || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], name: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Project Name"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={project.startDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], startDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Start"
                                            />
                                            {' - '}
                                            <EditableText
                                                value={project.endDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], endDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={project.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700 mb-2"
                                        placeholder="Project description"
                                        multiline
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {(project.technologies || []).map((tech: string, techIndex: number) => (
                                            <span key={techIndex} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'awards':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((award: any, index: number) => (
                                <div key={award.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={award.title || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], title: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Award Title"
                                            />
                                            <EditableText
                                                value={award.issuer || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], issuer: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Issuing Organization"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={award.date || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], date: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={award.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Award description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'volunteer':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((volunteer: any, index: number) => (
                                <div key={volunteer.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={volunteer.role || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], role: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Volunteer Role"
                                            />
                                            <EditableText
                                                value={volunteer.organization || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], organization: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Organization"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={volunteer.startDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], startDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Start"
                                            />
                                            {' - '}
                                            <EditableText
                                                value={volunteer.endDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], endDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={volunteer.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Volunteer description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'organizations':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((org: any, index: number) => (
                                <div key={org.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={org.name || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], name: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Organization Name"
                                            />
                                            <EditableText
                                                value={org.role || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], role: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Your Role"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={org.startDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], startDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Start"
                                            />
                                            {' - '}
                                            <EditableText
                                                value={org.endDate || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], endDate: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="End"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={org.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Organization description"
                                        multiline
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newOrg = {
                                        id: `org-${Date.now()}`,
                                        name: '',
                                        role: '',
                                        startDate: '',
                                        endDate: '',
                                        description: ''
                                    };
                                    const updatedContent = [...(section.content as any[]), newOrg];
                                    onUpdate(section.id, { content: updatedContent });
                                }}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Organization</span>
                            </button>
                        </div>
                    </div>
                );

            case 'courses':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((course: any, index: number) => (
                                <div key={course.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={course.name || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], name: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Course Name"
                                            />
                                            <EditableText
                                                value={course.institution || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], institution: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Institution"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={course.date || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], date: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={course.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Course description"
                                        multiline
                                    />
                                </div>
                            ))}
                            <button
                                onClick={() => {
                                    const newCourse = {
                                        id: `course-${Date.now()}`,
                                        name: '',
                                        institution: '',
                                        date: '',
                                        description: ''
                                    };
                                    const updatedContent = [...(section.content as any[]), newCourse];
                                    onUpdate(section.id, { content: updatedContent });
                                }}
                                className="flex items-center space-x-2 font-medium"
                                style={design ? getTextColorClass(design, true) : { color: '#2563eb' }}
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Course</span>
                            </button>
                        </div>
                    </div>
                );

            case 'certifications':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((cert: any, index: number) => (
                                <div key={cert.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={cert.name || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], name: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Certification Name"
                                            />
                                            <EditableText
                                                value={cert.issuer || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], issuer: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Issuing Organization"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={cert.date || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], date: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={cert.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Certification description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'languages':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((lang: any, index: number) => (
                                <div key={lang.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={lang.language || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], language: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Language"
                                            />
                                            <EditableText
                                                value={lang.proficiency || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], proficiency: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Proficiency Level"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'publications':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((pub: any, index: number) => (
                                <div key={pub.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={pub.title || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], title: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Publication Title"
                                            />
                                            <EditableText
                                                value={pub.publisher || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], publisher: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Publisher"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={pub.date || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], date: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={pub.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Publication description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'interests':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((interest: any, index: number) => (
                                <div key={interest.id || index} className="mb-4">
                                    <EditableText
                                        value={interest.name || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], name: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-lg font-semibold text-gray-900"
                                        placeholder="Interest"
                                    />
                                    <EditableText
                                        value={interest.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'references':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((ref: any, index: number) => (
                                <div key={ref.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={ref.name || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], name: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Reference Name"
                                            />
                                            <EditableText
                                                value={ref.title || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], title: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Title"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={ref.company || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], company: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700 mb-2"
                                        placeholder="Company"
                                    />
                                    <EditableText
                                        value={ref.email || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], email: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Email"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'custom':
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="space-y-4">
                            {(section.content as any[])?.map((item: any, index: number) => (
                                <div key={item.id || index} className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={item.title || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], title: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-lg font-semibold text-gray-900"
                                                placeholder="Title"
                                            />
                                            <EditableText
                                                value={item.subtitle || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], subtitle: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="text-blue-600 font-medium"
                                                placeholder="Subtitle"
                                            />
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <EditableText
                                                value={item.date || ''}
                                                onChange={(value) => {
                                                    const updatedContent = [...(section.content as any[])];
                                                    updatedContent[index] = { ...updatedContent[index], date: value };
                                                    onUpdate(section.id, { content: updatedContent });
                                                }}
                                                className="inline"
                                                placeholder="Date"
                                            />
                                        </div>
                                    </div>
                                    <EditableText
                                        value={item.description || ''}
                                        onChange={(value) => {
                                            const updatedContent = [...(section.content as any[])];
                                            updatedContent[index] = { ...updatedContent[index], description: value };
                                            onUpdate(section.id, { content: updatedContent });
                                        }}
                                        className="text-gray-700"
                                        placeholder="Description"
                                        multiline
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="resume-section">
                        <h2 className="resume-section-header text-lg font-bold text-gray-900 mb-4">
                            {section.title}
                        </h2>
                        <div className="text-gray-700">
                            <EditableText
                                value={section.content as string || ''}
                                onChange={(value) => onUpdate(section.id, { content: value })}
                                className="leading-relaxed"
                                placeholder={`Add your ${section.title.toLowerCase()} information here...`}
                                multiline
                                tag="p"
                            />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`mb-6 ${className}`}>
            {renderSectionContent()}
        </div>
    );
};

export default SectionRenderer; 