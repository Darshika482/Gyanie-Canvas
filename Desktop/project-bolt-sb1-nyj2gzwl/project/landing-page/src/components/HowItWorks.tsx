import React from 'react';
import { FileText, Edit, Download } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            icon: FileText,
            title: 'Upload or Choose Template',
            description: 'Start by uploading your existing resume or selecting from our collection of professional templates.',
            image: '🎨'
        },
        {
            number: 2,
            icon: Edit,
            title: 'Edit Visually in Real Time',
            description: 'Use our intuitive editor to customize content, formatting, and design with instant preview.',
            image: '✏️'
        },
        {
            number: 3,
            icon: Download,
            title: 'Download or Share',
            description: 'Export your polished resume as PDF or share it online with a professional link.',
            image: '📤'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Create your professional resume in just three simple steps
                    </p>
                </div>

                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-200 via-teal-400 to-teal-200 transform -translate-y-1/2"></div>

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                {/* Step number circle */}
                                <div className="relative z-10 mx-auto w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="text-white font-bold text-xl">{step.number}</span>
                                </div>

                                {/* Icon */}
                                <div className="inline-flex p-4 bg-teal-50 rounded-xl mb-6 group-hover:bg-teal-100 transition-colors duration-300">
                                    <step.icon className="w-8 h-8 text-teal-600" />
                                </div>

                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    {step.title}
                                </h3>

                                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                                    {step.description}
                                </p>

                                {/* Decorative emoji */}
                                <div className="text-4xl mt-6 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                    {step.image}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks; 