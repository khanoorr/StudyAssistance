# Learnship - AI Learning Assistant

A web application that leverages generative AI to create personalized study materials based on user input. This application was built for the FutureStack GenAI hackathon.

## Project Status: COMPLETE

All required features have been implemented and tested successfully. The application is fully functional with a clean, modern interface and responsive design. It demonstrates practical use of generative AI for educational purposes with multiple content types (Summary Notes, Flashcards, Quiz, Roadmap, and Study Materials & Videos).

**Note**: This application now uses the Cerebras API instead of running models locally. You'll need to obtain an API token from Cerebras and replace `YOUR_API_TOKEN_HERE` in `app.py` with your actual token.

## Description

Learnship is an AI Learning Assistant that helps students learn by generating customized educational content. With a modern, clean interface featuring gradient backgrounds, subtle shadows, and responsive design, Learnship makes it easy to create study materials for any topic. Users can select from multiple output formats to suit their learning preferences.

## Features

- Generate summary notes for any topic
- Create flashcards with key terms and definitions
- Generate multiple-choice quizzes with answer checking and scoring functionality
- Create learning roadmaps to guide study progression
- Find study materials and YouTube video resources
- Clean, modern user interface with responsive design inspired by Google's design principles
- Interactive elements for better engagement

## Technologies Used

- **Backend**: Python 3 with Flask
- **AI**: Llama 3.1 8B model hosted on Cerebras
- **Frontend**: HTML, CSS, and vanilla JavaScript

## Installation

1. Clone or download this repository
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
4. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Obtain a Cerebras API token:
   - Visit [Cerebras](https://www.cerebras.ai/)
   - Sign up or log in to your account
   - Go to your profile settings and create an API token
   - Copy the token
6. Update the API token in `app.py`:
   - Open `app.py` in a text editor
   - Replace `YOUR_API_TOKEN_HERE` with your actual Cerebras API token

## Usage

1. Set your Cerebras API token in `app.py` (replace `YOUR_API_TOKEN_HERE`)
2. Run the Flask application:
   ```bash
   python app.py
   ```
3. Open your web browser and navigate to `http://localhost:5000`
4. Enter a topic you want to study
5. Select your desired output format (Summary Notes, Flashcards, Quiz, Roadmap, or Study Materials & Videos)
6. Click "Generate Study Materials"
7. View and interact with your generated study materials

## How It Works

1. The user inputs a topic and selects a content type
2. JavaScript sends this data to the Flask backend via a POST request
3. The backend crafts a specific prompt based on the content type:
   - For Summary Notes: Asks for a concise summary with key points
   - For Flashcards: Requests key terms and definitions in JSON format
   - For Quiz: Asks for multiple-choice questions with answer choices and correct answers in JSON format
   - For Roadmap: Requests a learning roadmap with clear steps and progression
   - For Study Materials & Videos: Requests study materials and YouTube video recommendations
4. The backend sends the prompt to the Cerebras API
5. The Llama 3.1 8B model hosted on Cerebras generates the content based on the prompt
6. The backend returns the generated content to the frontend
7. JavaScript dynamically displays the content with appropriate formatting
8. For quizzes, users can select answers and click the "Submit Quiz" button to see their score and which answers were correct or incorrect

## Hackathon Criteria Fulfillment

- **Generative AI Theme**: Uses the Llama 3.1 8B LLM to generate educational content
- **Practical Application**: Provides a useful tool for students to create study materials
- **Wow Factor**: Demonstrates how AI can be used to personalize learning experiences
- **Clean Design**: Features a modern, attractive interface with responsive design
- **Technical Implementation**: Combines Python/Flask backend with HTML/CSS/JS frontend

## Model Information

This application uses the Llama 3.1 8B model hosted on Cerebras. Instead of running the model locally, this application uses the Cerebras API to access the model hosted on Cerebras' servers. This approach avoids the need for heavy dependencies and makes the application easier to run.

## Project Development Progress

- [x] Set up project directory structure
- [x] Create requirements.txt file
- [x] Implement backend API with Flask
- [x] Create HTML template for frontend
- [x] Implement CSS styling
- [x] Implement JavaScript functionality
- [x] Write comprehensive README.md
- [x] Test the complete application
- [x] Implement flowchart functionality with Mermaid.js
- [x] Fix flowchart markdown formatting issues
