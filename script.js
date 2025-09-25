
document.addEventListener('DOMContentLoaded', () => {
    const studyForm = document.getElementById('study-form');
    const topicInput = document.getElementById('topic');
    const generateBtn = document.getElementById('generate-btn');
    const loading = document.getElementById('loading');
    const contentDisplay = document.getElementById('content-display');

    const CEREBRAS_API_KEY = 'csk-5339684ne4r8epnrjwd84p65e65c8rty6etj9e926n5nkttx';
    const API_URL = 'https://api.cerebras.com/v1/chat/completions';

    studyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        const contentType = document.querySelector('input[name="content_type"]:checked').value;

        if (!topic || !contentType) {
            alert('Please enter a topic and select a content type.');
            return;
        }

        generateContent(topic, contentType);
    });

    const generateContent = (topic, contentType) => {
        loading.classList.remove('hidden');
        contentDisplay.classList.add('hidden');
        generateBtn.disabled = true;

        const prompt = `Generate ${contentType} for the topic: ${topic}`;

        const requestBody = {
            model: "mistral-7b-instruct-v0.2",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CEREBRAS_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.choices && data.choices[0]) {
                const content = data.choices[0].message.content;
                displayOutput(content);
            } else {
                let errorMessage = 'Invalid response from API.';
                if (data.error && data.error.message) {
                    errorMessage = data.error.message;
                } else if (typeof data === 'string') {
                    errorMessage = data;
                }
                throw new Error(errorMessage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            contentDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
            contentDisplay.classList.remove('hidden');
        })
        .finally(() => {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        });
    };

    const displayOutput = (content) => {
        contentDisplay.innerHTML = content.replace(/\n/g, '<br>');
        contentDisplay.classList.remove('hidden');
    };
});
