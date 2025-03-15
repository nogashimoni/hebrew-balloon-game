/**
 * Toy Selection and Collection System
 * Shared functionality for toy selection, collection and display across games
 */

// Add pop-in animation style if it doesn't exist
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('toy-animations')) {
        const style = document.createElement('style');
        style.id = 'toy-animations';
        style.textContent = `
            @keyframes pop-in {
                0% { transform: scale(0); opacity: 0; }
                70% { transform: scale(1.2); opacity: 1; }
                100% { transform: scale(1); }
            }
            
            .toy-pop-in {
                animation: pop-in 0.5s ease-out forwards;
            }
        `;
        document.head.appendChild(style);
    }
});

// Available toys for selection
const AVAILABLE_TOYS = ['🧸', '🎠', '🎮', '🪀', '🎪', '🎨', '🪜', '🎊', '🐼', '🚂', '🎁', '🔮'];

// Local storage key for toys collection
const TOY_STORAGE_KEY = 'roomEmojis';

/**
 * Shows the toy selection modal with random options
 * @param {Function} onSelectCallback - Optional callback after toy selection
 * @param {Function} onDismiss - Optional callback when modal is dismissed
 */
function showToySelection(onSelectCallback, onDismiss) {
    // Select random toys to show
    const selectedToys = AVAILABLE_TOYS
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    // Create the modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 20px;
        max-width: 90%;
        width: 400px;
        text-align: center;
        direction: rtl;
    `;

    const title = document.createElement('h2');
    title.textContent = 'בחרו צעצוע לאוסף שלכם!';
    title.style.cssText = `
        color: #333;
        margin-bottom: 20px;
        font-size: 24px;
    `;

    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin: 20px 0;
    `;

    selectedToys.forEach(toy => {
        const button = document.createElement('button');
        button.textContent = toy;
        button.style.cssText = `
            font-size: 40px;
            padding: 15px;
            border: 2px solid #ddd;
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: transform 0.2s;
        `;

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', () => {
            // Add toy to collection
            addToyToCollection(toy);
            
            // Show confirmation message
            showConfirmationMessage(toy);
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Call optional callback
            if (typeof onSelectCallback === 'function') {
                onSelectCallback(toy);
            }
        });

        grid.appendChild(button);
    });

    content.appendChild(title);
    content.appendChild(grid);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Add a small test button in the corner
    if (window.location.search.includes('debug=true')) {
        addTestButton(modal);
    }
}

/**
 * Adds a toy to the collection in localStorage
 * @param {string} toy - The emoji to add to collection
 */
function addToyToCollection(toy) {
    // Get current toys collection
    const roomEmojis = new Set(JSON.parse(localStorage.getItem(TOY_STORAGE_KEY) || '[]'));
    
    // Add the new toy
    roomEmojis.add(toy);
    
    // Save back to localStorage
    localStorage.setItem(TOY_STORAGE_KEY, JSON.stringify([...roomEmojis]));
    
    // For backward compatibility with older games
    localStorage.setItem('toys', JSON.stringify([...roomEmojis]));
    
    // Debug log
    console.log('Toy added to collection:', toy);
    console.log('Current collection:', [...roomEmojis]);
}

/**
 * Shows a confirmation message after toy selection
 * @param {string} toy - The selected toy emoji
 */
function showConfirmationMessage(toy) {
    const confirmMessage = document.createElement('div');
    confirmMessage.className = 'message-overlay';
    confirmMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        text-align: center;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.3s ease;
    `;
    confirmMessage.textContent = `${toy} נוסף לחדר המשחקים שלך!`;
    document.body.appendChild(confirmMessage);
    
    // Play celebration sound if function exists
    if (typeof playMagicalSound === 'function') {
        playMagicalSound();
    }
    
    // Remove confirmation after a delay
    setTimeout(() => {
        confirmMessage.style.opacity = '0';
        setTimeout(() => {
            confirmMessage.remove();
        }, 300);
    }, 2000);
}

/**
 * For testing: adds a small diagnostic button that shows the current toy collection
 * @param {HTMLElement} parentElement - Element to append the test button to
 */
function addTestButton(parentElement) {
    const testButton = document.createElement('button');
    testButton.textContent = '🧪';
    testButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 20px;
        padding: 5px 10px;
        background: rgba(255,255,255,0.8);
        border: 1px solid #ddd;
        border-radius: 5px;
        cursor: pointer;
    `;
    
    testButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const toys = JSON.parse(localStorage.getItem(TOY_STORAGE_KEY) || '[]');
        alert(`Current toy collection (${toys.length} toys):\n${toys.join(' ')}`);
    });
    
    parentElement.appendChild(testButton);
}

/**
 * Checks the current toy collection
 * @returns {Array} Array of collected toys
 */
function getToyCollection() {
    return JSON.parse(localStorage.getItem(TOY_STORAGE_KEY) || '[]');
}

/**
 * Resets the toy collection (for testing)
 */
function resetToyCollection() {
    localStorage.setItem(TOY_STORAGE_KEY, '[]');
    localStorage.setItem('toys', '[]');
    console.log('Toy collection reset');
}
