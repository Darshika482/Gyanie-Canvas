import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

function App() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <Hero />
                <section id="features">
                    <Features />
                </section>
                <section id="how-it-works">
                    <HowItWorks />
                </section>
                <Testimonials />
                <section id="pricing">
                    <Pricing />
                </section>
                <section id="faq">
                    <FAQ />
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default App; 