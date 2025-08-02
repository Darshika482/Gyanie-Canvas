import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            content: 'ResumeForge helped me land my dream job! The templates are modern and the editing experience is incredibly smooth.',
            rating: 5,
            avatar: 'SJ',
            verified: true
        },
        {
            name: 'Michael Chen',
            role: 'Product Manager',
            company: 'StartupXYZ',
            content: 'The real-time editing feature is a game-changer. I could see exactly how my resume would look while making changes.',
            rating: 5,
            avatar: 'MC',
            verified: true
        },
        {
            name: 'Emily Rodriguez',
            role: 'Marketing Director',
            company: 'Creative Agency',
            content: 'Beautiful templates and so easy to use. I had my resume updated and exported in less than 30 minutes!',
            rating: 5,
            avatar: 'ER',
            verified: true
        }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600">
                        Join thousands of professionals who've elevated their careers
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                        <div className="text-center">
                            {/* Stars */}
                            <div className="flex justify-center mb-6">
                                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <blockquote className="text-xl lg:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                                "{testimonials[currentIndex].content}"
                            </blockquote>

                            {/* Author */}
                            <div className="flex items-center justify-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {testimonials[currentIndex].avatar}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="font-semibold text-gray-900">
                                            {testimonials[currentIndex].name}
                                        </h4>
                                        {testimonials[currentIndex].verified && (
                                            <CheckCircle className="w-4 h-4 text-teal-500" />
                                        )}
                                    </div>
                                    <p className="text-gray-600">
                                        {testimonials[currentIndex].role} at {testimonials[currentIndex].company}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 transition-colors duration-300"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-teal-50 transition-colors duration-300"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-teal-500' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials; 