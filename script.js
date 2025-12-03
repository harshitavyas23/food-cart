// Food favorites app - Simple JavaScript implementation
// Data stored in memory (no persistence)

const foods = [];

// Food-related emojis for random assignment
const foodEmojis = ['🍕', '🍔', '🌮', '🍜', '🍣', '🥗', '🍝', '🍰', '🍩', '🥐', '🍱', '🥘', '🍛', '🥙', '🌯', '🥪', '🍲', '🥧', '🧁', '🍪'];

// DOM Elements
const foodInput = document.getElementById('foodInput');
const addBtn = document.getElementById('addBtn');
const foodList = document.getElementById('foodList');
const foodCount = document.getElementById('foodCount');
const emptyState = document.getElementById('emptyState');

// Get a random food emoji
function getRandomEmoji() {
    return foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
}

// Update the food count display
function updateCount() {
    const count = foods.length;
    foodCount.textContent = `${count} item${count !== 1 ? 's' : ''}`;
}

// Toggle empty state visibility
function toggleEmptyState() {
    if (foods.length === 0) {
        emptyState.classList.remove('hidden');
        foodList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        foodList.classList.remove('hidden');
    }
}

// Create a food item element
function createFoodElement(food) {
    const li = document.createElement('li');
    li.className = 'food-item';
    li.dataset.id = food.id;

    li.innerHTML = `
        <div class="food-info">
            <span class="food-emoji">${food.emoji}</span>
            <span class="food-name">${escapeHtml(food.name)}</span>
        </div>
        <button class="delete-btn" onclick="deleteFood(${food.id})">Remove</button>
    `;

    return li;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add a new food item
function addFood() {
    const name = foodInput.value.trim();

    if (!name) {
        foodInput.focus();
        return;
    }

    // Check for duplicates (case-insensitive)
    const isDuplicate = foods.some(food =>
        food.name.toLowerCase() === name.toLowerCase()
    );

    if (isDuplicate) {
        foodInput.value = '';
        foodInput.placeholder = 'Already in your favorites!';
        setTimeout(() => {
            foodInput.placeholder = 'Enter a delicious food...';
        }, 2000);
        return;
    }

    const food = {
        id: Date.now(),
        name: name,
        emoji: getRandomEmoji()
    };

    foods.push(food);

    const foodElement = createFoodElement(food);
    foodList.insertBefore(foodElement, foodList.firstChild);

    foodInput.value = '';
    foodInput.focus();

    updateCount();
    toggleEmptyState();
}

// Delete a food item
function deleteFood(id) {
    const index = foods.findIndex(food => food.id === id);

    if (index !== -1) {
        foods.splice(index, 1);

        const element = document.querySelector(`[data-id="${id}"]`);
        if (element) {
            element.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                element.remove();
                toggleEmptyState();
            }, 280);
        }

        updateCount();
    }
}

// Event Listeners
addBtn.addEventListener('click', addFood);

foodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addFood();
    }
});

// Initialize
toggleEmptyState();
updateCount();

// Add some sample foods on first load for demo
const sampleFoods = ['Pizza Margherita', 'Sushi Platter', 'Tacos al Pastor'];
sampleFoods.forEach((name, index) => {
    setTimeout(() => {
        foodInput.value = name;
        addFood();
    }, index * 200);
});

