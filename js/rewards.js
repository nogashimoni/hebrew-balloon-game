// Available toys that can be won as rewards
const availableToys = [
    {
        id: 'teddy',
        name: 'דובי חמוד',
        image: 'images/toys/teddy.png'
    },
    {
        id: 'robot',
        name: 'רובוט חכם',
        image: 'images/toys/robot.png'
    },
    {
        id: 'unicorn',
        name: 'חד קרן קסום',
        image: 'images/toys/unicorn.png'
    },
    {
        id: 'dinosaur',
        name: 'דינוזאור ירוק',
        image: 'images/toys/dinosaur.png'
    },
    {
        id: 'spaceship',
        name: 'חללית מהירה',
        image: 'images/toys/spaceship.png'
    },
    {
        id: 'train',
        name: 'רכבת צבעונית',
        image: 'images/toys/train.png'
    }
];

// Function to show reward selection modal
function showRewardModal(score, total) {
    // Only show rewards for perfect or near-perfect scores
    if (score < total - 1) return;

    // Get previously won toys
    const myToys = JSON.parse(localStorage.getItem('myToys') || '[]');
    const wonToyIds = new Set(myToys.map(t => t.id));
    
    // Filter out toys that were already won
    const availableRewards = availableToys.filter(toy => !wonToyIds.has(toy.id));
    
    // If all toys were collected, don't show modal
    if (availableRewards.length === 0) {
        alert('כל הכבוד! 🎉\nאספת את כל הצעצועים!');
        return;
    }

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // Get 3 random rewards (or less if not enough available)
    const rewardChoices = availableRewards
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(3, availableRewards.length));

    // Create modal content
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
    `;
    content.innerHTML = `
        <h2>כל הכבוד! 🎉</h2>
        <p>השגת ${score} מתוך ${total} נקודות!</p>
        <p>בחר/י צעצוע:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
            ${rewardChoices.map(toy => `
                <div class="toy-choice" style="cursor: pointer; padding: 10px; border: 2px solid #ddd; border-radius: 10px;">
                    <img src="${toy.image}" alt="${toy.name}" style="width: 150px; height: 150px; object-fit: contain;">
                    <p style="margin: 10px 0;">${toy.name}</p>
                </div>
            `).join('')}
        </div>
    `;

    // Add click handlers for toy selection
    content.querySelectorAll('.toy-choice').forEach((choice, index) => {
        choice.addEventListener('click', () => {
            const selectedToy = rewardChoices[index];
            // Add toy to collection
            myToys.push({
                ...selectedToy,
                date: new Date().toISOString()
            });
            localStorage.setItem('myToys', JSON.stringify(myToys));
            
            // Remove modal
            document.body.removeChild(modal);
            
            // Show success message
            alert(`מזל טוב! ${selectedToy.name} נוסף לאוסף הצעצועים שלך! 🎉`);
        });
    });

    modal.appendChild(content);
    document.body.appendChild(modal);
}

// Export for use in games
window.showRewardModal = showRewardModal;
