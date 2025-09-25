document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("study-form");
  const generateBtn = document.getElementById("generate-btn");
  const loadingDiv = document.getElementById("loading");
  const contentDisplay = document.getElementById("content-display");

  // Initialize mermaid with better configuration for version 10.6.1
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
    fontFamily: "Arial, sans-serif",
    flowchart: {
      useMaxWidth: false,
      htmlLabels: true,
    },
    sequence: {
      useMaxWidth: false,
    },
  });

  // Store generated content for each type
  const generatedContent = {};
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const topic = document.getElementById("topic").value;
    const contentType = document.querySelector(
      'input[name="content_type"]:checked'
    ).value;

    // Show loading, hide content
    loadingDiv.classList.remove("hidden");
    contentDisplay.classList.add("hidden");
    contentDisplay.innerHTML = "";
    generateBtn.disabled = true;

    // Send request to backend
    fetch("/generate_content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: topic,
        content_type: contentType,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }

        // Store the generated content
        generatedContent[contentType] = data.content;

        // Display the content
        displayContent(data.content, contentType);
      })
      .catch((error) => {
        contentDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        contentDisplay.classList.remove("hidden");
      })
      .finally(() => {
        // Hide loading, enable button
        loadingDiv.classList.add("hidden");
        generateBtn.disabled = false;
      });
  });

  function displayContent(content, contentType) {
    // Map content types to their display functions
    const displayFunctions = {
      "Summary Notes": displaySummaryNotes,
      "Flashcards": displayFlashcards,
      "Quiz": displayQuiz,
      "Roadmap": displayRoadmap,
      "Study Material": displayStudyMaterial
    };
    
    // Use the appropriate display function
    const displayFunction = displayFunctions[contentType] || displaySummaryNotes;
    displayFunction(content);

    contentDisplay.classList.remove("hidden");
    
    // Add table of contents for longer content
    if (contentType === "Summary Notes" || contentType === "Roadmap" || contentType === "Study Material") {
      addTableOfContents();
    }
    
    // Show content navigation bar
    const contentNav = document.getElementById("content-nav");
    if (contentNav) {
      contentNav.classList.remove("hidden");
      
      // Update active state in content navigation
      document.querySelectorAll('.content-nav .nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-content') === contentType.toLowerCase().replace(' ', '-')) {
          item.classList.add('active');
        }
      });
    }
  }

  function displaySummaryNotes(content) {
    contentDisplay.innerHTML = `<div class="content-section summary-notes" id="summary-notes">${content}</div>`;
  }

  function displayFlashcards(content) {
    try {
      // Try to parse as JSON first
      const flashcards = JSON.parse(content);
      let html = '<div class="content-section flashcards-content" id="flashcards"><h2>Flashcards</h2><div class="flashcards-container">';

      flashcards.forEach((card) => {
        html += `
                    <div class="flashcard">
                        <h3>${card.term}</h3>
                        <p>${card.definition}</p>
                    </div>
                `;
      });

      html += "</div></div>";
      contentDisplay.innerHTML = html;
    } catch (e) {
      // If JSON parsing fails, display as plain text
      contentDisplay.innerHTML = `
                <div class="content-section flashcards-content" id="flashcards">
                <h2>Flashcards</h2>
                <div class="flashcards-container">
                    <div class="flashcard">
                        <p>${content}</p>
                    </div>
                </div>
                </div>
            `;
    }
  }

  function displayQuiz(content) {
    try {
      // Try to parse as JSON first
      const quiz = JSON.parse(content);
      let html = '<div class="content-section quiz-content" id="quiz"><h2>Quiz</h2><div class="quiz-container">';

      quiz.forEach((q, index) => {
        html += `
          <div class="quiz-question" data-question-index="${index}">
            <h3>Question ${index + 1}</h3>
            <p>${q.question}</p>
            <ul>
        `;

        q.choices.forEach((choice, choiceIndex) => {
          html += `<li data-question="${index}" data-choice="${choiceIndex}">${choice}</li>`;
        });

        html += `
            </ul>
            <p class="correct-answer hidden">Correct answer: ${q.correct_answer}</p>
          </div>
        `;
      });

      // Add submit button and score display
      html += `
        <div class="quiz-controls">
          <button id="submit-quiz" class="submit-quiz-btn">Submit Quiz</button>
          <div id="quiz-score" class="quiz-score hidden"></div>
        </div>
      </div></div>`;
      contentDisplay.innerHTML = html;

      // Add event listeners for quiz choices
      document.querySelectorAll(".quiz-question li").forEach((item) => {
        item.addEventListener("click", function () {
          // Check if quiz has already been submitted
          const submitBtn = document.getElementById("submit-quiz");
          if (submitBtn && submitBtn.disabled) {
            return;
          }
          
          const questionIndex = parseInt(this.getAttribute("data-question"));
          const choiceIndex = parseInt(this.getAttribute("data-choice"));
          
          // Reset all choices for this question
          document
            .querySelectorAll(`.quiz-question[data-question-index="${questionIndex}"] li`)
            .forEach((li) => {
              li.classList.remove("correct", "incorrect");
            });

          // Check if selected answer is correct
          if (quiz[questionIndex].choices[choiceIndex] === quiz[questionIndex].correct_answer) {
            this.classList.add("correct");
            // Hide correct answer text if it was shown
            const correctAnswerElement = this.closest(".quiz-question").querySelector(".correct-answer");
            correctAnswerElement.classList.add("hidden");
          } else {
            this.classList.add("incorrect");
            // Show correct answer
            const correctAnswerElement = this.closest(".quiz-question").querySelector(".correct-answer");
            correctAnswerElement.classList.remove("hidden");
          }
        });
      });

      // Add event listener for submit button
      const submitBtn = document.getElementById("submit-quiz");
      if (submitBtn) {
        submitBtn.addEventListener("click", function() {
          // Calculate score
          let correctCount = 0;
          const totalQuestions = quiz.length;
          
          document.querySelectorAll(".quiz-question").forEach((questionDiv, index) => {
            const selectedChoice = questionDiv.querySelector("li.correct, li.incorrect");
            if (selectedChoice) {
              const choiceIndex = parseInt(selectedChoice.getAttribute("data-choice"));
              if (quiz[index].choices[choiceIndex] === quiz[index].correct_answer) {
                correctCount++;
              }
            }
          });
          
          // Display score
          const scoreElement = document.getElementById("quiz-score");
          if (scoreElement) {
            scoreElement.innerHTML = `<h3>Your Score: ${correctCount}/${totalQuestions}</h3>`;
            scoreElement.classList.remove("hidden");
          }
          
          // Disable submit button and all choices
          this.disabled = true;
          this.textContent = "Quiz Submitted";
          document.querySelectorAll(".quiz-question li").forEach((item) => {
            item.style.cursor = "default";
            item.style.pointerEvents = "none";
          });
        });
      }
    } catch (e) {
      // If JSON parsing fails, display as plain text
      contentDisplay.innerHTML = `
        <div class="content-section quiz-content" id="quiz">
          <h2>Quiz</h2>
          <div class="quiz-container">
            <div class="quiz-question">
              <p>${content}</p>
            </div>
          </div>
        </div>
      `;
    }
  }

  function displayRoadmap(content) {
    contentDisplay.innerHTML = `
      <div class="content-section roadmap-content" id="roadmap">
      <div class="roadmap-container">
        <h2>Learning Roadmap</h2>
        <div class="roadmap-content">${content}</div>
      </div>
      </div>
    `;
  }

  function displayStudyMaterial(content) {
    contentDisplay.innerHTML = `
      <div class="content-section study-material-content" id="study-material">
      <div class="study-material-container">
        <h2>Study Materials & Videos</h2>
        <div class="study-material-content">${content}</div>
      </div>
      </div>
    `;
  }
  
  function addTableOfContents() {
    const contentDiv = document.querySelector('#content-display > div');
    if (!contentDiv) return;
    
    // Get all headings (h2 and h3)
    const headings = contentDiv.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Only add TOC if there are 3 or more headings
    
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = '<h3>Table of Contents</h3><ul class="toc-list"></ul>';
    
    const tocList = tocContainer.querySelector('.toc-list');
    
    // Add each heading to the TOC
    headings.forEach((heading, index) => {
      // Add an ID to the heading if it doesn't have one
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      // Create TOC item
      const tocItem = document.createElement('li');
      tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      
      // Create link to the heading
      const tocLink = document.createElement('a');
      tocLink.href = `#${heading.id}`;
      tocLink.textContent = heading.textContent;
      tocLink.addEventListener('click', function(e) {
        e.preventDefault();
        const targetElement = document.getElementById(heading.id);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      
      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
    });
    
    // Insert TOC at the beginning of the content
    contentDiv.insertBefore(tocContainer, contentDiv.firstChild);
  }
  
  // Function to switch between different content types with smooth transitions
  function switchContent(contentType) {
    // Hide all content sections with fade out effect
    document.querySelectorAll('.content-section').forEach(section => {
      if (!section.classList.contains('hidden')) {
        section.style.opacity = '0';
        section.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          section.classList.add('hidden');
        }, 300);
      }
    });

    // Show the selected content section with fade in effect
    const selectedSection = document.getElementById(contentType);
    if (selectedSection) {
      selectedSection.classList.remove('hidden');
      setTimeout(() => {
        selectedSection.style.opacity = '1';
        selectedSection.style.transition = 'opacity 0.3s ease';
      }, 50);
    } else {
      // If the content section doesn't exist, check if we have stored content for this type
      const contentTypeMap = {
        "summary-notes": "Summary Notes",
        "flashcards": "Flashcards",
        "quiz": "Quiz",
        "roadmap": "Roadmap",
        "study-material": "Study Material"
      };
      
      const originalContentType = contentTypeMap[contentType];
      if (generatedContent[originalContentType]) {
        displayContent(generatedContent[originalContentType], originalContentType);
      }
    }

    // Update active state in navigation
    document.querySelectorAll('.content-nav .nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeNavItem = document.querySelector(`.content-nav .nav-item[data-content="${contentType}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
    }
  }
  
  // Add event listeners for content navigation items
  document.addEventListener('click', function(e) {
    // Check if clicked element is a content nav item
    if (e.target.closest('.content-nav .nav-item')) {
      const navItem = e.target.closest('.content-nav .nav-item');
      const contentType = navItem.getAttribute('data-content');
      switchContent(contentType);
    }
  });
});
