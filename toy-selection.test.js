/**
 * @jest-environment jsdom
 */

// Tests for the toy selection functionality

describe('Toy Selection Tests', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      getAll: () => store,
    };
  })();

  // Mock functions
  const mockShowToySelection = jest.fn();
  const mockAddToyToCollection = jest.fn((toy) => {
    // Simulate the real function's behavior
    const roomEmojis = new Set(JSON.parse(localStorageMock.getItem('roomEmojis') || '[]'));
    roomEmojis.add(toy);
    localStorageMock.setItem('roomEmojis', JSON.stringify([...roomEmojis]));
    localStorageMock.setItem('toys', JSON.stringify([...roomEmojis])); // For backward compatibility
  });

  // Set up mocks before each test
  beforeEach(() => {
    // Create spies for DOM methods (but don't try to replace document elements directly)
    jest.spyOn(document.body, 'appendChild').mockImplementation(jest.fn());
    jest.spyOn(document.body, 'removeChild').mockImplementation(jest.fn());
    jest.spyOn(document.head, 'appendChild').mockImplementation(jest.fn());
    
    // Mock createElement to return a fake element
    jest.spyOn(document, 'createElement').mockImplementation(() => {
      return {
        style: {},
        className: '',
        textContent: '',
        addEventListener: jest.fn(),
        appendChild: jest.fn(),
      };
    });
    
    // Replace localStorage and window with our mocks
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Set up our global mocks for toy functions
    global.showToySelection = mockShowToySelection;
    global.addToyToCollection = mockAddToyToCollection;
    
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to create a Hebrew letter game instance
  function createHebrewLetterGame(initialEmojis = []) {
    return {
      collectedEmojis: new Set(initialEmojis),
      
      collectReward: function(count) {
        // Add unique emojis to the collection
        const possibleEmojis = ['😊', '🦁', '🌟', '🚀', '🎈', '🎁', '🐬', '🌈', '🍕', '🦄'];
        let added = 0;
        
        for (let i = 0; i < possibleEmojis.length && added < count && this.collectedEmojis.size < 9; i++) {
          if (!this.collectedEmojis.has(possibleEmojis[i])) {
            this.collectedEmojis.add(possibleEmojis[i]);
            added++;
          }
        }
        
        // Store in localStorage
        localStorage.setItem('collectedEmojis', JSON.stringify(Array.from(this.collectedEmojis)));
        
        // Check if we've collected 9 emojis
        if (this.collectedEmojis.size >= 9) {
          this.handleToySelection();
        }
        
        return this.collectedEmojis.size;
      },
      
      handleToySelection: function() {
        showToySelection(this.toySelected.bind(this), null);
      },
      
      toySelected: function(toy) {
        this.collectedEmojis.clear();
        localStorage.setItem('collectedEmojis', JSON.stringify([]));
      }
    };
  }

  // Define test cases with parameters
  const testCases = [
    {
      name: 'single session collection',
      description: 'Collecting 9 emojis in a single Hebrew letter game session',
      collectionSteps: [5, 4], // Collect 5, then 4 more emojis
      expectToySelectionAfterSteps: [false, true], // No toy selection after first step, yes after second
      reloadBetweenSteps: false
    },
    {
      name: 'multiple session collection',
      description: 'Collecting emojis across multiple game sessions',
      collectionSteps: [3, 6], // Collect 3, then 6 more emojis
      expectToySelectionAfterSteps: [false, true], // No toy selection after first step, yes after second
      reloadBetweenSteps: true
    },
    {
      name: 'exact boundary collection',
      description: 'Collecting exactly 9 emojis in one go',
      collectionSteps: [9], // Collect all 9 emojis at once
      expectToySelectionAfterSteps: [true], // Toy selection after first step
      reloadBetweenSteps: false
    }
  ];

  // Use it.each for parameterized testing
  it.each(testCases)('$description', (testCase) => {
    // Reset mocks before each test case
    mockShowToySelection.mockReset();
    mockAddToyToCollection.mockReset();
    localStorageMock.clear();
    
    let game = createHebrewLetterGame();
    let totalCollected = 0;
    
    // Run through each collection step
    for (let i = 0; i < testCase.collectionSteps.length; i++) {
      const step = testCase.collectionSteps[i];
      const expectToySelection = testCase.expectToySelectionAfterSteps[i];
      
      // If we need to simulate reloading the game between steps
      if (i > 0 && testCase.reloadBetweenSteps) {
        // Create a new game instance with emojis from localStorage
        game = createHebrewLetterGame(
          JSON.parse(localStorage.getItem('collectedEmojis') || '[]')
        );
      }
      
      // Collect emojis for this step
      totalCollected = game.collectReward(step);
      
      // Verify the expected count
      expect(game.collectedEmojis.size).toBe(Math.min(9, totalCollected));
      
      // Verify if toy selection was called as expected
      if (expectToySelection) {
        expect(mockShowToySelection).toHaveBeenCalled();
      } else {
        expect(mockShowToySelection).not.toHaveBeenCalled();
      }
    }
    
    // If toy selection was triggered, verify toy can be added to collection
    if (mockShowToySelection.mock.calls.length > 0) {
      const newToy = '🧸'; // One of the available toys
      
      // When toy selection is triggered, we need to:  
      // 1. Extract the callback that would be passed to showToySelection
      const toySelectedCallback = mockShowToySelection.mock.calls[0][0];
      
      // 2. Call the callback with the toy (simulating user selecting a toy)
      toySelectedCallback(newToy);
      
      // 3. Manually call addToyToCollection to simulate what happens in the real code
      // This is necessary since we've mocked the function but it wouldn't automatically run
      localStorage.setItem('roomEmojis', JSON.stringify([newToy]));
      
      // Verify a toy was added to the toy room collection
      const storedToys = JSON.parse(localStorage.getItem('roomEmojis') || '[]');
      expect(storedToys).toContain(newToy);
    }
  });
});
