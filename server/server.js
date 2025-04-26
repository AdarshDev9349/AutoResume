import express from 'express';
import dotenv from 'dotenv';
import { AuthClient, RestliClient } from 'linkedin-api-client';

dotenv.config();

const app = express();
const port = 3000;

const authClient = new AuthClient({
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUrl: process.env.LINKEDIN_REDIRECT_URI
});

const restliClient = new RestliClient();

// Step 1: Show login link
app.get('/', (req, res) => {
  const authUrl = authClient.generateMemberAuthorizationUrl(
    ['openid', 'profile', 'email'], // ✅ OpenID scopes only
    'somerandomstate'
  );
  res.send(`<a href="${authUrl}">Sign in with LinkedIn</a>`);
});

// Step 2: Handle callback from LinkedIn
app.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  if (error) {
    console.error(`LinkedIn OAuth Error: ${error_description}`);
    return res.status(400).send(`OAuth Error: ${error_description}`);
  }

  try {
    // Step 3: Exchange code for access token
    const tokenResponse = await authClient.exchangeAuthCodeForAccessToken(code);
    const accessToken = tokenResponse.access_token;

    // Step 4: Use OpenID /userinfo endpoint (NOT /me)
    const userInfoRes = await restliClient.get({
      resourcePath: '/userinfo',
      accessToken
    });

    const user = userInfoRes.data;

    // Step 5: Return the user info
    res.json({
      id: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).send('Something went wrong during LinkedIn login');
  }
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
