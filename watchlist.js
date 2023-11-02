import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set, get } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

const firebaseConfig = {
    databaseURL: 'https://moviefinder-22f21-default-rtdb.firebaseio.com/'
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const watchlistDb = ref(db, 'watchlist')
const addMovie = document.querySelector('.add-movie');

// Read data from firebase

function readData() {
    addMovie.innerHTML = ''
    get(watchlistDb).then((snapshot) => {
        if (snapshot.exists()) {
            addMovie.innerHTML = '';
            const movies = snapshot.val();
            const keys = Object.keys(movies);



            for (let key of keys) {
                addMovie.classList.add('show');
                addMovie.appendChild(createMovieHTML(movies[key], key));
            }
        } else {
            addMovie.innerHTML = `
                <p>Your watchlist is looking a little empty...</p>
                <a href="home.html"><i class="fa-solid fa-circle-plus"></i>Let's add some movies!</a>`
        }
    }).catch((error) => {
        console.error(error);
    });
}


// Create movie HTML
function createMovieHTML(movie, key) {
    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.className = 'each-movie';

    //Set its inner HTML
    newDiv.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}"  class='movie-image'>
                <div class='movie-header'>
                    <div class='movie-title'>
                        <h2 id='movie-title'>${movie.title} </h2>
                        <p class='movie-rating'>⭐${movie.rating}</p>
                    </div>
                    <div class='movie-info'>
                        <p class='movie-time'>${movie.runtime}</p>
                        <p class='movie-genre'>${movie.genre}</p>
                        <button id='remove-movie'><i class="fa-solid fa-circle-minus"></i>Delete</button>
                    </div>
                    <div class='movie-plot'>
                        <p id='movie-plot'>${movie.plot}</p>
                    </div>
                </div>
            `

        // Add an event listener to the anchor tag
        const removeWatchlist = newDiv.querySelector('#remove-movie')

        removeWatchlist.addEventListener('click', (e) => {
            // e.preventDefault();
            remove(key);
        })

    return newDiv
}

// Remove movie from watchlist
function remove(key) {
    const movieRef = ref(db, 'watchlist/' + key);
    set(movieRef, null);
    readData();
}

readData();