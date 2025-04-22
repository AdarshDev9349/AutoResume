
# Resume Page with GitHub Data

## Features

- **GitHub Data Fetching**: Displays the GitHub user's profile and pinned repositories by fetching data from the GitHub API.
- **User Profile**: Shows the user's avatar, bio, email, location, company, website, Twitter, and GitHub profile link.
- **Pinned Repositories**: Displays the user's pinned repositories along with details like description, language, stars, and a link to the repository on GitHub.
- **PDF Download**: Allows the user to download the resume as a PDF.
- **Responsive Design**: The layout adapts to different screen sizes for both desktop and mobile views.

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/resume-page.git
   cd resume-page
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

4. **Navigate to a resume page**: 

   Open the browser and go to `http://localhost:3000/resume/:username`, replacing `:username` with a valid GitHub username (e.g., `/resume/octocat`).
