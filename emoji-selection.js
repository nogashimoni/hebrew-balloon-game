function showEmojiSelection(collectedEmojis) {
    // Create modal container
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

    // Create modal content
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

    // Add title
    const title = document.createElement('h2');
    title.textContent = 'בחרו צעצוע לאוסף שלכם!';
    title.style.color = '#333';
    title.style.marginBottom = '20px';

    // Add emojis grid
    const grid = document.createElement('div');
    grid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${Math.min(3, collectedEmojis.size)}, 1fr);
        gap: 15px;
        margin: 20px 0;
    `;

    // Convert Set to Array and create buttons
    Array.from(collectedEmojis).forEach(emoji => {
        const button = document.createElement('button');
        button.textContent = emoji;
        button.style.cssText = `
            font-size: 36px;
            padding: 15px;
            border: 2px solid #FFB6C1;
            border-radius: 10px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        button.onmouseover = () => {
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        };

        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = 'none';
        };

        button.onclick = () => {
            // Add to toys collection
            const toys = JSON.parse(localStorage.getItem('toys') || '[]');
            if (!toys.includes(emoji)) {
                toys.push(emoji);
                localStorage.setItem('toys', JSON.stringify(toys));
            }

            // Play magical sound
            if (typeof playMagicalSound === 'function') {
                playMagicalSound();
            }

            // Remove modal
            document.body.removeChild(modal);

            // Redirect to toys page
            window.location.href = 'toys.html';
        };

        grid.appendChild(button);
    });

    // Assemble modal
    content.appendChild(title);
    content.appendChild(grid);
    modal.appendChild(content);
    document.body.appendChild(modal);
}

// Function to check if all emojis are collected
function checkAllEmojisCollected(collectedEmojis) {
    if (collectedEmojis.size >= 2) {
        showEmojiSelection(collectedEmojis);
        return true;
    }
    return false;
}
