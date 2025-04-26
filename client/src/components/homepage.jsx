import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function GenerateResume() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    if (username.trim() !== "") {
      navigate(`/resume/${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Pixelated Background Effect */}
      <div className="absolute inset-0 bg-[url('/path-to-your-pixelated-background.png')] bg-cover opacity-10 pointer-events-none" />

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-6">
          Create Your Resume
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Enter your GitHub username below and generate your professional resume.
        </p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g., torvalds"
          className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 mb-6 transition"
        />

        <button
          onClick={handleClick}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 active:scale-95 transition-transform duration-300 text-white font-semibold py-3 rounded-xl"
        >
          + Generate Resume
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Powered by GitHub | Free Forever
        </p>
      </motion.div>

    </div>
  );
}
