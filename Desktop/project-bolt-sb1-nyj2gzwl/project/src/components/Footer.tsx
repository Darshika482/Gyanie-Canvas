import React from 'react';
import { FileText, Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold">DataSense</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">RESUMEFORGE</span>
                            </div>
                        </div>
                        <p className="text-gray-300 mb-6 max-w-md">
                            Build professional resumes with our intuitive visual editor. Join thousands of professionals who've elevated their careers with DataSense.
                        </p>

                        {/* Newsletter */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Stay updated</h4>
                            <div className="flex space-x-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                                <button className="px-6 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg font-semibold hover:scale-105 transition-transform duration-200">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Templates</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-300">
                            <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-teal-400 transition-colors">Blog</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex space-x-6 mb-4 md:mb-0 text-sm text-gray-400">
                        <a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-teal-400 transition-colors">Cookie Policy</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-400">Follow us:</span>
                        <div className="flex space-x-3">
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-teal-600 transition-colors">
                                <Github className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8 text-sm text-gray-400">
                    © 2025 DataSense. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer; 