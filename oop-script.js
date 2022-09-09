//the API documentation site https://developers.themoviedb.org/3/

class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    HomePage.renderMovies(movies);
    const actors = await APIService.fetchActors();
    HomePage.renderActors(actors);
  }
}

class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static async fetchMovies() {
    const url = APIService._constructUrl(`movie/now_playing`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((movie) => new Movie(movie));
  }
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new Movie(data);
  }
  static async fetchMovieTrailer(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/videos`);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  static async fetchMovieRecommendations(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/recommendations`);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  static async fetchActors() {
    const url = APIService._constructUrl(`person/popular`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((actor) => new Actor(actor));
  }
  static async fetchActor(actorId) {
    const url = APIService._constructUrl(`person/${actorId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new Actor(data);
  }
  static async fetchActorMovies(actorId) {
    const url = APIService._constructUrl(`person/${actorId}/movie_credits`);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  static async fetchMovieActors(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}/credits`);
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`;
  }
}

class HomePage {
  static container = document.getElementById("container");
  static renderMovies(movies) {
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      const movieImage = document.createElement("img");
      movieImage.src = `${movie.backdropUrl}`;
      const movieTitle = document.createElement("h3");
      movieTitle.textContent = `${movie.title}`;
      movieDiv.addEventListener("click", function () {
        Movies.run(movie.id);
      });
      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(movieImage);
      this.container.appendChild(movieDiv);
    });
  }
  static renderActors(actors) {
    actors.forEach((actor) => {
      const actorDiv = document.createElement("div");
      const actorImage = document.createElement("img");
      actorImage.src = `${actor.profileUrl}`;
      const actorName = document.createElement("h3");
      actorName.textContent = `${actor.name}`;
      actorImage.addEventListener("click", function () {
        Actors.run(actor.id);
      });

      actorDiv.appendChild(actorName);
      actorDiv.appendChild(actorImage);
      this.container.appendChild(actorDiv);
    });
  }
}

class Movies {
  static async run(movieId) {
    const movieData = await APIService.fetchMovie(movieId);
    const movieActors = await APIService.fetchMovieActors(movieId);
    const movieTrailer = await APIService.fetchMovieTrailer(movieId);
    const movieRecommendations = await APIService.fetchMovieRecommendations(
      movieId
    );
    movieData.actors = movieActors.cast.map((actor) => new Actor(actor));
    movieData.trailer = movieTrailer.results[0];
    movieData.recommendations = movieRecommendations.results.map(
      (movie) => new Movie(movie)
    );
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData);
  }
}

class MoviePage {
  static container = document.getElementById("container");
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
}

class MovieSection {
  static renderMovie(movie) {
    MoviePage.container.innerHTML = `
      <div class="movie-header"style="--bg-img: url(${movie.backdropUrl});">
        <div class='black-layer'>
          <div class="row ml-2">
            <div class="col-md-4">
              <img id="movie-backdrop" class="img-border" src=${
                movie.posterUrl
              }>
            </div>
            <div class="col-md-8 d-flex flex-column justify-content-center align-items-start text-white">
              <h2 id="movie-title">${movie.title}</h2>
              <p id="genres"><span class="text-uppercase">genres: </span>${movie.genres.map(
                (genre) => ` <span>${genre.name}</span>`
              )}</p>
              <p id="vote"><span class="text-uppercase">vote count: </span>${
                movie.voteCount
              }</p>
              <p><span class="text-uppercase">vote average: </span>${
                movie.voteAverage
              }</p>
              <p id="spoken-language"><span class="text-uppercase">Spoken Language: </span>${movie.spokenLanguages.map(
                (spokenLanguage) => ` <span>${spokenLanguage.name}</span>`
              )}</p>
              <p id="movie-releaseDate"><span class="text-uppercase">release Date: </span>${
                movie.releaseDate
              }</p>
              <p id="movie-runtime"><span class="text-uppercase">runtime: </span>${
                movie.runtime
              }</p>
              <h3>Overview:</h3>
              <p id="movie-overview">${movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="actor-page-background pt-2 d-flex flex-column justify-content-center align-items-center">
        <h3 class = "text-uppercase mt-3"><span class="first-letter">A</span>ctors</h3>
        ${MovieSection.renderMovieActors(movie.actors)}
        <h3 class = "text-uppercase mt-3"><span class="first-letter">T</span>railer</h3>
        <iframe class="trailer" src="https://www.youtube.com/embed/${
          movie.trailer.key
        }" allowfullscreen=""></iframe>
        <h3 class = "text-uppercase mt-3"><span class="first-letter">M</span>ovies you might like</h3>
        ${MovieSection.renderMovieRecommendations(movie.recommendations)}
        <h3 class = "text-uppercase mt-3"><span class="first-letter">P</span>roduction <span class="first-letter">C</span>ompanies</h3>
        ${MovieSection.renderMovieCompanies(movie.customProductionCompanies)}
      </div>
    `;
  }
  static renderMovieActors(movieActors) {
    return `
        <div class="actor-movies">
          <div class="row justify-content-center">
            ${movieActors
              .slice(0, 6)
              .map((actor) => {
                return `
              <div class="col-md-2 col-sm-4 col-6 actor-movie text-center mb-5 pointer" onclick="Actors.run(${actor.id})">
                <img id="actor-movie-poster" class="img-border" src=${actor.profileUrl} alt=${actor.name}>
                <p>${actor.name}</p>
              </div>
              `;
              })
              .join("")}
          </div>
        </div>
      
    `;
  }
  static renderMovieRecommendations(movieRecommendations) {
    return `
      
        <div class="actor-movies">
          <div class="row justify-content-center">
            ${movieRecommendations
              .slice(0, 6)
              .map((movie) => {
                return `
              <div class="col-md-2 col-sm-4 col-6 actor-movie text-center mb-5" onclick="Movies.run(${movie.id})">
                <img id="actor-movie-poster" class="img-border" src=${movie.posterUrl} alt=${movie.title}>
                <p>${movie.title}</p>
              </div>
              `;
              })
              .join("")}
          </div>
        </div>
      
    `;
  }
  static renderMovieCompanies(movieCompanies) {
    return `
        <div class="actor-movies">
          <div class="row justify-content-center">
            ${movieCompanies
              .map((company) => {
                return `
              <div class="col-md-4 col-6 actor-movie text-center mb-5">
                <p>${company.name}</p>
                <img id="company-logo" src=${company.logo} alt=${company.name}>
              </div>
              `;
              })
              .join("")}
          </div>
        </div>
      
    `;
  }
}

class Movie {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.posterPath = json.poster_path;
    this.productionCompanies = json.production_companies;
    this.voteCount = json.vote_count;
    this.voteAverage = json.vote_average;
    this.spokenLanguages = json.spoken_languages;
    this.genres = json.genres;
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
  get posterUrl() {
    return this.posterPath ? Movie.BACKDROP_BASE_URL + this.posterPath : "";
  }
  get customProductionCompanies() {
    return this.productionCompanies
      ? this.productionCompanies.map((productionCompanie) => {
          return {
            name: productionCompanie.name,
            logo: Movie.BACKDROP_BASE_URL + productionCompanie.logo_path,
          };
        })
      : "";
  }
}

class ActorPage {
  static container = document.getElementById("container");
  static renderActorSection(actor) {
    ActorSection.renderActor(actor);
  }
}

class ActorSection {
  static renderActor(actor) {
    const gender = {
      1: "female",
      2: "male",
    };
    ActorPage.container.innerHTML = `
      <div class="actor-page-background">
        <div class="actor-header">
          <div class="row ml-2">
            <div class="col-md-4 ">
              <img id="actor-profile" class="img-border" src=${
                actor.profileUrl
              }>
            </div>
            <div class="col-md-8 d-flex flex-column justify-content-center align-items-start text-white">
              <h2 id="actor-name">${actor.name}</h2>
              <p id="actor-gender"><span class="text-uppercase">gender: </span>${
                gender[actor.gender]
              }</p>
              <p id="actor-popularity"><span class="text-uppercase">popularity: </span>${
                actor.popularity
              }</p>
              <p id="actor-birthday"><span class="text-uppercase">birthday: </span>${
                actor.birthday
              }</p>
              <p class="text-uppercase">biography:</p>
              <p id="actor-biography">${actor.biography}</p>
            </div>
          </div>
        </div>
        <div class = "my-5">
          <h3 class = "text-center text-uppercase mt-5"><span class="first-letter">M</span>ovies <span class="first-letter">I</span>n <span class="first-letter">C</span>ast</h3>
          ${ActorSection.renderActorMovies(actor.movies)}
        </div>
        <div class="my-5">
          ${
            actor.crews.length
              ? `<h3 class = "text-center text-uppercase mt-5"><span class="first-letter">M</span>ovies <span class="first-letter">I</span>n <span class="first-letter">C</span>rew</h3> ${ActorSection.renderActorCrews(
                  actor.crews
                )}`
              : ""
          }
        </div>
        </div>
      `;
  }
  static renderActorMovies(actorMovies) {
    return `
      
        <div class="actor-movies">
          <div class="row justify-content-center">
            ${actorMovies
              .slice(0, 6)
              .map((movie) => {
                return `
              <div class="col-md-2 col-sm-4 col-6 actor-movie text-center mb-5" onclick="Movies.run(${movie.id})">
                <img id="actor-movie-poster" class="img-border" src=${movie.posterUrl} alt=${movie.title}>
                <p>${movie.title}</p>
              </div>
              `;
              })
              .join("")}
          </div>
        </div>
      
    `;
  }
  static renderActorCrews(actorCrews) {
    return `
        <div class="actor-crews">
          <div class="row justify-content-center">
            ${actorCrews
              .slice(0, 6)
              .map((crew) => {
                return `
              <div class="col-md-2 col-sm-4 col-6 actor-crew text-center mb-5" onclick="Movies.run(${crew.id})">
                <img id="actor-crew-poster" class="img-border" src=${crew.posterUrl} alt=${crew.title}>
                <p>${crew.title}</p>
              </div>
              `;
              })
              .join("")}
          </div>
        </div>
    `;
  }
}

class Actors {
  static async run(actorId) {
    const actorData = await APIService.fetchActor(actorId);
    const actorRoles = await APIService.fetchActorMovies(actorId);
    actorData.movies = actorRoles.cast.map((movie) => new Movie(movie));
    actorData.crews = actorRoles.crew.map((movie) => new Movie(movie));
    ActorPage.renderActorSection(actorData);
    // APIService.fetchActors(actorData)
    // APIService.fetchMovies(actorData)
  }
}

class Actor {
  static PROFILE_BASE_URL = "https://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.id = json.id;
    this.name = json.name;
    this.profilePath = json.profile_path;
    this.biography = json.biography;
    this.birthday = json.birthday;
    this.gender = json.gender;
    this.popularity = json.popularity;
  }
  get profileUrl() {
    return this.profilePath ? Actor.PROFILE_BASE_URL + this.profilePath : "";
  }
}
document.addEventListener("DOMContentLoaded", App.run);
