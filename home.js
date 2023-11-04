// // import firebase_admin, credentials and firestore

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getDatabase, ref, set } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js';

// Firebase configuration
const firebaseConfig = {
    databaseURL: 'https://moviefinder-22f21-default-rtdb.firebaseio.com/'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getDatabase(app)
const root = 'watchlist/'

// DOM Elements
const search = document.querySelector('#search');
const submitsearch = document.querySelector('#submit-search');
const movies = document.querySelector('.movies');

// API Key
const apiKey = '722d8d8f';

// Function to create a new reference and set data
function setNewRef(db, path, data) {
    const newRef = ref(db, path);
    set(newRef, data)
    .catch((error) => {
        console.error('Error adding document: ', error);
    });
}

// Add movie to watchlist
function addMovie(movie, data) {
    const movieData = {
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        rating: data.imdbRating,
        runtime: data.Runtime,
        genre: data.Genre,
        plot: data.Plot
    }

    setNewRef(db, root + movie.Title, movieData)
}

// Event Listener for search submit 
submitsearch.addEventListener('click', handleSearchSubmit)

function handleSearchSubmit(e) {
    e.preventDefault();
    const searchValue = search.value;

    //Clear the div
    document.querySelector('.movies').innerHTML = '';
    
    // Fetch API
    fetchMovies(searchValue);
}

function fetchMovies(searchValue) {
    fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {

        // Handle Error
        if(data.Response === 'False'){
            movies.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Movie not found</p>`
        }  else{
            displayMovies(data.Search);
        }
        search.value = '';
})}

function displayMovies(movieList) {
    for (let movie of movieList){
        fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movie.Title}&plot=full`)
        .then((res) => res.json())
        .then((data) => { 
            movies.classList.add('show');
            movies.appendChild(createMovieHTML(movie, data));
        })
    }
}

// create Movie HTML
function createMovieHTML(movie, data) {
    // Create a new div element
    const newDiv = document.createElement('div');
    newDiv.className = 'each-movie';

    //Set its inner HTML
    newDiv.innerHTML = createMovieMarkup(movie, data);
    
    // Add an event listener to the anchor tag
    const addToWatchlist = newDiv.querySelector('#add-to-watchlist')

    addToWatchlist.addEventListener('click', (e) => {
        e.preventDefault();
        addMovie(movie, data);
    })
    
    return newDiv
}

function createMovieMarkup(movie, data){
    return `
        <img src="${movie.Poster}" alt="${movie.Title}"  class='movie-image'>
        <div class='movie-header'>
            <div class='movie-title'>
                <h2 id='movie-title'>${movie.Title} </h2>
                <p class='movie-rating'>⭐${data.imdbRating}</p>
            </div>
            <div class='movie-info'>
                <p class='movie-time'>${data.Runtime}</p>
                <p class='movie-genre'>${data.Genre}</p>
                <a href="#" id='add-to-watchlist'><i class="fa-solid fa-circle-plus"></i>Watchlist</a>
            </div>
            <div class='movie-plot'>
                <p id='movie-plot'>${data.Plot}</p>
            </div>
        </div>
    `
}