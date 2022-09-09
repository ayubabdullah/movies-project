//the API documentation site https://developers.themoviedb.org/3/
const container = document.getElementById("container");

class App {
  static async run(input) {
    //At initialization, fetches now playing movies else statement and displays them in the homepage, also gets movies by filter or genres from the navbar to display in the homepage
    let movies;
    if (typeof input === "number") {
      movies = await APIService.fetchMoviesByGenre(input);
    } else {
      movies = await APIService.fetchMovies(input);
    }
    HomePage.renderMovies(movies);
  }
}

class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  //Creates the url to look up
  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`;
  }

  //returns movie objects (now playing, popular, top rated, upcoming )
  static async fetchMovies(property) {
    const url = APIService._constructUrl(`movie/${property}`);
    const data = await (await fetch(url)).json();
    //results is the array that has the movies as objects inside
    return data.results.map((movie) => new Movie(movie));
  }

  //returns movies for any genre id
  static async fetchMoviesByGenre(genreId) {
    const data = await (
      await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=ecfdd3d5230c96c392fc9421937894a9&include_adult=false&with_genres=${genreId}`
      )
    ).json();
    //results is the array that has the movies as objects inside
    return data.results.map((movie) => new Movie(movie));
  }
}

class HomePage {
  //displays returned movie objects in the home page
  static renderMovies(movies) {
    //Empty the container div if it has something in it
    if (container.innerText !== "") {
      container.innerText = "";
    }

    const div = document.createElement("div");
    div.setAttribute("class", "homePageMovies row g-3 p-3");
    // div.setAttribute("style", "font-family: Poppins;");

    const moviesContainer = container.appendChild(div);

    movies.forEach((movie) => {
      //creates single movie divisions for the home page for each movie
      const movieDiv = document.createElement("div");
      movieDiv.setAttribute("class", "col-md-4 col-sm-6");
      const movieImage = document.createElement("img");
      movieImage.setAttribute("class", "img-fluid homePageMovieImg");
      movieImage.setAttribute("title", `${movie.overview}`);
      movieImage.src = `${movie.backdropUrl}`;

      const movieTitle = document.createElement("h3");
      movieTitle.textContent = `${movie.title.toUpperCase()}`;
      movieTitle.setAttribute("class", "movie-title text-center");

      // push to movie screen

      movieDiv.appendChild(movieImage);
      movieDiv.appendChild(movieTitle);
      moviesContainer.appendChild(movieDiv);
    });
  }
}

// Search button
const submit = document.querySelector("#submit");
submit.addEventListener("click", (e) => {
  e.preventDefault();
  const search = document.querySelector("#search").value;
  // render movie
  // SearchPage.renderSearchResults(search)
});

class AboutPage {
  static renderAboutPage() {
    container.innerHTML = `
    <div class ="aboutPage" >
      <p>Made by blood, sweat and tears of Ali Rıza Şahin and Ufuk Deniz Demirbilek</p>
      <h3>Contents</h3>
      <ol>
        <li>HomePage</li>
        <ul>
          <li>Filter and Genre Selection</li>
          <li>Display movies according to genre or filter selected from dropdown menu</li>
        </ul>
        <li>Single Movie Page</li>
          <ul>
            <li>Single Movie Details with Trailer and Cast & Crew</li>
            <li>Every card is linked to either single actor or movie page</li>
          </ul>
        <li>Actor List Page</li>
          <ul>
            <li>Display Popular Actors</li>
          </ul>
        <li>Search</li>
          <ul>
            <li>For any given input, searches in people and movies, displays all</li>
            <li>Every card is linked to either single actor or movie page</li>
          </ul>
      </ol>
    </div>`;
  }
}

// movie
class Movie {
  static PICTURE_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.posterPath = json.poster_path;
    this.genres = json.genres;
    this.spokenLanguages = json.spoken_languages;
    this.voteAverage = json.vote_average;
    this.voteCount = json.vote_count;
    this.productionCompanies = json.production_companies;
  }

  //Backdrop url is the pictures of the movies that can be used as a background
  get backdropUrl() {
    return this.backdropPath ? Movie.PICTURE_BASE_URL + this.backdropPath : "";
  }
}

document.addEventListener("DOMContentLoaded", App.run("now_playing"));
