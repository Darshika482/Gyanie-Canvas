import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    const [isAnnual, setIsAnnual] = useState(false);

    const handleGetStarted = () => {
        navigate('/dashboard');
    };

    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for getting started',
            features: [
                '3 resume templates',
                'Basic editing tools',
                'PDF export',
                'Email support'
            ],
            popular: false,
            buttonText: 'Get Started Free',
            buttonStyle: 'border-2 border-gray-300 text-gray-700 hover:border-teal-500 hover:text-teal-600'
        },
        {
            name: 'Pro',
            price: { monthly: 9.99, annual: 99.99 },
            description: 'For serious professionals',
            features: [
                'Unlimited templates',
                'Advanced customization',
                'Multiple file formats',
                'Priority support',
                'Custom branding',
                'Analytics tracking'
            ],
            popular: true,
            buttonText: 'Start Pro Trial',
            buttonStyle: 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:scale-105 hover:shadow-xl hover:shadow-teal-500/25'
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Simple Pricing. Free to Get Started.
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Choose the plan that works best for you
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-gradient-to-r from-teal-500 to-cyan-600 transition-transform duration-300 ${isAnnual ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                        <span className={`font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                            Annual
                        </span>
                        {isAnnual && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                                Save 17%
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl shadow-lg p-8 ${plan.popular ? 'ring-2 ring-teal-500 transform scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="flex items-center bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        <Star className="w-4 h-4 mr-1" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <p className="text-gray-600 mb-4">{plan.description}</p>
                                <div className="mb-4">
                                    <span className="text-4xl font-bold text-gray-900">
                                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                                    </span>
                                    {plan.price.monthly > 0 && (
                                        <span className="text-gray-600 ml-1">
                                            /{isAnnual ? 'year' : 'month'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center">
                                        <Check className="w-5 h-5 text-teal-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleGetStarted}
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${plan.buttonStyle}`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        All plans include 14-day free trial. No credit card required.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Pricing; 