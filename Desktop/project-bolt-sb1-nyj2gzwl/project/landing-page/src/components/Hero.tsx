import React from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-white">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-teal-100 to-blue-100 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '3s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-100 to-teal-100 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start mb-6">
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm text-gray-600">Trusted by 50,000+ professionals</span>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Build Your Resume.{' '}
                            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Shape Your Future.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            A smart visual editor with modern templates — build and export resumes instantly with real-time preview and professional formatting.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="group relative overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25">
                                <span className="relative z-10 flex items-center justify-center">
                                    Start for Free
                                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button className="group flex items-center justify-center px-8 py-4 border-2 border-gray-300 rounded-lg font-semibold text-lg text-gray-700 hover:border-teal-500 hover:text-teal-600 transition-all duration-300">
                                <Play className="mr-2 w-5 h-5" />
                                Watch Demo
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-500">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                No credit card required
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Free templates included
                            </div>
                        </div>
                    </div>

                    {/* Right content - Resume mockup */}
                    <div className="relative">
                        <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                                            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="h-3 bg-teal-200 rounded w-full animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                                    </div>

                                    <div className="pt-4 space-y-2">
                                        <div className="h-4 bg-teal-300 rounded w-2/3 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg rotate-12 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-ping"></div>
                        <div className="absolute top-1/2 -right-8 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero; 