// src/pages/Home.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Homepp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col gap-28 md:justify-between relative overflow-hidden">
      
      {/* Pixelated Background Effect */}
      <div className="absolute inset-0 bg-[url('/path-to-your-pixelated-background.png')] bg-cover opacity-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full flex justify-between items-center max-w-7xl mx-auto py-6 md:py-8 px-4 md:px-6 relative z-10">
        <div className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-300 to-white text-transparent bg-clip-text">
          AutoResume
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
          <a href="#tools" className="hover:text-white transition">Tools</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </div>

        {/* Right Buttons */}
        <div className="hidden md:flex gap-4 ml-4">
          <button className="border border-gray-500 rounded-full px-5 py-2 text-sm hover:border-white hover:text-white transition">
            Log In
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-125 text-white rounded-full px-5 py-2 text-sm transition">
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-20 left-0 w-full backdrop-blur-md bg-white/10 rounded-xl p-6 flex flex-col gap-4 text-gray-300 md:hidden"
            >
              <a href="#tools" className="hover:text-white transition">Tools</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#faq" className="hover:text-white transition">FAQ</a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col  items-center text-center md:mb-40 md:mt-2 mb-20 max-w-3xl mx-auto px-4 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-white bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
        >
          Launch Your Career<br className="hidden md:block" /> With A GitHub-Powered Resume.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-400 text-base md:text-lg mt-6"
        >
          Generate professional resumes directly from your GitHub — fast, elegant, and recruiter-ready.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 mt-10 w-full justify-center"
        >
          <button 
            onClick={()=> navigate('/generate-resume') }
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 active:scale-95 transition-transform duration-300 text-white rounded-full px-8 py-3 text-lg"
          >
            + Start Creating
          </button>
          <button className="border border-gray-500 hover:border-white hover:scale-105 active:scale-95 transition-transform duration-300 rounded-full px-8 py-3 text-lg">
            Log In
          </button>
        </motion.div>
      </main>
    </div>
  );
}
