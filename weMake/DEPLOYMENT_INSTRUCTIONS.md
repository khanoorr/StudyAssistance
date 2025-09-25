# Deployment Instructions for GitHub Pages

This document provides step-by-step instructions to deploy your application to GitHub Pages.

## Prerequisites

1.  A GitHub account.
2.  Git installed on your computer.

## Deployment Steps

### 1. Repository Setup
Your project files should be pushed to a **public** GitHub repository.

### 2. Configure GitHub Pages

1.  Go to your repository on GitHub.com.
2.  Click on the **Settings** tab.
3.  In the left sidebar, click on **Pages**.
4.  Under "Build and deployment", for the "Source", select **Deploy from a branch**.
5.  In the "Branch" section, ensure you select:
    *   Branch: **main**
    *   Folder: **/docs**
6.  Click **Save**.
7.  Wait a few minutes for GitHub to deploy your site. It can sometimes take 5-10 minutes for changes to appear.
8.  Your site will be available at: `https://<your-username>.github.io/<your-repository-name>/`

## Updating Your Application

If you make changes to your files in the `docs` folder and want to update the deployed version:

1.  Commit your changes:
    ```bash
    git add docs/
    git commit -m "Update application"
    ```

2.  Push to GitHub:
    ```bash
    git push origin main
    ```

3.  GitHub Pages will automatically rebuild and update your site within a few minutes.

## Troubleshooting

*   **404 "File not found" Error:** This is the most common issue. It almost always means your GitHub Pages source setting is incorrect. Double-check that it is set to deploy from the `/docs` folder in your `main` branch.
*   **Site Doesn't Load Content:** Ensure your Cerebras API token is correctly placed in the `script.js` file and is valid. Check the browser's developer console for any API-related errors.
