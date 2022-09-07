//the API documentation site https://developers.themoviedb.org/3/

class App {
  static async run() {
    // const movies = await APIService.fetchMovies()
    // HomePage.renderMovies(movies);
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
        Movies.run(movie);
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
        Actors.run(actor);
      });

      actorDiv.appendChild(actorName);
      actorDiv.appendChild(actorImage);
      this.container.appendChild(actorDiv);
    });
  }
}

class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData);
  }
}

class MoviePage {
  static container = document.getElementById("container");
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
  static renderActorSection(actor) {
    MovieSection.renderActor(actor);
  }
}

class MovieSection {
  static renderMovie(movie) {
    MoviePage.container.innerHTML = `
      <div class="movie-header"style="--bg-img: url(${movie.backdropUrl});">
        <div class='black-layer'>
          <div class="row ml-2">
            <div class="col-md-4">
              <img id="movie-backdrop" class="img-border" src=${movie.backdropUrl}>
            </div>
            <div class="col-md-8 d-flex flex-column justify-content-center align-items-start text-white">
              <h2 id="movie-title">${movie.title}</h2>
              <p id="genres">${movie.genres}</p>
              <p id="movie-release-date">${movie.releaseDate}</p>
              <p id="movie-runtime">${movie.runtime}</p>
              <h3>Overview:</h3>
              <p id="movie-overview">${movie.overview}</p>
            </div>
          </div>
        </div>
      </div>
      <h3>Actors:</h3>
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
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
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
              <div class="col-md-2 col-sm-4 col-6 actor-movie text-center">
                <img id="actor-movie-poster" class="img-border" src=${movie.backdropUrl} alt="${movie.title}">
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
              <div class="col-md-2 actor-crew text-center">
                <img id="actor-crew-poster" class="img-border" src=${crew.backdropUrl} alt="${crew.title}">
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
  static async run(actor) {
    const actorData = await APIService.fetchActor(actor.id);

    const actorRoles = await APIService.fetchActorMovies(actor.id);
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
