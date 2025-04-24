const GIT_TOKEN = import.meta.env.VITE_GIT_TOKEN;

async function fetchGitHubData(username) {
  const query = `
    {
      user(login: "${username}") {
        name
        bio
        email
        websiteUrl
        twitterUsername
        location
        avatarUrl
        url
        company
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              primaryLanguage {
                name
              }
              stargazerCount
              url
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GIT_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const user = json.data.user;

  if (!user) return null;

  return {
    name: user.name,
    bio: user.bio,
    email: user.email,
    websiteUrl: user.websiteUrl,
    twitterUsername: user.twitterUsername,
    location: user.location,
    avatarUrl: user.avatarUrl,
    profileUrl: user.url,
    company: user.company,
    projects: user.pinnedItems.nodes,
  };
}

export default fetchGitHubData;
