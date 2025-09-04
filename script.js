// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const resultsContainer = document.getElementById('resultsContainer');
const noResults = document.getElementById('noResults');
const errorDiv = document.getElementById('error');

// API base URL

const API_BASE_URL = 'https://api.tvmaze.com';

// Search function
async function searchShows(query) {
    if (!query.trim()) {
        showError('Please enter a search term');
        return;
    }

    // Show loading state
    showLoading(true);
    hideError();
    clearResults();
    
    try {
        const response = await fetch(`${API_BASE_URL}/search/shows?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        showLoading(false);

        if (data.length === 0) {
            showNoResults(true);
        } else {
            displayResults(data);
        }

    } catch (error) {
        showLoading(false);
        showError(`Error fetching data: ${error.message}`);
        console.error('Search error:', error);
    }
}

// Display search results
function displayResults(shows) {
    resultsContainer.innerHTML = '';
    showNoResults(false);

    shows.forEach(item => {
        const show = item.show;
        const card = createShowCard(show);
        resultsContainer.appendChild(card);
    });
}

// Create individual show card
function createShowCard(show) {
    const card = document.createElement('div');
    card.className = 'show-card';

    // Handle missing image
    const imageUrl = show.image ? show.image.medium : 'https://via.placeholder.com/210x295/667eea/ffffff?text=No+Image';
    
    // Clean up HTML from summary
    const summary = show.summary ? 
        show.summary.replace(/<[^>]*>/g, '') : 'No summary available';

    // Format genres
    const genres = show.genres && show.genres.length > 0 ? 
        show.genres.join(', ') : 'Unknown';

    // Format rating
    const rating = show.rating && show.rating.average ? 
        show.rating.average.toFixed(1) : 'N/A';

    card.innerHTML = `
        <img src="${imageUrl}" alt="${show.name}" class="show-image" 
             onerror="this.src='https://via.placeholder.com/210x295/667eea/ffffff?text=No+Image'">
        <div class="show-info">
            <div class="show-title">${show.name}</div>
            <div class="show-meta">
                <span class="show-rating">★ ${rating}</span>
                <span class="show-genres">${genres}</span>
            </div>
            <div class="show-summary">${summary}</div>
        </div>
    `;

    return card;
}

// Utility functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showNoResults(show) {
    noResults.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function clearResults() {
    resultsContainer.innerHTML = '';
    showNoResults(false);
}

// Event listeners
searchBtn.addEventListener('click', () => {
    const query = searchInput.value;
    searchShows(query);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value;
        searchShows(query);
    }
});

// Focus on input when page loads
window.addEventListener('load', () => {
    searchInput.focus();
});

// Initial search with "girls" to demonstrate
window.addEventListener('load', () => {
    setTimeout(() => {
        searchInput.value = 'girls';
        searchShows('girls');
    }, 500);
});