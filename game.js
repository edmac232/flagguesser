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

    // --- Corrected File Paths ---
    // This double-path is correct based on your folder structure and server setup.
    const flagsBasePath = 'country-flags-main/country-flags-main/svg/';
    const countriesJsonPath = 'country-flags-main/country-flags-main/countries.json';

    // --- Load Country Data ---
    fetch(countriesJsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok for ${countriesJsonPath}`);
            }
            return response.json();
        })
        .then(data => {
            countries = data;
            countryCodes = Object.keys(countries);
            startGame();
        })
        .catch(error => {
            console.error('Error loading country data:', error);
            feedbackElement.textContent = 'Could not load game data. Check file paths and that Live Server is running.';
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
        flagContainer.classList.add('hidden');

        // Get a random country
        const randomIndex = Math.floor(Math.random() * countryCodes.length);
        currentCountryCode = countryCodes[randomIndex];
        const flagFileName = `${currentCountryCode.toLowerCase()}.svg`;

        // Display the flag
        flagImage.src = `${flagsBasePath}${flagFileName}`;
        
        flagImage.onload = () => {
            flagContainer.classList.remove('hidden');
            // Hide the flag after 1 second
            setTimeout(() => {
                if (gameInProgress) {
                    flagContainer.classList.add('hidden');
                }
            }, 1000);
        };
        
        flagImage.onerror = () => {
             console.error(`Failed to load flag: ${flagImage.src}`);
             feedbackElement.textContent = 'Error: Could not load flag image. Check paths.';
        };
    }

    // --- Handle User's Guess ---
    function handleGuess() {
        if (!gameInProgress) return;

        const userGuess = guessInput.value.trim().toLowerCase();
        const correctCountryName = countries[currentCountryCode].toLowerCase();

        flagContainer.classList.remove('hidden');
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
        if (event.key === 'Enter' && !guessButton.classList.contains('hidden')) {
            handleGuess();
        }
    });
});