import React from 'react';
import { Edit3, Upload, Palette, Download } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Edit3,
            title: 'Real-Time Editing',
            description: 'See your changes instantly with live preview as you edit your resume content and formatting.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Upload,
            title: 'Upload & Import',
            description: 'Import existing resumes or start from scratch with our intelligent content parser.',
            color: 'from-green-500 to-teal-500'
        },
        {
            icon: Palette,
            title: 'Customizable Templates',
            description: 'Choose from professionally designed templates and customize colors, fonts, and layouts.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: Download,
            title: 'One-Click Export',
            description: 'Download your resume as PDF or share it online with a single click when you\'re ready.',
            color: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Why Choose DataSense?
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Everything you need to create a professional resume that stands out from the crowd
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        >
                            <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {feature.title}
                            </h3>

                            <p className="text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover glow effect */}
                            <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features; 