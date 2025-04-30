"use client";
import fetchGitHubData from "../../datafetch/data.server";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

import { generateBioFromGitHubData } from "../../datafetch/bio.server";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";

function ResumePage() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [notfound, setNotfound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState({
    phone: "",
    bio: "",
    education: [],
    educationInput: { degree: "", institution: "", year: "" },
    workExperience: [], // now an array
    workExperienceInput: { title: "", company: "", duration: "", description: "" },
    projects: [],
    projectInput: { name: "", description: "", url: "" },
    skills: [],
    skillInput: "",
    achievements: [],
    achievementInput: "",
  });


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectAvailable, setIsProjectAvailable] = useState(false);
  const resumeRef = useRef(null);

  const generatebio = async () => {
    const githubdata = await fetchGitHubData(username);
  
    if (!githubdata) {
      console.error("Failed to fetch GitHub data.");
      return;
    }
  
    console.log("✅ GitHub Data:", githubdata);
  
    const aiGeneratedBio = await generateBioFromGitHubData(githubdata);
  
    console.log("✅ AI Generated Bio:", aiGeneratedBio);
  
    if (aiGeneratedBio) {
      // ✨ Update the 'bio' field inside additionalInfo
      handleInputChange({
        target: {
          name: 'bio',
          value: aiGeneratedBio,
        },
      });
    }
  };
  
  


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
      <div className={`${isSidebarOpen ? "w-10/11 md:w-1/3" : "w-20"} md:relative absolute z-14 bg-gradient-to-r from-[#0f0c29]  via-[#302b63] to-[#24243e] transition-all duration-300 shadow-lg flex flex-col`}>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={` bg-blue-600 text-white p-2 my-6 rounded-md hover:bg-blue-700 transition-all duration-300 ${isSidebarOpen ? "w-1/4 mx-4 self-end " : "w-12 absolute left-6 z-11 self-center"}`}
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
              <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
                <summary className="cursor-pointer text-gray-200 font-medium p-4">Your Bio</summary>
                <div className="p-4">
                  <textarea
                    name="bio"
                    value={additionalInfo.bio}
                    onChange={handleInputChange}
                    className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your work experience"
                    rows="4"
                  />
                   <button
                      type="button"
                      onClick={generatebio}
                      className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#6a11cb] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                    >
                      Generate
                    </button>
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
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={additionalInfo.workExperienceInput?.title || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      workExperienceInput: {
                        ...prev.workExperienceInput,
                        title: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={additionalInfo.workExperienceInput?.company || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      workExperienceInput: {
                        ...prev.workExperienceInput,
                        company: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Duration"
                  value={additionalInfo.workExperienceInput?.duration || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      workExperienceInput: {
                        ...prev.workExperienceInput,
                        duration: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={additionalInfo.workExperienceInput?.description || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      workExperienceInput: {
                        ...prev.workExperienceInput,
                        description: e.target.value,
                      },
                    }))
                  }
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="2"
                />
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      const input = additionalInfo.workExperienceInput || {};
                      if (input.title && input.company && input.duration) {
                        setAdditionalInfo(prev => ({
                          ...prev,
                          workExperience: [
                            ...(Array.isArray(prev.workExperience) ? prev.workExperience : []),
                            input,
                          ],
                          workExperienceInput: { title: "", company: "", duration: "", description: "" },
                        }));
                      }
                    }}
                    className="bg-gradient-to-r from-[#6a11cb] via-[#2575fc] to-[#6a11cb] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                  >
                    Add Experience
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalInfo(prev => ({
                        ...prev,
                        workExperience: (Array.isArray(prev.workExperience) ? prev.workExperience : []).slice(0, -1),
                      }))
                    }
                    className="bg-gradient-to-r from-[#ff6a00] via-[#ffcc00] to-[#ff6a00] hover:scale-105 transform transition-all text-white px-6 py-3 rounded-full text-sm focus:outline-none"
                  >
                    Remove Last
                  </button>
                </div>
              </div>
            </details>

            {/* Skills */}
            <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
              <summary className="cursor-pointer text-gray-200 font-medium p-4">Skills</summary>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Add a skill and press Enter"
                  value={additionalInfo.skillInput || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      skillInput: e.target.value,
                    }))
                  }
                  onKeyDown={e => {
                    if (e.key === "Enter" && additionalInfo.skillInput?.trim()) {
                      setAdditionalInfo(prev => ({
                        ...prev,
                        skills: [
                          ...(Array.isArray(prev.skills) ? prev.skills : prev.skills ? prev.skills.split(",") : []),
                          prev.skillInput.trim(),
                        ],
                        skillInput: "",
                      }));
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(additionalInfo.skills)
                    ? additionalInfo.skills
                    : additionalInfo.skills
                    ? additionalInfo.skills.split(",")
                    : []
                  ).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalInfo(prev => ({
                            ...prev,
                            skills: (Array.isArray(prev.skills) ? prev.skills : prev.skills.split(",")).filter(
                              (s, i) => i !== idx
                            ),
                          }))
                        }
                        className="text-white hover:text-red-500"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </details>

            {/* Achievements */}
            <details className="border border-gray-600 rounded-lg bg-[#2d2d3a]">
              <summary className="cursor-pointer text-gray-200 font-medium p-4">Achievements and Interests</summary>
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Add an achievement and press Enter"
                  value={additionalInfo.achievementInput || ""}
                  onChange={e =>
                    setAdditionalInfo(prev => ({
                      ...prev,
                      achievementInput: e.target.value,
                    }))
                  }
                  onKeyDown={e => {
                    if (e.key === "Enter" && additionalInfo.achievementInput?.trim()) {
                      setAdditionalInfo(prev => ({
                        ...prev,
                        achievements: [
                          ...(Array.isArray(prev.achievements)
                            ? prev.achievements
                            : prev.achievements
                            ? prev.achievements.split(",")
                            : []),
                          prev.achievementInput.trim(),
                        ],
                        achievementInput: "",
                      }));
                      e.preventDefault();
                    }
                  }}
                  className="w-full border border-gray-600 rounded-lg p-4 bg-[#2d2d3a] text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <ul className="mt-4 list-disc list-inside space-y-2">
                  {(Array.isArray(additionalInfo.achievements)
                    ? additionalInfo.achievements
                    : additionalInfo.achievements
                    ? additionalInfo.achievements.split(",")
                    : []
                  ).map((achievement, idx) => (
                    <li key={idx} className="text-gray-300 flex items-center gap-2">
                      {achievement}
                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalInfo(prev => ({
                            ...prev,
                            achievements: (Array.isArray(prev.achievements)
                              ? prev.achievements
                              : prev.achievements.split(",")
                            ).filter((a, i) => i !== idx),
                          }))
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            </form>
          </div>
        )}
      </div>
      <div className="relative mt-18 md:mt-0 z-10 w-full max-w-4xl mx-auto p-4 md:p-8 grid grid-cols-1  gap-8">
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
                <section className="mt-6">
                  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
                   
                  </h2>
                  <p>
                    {additionalInfo.bio ||
                      "No bio provided."}
                  </p>
                </section>

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

                <section className="mt-6">
  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
    Work Experience
  </h2>
  {Array.isArray(additionalInfo.workExperience) && additionalInfo.workExperience.length > 0 ? (
    <ul className="list-disc list-inside space-y-2">
      <AnimatePresence>
        {additionalInfo.workExperience.map((exp, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-base"
          >
            <span className="font-semibold">{exp.title}</span>
            {exp.company && <> at <span className="font-medium">{exp.company}</span></>}
            {exp.duration && <> — <span>{exp.duration}</span></>}
            {exp.description && (
              <div className="text-gray-600 text-sm mt-1">{exp.description}</div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  ) : (
    <p className="text-gray-500">No work experience provided.</p>
  )}
</section>



{/* Skills */}
<section className="mt-6">
  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
    Skills
  </h2>
  {Array.isArray(additionalInfo.skills) && additionalInfo.skills.length > 0 ? (
    <ul className="flex flex-wrap gap-2">
      {additionalInfo.skills.map((skill, idx) => (
        <li
          key={idx}
          className=" px-3 py-1 rounded-full text-m"
        >
          {skill}
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No skills provided.</p>
  )}
</section>

{/* Achievements */}
<section className="mt-6">
  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
    Achievements and Interests
  </h2>
  {Array.isArray(additionalInfo.achievements) && additionalInfo.achievements.length > 0 ? (
    <ul className="list-disc list-inside space-y-1">
      {additionalInfo.achievements.map((ach, idx) => (
        <li key={idx} className="text-gray-700">{ach}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No achievements provided.</p>
  )}
</section>


<section className="mt-6">
  <h2 className="text-2xl font-bold text-black border-b pb-2 mb-4">
    Projects
  </h2>
  {isProjectAvailable || additionalInfo.projects.length > 0 ? (
    <div className="space-y-4">
      {/* Combine GitHub projects and additional projects */}
      {[
        ...(userData.projects || []).map((repo, index) => ({
          ...repo,
          _isGithub: true,
          _index: index,
        })),
        ...additionalInfo.projects.map((repo, index) => ({
          ...repo,
          _isGithub: false,
          _index: index,
        })),
      ].map((repo, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="flex-1">
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
          {/* Show delete button for both fetched and additional projects */}
          <button
            type="button"
            className="ml-2 text-red-500 hover:text-red-700 text-lg print:hidden font-bold"
            onClick={() => {
              if (repo._isGithub) {
                // Remove from userData.projects
                setUserData(prev => ({
                  ...prev,
                  projects: prev.projects.filter((_, i) => i !== repo._index),
                }));
              } else {
                // Remove from additionalInfo.projects
                setAdditionalInfo(prev => ({
                  ...prev,
                  projects: prev.projects.filter((_, i) => i !== repo._index),
                }));
              }
            }}
            title="Remove Project"
          >
            &times;
          </button>
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
              line-height: 1.2 !important;
              color: black !important;
            }
              h2{
              
              font-size: 20px !important;
              
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
