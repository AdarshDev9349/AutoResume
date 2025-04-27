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
    projects: [],
    projectInput: { name: "", description: "", url: "" },
    skills: "",
    achievements: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectAvailable, setIsProjectAvailable] = useState(false);
  const resumeRef = useRef(null);

  const handlePrint = useReactToPrint({
    documentTitle: `${username}-github-resume`,
    onBeforeGetContent: () => new Promise((resolve) => setTimeout(resolve, 500)),
    content: () => resumeRef.current,
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
        div, section, header, footer, article, aside {
          background: white !important;
          box-shadow: none !important;
          border: none !important;
        }
        .print\\:hidden {
          display: none !important;
        }
      }
    `,
  });

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGitHubData(username);
        console.log("Fetched data:", data);

        if (!data) {
          setNotfound(true);
          setUserData(null);
          setIsProjectAvailable(false);
        } else {
          setUserData(data);
          setNotfound(false);
          setIsProjectAvailable(data.projects && data.projects.length > 0);
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
        setNotfound(true);
        setUserData(null);
        setIsProjectAvailable(false);
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

  const handleProjectInputChange = (field, value) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      projectInput: { ...prev.projectInput, [field]: value },
    }));
  };

  const addProject = () => {
    const { name, description, url } = additionalInfo.projectInput;
    if (name && description && url) {
      setAdditionalInfo((prev) => ({
        ...prev,
        projects: [...prev.projects, prev.projectInput],
        projectInput: { name: "", description: "", url: "" },
      }));
    }
  };

  const removeLastProject = () => {
    setAdditionalInfo((prev) => ({
      ...prev,
      projects: prev.projects.slice(0, -1),
    }));
  };

  const handleEducationDelete = (index) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleProjectDelete = (index) => {
    setAdditionalInfo((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "w-full md:w-1/3" : "w-20"} bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] transition-all duration-300 shadow-lg flex flex-col`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`bg-blue-600 text-white p-2 my-6 rounded-md hover:bg-blue-700 transition-all duration-300 ${isSidebarOpen ? "w-1/4 mx-4 self-end" : "w-12 self-center"}`}
        >
          {isSidebarOpen ? "<" : ">"}
        </button>
        {isSidebarOpen && (
          <div className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white mb-6">
              Add Additional Information
            </h2>
            <form className="space-y-6">
              {/* Phone */}
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Phone</summary>
                <div className="p-4">
                  <input
                    type="tel"
                    name="phone"
                    value={additionalInfo.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your phone number"
                  />
                </div>
              </details>
              
                 {/* Education */}
                 <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Education</summary>
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={additionalInfo.educationInput.degree}
                    onChange={(e) => handleEducationInputChange("degree", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={additionalInfo.educationInput.institution}
                    onChange={(e) => handleEducationInputChange("institution", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Year"
                    value={additionalInfo.educationInput.year}
                    onChange={(e) => handleEducationInputChange("year", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={addEducation}
                      className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#6a11cb] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                    >
                      Add Education
                    </button>
                    <button
                      type="button"
                      onClick={removeLastEducation}
                      className="bg-gradient-to-r from-[#ff6a00] via-[#ffcc00] to-[#ff6a00] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                    >
                      Remove Last
                    </button>
                  </div>
                </div>
              </details>

              {/* Projects */}
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Projects</summary>
                <div className="p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={additionalInfo.projectInput.name}
                    onChange={(e) => handleProjectInputChange("name", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Project Description"
                    value={additionalInfo.projectInput.description}
                    onChange={(e) => handleProjectInputChange("description", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Project URL"
                    value={additionalInfo.projectInput.url}
                    onChange={(e) => handleProjectInputChange("url", e.target.value)}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={addProject}
                      className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#6a11cb] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                    >
                      Add Project
                    </button>
                    <button
                      type="button"
                      onClick={removeLastProject}
                      className="bg-gradient-to-r from-[#ff6a00] via-[#ffcc00] to-[#ff6a00] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                    >
                      Remove Last
                    </button>
                  </div>
                </div>
              </details>

              {/* Work Experience */}
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Work Experience</summary>
                <div className="p-4">
                  <textarea
                    name="workExperience"
                    value={additionalInfo.workExperience}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your work experience"
                    rows="4"
                  />
                </div>
              </details>

              {/* Skills */}
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Skills</summary>
                <div className="p-4">
                  <input
                    type="text"
                    name="skills"
                    value={additionalInfo.skills}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your skills (comma-separated)"
                  />
                </div>
              </details>

              {/* Achievements */}
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Achievements and Interests</summary>
                <div className="p-4">
                  <textarea
                    name="achievements"
                    value={additionalInfo.achievements}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your achievements and interests"
                    rows="4"
                  />
                </div>
              </details>
            </form>
          </div>
        )}
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto p-4 md:p-8 grid grid-cols-1  gap-8">
        <div className="bg-white  shadow-2xl overflow-hidden" ref={resumeRef}>
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
                {/* Pinned Projects */}
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                    Projects
                  </h2>
                  {isProjectAvailable || additionalInfo.projects.length > 0 ? (
                    <div className="space-y-4">
                      {/* Combine GitHub projects and additional projects */}
                      {[
                        ...(userData.projects || []),
                        ...additionalInfo.projects,
                      ].map((repo, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold">{repo.name}</h3>
                          <p className="text-sm text-gray-700 mb-1">
                            {repo.description || "No description provided."}
                          </p>
                          {repo.url && (
                            <a
                              href={repo.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 text-sm underline"
                            >
                              {repo.url}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No projects found.</p>
                  )}
                </section>
              </div>
            </>
          ) : null}
        </div>
        <style jsx global>{`
          @media print {
            body {
              background: white !important;
              font-family: "Inter", "Helvetica", "Arial", sans-serif !important;
              font-size: 11pt !important;
              line-height: 1.4 !important;
              color: black !important;
            }

            @page {
              size: auto;
              margin: 10mm;
            }

            .no-print {
              display: none !important;
            }

            .print-footer {
              display: block !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ResumePage;
