import React, { useState, useEffect } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleGetStarted = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-sm shadow-lg'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900">DataSense</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">RESUMEFORGE</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-700 hover:text-teal-600 transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-gray-700 hover:text-teal-600 transition-colors">
                            How it Works
                        </a>
                        <a href="#pricing" className="text-gray-700 hover:text-teal-600 transition-colors">
                            Pricing
                        </a>
                        <a href="#faq" className="text-gray-700 hover:text-teal-600 transition-colors">
                            FAQ
                        </a>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-gray-700 hover:text-teal-600 transition-colors">
                            Sign In
                        </button>
                        <button
                            onClick={handleGetStarted}
                            className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform duration-200"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <Menu className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t shadow-lg">
                        <nav className="px-4 py-4 space-y-4">
                            <a href="#features" className="block text-gray-700 hover:text-teal-600 transition-colors">
                                Features
                            </a>
                            <a href="#how-it-works" className="block text-gray-700 hover:text-teal-600 transition-colors">
                                How it Works
                            </a>
                            <a href="#pricing" className="block text-gray-700 hover:text-teal-600 transition-colors">
                                Pricing
                            </a>
                            <a href="#faq" className="block text-gray-700 hover:text-teal-600 transition-colors">
                                FAQ
                            </a>
                            <div className="pt-4 border-t space-y-2">
                                <button className="block w-full text-left text-gray-700 hover:text-teal-600 transition-colors">
                                    Sign In
                                </button>
                                <button
                                    onClick={handleGetStarted}
                                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold"
                                >
                                    Get Started
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 