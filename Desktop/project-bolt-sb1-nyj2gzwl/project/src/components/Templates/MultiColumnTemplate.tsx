import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface MultiColumnTemplateProps {
  resume: Resume;
}

const MultiColumnTemplate: React.FC<MultiColumnTemplateProps> = ({ resume }) => {
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
      <div>
        {/* Header */}
        <div className="bg-gray-100 p-6 text-center">
          <EditableText
            value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
            onChange={(value) => updatePersonalInfo('fullName', value)}
            className="text-3xl font-bold text-gray-900 mb-2"
            placeholder="Your Full Name"
            tag="h1"
          />
          <EditableText
            value={resume.content.personalInfo.summary || "Professional Title"}
            onChange={(value) => updatePersonalInfo('summary', value)}
            className="text-lg text-gray-600 mb-4"
            placeholder="Professional title"
            tag="p"
          />

          {/* Contact Info */}
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
            <EditableText
              value={resume.content.personalInfo.phone || data.personalInfo.phone}
              onChange={(value) => updatePersonalInfo('phone', value)}
              className="text-gray-600"
              placeholder="Phone"
            />
            <EditableText
              value={resume.content.personalInfo.email || data.personalInfo.email}
              onChange={(value) => updatePersonalInfo('email', value)}
              className="text-gray-600"
              placeholder="Email"
            />
            <EditableText
              value={resume.content.personalInfo.location || data.personalInfo.location}
              onChange={(value) => updatePersonalInfo('location', value)}
              className="text-gray-600"
              placeholder="Location"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 p-8">
          {/* Left Column */}
          <div className="col-span-2 space-y-8">
            {/* Experience */}
            <section>
              <EditableText
                value="EXPERIENCE"
                onChange={(value) => { }}
                className="text-xl font-bold text-gray-900 mb-2"
                placeholder="Section Title"
                tag="h2"
              />
              <EditableText
                value="Professional work history and achievements"
                onChange={(value) => { }}
                className="text-sm text-gray-500 mb-4"
                placeholder="Section description"
                tag="p"
              />

              <div className="space-y-6">
                {data.experience.map((job, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <EditableText
                          value={job.position}
                          onChange={(value) => { }}
                          className="text-lg font-semibold text-gray-900"
                          placeholder="Job Title"
                          tag="h3"
                        />
                        <EditableText
                          value={job.company}
                          onChange={(value) => { }}
                          className="text-blue-600 font-medium"
                          placeholder="Company Name"
                          tag="p"
                        />
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>
                          <EditableText
                            value={job.startDate}
                            onChange={(value) => { }}
                            className="inline"
                            placeholder="Start"
                          />
                          {' - '}
                          <EditableText
                            value={job.current ? 'Present' : job.endDate}
                            onChange={(value) => { }}
                            className="inline"
                            placeholder="End"
                          />
                        </p>
                        <EditableText
                          value={job.location}
                          onChange={(value) => { }}
                          className="mt-1"
                          placeholder="Location"
                          tag="p"
                        />
                      </div>
                    </div>
                    <EditableList
                      items={job.description}
                      onChange={(items) => { }}
                      placeholder="Add achievement or responsibility"
                      className="text-sm text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <EditableText
                value="EDUCATION"
                onChange={(value) => { }}
                className="text-xl font-bold text-gray-900 mb-2"
                placeholder="Section Title"
                tag="h2"
              />
              <EditableText
                value="Academic qualifications and certifications"
                onChange={(value) => { }}
                className="text-sm text-gray-500 mb-4"
                placeholder="Section description"
                tag="p"
              />

              <div>
                <EditableText
                  value="Bachelor of Science in Computer Science"
                  onChange={(value) => { }}
                  className="text-lg font-semibold text-gray-900"
                  placeholder="Degree"
                  tag="h3"
                />
                <EditableText
                  value="University of Technology"
                  onChange={(value) => { }}
                  className="text-blue-600 font-medium"
                  placeholder="Institution"
                  tag="p"
                />
                <EditableText
                  value="2013 - 2017"
                  onChange={(value) => { }}
                  className="text-sm text-gray-600"
                  placeholder="Years"
                  tag="p"
                />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <section>
              <EditableText
                value="SKILLS"
                onChange={(value) => { }}
                className="text-lg font-bold text-gray-900 mb-2"
                placeholder="Section Title"
                tag="h2"
              />
              <EditableText
                value="Technical competencies"
                onChange={(value) => { }}
                className="text-sm text-gray-500 mb-4"
                placeholder="Section description"
                tag="p"
              />

              <div className="space-y-4">
                {data.skills.map((skillGroup, index) => (
                  <div key={index}>
                    <EditableText
                      value={skillGroup.category}
                      onChange={(value) => { }}
                      className="font-semibold text-gray-900 mb-2"
                      placeholder="Skill Category"
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

            {/* Languages */}
            <section>
              <EditableText
                value="LANGUAGES"
                onChange={(value) => { }}
                className="text-lg font-bold text-gray-900 mb-2"
                placeholder="Section Title"
                tag="h2"
              />
              <EditableText
                value="Language proficiencies"
                onChange={(value) => { }}
                className="text-sm text-gray-500 mb-4"
                placeholder="Section description"
                tag="p"
              />

              <div className="space-y-3">
                {data.languages.map((lang, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <EditableText
                        value={lang.language}
                        onChange={(value) => { }}
                        className="font-medium text-gray-900"
                        placeholder="Language"
                      />
                      <EditableText
                        value={lang.proficiency}
                        onChange={(value) => { }}
                        className="text-sm text-gray-600"
                        placeholder="Level"
                      />
                    </div>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${i < lang.level ? 'bg-blue-500' : 'bg-gray-200'
                            }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiColumnTemplate;