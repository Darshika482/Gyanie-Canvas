import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard/Dashboard';
import ResumeEditor from './components/Editor/ResumeEditor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={
            <>
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
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/:id" element={<ResumeEditor />} />
          <Route path="*" element={
            <>
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
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;