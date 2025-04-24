import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Prevent caching for all responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Step 1: Redirect user to LinkedIn OpenID Connect login
app.get("/auth/linkedin", (req, res) => {
  const scope = "openid profile email";
  const state = "DCEEFWF45453sdffef424"; 

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scope)}&state=${state}`;
  
  res.redirect(authUrl);
});

// Step 2: LinkedIn redirects back with `code`
app.get("/callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    // Step 3: Exchange code for access and ID tokens
    const tokenRes = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, id_token } = tokenRes.data;

    // Step 4: Decode ID token to get user info
    const decoded = jwt.decode(id_token, { complete: true });


    if (!decoded) {
      return res.status(400).json({ error: "Invalid ID token" });
    }


    return res.json({
      message: "Successfully authenticated via OpenID Connect hehheheheheheehheeheh",

      access_token,
      id_token,
      user_info: decoded.payload,
    
    });

  } catch (error) {
    console.error("OIDC Error:", error.response?.data || error.message);
    return res.status(500).json({ error: "LinkedIn OIDC auth failed", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ LinkedIn OpenID Connect backend running on http://localhost:${PORT}`);
  console.log({ CLIENT_ID, CLIENT_SECRET, REDIRECT_URI });
});
