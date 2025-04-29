import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

export default function Homepp() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col gap-12 md:justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-cover opacity-10 pointer-events-none" />

      <nav className="flex mt-4 md:flex w-full justify-between items-center max-w-7xl mx-auto py-6 md:py-8 px-4 md:px-6 relative z-10">
        <div className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-gray-300 to-white text-transparent bg-clip-text">
          AutoResume
        </div>
        <div className="flex gap-8 text-sm font-medium text-gray-300" />
        <div className="flex gap-4 ml-4">
          <button   onClick={()=> navigate('/generate-resume') } className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-125 text-white rounded-full px-5 py-2 text-sm transition">
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex flex-col items-center text-center mb-16 mt-8 md:mb-40 md:mt-2 max-w-3xl mx-auto px-4 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight text-white bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent"
        >
          Build Your Resume<br className="hidden md:block" /> with GitHub in Seconds.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-gray-400 text-sm sm:text-base md:text-lg mt-6"
        >
          <span className="block mb-2">
            <span className="font-semibold text-white">AutoResume</span> instantly creates a professional resume using your public GitHub profile and repositories.
          </span>
          <span className="block mb-2">
            <span className="text-indigo-300 font-medium">Preview, customize, and add your own achievements, skills, and education</span> — all in a modern, beautiful template.
          </span>
          <span className="block">
            <span className="text-purple-300 font-medium">Perfect for developers, students, and tech professionals.</span>
          </span>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex flex-col items-center mt-16 sm:mt-14"
        >
          <span className="text-gray-300 text-base sm:text-lg mb-2">Scroll to explore more</span>
          <FaArrowDown className="animate-bounce text-indigo-300 sm:text-3xl text-2xl" />
        </motion.div>

        <motion.div
          id="howitworks"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-16 w-full max-w-2xl mx-auto bg-white/5 rounded-2xl shadow-lg p-6 md:p-10 border border-white/10 backdrop-blur-md"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
            How does it work?
          </h2>
          <ol className="list-decimal list-inside text-left text-gray-200 space-y-2 md:text-lg text-sm">
            <li>
              <span className="font-semibold text-white">Connect your GitHub</span> — We fetch your public profile, contributions, and pinned repositories.
            </li>
            <li>
              <span className="font-semibold text-white">Instant Resume Draft</span> — Your resume is auto-generated with your GitHub data in a modern template.
            </li>
            <li>
              <span className="font-semibold text-white">Personalize &amp; Enhance</span> — Add your education, work experience, skills, and achievements with our easy editor.
            </li>
            <li>
              <span className="font-semibold text-white">Download or Share</span> — Export as PDF or share your resume link with recruiters.
            </li>
          </ol>
          <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-center">
            <span className="inline-flex items-center gap-2 text-indigo-300 text-sm sm:text-base">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              No signup required
            </span>
            <span className="inline-flex items-center gap-2 text-purple-300 text-sm sm:text-base">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2 2 4-4" />
              </svg>
              100% Free &amp; Open Source
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
