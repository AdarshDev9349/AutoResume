
const SERVER_URL = 'http://localhost:3000'; 

async function generateBioFromGitHubData(githubData) {
  console.log('Generating bio from GitHub data:', githubData);
  if (!githubData) return null;


  const techStack = new Set();
  const projectSummaries = [];

  githubData.projects.forEach((project) => {
    if (project.primaryLanguage && project.primaryLanguage.name) {
      techStack.add(project.primaryLanguage.name);
    }
    if (project.name && project.description) {
      projectSummaries.push(`${project.name}: ${project.description}`);
    }
  });

  const skills = Array.from(techStack).slice(0, 5); // take max 5 skills

  const bodyForAI = {
    name: githubData.name,
    company: githubData.company,
    location: githubData.location,
    website: githubData.websiteUrl,
    twitter: githubData.twitterUsername,
    skills: skills,
    projects: projectSummaries,
    email: githubData.email,
    githubProfile: githubData.profileUrl,
  };

  try {
    const response = await fetch(`${SERVER_URL}/generate-bio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyForAI),
    });

    const data = await response.json();
    return data.bio; // Assuming your backend sends { bio: "..." }
  } catch (error) {
    console.error('Failed to generate bio:', error);
    return null;
  }
}

export { generateBioFromGitHubData };