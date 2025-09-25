document.addEventListener('DOMContentLoaded', () => {
    const studyForm = document.getElementById('study-form');
    const topicInput = document.getElementById('topic');
    const contentTypeInput = document.getElementById('content_type');
    const contentTypesContainer = document.querySelector('.content-types');
    const generateBtn = document.getElementById('generate-btn');
    const loading = document.getElementById('loading');
    const outputSection = document.getElementById('output-section');
    const outputTitle = document.getElementById('output-title');
    const contentDisplay = document.getElementById('content-display');
    const copyBtn = document.getElementById('copy-btn');
    const regenerateBtn = document.getElementById('regenerate-btn');

    let lastGeneratedData = null;

    contentTypesContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.content-types button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            contentTypeInput.value = e.target.dataset.value;
        }
    });

    studyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const topic = topicInput.value.trim();
        const contentType = contentTypeInput.value;

        if (!topic || !contentType) {
            alert('Please enter a topic and select a content type.');
            return;
        }

        const requestData = { topic, content_type: contentType };
        generateContent(requestData);
    });

    const generateContent = (requestData) => {
        loading.classList.remove('d-none');
        outputSection.classList.add('d-none');
        generateBtn.disabled = true;

        fetch('/generate_content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) throw new Error(data.error);
            lastGeneratedData = requestData;
            displayOutput(data.content, requestData.content_type);
        })
        .catch(error => {
            contentDisplay.innerHTML = `<p class="text-danger">Error: ${error.message}</p>`;
            outputTitle.textContent = 'Error';
            outputSection.classList.remove('d-none');
        })
        .finally(() => {
            loading.classList.add('d-none');
            generateBtn.disabled = false;
        });
    };

    const displayOutput = (content, contentType) => {
        outputTitle.textContent = `${contentType} for "${lastGeneratedData.topic}"`;
        if (contentType === 'Flashcards') {
            const flashcards = content.split('---').map(fc => {
                const [front, back] = fc.split('\nAnswer:');
                return { front: front.replace('Question: ', ''), back };
            });
            contentDisplay.innerHTML = flashcards.map(fc => `
                <div class="flashcard">
                    <div class="card-inner">
                        <div class="card-front">${fc.front}</div>
                        <div class="card-back">${fc.back}</div>
                    </div>
                </div>
            `).join('');
            document.querySelectorAll('.flashcard .card-inner').forEach(card => {
                card.addEventListener('click', () => card.classList.toggle('is-flipped'));
            });
        } else {
            contentDisplay.innerHTML = content;
        }
        outputSection.classList.remove('d-none');
    };

    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(contentDisplay.innerText)
            .then(() => alert('Content copied to clipboard!'))
            .catch(() => alert('Failed to copy content.'));
    });

    regenerateBtn.addEventListener('click', () => {
        if (lastGeneratedData) generateContent(lastGeneratedData);
    });
});