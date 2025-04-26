"use client";

import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import fetchGitHubData from "./datafetch/data.server";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

function ResumePage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [notfound, setNotfound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState({
    phone: "",
    education: [],
    educationInput: { degree: "", institution: "", year: "" },
    workExperience: "",
    skills: "",
    achievements: "",
  });
  const resumeRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${username}-github-resume`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    },
    contentRef: resumeRef,
    removeAfterPrint: true,
    pageStyle: `
      @page {
        size: auto;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGitHubData(username);

        if (!data || data.projects.length === 0) {
          setNotfound(true);
          setUserData(null);
        } else {
          setUserData(data);
          setNotfound(false);
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setNotfound(true);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [username]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationInputChange = (field, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      educationInput: { ...prev.educationInput, [field]: value },
    }));
  };

  const addEducation = () => {
    const { degree, institution, year } = additionalInfo.educationInput;
    if (degree && institution && year) {
      setAdditionalInfo((prev) => ({
        ...prev,
        education: [...prev.education, prev.educationInput],
        educationInput: { degree: "", institution: "", year: "" },
      }));
    }
  };

  const removeLastEducation = () => {
    setAdditionalInfo((prev) => ({
      ...prev,
      education: prev.education.slice(0, -1),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/path-to-your-pixelated-background.png')] bg-cover opacity-10 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side: Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Add Additional Information</h2>
          <form className="space-y-6">
            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={additionalInfo.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Education
              </label>
              <div className="space-y-2 mb-4">
                <input
                  type="text"
                  placeholder="Degree"
                  value={additionalInfo.educationInput.degree}
                  onChange={(e) =>
                    handleEducationInputChange("degree", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={additionalInfo.educationInput.institution}
                  onChange={(e) =>
                    handleEducationInputChange("institution", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Year"
                  value={additionalInfo.educationInput.year}
                  onChange={(e) =>
                    handleEducationInputChange("year", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addEducation}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Add Education
                </button>
                <button
                  type="button"
                  onClick={removeLastEducation}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Remove Last
                </button>
              </div>
            </div>

            {/* Work Experience */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Work Experience
              </label>
              <textarea
                name="workExperience"
                value={additionalInfo.workExperience}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your work experience"
                rows="3"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={additionalInfo.skills}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your skills (comma-separated)"
              />
            </div>

            {/* Achievements */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Achievements and Interests
              </label>
              <textarea
                name="achievements"
                value={additionalInfo.achievements}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your achievements and interests"
                rows="3"
              />
            </div>
          </form>
        </div>

        {/* Right Side: Resume */}
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          ref={resumeRef}
        >
          {notfound ? (
            <h2 className="text-red-600 text-center p-6 text-lg font-semibold">
              User not found or no public repositories!
            </h2>
          ) : isLoading ? (
            <div className="flex justify-center items-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">Loading resume data...</p>
            </div>
          ) : userData ? (
            <>
              {/* Print Button */}
              <div className="flex justify-end p-4 print:hidden">
                <button
                  onClick={handlePrint}
                  disabled={!userData}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>

              <div className="p-6 md:p-10 text-gray-800">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-3xl font-bold">
                    {userData.name || username}
                  </h1>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    <p className="text-gray-600 text-sm">
                      {!userData.email ? "no email" : userData.email}
                      {additionalInfo.phone && ` | ${additionalInfo.phone}`}
                      {" |"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <a
                        href={userData.profileUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </p>
                    <p className="text-gray-600 text-sm">
                      <a
                        href={userData.websiteUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </p>
                  </div>
                </motion.div>

                {/* Education */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Education
                  </h2>
                  {additionalInfo.education.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      <AnimatePresence>
                        {additionalInfo.education.map((edu, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-base"
                          >
                            {edu.degree} —{" "}
                            <span className="font-medium">
                              {edu.institution}
                            </span>{" "}
                            ({edu.year})
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  ) : (
                    <p className="text-gray-500">
                      No education information provided.
                    </p>
                  )}
                </section>

                {/* Work Experience */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Work Experience
                  </h2>
                  <p>
                    {additionalInfo.workExperience ||
                      "No work experience provided."}
                  </p>
                </section>

                {/* Skills */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Skills
                  </h2>
                  <p>{additionalInfo.skills || "No skills provided."}</p>
                </section>

                {/* Achievements */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Achievements and Interests
                  </h2>
                  <p>
                    {additionalInfo.achievements || "No achievements provided."}
                  </p>
                </section>

                {/* Pinned Projects */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Projects
                  </h2>
                  {userData.projects.length > 0 ? (
                    <div className="space-y-4">
                      {userData.projects.map((repo) => (
                        <div key={repo.name}>
                          <h3 className="text-lg font-semibold">{repo.name}</h3>
                          <p className="text-sm text-gray-700 mb-1">
                            {repo.description || "No description provided."}
                          </p>
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 text-sm underline"
                          >
                            {repo.url}
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No pinned projects found.</p>
                  )}
                </section>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ResumePage;
