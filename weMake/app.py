from flask import Flask, request, jsonify, render_template
import requests
import json

app = Flask(__name__)

# Cerebras API configuration
# Using a smaller model for efficiency
API_URL = "https://api.cerebras.ai/v1/chat/completions"
HEADERS = {"Authorization": "Bearer csk-5339684ne4r8epnrjwd84p65e65c8rty6etj9e926n5nkttx"}

def query_cerebras_api(messages):
    """
    Query the Cerebras API
    """
    payload = {
        "model": "llama3.1-8b",
        "messages": messages
    }
    response = requests.post(API_URL, headers=HEADERS, json=payload)
    return response.json()

def generate_content(topic, content_type):
    """
    Generate educational content based on topic and content type
    """
    # Create specific prompts based on content type
    if content_type == "Summary Notes":
        messages = [
            {"role": "user", "content": f"Create a concise, easy-to-understand summary about {topic}. Include key points and important facts. Format the response in HTML with <h2> for the title and <p> for paragraphs."}
        ]
    elif content_type == "Flashcards":
        messages = [
            {"role": "user", "content": f"Generate a list of 5 key terms and their definitions related to {topic}. Format the response as a JSON array with each object having 'term' and 'definition' keys. Do not include any markdown formatting in the response."}
        ]
    elif content_type == "Quiz":
        messages = [
            {"role": "user", "content": f"Create 3 multiple-choice questions about {topic} with 4 answer choices each and indicate the correct answer. Format the response as a JSON array with each object having 'question', 'choices' (array), and 'correct_answer' keys. Do not include any markdown formatting in the response. Make sure the correct_answer is one of the choices in the choices array."}
        ]
    elif content_type == "Roadmap":
        messages = [
            {"role": "user", "content": f"Create a learning roadmap for {topic} as an HTML formatted list with clear steps. Include main concepts, subtopics, and learning progression. Use <h2> for the title, <ul> for the main roadmap, and <li> for each step. Add brief descriptions for each step."}
        ]
    elif content_type == "Study Material":
        messages = [
            {"role": "user", "content": f"Provide study materials and YouTube video recommendations for learning {topic}. Format the response in HTML with <h2> for the title, <h3> for sections like 'Study Materials' and 'Video Resources', <ul> for lists, and <li> for each item. Include links to relevant YouTube videos using proper HTML anchor tags."}
        ]
    else:
        return "Invalid content type"
    
    # Query the Cerebras API
    try:
        response = query_cerebras_api(messages)
        
        # Extract the generated content
        if "choices" in response and len(response["choices"]) > 0:
            generated_content = response["choices"][0].get("message", {}).get("content", "")
            return generated_content
        else:
            return f"Error: {response}"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_content', methods=['POST'])
def generate_content_endpoint():
    """
    API endpoint to generate educational content
    """
    data = request.get_json()
    topic = data.get('topic')
    content_type = data.get('content_type')
    
    if not topic or not content_type:
        return jsonify({'error': 'Missing topic or content_type'}), 400
    
    try:
        content = generate_content(topic, content_type)
        return jsonify({'content': content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
