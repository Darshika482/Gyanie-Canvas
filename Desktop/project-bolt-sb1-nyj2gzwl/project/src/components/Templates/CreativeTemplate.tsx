import React from 'react';
import EditableText from '../Editor/EditableText';
import EditableList from '../Editor/EditableList';
import { Resume } from '../../types';
import { useResumeStore } from '../../store/resumeStore';
import { sampleResumeData } from '../../data/defaultContent';

interface CreativeTemplateProps {
  resume: Resume;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ resume }) => {
  const { updateResume } = useResumeStore();
  const data = sampleResumeData;

  // Debug: Log that CreativeTemplate is being rendered
  console.log('CreativeTemplate - Rendered with colors:', {
    primaryColor: resume.content.design.primaryColor,
    secondaryColor: resume.content.design.secondaryColor
  });

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
    <div
      className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto"
      key={`${resume.id}-${resume.content.design.primaryColor}-${resume.content.design.secondaryColor}`}
    >
      <div>
        {/* Creative Header with Geometric Shapes */}
        <div
          className="relative p-8 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
          }}
        >
          {/* Geometric Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white bg-opacity-10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white bg-opacity-10 rounded-full translate-y-24 -translate-x-24"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white bg-opacity-10 transform rotate-45"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Profile Photo with Creative Border */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full p-2">
                  <div className="w-full h-full bg-gray-300 rounded-full"></div>
                </div>
                <div
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                  style={{ backgroundColor: resume.content.design.secondaryColor }}
                ></div>
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full"
                  style={{ backgroundColor: resume.content.design.secondaryColor }}
                ></div>
              </div>

              <div className="text-white">
                <EditableText
                  value={resume.content.personalInfo.fullName || data.personalInfo.fullName}
                  onChange={(value) => updatePersonalInfo('fullName', value)}
                  className="text-4xl font-bold mb-2 text-white"
                  placeholder="Your Name"
                  tag="h1"
                />
                <div className="bg-white bg-opacity-20 rounded-full px-4 py-2 inline-block">
                  <EditableText
                    value={resume.content.personalInfo.summary || "THE ROLE YOU ARE APPLYING FOR?"}
                    onChange={(value) => updatePersonalInfo('summary', value)}
                    className="text-white font-medium uppercase tracking-wide"
                    placeholder="Your role"
                    tag="p"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info in Creative Layout */}
          <div className="relative z-10 mt-6 grid grid-cols-4 gap-4 text-white text-sm">
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">📞</div>
              <EditableText
                value={resume.content.personalInfo.phone || data.personalInfo.phone}
                onChange={(value) => updatePersonalInfo('phone', value)}
                className="text-white text-xs"
                placeholder="Phone"
              />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">✉️</div>
              <EditableText
                value={resume.content.personalInfo.email || data.personalInfo.email}
                onChange={(value) => updatePersonalInfo('email', value)}
                className="text-white text-xs"
                placeholder="Email"
              />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">🔗</div>
              <EditableText
                value={resume.content.personalInfo.website || data.personalInfo.website}
                onChange={(value) => updatePersonalInfo('website', value)}
                className="text-white text-xs"
                placeholder="Website"
              />
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-lg mb-1">📍</div>
              <EditableText
                value={resume.content.personalInfo.location || data.personalInfo.location}
                onChange={(value) => updatePersonalInfo('location', value)}
                className="text-white text-xs"
                placeholder="Location"
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="col-span-2 space-y-8">
              {/* Experience with Creative Timeline */}
              <section>
                <div className="flex items-center mb-6">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{
                      background: `linear-gradient(135deg, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                    }}
                  >
                    <span className="text-white font-bold">💼</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">EXPERIENCE</h2>
                </div>

                <div className="relative">
                  {/* Timeline Line */}
                  <div
                    className="absolute left-6 top-0 bottom-0 w-0.5"
                    style={{
                      background: `linear-gradient(to bottom, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                    }}
                  ></div>

                  <div className="space-y-8">
                    {data.experience.map((job, index) => (
                      <div key={index} className="relative pl-16">
                        {/* Timeline Dot */}
                        <div
                          className="absolute left-4 w-4 h-4 rounded-full border-4 border-white shadow-lg"
                          style={{ backgroundColor: resume.content.design.secondaryColor }}
                        ></div>

                        <div className="bg-gray-50 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <EditableText
                                value={job.position}
                                onChange={(value) => { }}
                                className="text-xl font-bold text-gray-900"
                                placeholder="Position"
                                tag="h3"
                              />
                              <EditableText
                                value={job.company}
                                onChange={(value) => { }}
                                className="font-semibold"
                                style={{ color: resume.content.design.secondaryColor }}
                                placeholder="Company"
                                tag="p"
                              />
                            </div>
                            <div className="text-right">
                              <div
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                  backgroundColor: `${resume.content.design.secondaryColor}20`,
                                  color: resume.content.design.secondaryColor
                                }}
                              >
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
                              </div>
                              <EditableText
                                value={job.location}
                                onChange={(value) => { }}
                                className="text-sm text-gray-600 mt-1"
                                placeholder="Location"
                                tag="p"
                              />
                            </div>
                          </div>
                          <EditableList
                            items={job.description}
                            onChange={(items) => { }}
                            placeholder="Add achievement"
                            className="text-sm text-gray-700"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Skills with Progress Bars */}
              <section>
                <div className="flex items-center mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: `linear-gradient(135deg, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                    }}
                  >
                    <span className="text-white text-sm">⚡</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">SKILLS</h2>
                </div>

                <div className="space-y-4">
                  {data.skills.map((skillGroup, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4"
                      style={{
                        background: `linear-gradient(to right, ${resume.content.design.secondaryColor}10, ${resume.content.design.primaryColor}10)`
                      }}
                    >
                      <EditableText
                        value={skillGroup.category}
                        onChange={(value) => { }}
                        className="font-bold mb-3"
                        style={{ color: resume.content.design.secondaryColor }}
                        placeholder="Category"
                        tag="h3"
                      />
                      <div className="space-y-2">
                        {skillGroup.skills.map((skill, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <EditableText
                              value={skill}
                              onChange={(value) => { }}
                              className="text-sm text-gray-700 flex-1"
                              placeholder="Skill"
                            />
                            <div className="w-16 h-2 bg-gray-200 rounded-full ml-2">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: '85%',
                                  background: `linear-gradient(to right, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: `linear-gradient(135deg, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                    }}
                  >
                    <span className="text-white text-sm">🎓</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">EDUCATION</h2>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{
                    background: `linear-gradient(to right, ${resume.content.design.secondaryColor}10, ${resume.content.design.primaryColor}10)`
                  }}
                >
                  <EditableText
                    value="Bachelor of Science"
                    onChange={(value) => { }}
                    className="font-bold"
                    style={{ color: resume.content.design.secondaryColor }}
                    placeholder="Degree"
                    tag="h3"
                  />
                  <EditableText
                    value="Computer Science"
                    onChange={(value) => { }}
                    className="font-medium"
                    style={{ color: resume.content.design.secondaryColor }}
                    placeholder="Field"
                    tag="p"
                  />
                  <EditableText
                    value="University of Technology"
                    onChange={(value) => { }}
                    className="text-gray-700 text-sm"
                    placeholder="Institution"
                    tag="p"
                  />
                  <EditableText
                    value="2013 - 2017"
                    onChange={(value) => { }}
                    className="text-gray-600 text-sm"
                    placeholder="Years"
                    tag="p"
                  />
                </div>
              </section>

              {/* Languages with Creative Indicators */}
              <section>
                <div className="flex items-center mb-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{
                      background: `linear-gradient(135deg, ${resume.content.design.primaryColor} 0%, ${resume.content.design.secondaryColor} 100%)`
                    }}
                  >
                    <span className="text-white text-sm">🌍</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">LANGUAGES</h2>
                </div>

                <div className="space-y-3">
                  {data.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-3"
                      style={{
                        background: `linear-gradient(to right, ${resume.content.design.secondaryColor}10, ${resume.content.design.primaryColor}10)`
                      }}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <EditableText
                          value={lang.language}
                          onChange={(value) => { }}
                          className="font-medium text-gray-900"
                          placeholder="Language"
                        />
                        <EditableText
                          value={lang.proficiency}
                          onChange={(value) => { }}
                          className="text-sm font-medium"
                          style={{ color: resume.content.design.secondaryColor }}
                          placeholder="Level"
                        />
                      </div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: i < lang.level ? resume.content.design.primaryColor : '#e5e7eb' }}
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
    </div>
  );
};

export default CreativeTemplate;