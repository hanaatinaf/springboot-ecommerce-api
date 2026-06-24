/* ================================================================
   JAVASCRIPT FUNDAMENTALS GUIDE
   ----------------------------------------------------------------
   Concepts covered in this file:
     1. Arrays of objects (data model)
     2. DOM selection — querySelector, getElementById
     3. DOM manipulation — innerHTML, createElement, classList
     4. Event listeners — click, input
     5. Array methods — filter, forEach, find
     6. Functions — declaration, parameters, return values
     7. Template literals (backtick strings)
     8. localStorage — persist data between page reloads
     9. Modules-style organisation (data → logic → UI → init)
================================================================ */


/* ================================================================
   1. DATA MODEL
   An array of objects. Each object represents one destination.
   Properties: id, title, location, category, difficulty,
               distance, image, description
================================================================ */
const destinations = [
  {
    id: 1,
    title: "Torres del Paine Circuit",
    location: "Patagonia, Chile",
    category: "mountain",
    difficulty: "hard",
    distance: "130 km",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    description: "One of the world's most spectacular long-distance treks, passing glaciers, granite spires, and turquoise lakes."
  },
  {
    id: 2,
    title: "Redwood Forest Trail",
    location: "California, USA",
    category: "forest",
    difficulty: "easy",
    distance: "8 km",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80",
    description: "Walk among the tallest trees on Earth. A serene path through ancient coastal redwoods, perfect for beginners."
  },
  {
    id: 3,
    title: "Cinque Terre Blue Path",
    location: "Liguria, Italy",
    category: "coastal",
    difficulty: "medium",
    distance: "12 km",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    description: "Link five colourful villages perched on sea cliffs. Stunning Mediterranean views at every turn."
  },
  {
    id: 4,
    title: "Bryce Canyon Rim Trail",
    location: "Utah, USA",
    category: "desert",
    difficulty: "easy",
    distance: "5 km",
    image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600&q=80",
    description: "Walk the canyon rim past thousands of red and orange hoodoo spires — like hiking on another planet."
  },
  {
    id: 5,
    title: "Snowdon Summit via Pyg Track",
    location: "Snowdonia, Wales",
    category: "mountain",
    difficulty: "medium",
    distance: "14 km",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
    description: "The classic route to the highest peak in Wales, rewarding hikers with sweeping views over the Irish Sea."
  },
  {
    id: 6,
    title: "Daintree Rainforest Walk",
    location: "Queensland, Australia",
    category: "forest",
    difficulty: "easy",
    distance: "6 km",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    description: "Step into the world's oldest tropical rainforest, home to exotic birds and ancient ferns."
  },
  {
    id: 7,
    title: "Amalfi Coast Path of the Gods",
    location: "Campania, Italy",
    category: "coastal",
    difficulty: "medium",
    distance: "7 km",
    image: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=600&q=80",
    description: "A dramatic cliffside trail high above the Amalfi Coast with breathtaking views of the Tyrrhenian Sea."
  },
  {
    id: 8,
    title: "Wadi Rum Desert Trek",
    location: "Aqaba, Jordan",
    category: "desert",
    difficulty: "hard",
    distance: "25 km",
    image: "https://images.unsplash.com/photo-1519455953755-af066f52f1a9?w=600&q=80",
    description: "Trek across rose-red sand dunes and ancient rock formations in one of the world's most dramatic landscapes."
  },
  {
    id: 9,
    title: "Lauterbrunnen Valley Loop",
    location: "Bern Alps, Switzerland",
    category: "mountain",
    difficulty: "medium",
    distance: "18 km",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    description: "Hike past 72 waterfalls in a glacially carved valley beneath the iconic Eiger, Mönch, and Jungfrau peaks."
  }
];

/* ================================================================
   2. QUOTES DATA
   Another array — this one stores plain strings.
================================================================ */
const quotes = [
  { text: "The mountains are calling and I must go.", author: "John Muir" },
  { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir" },
  { text: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "Of all the paths you take in life, make sure a few of them are dirt.", author: "John Muir" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" }
];


/* ================================================================
   3. STATE
   Variables that track what's currently happening in the UI.
================================================================ */
let activeCategory = "all";   // which filter button is active
let searchTerm = "";          // current text in the search box
let favorites = loadFavorites(); // IDs of favourited destinations


/* ================================================================
   4. LOCALSTORAGE HELPERS
   localStorage lets you save data in the browser so it persists
   even after the page is refreshed.
================================================================ */
function loadFavorites() {
  // JSON.parse converts a saved string back into an array
  const saved = localStorage.getItem("hikingFavorites");
  return saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
  // JSON.stringify converts an array into a string for storage
  localStorage.setItem("hikingFavorites", JSON.stringify(favorites));
}


/* ================================================================
   5. FILTER LOGIC
   Pure function: takes data in, returns filtered data out.
   Doesn't touch the DOM — just does the calculation.
================================================================ */
function getFilteredDestinations() {
  return destinations.filter(function (dest) {
    // Check category matches (or "all" is selected)
    const categoryMatch =
      activeCategory === "all" || dest.category === activeCategory;

    // Check search term appears in title or location (case-insensitive)
    const term = searchTerm.toLowerCase();
    const searchMatch =
      term === "" ||
      dest.title.toLowerCase().includes(term) ||
      dest.location.toLowerCase().includes(term);

    // Both conditions must be true
    return categoryMatch && searchMatch;
  });
}


/* ================================================================
   6. BUILD A CARD — returns an HTML string using template literals
   Template literals (backtick strings) let you embed expressions
   with ${...} syntax, making HTML generation clean and readable.
================================================================ */
function buildCardHTML(dest) {
  const isFav = favorites.includes(dest.id);

  // Capitalise first letter of difficulty
  const diffLabel = dest.difficulty.charAt(0).toUpperCase() + dest.difficulty.slice(1);

  return `
    <div class="card" data-id="${dest.id}">
      <div class="card-img-wrapper">
        <img
          class="card-img"
          src="${dest.image}"
          alt="${dest.title}"
          loading="lazy"
        />
        <span class="card-badge">${dest.category}</span>
        <button
          class="fav-btn ${isFav ? "active" : ""}"
          data-id="${dest.id}"
          aria-label="${isFav ? "Remove from favourites" : "Add to favourites"}"
          title="${isFav ? "Remove from favourites" : "Add to favourites"}"
        >
          ${isFav ? "❤️" : "🤍"}
        </button>
      </div>
      <div class="card-body">
        <h3 class="card-title">${dest.title}</h3>
        <p class="card-location">${dest.location}</p>
        <p class="card-description">${dest.description}</p>
        <div class="card-meta">
          <span class="difficulty ${dest.difficulty}">${diffLabel}</span>
          <span>🥾 ${dest.distance}</span>
        </div>
      </div>
    </div>
  `;
}


/* ================================================================
   7. RENDER DESTINATIONS
   Gets filtered data, builds HTML strings, injects into the DOM.
================================================================ */
function renderDestinations() {
  const grid = document.getElementById("destinationsGrid");
  const noResults = document.getElementById("noResults");

  const filtered = getFilteredDestinations();

  if (filtered.length === 0) {
    grid.innerHTML = "";
    noResults.classList.remove("hidden");
  } else {
    noResults.classList.add("hidden");
    // .map() transforms each destination into an HTML string,
    // .join("") merges the array into one big string
    grid.innerHTML = filtered.map(buildCardHTML).join("");
  }
}


/* ================================================================
   8. RENDER FAVORITES
================================================================ */
function renderFavorites() {
  const grid = document.getElementById("favoritesGrid");
  const noFav = document.getElementById("noFavorites");

  if (favorites.length === 0) {
    grid.innerHTML = "";
    noFav.classList.remove("hidden");
    return;
  }

  noFav.classList.add("hidden");

  // Find destination objects whose id is in the favorites array
  const favDests = destinations.filter(function (d) {
    return favorites.includes(d.id);
  });

  grid.innerHTML = favDests.map(buildCardHTML).join("");
}


/* ================================================================
   9. TOGGLE FAVOURITE
   Called when a heart button is clicked.
   Demonstrates: array indexOf, splice (remove), push (add).
================================================================ */
function toggleFavorite(id) {
  const index = favorites.indexOf(id);

  if (index === -1) {
    // Not in the list → add it
    favorites.push(id);
  } else {
    // Already in the list → remove it
    favorites.splice(index, 1);
  }

  saveFavorites();
  renderDestinations();
  renderFavorites();
}


/* ================================================================
   10. SHOW A RANDOM QUOTE
================================================================ */
function showRandomQuote() {
  // Math.random() returns 0–1; multiply by array length and floor it
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  document.getElementById("inspirationQuote").textContent = `"${quote.text}"`;
  document.getElementById("quoteAuthor").textContent = `— ${quote.author}`;
}


/* ================================================================
   11. EVENT LISTENERS
   "Listen" for user actions and call the right function.
   addEventListener(eventType, callbackFunction)
================================================================ */
function setupEventListeners() {

  // --- Filter buttons ---
  // querySelectorAll returns a NodeList of ALL matching elements
  const filterBtns = document.querySelectorAll(".filter-btn");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Remove .active from the previously active button
      document.querySelector(".filter-btn.active").classList.remove("active");
      // Add .active to the clicked button
      btn.classList.add("active");

      // Read the data-category attribute we set in the HTML
      activeCategory = btn.dataset.category;
      renderDestinations();
    });
  });

  // --- Search input (live search as you type) ---
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", function () {
    searchTerm = searchInput.value;
    renderDestinations();
  });

  // --- Search button ---
  document.getElementById("searchBtn").addEventListener("click", function () {
    searchTerm = searchInput.value;
    renderDestinations();
    // Scroll the destinations section into view
    document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
  });

  // --- Heart / favourite buttons (event delegation) ---
  // Instead of attaching a listener to every card button,
  // we listen on the container. This works for dynamically added cards too.
  document.getElementById("destinationsGrid").addEventListener("click", function (event) {
    const btn = event.target.closest(".fav-btn");
    if (!btn) return; // click was not on a fav button

    const id = Number(btn.dataset.id); // dataset values are always strings → convert to number
    toggleFavorite(id);
  });

  document.getElementById("favoritesGrid").addEventListener("click", function (event) {
    const btn = event.target.closest(".fav-btn");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    toggleFavorite(id);
  });

  // --- New quote button ---
  document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);
}


/* ================================================================
   12. INITIALISE THE APP
   Runs once when the page loads. Sets everything up in order.
================================================================ */
function init() {
  renderDestinations();
  renderFavorites();
  setupEventListeners();
  // Show a random quote on first load
  showRandomQuote();
}

// The script tag is at the bottom of <body>, so the DOM is ready.
init();
