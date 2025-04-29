const SERVER_URL = 'https://api.together.xyz/v1/chat/completions'; 
const Api_key = import.meta.env.VITE_TOGETHER_API_KEY; 

async function generateBioFromGitHubData(githubData) {
  console.log('Generating bio from GitHub data:', githubData);
  if (!githubData) return null;

  const techStack = new Set();
  const projectSummaries = [];

  githubData.projects?.forEach((project) => {
    if (project.primaryLanguage?.name) {
      techStack.add(project.primaryLanguage.name);
    }
    if (project.name && project.description) {
      projectSummaries.push(`${project.name}: ${project.description}`);
    }
  });

  const skills = Array.from(techStack).slice(0, 5);

  const bodyForAI = {
    name: githubData.name || "Developer",
    company: githubData.company || "",
    location: githubData.location || "",
    website: githubData.websiteUrl || "",
    twitter: githubData.twitterUsername || "",
    skills: skills.length ? skills : ["Software Development"],
    projects: projectSummaries.length ? projectSummaries : ["Side Project: A passion project with focus on coding skills."],
    email: githubData.email || "",
    githubProfile: githubData.profileUrl || "",
  };

  const prompt = `
Write a professional and friendly bio for a developer's resume.

Name: ${bodyForAI.name}
${bodyForAI.company ? `Company: ${bodyForAI.company}` : ""}
${bodyForAI.location ? `Location: ${bodyForAI.location}` : ""}
${bodyForAI.website ? `Website: ${bodyForAI.website}` : ""}
${bodyForAI.twitter ? `Twitter: ${bodyForAI.twitter}` : ""}
Skills: ${bodyForAI.skills.join(", ")}
Projects: ${bodyForAI.projects.slice(0, 3).join("; ")}
Email: ${bodyForAI.email || "N/A"}
GitHub: ${bodyForAI.githubProfile}

Make the bio first person, ATS friendly, sound genuine, passionate about coding, mention some technologies if appropriate and dont include contact details.
It should be maximum 3-4 sentences also avoid links and usernames in the bio.
`;

  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const bio = data.choices[0].message.content.trim();
    return bio;
  } catch (error) {
    console.error('Failed to generate bio:', error);
    return null;
  }
}

export { generateBioFromGitHubData };
