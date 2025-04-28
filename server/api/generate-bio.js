import axios from "axios";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); 
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, location, website, twitter, skills, projects } = req.body;

  if (!name || !skills || !projects) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const prompt = `
Write a professional and friendly bio for a developer's resume.

Name: ${name}
${company ? `Company: ${company}` : ""}
${location ? `Location: ${location}` : ""}
${website ? `Website: ${website}` : ""}
${twitter ? `Twitter: ${twitter}` : ""}
Skills: ${skills.join(", ")}
Projects: ${projects.slice(0, 3).join("; ")}

Make the bio first person, ATS friendly, sound genuine, passionate about coding, mention some technologies if appropriate and don't include contact details.
It should be maximum 3-4 sentences, also avoid links and usernames in the bio.
`;

    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bio = response.data.choices[0].message.content.trim();
    return res.status(200).json({ bio });

  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to generate bio." });
  }
}
