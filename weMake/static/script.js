document.addEventListener('DOMContentLoaded', () => {
    const studyForm = document.getElementById('study-form');
    const topicInput = document.getElementById('topic');
    const contentTypeInput = document.getElementById('content_type');
    const contentTypes = document.querySelectorAll('.content-type');
    const generateBtn = document.getElementById('generate-btn');
    const loading = document.getElementById('loading');
    const outputSection = document.getElementById('output-section');
    const outputTitle = document.getElementById('output-title');
    const contentDisplay = document.getElementById('content-display');
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');

    let lastGeneratedData = null;

    // --- Content Type Selection ---
    contentTypes.forEach(ct => {
        ct.addEventListener('click', () => {
            contentTypes.forEach(c => c.classList.remove('selected'));
            ct.classList.add('selected');
            contentTypeInput.value = ct.dataset.value;
        });
    });

    // --- Form Submission ---
    studyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = topicInput.value;
        const contentType = contentTypeInput.value;

        if (!topic || !contentType) {
            alert('Please enter a topic and select a content type.');
            return;
        }

        const requestData = { topic, content_type: contentType };
        generateContent(requestData);
    });

    // --- API Call ---
    const generateContent = (requestData) => {
        loading.classList.remove('hidden');
        outputSection.classList.add('hidden');
        generateBtn.disabled = true;

        fetch('/generate_content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            lastGeneratedData = requestData;
            displayOutput(data.content, requestData.content_type);
        })
        .catch(error => {
            contentDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            outputTitle.textContent = 'Error';
            outputSection.classList.remove('hidden');
        })
        .finally(() => {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        });
    };

    // --- Display Output ---
    const displayOutput = (content, contentType) => {
        outputTitle.textContent = `${contentType} for "${lastGeneratedData.topic}"`;
        contentDisplay.innerHTML = content; // Assuming the content is pre-formatted HTML
        outputSection.classList.remove('hidden');
    };

    // --- Output Actions ---
    copyBtn.addEventListener('click', () => {
        const textToCopy = contentDisplay.innerText;
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('Content copied to clipboard!'))
            .catch(err => alert('Failed to copy content.'));
    });

    regenerateBtn.addEventListener('click', () => {
        if (lastGeneratedData) {
            generateContent(lastGeneratedData);
        }
    });
});
