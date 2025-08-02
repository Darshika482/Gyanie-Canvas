import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: 'Is DataSense really free to use?',
            answer: 'Yes! Our free plan includes access to 3 professional templates, basic editing tools, and PDF export. You can create and download your resume without paying anything.'
        },
        {
            question: 'Can I import my existing resume?',
            answer: 'Absolutely! You can upload your existing resume in various formats (PDF, DOC, DOCX) and our intelligent parser will extract the content for easy editing.'
        },
        {
            question: 'How many resume templates are available?',
            answer: 'We offer 3 templates in our free plan and over 50 professionally designed templates in our Pro plan, covering various industries and styles.'
        },
        {
            question: 'Can I customize the templates?',
            answer: 'Yes! All templates are fully customizable. You can change colors, fonts, layouts, sections, and formatting to match your personal style and industry requirements.'
        },
        {
            question: 'What file formats can I export to?',
            answer: 'Free users can export to PDF. Pro users get additional formats including Word (DOCX), plain text, and can create shareable online links.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Absolutely. We use industry-standard encryption to protect your data. Your personal information and resume content are never shared with third parties.'
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600">
                        Everything you need to know about DataSense
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                            >
                                <span className="font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${openIndex === index ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'py-4 max-h-96' : 'py-0 max-h-0'
                                    }`}
                            >
                                <p className="text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Still have questions?
                    </p>
                    <button className="text-teal-600 hover:text-teal-700 font-semibold">
                        Contact our support team →
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FAQ; 