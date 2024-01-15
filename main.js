
let sentences = [];
let currentSentenceIndex = 0;
let correctOrder = [];

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

function initializeGame() {
    const splashScreen = document.querySelector('#splash-screen');
    const gameLogo = document.querySelector('#gameLogo');
    const languageSelection = document.getElementById("language-selection");
    const gameView = document.querySelector('#game-view');
    const adminView = document.querySelector('#admin-view');
    const centeredContainer = document.getElementById('centered-container');

    score = 0;
    updateScoreDisplay();
    gameView.style.display = 'none';
    languageSelection.style.display = 'none';

    splashScreen.addEventListener('click', () => {
        clearTimeout(splashTimeout);
        transitionToLanguageSelection();
    });

    let splashTimeout = setTimeout(() => {
        transitionToLanguageSelection();
    }, 3000);

    let transitionToLanguageSelection = () => {
        splashScreen.style.display = 'none';
        centeredContainer.style.display = 'none';
        gameLogo.style.display = 'block';
        languageSelection.style.display = 'block';
    }

    document.getElementById("adminButton").addEventListener("click", () => {
        languageSelection.style.display = 'none';
        adminView.style.display = 'block';
    })

    document.getElementById("englishButton").addEventListener("click", () => {
        centeredContainer.style.display = 'block';
        loadGame("sentences_en.json");
    });

    document.getElementById("swedishButton").addEventListener("click", () => {
        loadGame("sentences_sv.json");
        centeredContainer.style.display = 'block';
    });
}

function loadGame(jsonFile) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(fetchedSentences => {
            sentences = fetchedSentences;
            document.getElementById("language-selection").style.display = 'none';
            document.getElementById("game-view").style.display = 'block';
            setupGame(sentences[currentSentenceIndex].sentence);
            initializeLevelIndicator();
            // loadAndDisplaySentences();
        })
        .catch(error => console.error('Error loading sentences:', error));
}

function initializeLevelIndicator() {
    updateLevelIndicator();

}
let score = 0;

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `Score: ${score}`;
}

function updateLevelIndicator() {
    const levelIndicator = document.getElementById('levelIndicator');
    if (levelIndicator) {
        levelIndicator.textContent = `Level: ${currentSentenceIndex + 1}/${sentences.length}`;
    }
}

function setupGame(sentence) {
    correctOrder = sentence.trim().split(/\s+/);
    let words = shuffleArray([...correctOrder]);
    const placeholderContainer = document.getElementById('placeholderContainer');
    const draggableContainer = document.getElementById('draggableContainer');
    placeholderContainer.innerHTML = '';
    draggableContainer.innerHTML = '';
    words.forEach((word, index) => createDraggableItem(word, index));
    // score = 0; 
    updateScoreDisplay();
}

function createDraggableItem(word, index) {
    const draggableItem = document.createElement('div');
    draggableItem.setAttribute('id', 'draggable-' + index);
    draggableItem.setAttribute('class', 'draggable');
    draggableItem.setAttribute('draggable', 'true');
    draggableItem.textContent = word;
    draggableItem.addEventListener('dragstart', onDragStartDraggingItem);
    const placeholder = document.createElement('div');
    placeholder.setAttribute('id', 'placeholder-' + index);
    placeholder.setAttribute('class', 'placeholder');
    placeholder.addEventListener('dragover', dragOverPlaceholder);
    placeholder.addEventListener('drop', onDropAllowedArea);
    document.getElementById('placeholderContainer').appendChild(placeholder);
    document.getElementById('draggableContainer').appendChild(draggableItem);
    updateLevelIndicator();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dragOverPlaceholder(event) {
    event.preventDefault();
}

function onDropAllowedArea(event) {
    event.preventDefault();
    const target = event.target;
    let draggedElement = document.getElementById(event.dataTransfer.getData("text"));
    let targetElement = target.classList.contains('draggable') ? target : target.firstChild;
    if (targetElement && draggedElement !== targetElement) {
        swapElements(draggedElement, targetElement);
    } else if (!targetElement) {
        target.appendChild(draggedElement);
    }
    checkWordPlacement(draggedElement.parentNode);
    if (targetElement) {
        checkWordPlacement(targetElement.parentNode);
    }
}

function swapElements(elem1, elem2) {
    const parent1 = elem1.parentNode;
    const parent2 = elem2.parentNode;
    if (parent1 && parent2) {
        parent1.appendChild(elem2);
        parent2.appendChild(elem1);
    }
}

function checkWordPlacement(target) {
    const draggedElementId = target.firstChild.id;
    const draggedElement = document.getElementById(draggedElementId);
    const word = target.firstChild.textContent;
    const targetIndex = parseInt(target.getAttribute('id').split('-')[1]);

    if (correctOrder[targetIndex] !== word) {

        draggedElement.classList.add('shake');


        draggedElement.addEventListener('animationend', () => {
            draggedElement.classList.remove('shake');

        }, { once: true });

        target.style.borderColor = 'red';
        score--;
    } else {
        target.style.borderColor = 'green';
        score++;
    }

    updateScoreDisplay();

    if (areAllPlaceholdersFilled()) {
        checkOrder();
    }
}


function onDragStartDraggingItem(event) {
    event.dataTransfer.setData("text", event.target.id);
}


function checkOrder() {
    const placeholders = document.querySelectorAll('.placeholder');
    let userOrder = Array.from(placeholders).map(placeholder => placeholder.firstChild ? placeholder.firstChild.textContent : '');
    if (arraysEqual(userOrder, correctOrder)) {
        showSuccessImage();
        currentSentenceIndex++;
        if (currentSentenceIndex < sentences.length) {
            setupGame(sentences[currentSentenceIndex].sentence);
            updateLevelIndicator();
        } else {
            endGame();
        }
    } else {
        alert("Incorrect. Try again.");
    }
}

let endGame = () => {
    congratsDialog();

}

let arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

let areAllPlaceholdersFilled = () => {
    const placeholders = document.querySelectorAll('.placeholder');
    return Array.from(placeholders).every(placeholder => placeholder.hasChildNodes());
}
document.getElementById("guideButton").addEventListener('click', () => {
    console.log("guide");
    const helpDialog = document.getElementById('helpDialog');
    helpDialog.title = "Game Instructions";
    helpDialog.content = "Gameplay:\n\n" +
        "You'll be presented with a series of scrambled words.\n" +
        "Drag and drop these words into the correct order to form a coherent sentence.\n" +
        "Each word is draggable and should be placed in the designated area.\n\n" +
        "Scoring:\n\n" +
        "You gain 1 point for every word correctly placed.\n" +
        "Incorrect placements result in a deduction of 1 point.\n" +
        "Your total score is displayed throughout the game.\n\n" +
        "Progressing Through Levels:\n\n" +
        "Once a sentence is correctly assembled, you'll briefly see a success animation before moving to the next sentence.\n" +
        "The game consists of multiple sentences, increasing in complexity.\n\n" +
        "End of the Game:\n\n" +
        "The game concludes when you have successfully arranged all the given sentences.\n" +
        "A congratulatory message will be displayed along with your final score.\n\n" +
        "Admin Panel (Optional):\n\n" +
        "You can add or remove sentences through the Admin Panel.\n" +
        "Choose the language, input new sentences, or delete existing ones.\n" +
        "Remember to save your changes.\n\n" +
        "Tips:\n\n" +
        "Take your time to think about the sentence structure.\n" +
        "Look for clues in the words that might indicate their order (like capitalization for the start of a sentence).";

    helpDialog.show();
});

document.getElementById("aboutButton").addEventListener('click', () => {
    console.log("about")
    const helpDialog = document.getElementById('helpDialog');
    helpDialog.title = "About Drag & Drop"
    helpDialog.content = "In this delightful brain teaser, you'll encounter a variety of sentences in both English and Swedish," +
        "challenging you to think and learn as you play. With each level, you're presented with a jumbled array" +
        " of words. Your task? Drag each word into its correct position to construct a meaningful sentence.\n\n" +
        "Earn points for accuracy and watch out for the tricky ones that test your linguistic expertise!."
    helpDialog.show();
});

let congratsDialog = () => {
    const congratsDialog = document.getElementById('helpDialog');
    congratsDialog.title = "Congratulations!";
    congratsDialog.content = `You've cleared all the sentences! Your final score is: ${score}`;
    congratsDialog.show();
}

let temporarySentences = [];

const saveToJsonButton = document.querySelector('#writeToJsonButton');

document.getElementById('addSentence').addEventListener('click', () => {
    const newSentenceInput = document.getElementById('newSentence');
    const newSentence = newSentenceInput.value.trim();

    if (newSentence) {
        temporarySentences.push({ sentence: newSentence });
        addNewSentence(newSentence); // Uppdatera användargränssnittet
        newSentenceInput.value = ''; // Rensa input-fältet

    } else {
        alert("Skriv en fråga att spara.");
    }
});

document.getElementById("writeToJsonButton").addEventListener("click", () => {
    if (temporarySentences.length > 0) {
        const saveUrl = currentLanguage === 'en' ? '/save-en' : '/save-sv';
        saveAllSentencesToJSON(saveUrl);
    } else {
        alert("Det finns inga frågor att spara.");
    }
});

function saveAllSentencesToJSON(saveUrl) {
    fetch(saveUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(temporarySentences)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            temporarySentences = [];
            alert("Frågorna har sparats.");
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function deleteSentenceFromJSON(sentence) {
    fetch('/delete-sentence', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: sentence }),
    })

}


function addNewSentence(sentence) {
    const sentenceItem = document.createElement('div');
    sentenceItem.classList.add('sentence-item');

    const sentenceText = document.createElement('p');
    sentenceText.textContent = sentence;
    sentenceItem.appendChild(sentenceText);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'X';

    deleteButton.addEventListener('click', function () {

        sentenceItem.remove();

        const index = temporarySentences.findIndex(obj => obj.sentence === sentence);
        if (index > -1) {
            temporarySentences.splice(index, 1);
        }
    });
    sentenceItem.appendChild(deleteButton);

    document.getElementById('sentenceList').appendChild(sentenceItem);
}


document.getElementById('addSentence').addEventListener('click', function () {
    const newSentenceInput = document.getElementById('newSentence');
    const newSentence = newSentenceInput.value.trim();

    if (newSentence) {
        addNewSentence(newSentence);
        newSentenceInput.value = '';
    }
    console.log(temporarySentences);
});


function displaySentence(sentence) {
    const sentenceItem = document.createElement('div');
    sentenceItem.classList.add('sentence-item');

    const sentenceText = document.createElement('p');
    sentenceText.textContent = sentence;
    sentenceItem.appendChild(sentenceText);
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'X';
    deleteButton.addEventListener('click', function () {
        // Ta bort meningen från användargränssnittet
        sentenceItem.remove();

        // Ta bort meningen från temporarySentences
        const index = temporarySentences.findIndex(obj => obj.sentence === sentence);
        if (index > -1) {
            temporarySentences.splice(index, 1);
        }
        console.log(temporarySentences);
    });
    sentenceItem.appendChild(deleteButton);
    // Lägg till i sentenceList
    document.getElementById('sentenceList').appendChild(sentenceItem);
    console.log(temporarySentences);
}
function loadAndDisplaySentences(jsonFile) {
    fetch(jsonFile)
        .then(response => response.json())
        .then(sentences => {
            const sentenceList = document.getElementById('sentenceList');
            sentenceList.innerHTML = '';
            temporarySentences = [];

            sentences.forEach(sentenceObj => {
                temporarySentences.push(sentenceObj);
                displaySentence(sentenceObj.sentence);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


let currentLanguage = 'en';

document.getElementById('adminEnButton').addEventListener('click', () => {
    currentLanguage = 'en';
    loadAndDisplaySentences('sentences_en.json');
    document.getElementById('adminSvButton').disabled = true;
    document.getElementById('adminSvButton').classList.add('button-disabled');
    document.getElementById('adminEnButton').disabled = false;
    document.getElementById('adminEnButton').classList.remove('button-disabled');
});

document.getElementById('adminSvButton').addEventListener('click', () => {
    currentLanguage = 'sv';
    loadAndDisplaySentences('sentences_sv.json');
    document.getElementById('adminEnButton').disabled = true;
    document.getElementById('adminEnButton').classList.add('button-disabled');
    document.getElementById('adminSvButton').disabled = false;
    document.getElementById('adminSvButton').classList.remove('button-disabled');
});


function showSuccessImage() {
    const overlay = document.getElementById('overlay');
    const correctImageContainer = document.getElementById('correctImageContainer');

    if (correctImageContainer && overlay) {
        overlay.style.display = 'flex'; // Visa overlayn
        correctImageContainer.classList.remove('hidden');
        correctImageContainer.classList.add('zoom-animation');

        setTimeout(() => {
            correctImageContainer.classList.add('hidden');
            overlay.style.display = 'none';
        }, 1500);
    } else {
        console.error('Element not found in the DOM.');
    }
}
