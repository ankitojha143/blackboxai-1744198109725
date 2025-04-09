// DOM Elements
const lessonsSection = document.getElementById('lessons');
const practiceSection = document.getElementById('practice');
const exerciseContainer = document.getElementById('exercise-container');
const listenBtn = document.getElementById('listen-btn');
const speakBtn = document.getElementById('speak-btn');
const nextBtn = document.getElementById('next-btn');
const feedbackDiv = document.getElementById('feedback');

// App State
let currentLesson = null;
let currentExerciseIndex = 0;
let recognition = null;

// Initialize the app
function init() {
    loadLessons();
    setupSpeechRecognition();
    setupEventListeners();
}

// Load lessons from lessons.js
function loadLessons() {
    const lessons = getAllLessons();
    lessonsSection.innerHTML = lessons.map(lesson => `
        <div class="lesson-card bg-white rounded-lg shadow-md p-6 cursor-pointer" data-id="${lesson.id}">
            <div class="text-blue-600 text-3xl mb-4">
                <i class="fas ${lesson.icon}"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">${lesson.title}</h3>
            <p class="text-gray-600">${lesson.description}</p>
        </div>
    `).join('');
}

// Setup Web Speech API
function setupSpeechRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        alert("Speech recognition not supported in your browser. Try Chrome or Edge.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        checkAnswer(transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        feedbackDiv.textContent = `Error: ${event.error}`;
        feedbackDiv.className = 'incorrect';
        feedbackDiv.classList.remove('hidden');
    };
}

// Setup event listeners
function setupEventListeners() {
    // Lesson selection
    lessonsSection.addEventListener('click', (e) => {
        const lessonCard = e.target.closest('.lesson-card');
        if (lessonCard) {
            const lessonId = parseInt(lessonCard.dataset.id);
            startLesson(lessonId);
        }
    });

    // Listen button
    listenBtn.addEventListener('click', () => {
        const currentExercise = currentLesson.exercises[currentExerciseIndex];
        speakText(currentExercise.text);
    });

    // Speak button
    speakBtn.addEventListener('click', () => {
        if (speakBtn.classList.contains('recording')) {
            recognition.stop();
            speakBtn.classList.remove('recording');
        } else {
            recognition.start();
            speakBtn.classList.add('recording');
            feedbackDiv.classList.add('hidden');
        }
    });

    // Next button
    nextBtn.addEventListener('click', nextExercise);
}

// Start a lesson
function startLesson(lessonId) {
    currentLesson = getLessonById(lessonId);
    currentExerciseIndex = 0;
    lessonsSection.classList.add('hidden');
    practiceSection.classList.remove('hidden');
    showCurrentExercise();
}

// Show current exercise
function showCurrentExercise() {
    const exercise = currentLesson.exercises[currentExerciseIndex];
    exerciseContainer.innerHTML = `
        <div class="exercise-text text-xl font-medium mb-4">
            ${exercise.text}
        </div>
        <p class="text-gray-500">Try saying: "${exercise.response}"</p>
    `;
    feedbackDiv.classList.add('hidden');
}

// Check user's speech against expected response
function checkAnswer(userSpeech) {
    const expected = currentLesson.exercises[currentExerciseIndex].response.toLowerCase();
    const isCorrect = userSpeech.includes(expected) || 
                     expected.includes(userSpeech) || 
                     checkSimilarity(userSpeech, expected) > 0.6;

    feedbackDiv.textContent = isCorrect ? 'Correct! 🎉' : 'Try again!';
    feedbackDiv.className = isCorrect ? 'correct' : 'incorrect';
    feedbackDiv.classList.remove('hidden');
    speakBtn.classList.remove('recording');

    if (isCorrect) {
        setTimeout(nextExercise, 1500);
    }
}

// Simple similarity check
function checkSimilarity(str1, str2) {
    const set1 = new Set(str1.split(' '));
    const set2 = new Set(str2.split(' '));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    return intersection.size / Math.max(set1.size, set2.size);
}

// Move to next exercise
function nextExercise() {
    currentExerciseIndex++;
    if (currentExerciseIndex < currentLesson.exercises.length) {
        showCurrentExercise();
    } else {
        // Lesson complete
        feedbackDiv.textContent = 'Lesson complete! Great job!';
        feedbackDiv.className = 'correct';
        feedbackDiv.classList.remove('hidden');
        setTimeout(() => {
            practiceSection.classList.add('hidden');
            lessonsSection.classList.remove('hidden');
        }, 2000);
    }
}

// Text-to-speech function
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
