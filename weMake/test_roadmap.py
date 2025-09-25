import requests
import json

# Cerebras API configuration
API_URL = "https://api.cerebras.ai/v1/chat/completions"
HEADERS = {"Authorization": "Bearer csk-mecv2f83k2n2j549r53r98tdy2k8yckyh6rv3p46ym9x35ff"}

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

def test_flowchart_generation(topic):
    """
    Test roadmap generation
    """
    messages = [
        {"role": "user", "content": f"Create a learning roadmap for {topic} using mermaid flowchart syntax. Return ONLY the mermaid code starting with 'flowchart TD' and ending with the diagram definition. Do not include any markdown code block indicators (no ```mermaid or ```) or additional text. Use proper mermaid syntax compatible with version 10.6.1. IMPORTANT: Ensure correct spelling of all words, especially 'Products' (not 'Prostucts'), and proper syntax formatting with single spaces in all declarations like 'stroke-width:2px' (not 'stroke-width: :2px')."}
    ]
    
    print("Sending request to Cerebras API...")
    response = query_cerebras_api(messages)
    
    print("API Response:")
    print(json.dumps(response, indent=2))
    
    # Extract the generated content
    if "choices" in response and len(response["choices"]) > 0:
        generated_content = response["choices"][0].get("message", {}).get("content", "")
        print("\nGenerated Content:")
        print(repr(generated_content))
        return generated_content
    else:
        print("Error: No choices in response")
        return None

if __name__ == "__main__":
    topic = input("Enter a topic to test flowchart generation: ")
    content = test_flowchart_generation(topic)
    if content:
        print("\nContent formatted for mermaid:")
        content = content.strip()
        if not content.startswith("flowchart TD") and not content.startswith("graph TD"):
            content = "flowchart TD\n" + content
        print(content)
