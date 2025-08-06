import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume, ExperienceItem } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';
import { generateId } from '../../utils/helpers';

interface DoubleColumnTemplateProps {
  resume: Resume;
  onBlockSelect?: (type: string, id: string, index?: number, event?: React.MouseEvent) => void;
  selectedBlock?: {
    type: string;
    id: string;
    index?: number;
  } | null;
}

const DoubleColumnTemplate: React.FC<DoubleColumnTemplateProps> = ({ resume, onBlockSelect, selectedBlock }) => {
  const { updateResume } = useResumeStore();
  const data = sampleResumeData;

  // Get sections from resume content or use sample data as fallback
  const experience = resume.content.sections.find(section => section.type === 'experience')?.content || data.experience;
  const education = resume.content.sections.find(section => section.type === 'education')?.content || [];
  const skills = resume.content.sections.find(section => section.type === 'skills')?.content || data.skills;
  const projects = resume.content.sections.find(section => section.type === 'projects')?.content || [];
  const certifications = resume.content.sections.find(section => section.type === 'certifications')?.content || [];
  const languages = resume.content.sections.find(section => section.type === 'languages')?.content || data.languages;
  const awards = resume.content.sections.find(section => section.type === 'awards')?.content || [];
  const publications = resume.content.sections.find(section => section.type === 'publications')?.content || [];
  const volunteer = resume.content.sections.find(section => section.type === 'volunteer')?.content || [];
  const interests = resume.content.sections.find(section => section.type === 'interests')?.content || [];
  const references = resume.content.sections.find(section => section.type === 'references')?.content || [];
  const courses = resume.content.sections.find(section => section.type === 'courses')?.content || [];
  const organizations = resume.content.sections.find(section => section.type === 'organizations')?.content || [];
  const patents = resume.content.sections.find(section => section.type === 'patents')?.content || [];

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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="flex">
        {/* Left Sidebar - Dark Blue */}
        <div className="w-1/3 bg-slate-800 text-white p-6">
          {/* Profile Photo */}
          <div className="w-32 h-32 bg-slate-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-28 h-28 bg-slate-500 rounded-full"></div>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">CONTACT</h3>
            <div className="space-y-3 text-sm">
              <div>
                <EditableText
                  value={resume.content.personalInfo.phone || data.personalInfo.phone}
                  onChange={(value) => updatePersonalInfo('phone', value)}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white"
                  placeholder="Phone number"
                />
              </div>
              <div>
                <EditableText
                  value={resume.content.personalInfo.email || data.personalInfo.email}
                  onChange={(value) => updatePersonalInfo('email', value)}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white"
                  placeholder="Email address"
                />
              </div>
              <div>
                <EditableText
                  value={resume.content.personalInfo.website || data.personalInfo.website}
                  onChange={(value) => updatePersonalInfo('website', value)}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white"
                  placeholder="Website"
                />
              </div>
              <div>
                <EditableText
                  value={resume.content.personalInfo.location || data.personalInfo.location}
                  onChange={(value) => updatePersonalInfo('location', value)}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white"
                  placeholder="Location"
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">SKILLS</h3>
            <div className="space-y-4">
              {skills.map((skillGroup: any, index: number) => (
                <div key={index}>
                  <EditableText
                    value={skillGroup.category}
                    onChange={(value) => { }}
                    className="font-semibold text-white mb-2 hover:bg-slate-700"
                    placeholder="Skill Category"
                    tag="h3"
                  />
                  <div className="space-y-1">
                    {skillGroup.skills.map((skill: string, i: number) => (
                      <div key={i} className="text-sm text-slate-300">
                        <EditableText
                          value={skill}
                          onChange={(value) => { }}
                          className="text-slate-300 hover:bg-slate-700 hover:text-white"
                          placeholder="Skill"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">LANGUAGES</h3>
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
                      className="text-xs text-slate-300"
                      placeholder="Level"
                    />
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < lang.level ? 'bg-white' : 'bg-slate-600'
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Life Philosophy */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">MY LIFE PHILOSOPHY</h3>
            <div className="space-y-3">
              <EditableText
                value="Your favorite quote"
                onChange={(value) => { }}
                className="text-sm text-slate-300 italic"
                placeholder="Your favorite quote"
              />
              <EditableText
                value="Author"
                onChange={(value) => { }}
                className="text-xs text-slate-400"
                placeholder="Author"
              />
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 min-w-0">
          {/* Header */}
          <div
            className={`mb-8 cursor-pointer transition-all ${selectedBlock?.type === 'header'
              ? 'ring-4 rounded-lg p-3 border-2'
              : 'hover:bg-gray-50 rounded-lg p-2'
              }`}
            style={{
              ...(selectedBlock?.type === 'header' && {
                ringColor: resume.content.design.primaryColor,
                backgroundColor: `${resume.content.design.primaryColor}20`,
                borderColor: resume.content.design.primaryColor
              })
            }}
            onClick={(e) => onBlockSelect?.('header', 'personal-info', undefined, e)}
          >
            <EditableText
              value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
              onChange={(value) => updatePersonalInfo('fullName', value)}
              className="text-4xl font-bold text-gray-900 mb-2 break-words overflow-visible"
              placeholder="Your Full Name"
              tag="h1"
            />
            <EditableText
              value={resume.content.personalInfo.summary || "Professional Title"}
              onChange={(value) => updatePersonalInfo('summary', value)}
              className="text-xl text-gray-600 mb-4 break-words overflow-visible w-full"
              placeholder="Professional title"
              tag="p"
            />
          </div>

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
                  className={`relative group cursor-pointer transition-all ${selectedBlock?.type === 'experience' && selectedBlock?.index === index
                    ? 'ring-4 rounded-lg p-3 border-2'
                    : 'hover:bg-gray-50 rounded-lg p-2'
                    }`}
                  style={{
                    ...(selectedBlock?.type === 'experience' && selectedBlock?.index === index && {
                      ringColor: resume.content.design.primaryColor,
                      backgroundColor: `${resume.content.design.primaryColor}20`,
                      borderColor: resume.content.design.primaryColor
                    })
                  }}
                  onClick={(e) => onBlockSelect?.('experience', job.id || `job-${index}`, index, e)}
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
                        className="text-lg font-medium"
                        style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
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
                    <button
                      onClick={() => removeExperienceItem(index)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-2"
                    >
                      ×
                    </button>
                  </div>
                  <EditableList
                    items={job.description}
                    onChange={(items) => updateExperienceItem(index, 'description', items)}
                    placeholder="Add achievement or responsibility"
                    className="text-sm text-gray-700 ml-4"
                  />
                </div>
              ))}
            </div>
          </section>

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
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'education' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('education', `edu-${index}`, index, e)}
                  >
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
                    <EditableText
                      value={edu.period || "Years"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Years"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                PROJECTS
              </h2>
              <div className="space-y-4">
                {projects.map((project: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'projects' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('projects', `project-${index}`, index, e)}
                  >
                    <EditableText
                      value={project.name || "Project Title"}
                      onChange={(value) => { }}
                      className="text-lg font-semibold text-gray-900"
                      placeholder="Project Title"
                      tag="h3"
                    />
                    <EditableText
                      value={project.description || "Project Description"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-700"
                      placeholder="Project Description"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

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
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'skills' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('skills', `skill-${index}`, index, e)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{skillGroup.category}</h3>
                    <p className="text-sm text-gray-700">{skillGroup.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                CERTIFICATIONS
              </h2>
              <div className="space-y-4">
                {certifications.map((cert: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'certifications' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('certifications', `cert-${index}`, index, e)}
                  >
                    <EditableText
                      value={cert.name || "Certification Name"}
                      onChange={(value) => { }}
                      className="text-lg font-semibold text-gray-900"
                      placeholder="Certification Name"
                      tag="h3"
                    />
                    <EditableText
                      value={cert.issuer || "Issuing Organization"}
                      onChange={(value) => { }}
                      className="text-blue-600 font-medium"
                      placeholder="Issuing Organization"
                      tag="p"
                    />
                    <EditableText
                      value={cert.date || "Date"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Date"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Awards */}
          {awards.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                AWARDS
              </h2>
              <div className="space-y-4">
                {awards.map((award: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'awards' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('awards', `award-${index}`, index, e)}
                  >
                    <EditableText
                      value={award.title || "Award Title"}
                      onChange={(value) => { }}
                      className="text-lg font-semibold text-gray-900"
                      placeholder="Award Title"
                      tag="h3"
                    />
                    <EditableText
                      value={award.organization || "Organization"}
                      onChange={(value) => { }}
                      className="text-blue-600 font-medium"
                      placeholder="Organization"
                      tag="p"
                    />
                    <EditableText
                      value={award.date || "Date"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Date"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteer */}
          {volunteer.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                VOLUNTEER
              </h2>
              <div className="space-y-4">
                {volunteer.map((vol: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'volunteer' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('volunteer', `vol-${index}`, index, e)}
                  >
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
                    <EditableText
                      value={`${vol.startDate} - ${vol.endDate}` || "Period"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Period"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Courses */}
          {courses.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                COURSES
              </h2>
              <div className="space-y-4">
                {courses.map((course: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'courses' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('courses', `course-${index}`, index, e)}
                  >
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
                    <EditableText
                      value={course.period || "Period"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Period"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organizations */}
          {organizations.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-gray-200 pb-2">
                ORGANIZATIONS
              </h2>
              <div className="space-y-4">
                {organizations.map((org: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer transition-all ${selectedBlock?.type === 'organizations' && selectedBlock?.index === index
                      ? 'ring-4 ring-teal-500 bg-teal-100 rounded-lg p-3 border-2 border-teal-300'
                      : 'hover:bg-gray-50 rounded-lg p-2'
                      }`}
                    onClick={(e) => onBlockSelect?.('organizations', `org-${index}`, index, e)}
                  >
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
                    <EditableText
                      value={`${org.startDate} - ${org.endDate}` || "Period"}
                      onChange={(value) => { }}
                      className="text-sm text-gray-600"
                      placeholder="Period"
                      tag="p"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubleColumnTemplate;