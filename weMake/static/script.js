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

    contentTypes.forEach(ct => {
        ct.addEventListener('click', () => {
            contentTypes.forEach(c => c.classList.remove('selected'));
            ct.classList.add('selected');
            contentTypeInput.value = ct.dataset.value;
        });
    });

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
            contentDisplay.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
            outputTitle.textContent = 'Error';
            outputSection.classList.remove('hidden');
        })
        .finally(() => {
            loading.classList.add('hidden');
            generateBtn.disabled = false;
        });
    };

    const displayOutput = (content, contentType) => {
        outputTitle.textContent = `${contentType} for "${lastGeneratedData.topic}"`;
        contentDisplay.innerHTML = content;
        outputSection.classList.remove('hidden');
    };

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
