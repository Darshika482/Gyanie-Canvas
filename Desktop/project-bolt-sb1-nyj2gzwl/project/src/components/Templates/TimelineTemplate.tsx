import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface TimelineTemplateProps {
  resume: Resume;
}

const TimelineTemplate: React.FC<TimelineTemplateProps> = ({ resume }) => {
  const { updateResume } = useResumeStore();
  const data = sampleResumeData;

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

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <EditableText
              value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
              onChange={(value) => updatePersonalInfo('fullName', value)}
              className="text-4xl font-bold mb-2"
              style={{ color: resume.content.design.primaryColor }}
              placeholder="ISABELLE TODD"
              tag="h1"
            />
            <EditableText
              value={resume.content.personalInfo.summary || "The role you are applying for?"}
              onChange={(value) => updatePersonalInfo('summary', value)}
              className="text-lg mb-4"
              style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
              placeholder="The role you are applying for?"
              tag="p"
            />

            {/* Contact Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-700">
              <div className="flex items-center space-x-1">
                <span style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}>📞</span>
                <EditableText
                  value={resume.content.personalInfo.phone || data.personalInfo.phone}
                  onChange={(value) => updatePersonalInfo('phone', value)}
                  className="text-gray-700"
                  placeholder="+1-124-161-8172"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}>✉️</span>
                <EditableText
                  value={resume.content.personalInfo.email || data.personalInfo.email}
                  onChange={(value) => updatePersonalInfo('email', value)}
                  className="text-gray-700"
                  placeholder="anitacooks@gmail.com"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}>🔗</span>
                <EditableText
                  value={resume.content.personalInfo.website || data.personalInfo.website}
                  onChange={(value) => updatePersonalInfo('website', value)}
                  className="text-gray-700"
                  placeholder="behance.com/__NAME__"
                />
              </div>
              <div className="flex items-center space-x-1">
                <span style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}>📍</span>
                <EditableText
                  value={resume.content.personalInfo.location || data.personalInfo.location}
                  onChange={(value) => updatePersonalInfo('location', value)}
                  className="text-gray-700"
                  placeholder="New York, NYC"
                />
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center ml-8">
            <div className="w-28 h-28 bg-gray-300 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <section className="mb-12">
          <EditableText
            value="EXPERIENCE"
            onChange={(value) => { }}
            className="text-2xl font-bold mb-6"
            style={{ color: resume.content.design.primaryColor }}
            placeholder="EXPERIENCE"
            tag="h2"
          />

          <div className="relative">
            {/* Timeline Line */}
            <div
              className="absolute left-24 top-0 bottom-0 w-0.5"
              style={{ backgroundColor: resume.content.design.primaryColor }}
            ></div>

            <div className="space-y-8">
              {data.experience.map((job, index) => (
                <div key={index} className="flex">
                  {/* Date Column */}
                  <div className="w-24 flex-shrink-0 text-right pr-4">
                    <div className="font-bold text-sm" style={{ color: resume.content.design.primaryColor }}>
                      <EditableText
                        value={job.startDate}
                        onChange={(value) => { }}
                        className="block font-bold"
                        style={{ color: resume.content.design.primaryColor }}
                        placeholder="2017"
                      />
                      <span className="text-xs text-gray-500">-</span>
                      <EditableText
                        value={job.current ? 'Present' : job.endDate}
                        onChange={(value) => { }}
                        className="block font-bold"
                        style={{ color: resume.content.design.primaryColor }}
                        placeholder="Present"
                      />
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center mr-6">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: resume.content.design.primaryColor }}
                    ></div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2">
                      <EditableText
                        value={job.position}
                        onChange={(value) => { }}
                        className="text-xl font-bold mb-1"
                        style={{ color: resume.content.design.primaryColor }}
                        placeholder="UI/UX Designer"
                        tag="h3"
                      />
                      <EditableText
                        value={job.company}
                        onChange={(value) => { }}
                        className="text-lg font-semibold mb-2"
                        style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                        placeholder="Gutmann"
                        tag="p"
                      />
                      <EditableText
                        value={job.location}
                        onChange={(value) => { }}
                        className="text-sm text-gray-600 mb-3"
                        placeholder="New York, NYC"
                        tag="p"
                      />
                    </div>

                    {/* Company Description */}
                    <div
                      className="border-l-4 p-3 mb-4"
                      style={{
                        backgroundColor: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}10`,
                        borderColor: resume.content.design.secondaryColor || resume.content.design.primaryColor
                      }}
                    >
                      <EditableText
                        value="Gutmann is a company specialized in mentoring anddevelopment services in web environments, integrating Microsoft technology productsandsolutions."
                        onChange={(value) => { }}
                        className="text-sm"
                        style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                        placeholder="Company description"
                        multiline
                        tag="p"
                      />
                    </div>

                    <EditableList
                      items={job.description}
                      onChange={(items) => { }}
                      placeholder="Add achievement or responsibility"
                      className="text-sm text-gray-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-8">
          <EditableText
            value="SKILLS"
            onChange={(value) => { }}
            className="text-2xl font-bold mb-6"
            style={{ color: resume.content.design.primaryColor }}
            placeholder="SKILLS"
            tag="h2"
          />

          <div className="grid grid-cols-2 gap-6">
            {data.skills.map((skillGroup, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <EditableText
                  value={skillGroup.category}
                  onChange={(value) => { }}
                  className="font-bold mb-3"
                  style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                  placeholder="Softwares"
                  tag="h3"
                />
                <div className="space-y-1">
                  {skillGroup.skills.map((skill, i) => (
                    <div key={i} className="text-sm text-gray-700">
                      • <EditableText
                        value={skill}
                        onChange={(value) => { }}
                        className="text-gray-700 inline"
                        placeholder="Skill"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Training Section */}
        <section className="mb-8">
          <EditableText
            value="TRAINING / COURSES"
            onChange={(value) => { }}
            className="text-2xl font-bold mb-6"
            style={{ color: resume.content.design.primaryColor }}
            placeholder="TRAINING / COURSES"
            tag="h2"
          />

          <div className="grid grid-cols-2 gap-4">
            {data.training.map((course, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}10` }}
              >
                <EditableText
                  value={course.course}
                  onChange={(value) => { }}
                  className="font-bold mb-1"
                  style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                  placeholder="UI/UX Designing"
                  tag="h3"
                />
                <EditableText
                  value={course.provider}
                  onChange={(value) => { }}
                  className="text-sm mb-1"
                  style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                  placeholder="INSTA DIGITAL"
                  tag="p"
                />
                <EditableText
                  value={course.period}
                  onChange={(value) => { }}
                  className="text-xs text-gray-600"
                  placeholder="Sep 2015 to Nov 2015"
                  tag="p"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Languages */}
        <section>
          <EditableText
            value="LANGUAGES"
            onChange={(value) => { }}
            className="text-2xl font-bold mb-6"
            style={{ color: resume.content.design.primaryColor }}
            placeholder="LANGUAGES"
            tag="h2"
          />

          <div className="grid grid-cols-2 gap-4">
            {data.languages.map((lang, index) => (
              <div
                key={index}
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${resume.content.design.secondaryColor || resume.content.design.primaryColor}10` }}
              >
                <div className="flex justify-between items-center mb-2">
                  <EditableText
                    value={lang.language}
                    onChange={(value) => { }}
                    className="font-medium text-gray-900"
                    placeholder="HTML and CSS"
                  />
                  <EditableText
                    value={lang.proficiency}
                    onChange={(value) => { }}
                    className="text-sm font-medium"
                    style={{ color: resume.content.design.secondaryColor || resume.content.design.primaryColor }}
                    placeholder="Proficient"
                  />
                </div>
                <div className="flex space-x-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full ${i < lang.level ? '' : 'bg-gray-200'}`}
                      style={{
                        backgroundColor: i < lang.level ? resume.content.design.secondaryColor || resume.content.design.primaryColor : undefined
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TimelineTemplate;