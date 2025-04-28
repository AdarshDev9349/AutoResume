import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import serverless from "serverless-http"; // ADD THIS

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-bio", async (req, res) => {
  const { name, company, location, website, twitter, skills, projects, email, githubProfile } = req.body;

  if (!name || !skills || !projects) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const prompt = `
Write a professional and friendly bio for a developer's resume.

Name: ${name}
${company ? `Company: ${company}` : ""}
${location ? `Location: ${location}` : ""}
${website ? `Website: ${website}` : ""}
${twitter ? `Twitter: ${twitter}` : ""}
Skills: ${skills.join(", ")}
Projects: ${projects.slice(0, 3).join("; ")}
Email: ${email || "N/A"}
GitHub: ${githubProfile}

Make the bio first person, ATS friendly, sound genuine, passionate about coding, mention some technologies if appropriate and don't include contact details.
It should be maximum 3-4 sentences. Also avoid links and usernames in the bio.
`;

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const bio = response.data.choices[0].message.content.trim();
    res.json({ bio });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate bio." });
  }
});

app.get("/", (req, res) => {
  res.send("Bio Generator Server is running!");
});

// ❌ Remove this
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// ✅ Instead, export the handler
export const handler = serverless(app);
