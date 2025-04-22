"use client"

import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import fetchGitHubData from "./datafetch/data.server"
import { motion } from "framer-motion"
import { useReactToPrint } from "react-to-print"

function ResumePage() {
  const { username } = useParams()
  const [userData, setUserData] = useState(null)
  const [notfound, setNotfound] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const resumeRef = useRef(null)

  // Fixed implementation of useReactToPrint with proper contentRef
  const handlePrint = useReactToPrint({
    // Use contentRef instead of content function
    documentTitle: `${username}-github-resume`,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        setTimeout(resolve, 500)
      })
    },
    // This is the key fix - pass the ref directly as contentRef
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
  })

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchGitHubData(username)
        if (!data || data.projects.length === 0) {
          setNotfound(true)
          setUserData(null)
        } else {
          setUserData(data)
          setNotfound(false)
        }
      } catch (error) {
        console.error("Error fetching GitHub data:", error)
        setNotfound(true)
      } finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [username])

  return (
    <div className="font-sans bg-gray-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
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
            {/* Print button - hidden in print view */}
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

            {/* Resume content - this is what gets printed */}
            <div ref={resumeRef} className="p-6 md:p-10 text-gray-800 print:shadow-none print:p-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <img
                  src={userData.avatarUrl || "/placeholder.svg"}
                  alt={`${username}'s avatar`}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border"
                  onError={(e) => {
                    e.currentTarget.src = "https://via.placeholder.com/128?text=No+Image"
                  }}
                />
                <h1 className="text-3xl font-bold">{userData.name || username}</h1>
                <p className="text-gray-600 text-sm">{userData.bio}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 grid md:grid-cols-2 gap-4"
              >
                {userData.email && <Info title="Email" value={userData.email} />}
                {userData.location && <Info title="Location" value={userData.location} />}
                {userData.company && <Info title="Company" value={userData.company} />}
                {userData.websiteUrl && (
                  <Info
                    title="Website"
                    value={
                      <a href={userData.websiteUrl} className="text-blue-600 hover:underline">
                        {userData.websiteUrl}
                      </a>
                    }
                  />
                )}
                {userData.twitterUsername && (
                  <Info
                    title="Twitter"
                    value={
                      <a
                        href={`https://twitter.com/${userData.twitterUsername}`}
                        className="text-blue-600 hover:underline"
                      >
                        @{userData.twitterUsername}
                      </a>
                    }
                  />
                )}
                <Info
                  title="GitHub"
                  value={
                    <a href={userData.profileUrl} className="text-blue-600 hover:underline">
                      {userData.profileUrl}
                    </a>
                  }
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <h2 className="text-2xl font-semibold border-b pb-2 mb-4 text-gray-700">Pinned Projects</h2>
                {userData.projects.length > 0 ? (
                  userData.projects.map((repo) => (
                    <div key={repo.name} className="mb-4 p-4 border border-gray-200 rounded-lg hover:shadow transition">
                      <h3 className="text-xl font-semibold text-gray-800">{repo.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{repo.description || "No description provided."}</p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Language:</span> {repo.primaryLanguage?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Stars:</span> ⭐ {repo.stargazerCount}
                      </p>
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                      >
                        View on GitHub
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 italic">No pinned projects found.</p>
                )}
              </motion.div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

// Info component for displaying user details
const Info = ({ title, value }) => (
  <div className="text-sm">
    <p className="font-medium text-gray-700">{title}</p>
    <p className="text-gray-600">{value}</p>
  </div>
)

export default ResumePage
