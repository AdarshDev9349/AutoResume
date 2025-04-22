import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [inp, setInp] = useState("");
  const navigate = useNavigate();

  const handleclick = () => {
    if (inp.trim() !== "") {
      navigate(`/resume/${inp}`);
    }
  };

  return (
    <div className="font-sans p-8 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">GitHub Resume Generator</h1>
        <p className="text-gray-700 mb-2">Enter your GitHub username:</p>
        <input
          type="text"
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          placeholder="e.g., torvalds"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleclick}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition duration-200"
        >
          Generate Resume
        </button>
      </div>
    </div>
  );
}

export default Home;
