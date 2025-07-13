document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const scoreElement = document.getElementById('score');
    const flagContainer = document.getElementById('flag-container');
    const flagImage = document.getElementById('flag-image');
    const feedbackElement = document.getElementById('feedback');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const nextButton = document.getElementById('next-button');

    // --- Game State ---
    let countries = {};
    let countryCodes = [];
    let currentCountryCode = '';
    let score = 0;
    let gameInProgress = false;

    // --- File Paths ---
    // Adjust these paths if your file structure is different.
    const flagsBasePath = 'svg/'; // Using SVG files
    const flagFileName = `${currentCountryCode.toLowerCase()}.svg`;

    // --- Load Country Data ---
    fetch(countriesJsonPath)
        .then(response => response.json())
        .then(data => {
            countries = data;
            countryCodes = Object.keys(countries);
            startGame();
        })
        .catch(error => {
            console.error('Error loading country data:', error);
            feedbackElement.textContent = 'Could not load country data. Please check file paths.';
        });

    function startGame() {
        score = 0;
        updateScore();
        startNewRound();
    }

    // --- Start a New Round ---
    function startNewRound() {
        gameInProgress = true;
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.classList.remove('hidden');
        nextButton.classList.add('hidden');

        // Get a random country
        const randomIndex = Math.floor(Math.random() * countryCodes.length);
        currentCountryCode = countryCodes[randomIndex];
        const flagFileName = `${currentCountryCode.toLowerCase()}.png`;

        // Display the flag
        flagImage.src = `${flagsBasePath}${flagFileName}`;
        flagContainer.classList.remove('hidden');

        // Hide the flag after 1 second
        setTimeout(() => {
            if (gameInProgress) {
                flagContainer.classList.add('hidden');
            }
        }, 1000); // 1000 milliseconds = 1 second
    }

    // --- Handle User's Guess ---
    function handleGuess() {
        if (!gameInProgress) return;

        const userGuess = guessInput.value.trim().toLowerCase();
        const correctCountryName = countries[currentCountryCode].toLowerCase();

        flagContainer.classList.remove('hidden'); // Show the flag again for context
        guessInput.disabled = true;
        gameInProgress = false;

        if (userGuess === correctCountryName) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'correct';
            score++;
            updateScore();
        } else {
            feedbackElement.textContent = `Sorry, the correct answer was ${countries[currentCountryCode]}.`;
            feedbackElement.className = 'incorrect';
        }

        guessButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
    }

    function updateScore() {
        scoreElement.textContent = score;
    }

    // --- Event Listeners ---
    guessButton.addEventListener('click', handleGuess);
    nextButton.addEventListener('click', startNewRound);

    // Allow pressing Enter to submit a guess
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });
});