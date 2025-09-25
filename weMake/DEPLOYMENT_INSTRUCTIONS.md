# Deployment Instructions for GitHub Pages

This document provides step-by-step instructions to deploy your Learnship application to GitHub Pages.

## Prerequisites

1. A GitHub account (you already have this as @khanoorr)
2. Git installed on your computer (you already have this)

## Deployment Steps

### 1. Create a New GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in to your account
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository (e.g., "learnship" or any name you prefer)
4. Set the repository to "Public" (required for GitHub Pages)
5. Do NOT initialize with a README, .gitignore, or license
6. Click "Create repository"

### 2. Prepare Your Local Files

1. Make sure you have the `static/index.html` file that was created
2. You can remove the other files (`app.py`, `requirements.txt`, etc.) as they are not needed for GitHub Pages deployment

### 3. Update the API Token in index.html

1. Open `static/index.html` in a text editor
2. Find the line with `const API_TOKEN = "YOUR_API_TOKEN_HERE";`
3. Replace `"YOUR_API_TOKEN_HERE"` with your actual Cerebras API token
4. Save the file

### 4. Initialize and Push to GitHub

1. Open a terminal/command prompt in the `weMake` directory
2. Run the following commands one by one:

```bash
git init
git add static/index.html
git commit -m "Initial commit: Learnship application"
```

3. Connect your local repository to the GitHub repository (replace "learnship" with your actual repository name):

```bash
git remote add origin https://github.com/khanoorr/learnship.git
```

4. Push your code to GitHub:

```bash
git push -u origin main
```

Note: If you get an error about the branch name, you might need to use "master" instead of "main":

```bash
git push -u origin master
```

### 5. Configure GitHub Pages

1. Go to your repository page on GitHub
2. Click on the "Settings" tab
3. In the left sidebar, click "Pages"
4. Under "Source", select "Deploy from a branch"
5. In the "Branch" dropdown:
   - Select either "main" or "master" (whichever you used when pushing)
   - Select "/ (root)" as the folder
6. Click "Save"
7. Wait a few minutes for GitHub to deploy your site
8. Your site will be available at: `https://khanoorr.github.io/repository-name/`

## Updating Your Application

If you make changes to your `static/index.html` file and want to update the deployed version:

1. Commit your changes:
   ```bash
   git add static/index.html
   git commit -m "Update application"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```
   or
   ```bash
   git push origin master
   ```

3. GitHub Pages will automatically update your site within a few minutes

## Important Notes

1. Make sure your Cerebras API token is valid and has the necessary permissions
2. The application makes direct API calls from the browser, so ensure your token is properly secured
3. For a production application, you should consider using a backend proxy to protect your API token
4. GitHub Pages only supports static websites, so server-side code (like your Flask app) cannot run

## Troubleshooting

1. If your site doesn't load:
   - Check that you've committed and pushed the `static/index.html` file
   - Verify that GitHub Pages is properly configured in your repository settings
   - Check the browser console for any error messages

2. If the application doesn't generate content:
   - Verify that your Cerebras API token is correct and valid
   - Check the browser console for API-related errors
   - Ensure you're using a compatible browser

3. If you see a 404 error:
   - It may take a few minutes for GitHub Pages to deploy your site
   - Check that you've selected the correct branch in the GitHub Pages settings
