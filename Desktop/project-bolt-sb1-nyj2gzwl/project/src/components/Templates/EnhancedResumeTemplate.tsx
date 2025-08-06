import React, { useState, useRef, useEffect } from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume, ExperienceItem, EducationItem, SkillGroup, ProjectItem } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';
import { generateId } from '../../utils/helpers';

interface EnhancedResumeTemplateProps {
    resume: Resume;
    onBlockSelect?: (type: string, id: string, index?: number, event?: React.MouseEvent) => void;
    selectedBlock?: {
        type: string;
        id: string;
        index?: number;
    } | null;
}

interface FloatingToolbarProps {
    isVisible: boolean;
    position: { x: number; y: number };
    onTextFormat: () => void;
    onAddEntry: () => void;
    onDelete: () => void;
    onDrag: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    isVisible,
    position,
    onTextFormat,
    onAddEntry,
    onDelete,
    onDrag
}) => {
    if (!isVisible) return null;

    return (
        <div
            className="absolute bg-white border border-gray-200 rounded-lg shadow-xl p-2 flex items-center space-x-1 z-50"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translateY(-100%) translateX(-50%)'
            }}
        >
            {/* Text Formatting */}
            <button
                onClick={onTextFormat}
                className="p-2 hover:bg-blue-50 rounded transition-colors"
                title="Text Formatting"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </button>

            {/* Add Entry */}
            <button
                onClick={onAddEntry}
                className="p-2 hover:bg-green-50 rounded transition-colors"
                title="Add Entry"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {/* Drag Handle */}
            <button
                onClick={onDrag}
                className="p-2 hover:bg-gray-50 rounded transition-colors cursor-move"
                title="Drag to Reorder"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </button>

            {/* Delete */}
            <button
                onClick={onDelete}
                className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                title="Delete"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

const EnhancedResumeTemplate: React.FC<EnhancedResumeTemplateProps> = ({
    resume,
    onBlockSelect,
    selectedBlock
}) => {
    const { updateResume } = useResumeStore();
    const data = sampleResumeData;

    // Debug: Log that EnhancedResumeTemplate is being rendered
    console.log('EnhancedResumeTemplate - Rendered with colors:', {
        primaryColor: resume.content.design.primaryColor,
        secondaryColor: resume.content.design.secondaryColor
    });
    const [toolbarState, setToolbarState] = useState({
        isVisible: false,
        position: { x: 0, y: 0 },
        activeBlock: null as any
    });

    // Get sections from resume content
    const experience = resume.content.sections.find(section => section.type === 'experience')?.content || data.experience;
    const education = resume.content.sections.find(section => section.type === 'education')?.content || [];
    const skills = resume.content.sections.find(section => section.type === 'skills')?.content || data.skills;
    const projects = resume.content.sections.find(section => section.type === 'projects')?.content || [];
    const courses = resume.content.sections.find(section => section.type === 'courses')?.content || [];
    const languages = resume.content.sections.find(section => section.type === 'languages')?.content || data.languages;
    const volunteer = resume.content.sections.find(section => section.type === 'volunteer')?.content || [];
    const organizations = resume.content.sections.find(section => section.type === 'organizations')?.content || [];

    const updatePersonalInfo = (field: string, value: string) => {
        updateResume(resume.id, {
            content: {
                ...resume.content,
                personalInfo: {
                    ...resume.content.personalInfo,
                    [field]: value,
                },
            },
        });
    };

    const updateExperienceItem = (index: number, field: keyof ExperienceItem, value: string | string[] | boolean) => {
        const updatedExperience = [...experience];
        updatedExperience[index] = {
            ...updatedExperience[index],
            [field]: value,
        };

        updateResume(resume.id, {
            content: {
                ...resume.content,
                sections: resume.content.sections.map(section =>
                    section.type === 'experience'
                        ? { ...section, content: updatedExperience }
                        : section
                ),
            },
        });
    };

    const addExperienceItem = () => {
        const newExperienceItem: ExperienceItem = {
            id: generateId(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: [],
        };

        const updatedExperience = [...experience, newExperienceItem];

        updateResume(resume.id, {
            content: {
                ...resume.content,
                sections: resume.content.sections.map(section =>
                    section.type === 'experience'
                        ? { ...section, content: updatedExperience }
                        : section
                ),
            },
        });
    };

    const removeExperienceItem = (index: number) => {
        const updatedExperience = experience.filter((_: any, i: number) => i !== index);

        updateResume(resume.id, {
            content: {
                ...resume.content,
                sections: resume.content.sections.map(section =>
                    section.type === 'experience'
                        ? { ...section, content: updatedExperience }
                        : section
                ),
            },
        });
    };

    const handleBlockHover = (event: React.MouseEvent, blockData: any) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setToolbarState({
            isVisible: true,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.top
            },
            activeBlock: blockData
        });
    };

    const handleBlockLeave = () => {
        setToolbarState({
            isVisible: false,
            position: { x: 0, y: 0 },
            activeBlock: null
        });
    };

    const handleTextFormat = () => {
        console.log('Text format clicked for:', toolbarState.activeBlock);
    };

    const handleAddEntry = () => {
        console.log('Add entry clicked for:', toolbarState.activeBlock);
        if (toolbarState.activeBlock?.type === 'experience') {
            addExperienceItem();
        }
    };

    const handleDelete = () => {
        console.log('Delete clicked for:', toolbarState.activeBlock);
        if (toolbarState.activeBlock?.type === 'experience' && toolbarState.activeBlock?.index !== undefined) {
            removeExperienceItem(toolbarState.activeBlock.index);
        }
    };

    const handleDrag = () => {
        console.log('Drag clicked for:', toolbarState.activeBlock);
    };



    return (
        <div
            className="bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto"
            key={`${resume.id}-${resume.content.design.primaryColor}-${resume.content.design.secondaryColor}`}
        >
            <div className="flex">
                {/* LEFT SIDEBAR - Fixed Width (~30%) */}
                <div
                    className="w-1/3 text-white p-8"
                    style={{ backgroundColor: resume.content.design.primaryColor }}
                >
                    {/* Profile Image Placeholder */}
                    <div
                        className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ backgroundColor: resume.content.design.secondaryColor }}
                    >
                        <div
                            className="w-28 h-28 rounded-full"
                            style={{ backgroundColor: resume.content.design.secondaryColor }}
                        ></div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-6 text-center">
                        <EditableText
                            value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
                            onChange={(value) => updatePersonalInfo('fullName', value)}
                            className="text-2xl font-bold text-white mb-2"
                            placeholder="Your Full Name"
                            tag="h1"
                        />
                        <EditableText
                            value={resume.content.personalInfo.summary || "Role You're Applying For"}
                            onChange={(value) => updatePersonalInfo('summary', value)}
                            className="text-sm"
                            style={{ color: resume.content.design.secondaryColor }}
                            placeholder="Role You're Applying For"
                            tag="p"
                        />
                    </div>

                    {/* Contact Info */}
                    <div className="mb-8">
                        <h3
                            className="text-lg font-bold mb-4 pb-2"
                            style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor}` }}
                        >
                            CONTACT
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <EditableText
                                    value={resume.content.personalInfo.phone || data.personalInfo.phone}
                                    onChange={(value) => updatePersonalInfo('phone', value)}
                                    className="px-2 py-1 rounded hover:text-white"
                                    style={{
                                        color: `${resume.content.design.secondaryColor}80`,
                                        '--tw-hover-bg-opacity': '0.8'
                                    } as React.CSSProperties}
                                    placeholder="Phone"
                                />
                            </div>
                            <div>
                                <EditableText
                                    value={resume.content.personalInfo.email || data.personalInfo.email}
                                    onChange={(value) => updatePersonalInfo('email', value)}
                                    className="px-2 py-1 rounded hover:text-white"
                                    style={{
                                        color: `${resume.content.design.secondaryColor}80`,
                                        '--tw-hover-bg-opacity': '0.8'
                                    } as React.CSSProperties}
                                    placeholder="Email"
                                />
                            </div>
                            <div>
                                <EditableText
                                    value={resume.content.personalInfo.website || data.personalInfo.website}
                                    onChange={(value) => updatePersonalInfo('website', value)}
                                    className="px-2 py-1 rounded hover:text-white"
                                    style={{
                                        color: `${resume.content.design.secondaryColor}80`,
                                        '--tw-hover-bg-opacity': '0.8'
                                    } as React.CSSProperties}
                                    placeholder="Website"
                                />
                            </div>
                            <div>
                                <EditableText
                                    value={resume.content.personalInfo.location || data.personalInfo.location}
                                    onChange={(value) => updatePersonalInfo('location', value)}
                                    className="px-2 py-1 rounded hover:text-white"
                                    style={{
                                        color: `${resume.content.design.secondaryColor}80`,
                                        '--tw-hover-bg-opacity': '0.8'
                                    } as React.CSSProperties}
                                    placeholder="Location"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-8">
                        <h3
                            className="text-lg font-bold mb-4 pb-2"
                            style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor}` }}
                        >
                            LANGUAGES
                        </h3>
                        <div className="space-y-3">
                            {languages.map((lang, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-1">
                                        <EditableText
                                            value={lang.language}
                                            onChange={(value) => { }}
                                            className="font-medium text-white text-sm"
                                            placeholder="Language"
                                        />
                                        <EditableText
                                            value={lang.proficiency}
                                            onChange={(value) => { }}
                                            className="text-xs"
                                            style={{ color: `${resume.content.design.secondaryColor}80` }}
                                            placeholder="Level"
                                        />
                                    </div>
                                    <div className="flex space-x-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full ${i < lang.level ? 'bg-white' : ''}`}
                                                style={{
                                                    backgroundColor: i < lang.level ? 'white' : `${resume.content.design.secondaryColor}40`
                                                }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Life Philosophy */}
                    <div className="mb-8">
                        <h3
                            className="text-lg font-bold mb-4 pb-2"
                            style={{ borderBottom: `2px solid ${resume.content.design.secondaryColor}` }}
                        >
                            LIFE PHILOSOPHY
                        </h3>
                        <div className="space-y-3">
                            <EditableText
                                value="Your favorite quote"
                                onChange={(value) => { }}
                                className="text-sm italic"
                                style={{ color: `${resume.content.design.secondaryColor}80` }}
                                placeholder="Your favorite quote"
                            />
                            <EditableText
                                value="Author"
                                onChange={(value) => { }}
                                className="text-xs"
                                style={{ color: `${resume.content.design.secondaryColor}60` }}
                                placeholder="Author"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT MAIN CONTENT (~70%) */}
                <div className="flex-1 p-8 min-w-0">
                    {/* Training / Courses */}
                    {courses.length > 0 && (
                        <section className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
                                    TRAINING / COURSES
                                </h2>
                                <button
                                    onClick={addExperienceItem}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    + Add Course
                                </button>
                            </div>
                            <div className="space-y-4">
                                {courses.map((course: any, index: number) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
                                        onMouseEnter={(e) => handleBlockHover(e, { type: 'course', index })}
                                        onMouseLeave={handleBlockLeave}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <EditableText
                                                    value={course.course || "Course Name"}
                                                    onChange={(value) => { }}
                                                    className="text-lg font-semibold text-gray-900"
                                                    placeholder="Course Name"
                                                    tag="h3"
                                                />
                                                <EditableText
                                                    value={course.provider || "Provider"}
                                                    onChange={(value) => { }}
                                                    className="text-blue-600 font-medium"
                                                    placeholder="Provider"
                                                    tag="p"
                                                />
                                            </div>
                                            <div className="text-right text-sm text-gray-600 ml-4">
                                                <EditableText
                                                    value={course.period || "Period"}
                                                    onChange={(value) => { }}
                                                    className="text-sm text-gray-600"
                                                    placeholder="Period"
                                                    tag="p"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Experience */}
                    <section className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-2">
                                EXPERIENCE
                            </h2>
                            <button
                                onClick={addExperienceItem}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                + Add Experience
                            </button>
                        </div>
                        <div className="space-y-6">
                            {experience.map((job: any, index: number) => (
                                <div
                                    key={job.id || index}
                                    className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-4"
                                    onMouseEnter={(e) => handleBlockHover(e, { type: 'experience', index })}
                                    onMouseLeave={handleBlockLeave}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <EditableText
                                                value={job.position}
                                                onChange={(value) => updateExperienceItem(index, 'position', value)}
                                                className="text-xl font-semibold text-gray-900"
                                                placeholder="Job Title"
                                                tag="h3"
                                            />
                                            <EditableText
                                                value={job.company}
                                                onChange={(value) => updateExperienceItem(index, 'company', value)}
                                                className="text-lg text-blue-600 font-medium"
                                                placeholder="Company Name"
                                                tag="p"
                                            />
                                        </div>
                                        <div className="text-right text-sm text-gray-600 ml-4">
                                            <p>
                                                <EditableText
                                                    value={job.startDate}
                                                    onChange={(value) => updateExperienceItem(index, 'startDate', value)}
                                                    className="inline"
                                                    placeholder="Start"
                                                />
                                                {' - '}
                                                <EditableText
                                                    value={job.current ? 'Present' : job.endDate}
                                                    onChange={(value) => {
                                                        if (value === 'Present') {
                                                            updateExperienceItem(index, 'current', true);
                                                            updateExperienceItem(index, 'endDate', '');
                                                        } else {
                                                            updateExperienceItem(index, 'current', false);
                                                            updateExperienceItem(index, 'endDate', value);
                                                        }
                                                    }}
                                                    className="inline"
                                                    placeholder="End"
                                                />
                                            </p>
                                            <EditableText
                                                value={job.location}
                                                onChange={(value) => updateExperienceItem(index, 'location', value)}
                                                className="mt-1"
                                                placeholder="Location"
                                                tag="p"
                                            />
                                        </div>
                                    </div>
                                    <EditableList
                                        items={job.description}
                                        onChange={(items) => updateExperienceItem(index, 'description', items)}
                                        placeholder="Add achievement or responsibility"
                                        className="text-sm text-gray-700 ml-4"
                                    />
                                    <div className="mt-2">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            + Add Achievement
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    {skills.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                                SKILLS
                            </h2>
                            <div className="space-y-4">
                                {skills.map((skillGroup: any, index: number) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
                                        onMouseEnter={(e) => handleBlockHover(e, { type: 'skills', index })}
                                        onMouseLeave={handleBlockLeave}
                                    >
                                        <h3 className="font-semibold text-gray-900 mb-2">{skillGroup.category}</h3>
                                        <p className="text-sm text-gray-700">{skillGroup.skills.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                                EDUCATION
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu: any, index: number) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
                                        onMouseEnter={(e) => handleBlockHover(e, { type: 'education', index })}
                                        onMouseLeave={handleBlockLeave}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <EditableText
                                                    value={edu.degree || "Degree"}
                                                    onChange={(value) => { }}
                                                    className="text-lg font-semibold text-gray-900"
                                                    placeholder="Degree"
                                                    tag="h3"
                                                />
                                                <EditableText
                                                    value={edu.institution || "Institution"}
                                                    onChange={(value) => { }}
                                                    className="text-blue-600 font-medium"
                                                    placeholder="Institution"
                                                    tag="p"
                                                />
                                            </div>
                                            <div className="text-right text-sm text-gray-600 ml-4">
                                                <EditableText
                                                    value={`${edu.startDate} - ${edu.endDate}` || "Years"}
                                                    onChange={(value) => { }}
                                                    className="text-sm text-gray-600"
                                                    placeholder="Years"
                                                    tag="p"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Additional Sections */}
                    {volunteer.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                                VOLUNTEERING
                            </h2>
                            <div className="space-y-4">
                                {volunteer.map((vol: any, index: number) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
                                        onMouseEnter={(e) => handleBlockHover(e, { type: 'volunteer', index })}
                                        onMouseLeave={handleBlockLeave}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <EditableText
                                                    value={vol.role || "Role"}
                                                    onChange={(value) => { }}
                                                    className="text-lg font-semibold text-gray-900"
                                                    placeholder="Role"
                                                    tag="h3"
                                                />
                                                <EditableText
                                                    value={vol.organization || "Organization"}
                                                    onChange={(value) => { }}
                                                    className="text-blue-600 font-medium"
                                                    placeholder="Organization"
                                                    tag="p"
                                                />
                                            </div>
                                            <div className="text-right text-sm text-gray-600 ml-4">
                                                <EditableText
                                                    value={`${vol.startDate} - ${vol.endDate}` || "Period"}
                                                    onChange={(value) => { }}
                                                    className="text-sm text-gray-600"
                                                    placeholder="Period"
                                                    tag="p"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {organizations.length > 0 && (
                        <section className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                                ORGANIZATIONS
                            </h2>
                            <div className="space-y-4">
                                {organizations.map((org: any, index: number) => (
                                    <div
                                        key={index}
                                        className="relative group cursor-pointer transition-all hover:bg-gray-50 rounded-lg p-3"
                                        onMouseEnter={(e) => handleBlockHover(e, { type: 'organizations', index })}
                                        onMouseLeave={handleBlockLeave}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <EditableText
                                                    value={org.name || "Organization Name"}
                                                    onChange={(value) => { }}
                                                    className="text-lg font-semibold text-gray-900"
                                                    placeholder="Organization Name"
                                                    tag="h3"
                                                />
                                                <EditableText
                                                    value={org.role || "Role"}
                                                    onChange={(value) => { }}
                                                    className="text-blue-600 font-medium"
                                                    placeholder="Role"
                                                    tag="p"
                                                />
                                            </div>
                                            <div className="text-right text-sm text-gray-600 ml-4">
                                                <EditableText
                                                    value={`${org.startDate} - ${org.endDate}` || "Period"}
                                                    onChange={(value) => { }}
                                                    className="text-sm text-gray-600"
                                                    placeholder="Period"
                                                    tag="p"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Floating Toolbar */}
            <FloatingToolbar
                isVisible={toolbarState.isVisible}
                position={toolbarState.position}
                onTextFormat={handleTextFormat}
                onAddEntry={handleAddEntry}
                onDelete={handleDelete}
                onDrag={handleDrag}
            />
        </div>
    );
};

export default EnhancedResumeTemplate; 