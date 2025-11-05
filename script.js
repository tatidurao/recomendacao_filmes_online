const apiBase = "https://560adaf73883.ngrok-free.app"; // substitua pelo link gerado pelo ngrok

const movieContainer = document.getElementById("movieContainer");
const actionButtons = document.getElementById("actionButtons");

const popularBtn = document.getElementById("popularBtn");
const recommendedBtn = document.getElementById("recommendedBtn");
const likedBtn = document.getElementById("likedBtn");

const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");
const didNotWatchBtn = document.getElementById("didNotWatchBtn");

let currentMovies = [];
let currentIndex = 0;

// Carrega filmes de rota específica
async function loadMovies(endpoint, single = false) {
  try {
    const response = await fetch(`${apiBase}${endpoint}`);
    const json = await response.json();
    const data = json.data;
    console.log(data)

    if (!data) return;

    currentMovies = Array.isArray(data) ? data : [data];
    currentIndex = 0;
    actionButtons.classList.toggle("hidden", !single);

    renderMovies(single);
  } catch (err) {
    console.error("Erro ao carregar filmes:", err);
  }
}

function renderMovies(single) {
  movieContainer.innerHTML = "";

  if (single) {
    const movie = currentMovies[currentIndex];
    if (movie) {
      movieContainer.innerHTML = createMovieCard(movie);
    } else {
      movieContainer.innerHTML = "<h2>Sem mais filmes disponíveis</h2>";
    }
  } else {
    currentMovies.forEach((movie) => {
      movieContainer.innerHTML += createMovieCard(movie);
    });
  }
}

function createMovieCard(movie) {
  const stars =
    "★".repeat(Math.round(movie.rating)) +
    "☆".repeat(5 - Math.round(movie.rating));

  return `
    <div class="movie-card">
      <img src="${movie.poster_link}" alt="${movie.original_title}" />
      <div class="movie-info">
        <h3>${movie.original_title}</h3>
        <p>${movie.release_date} | ${movie.duration} min</p>
        <p class="stars">${stars}</p>
      </div>
    </div>
  `;
}

async function sendAction(endpoint) {
  try {
    const res = await fetch(`${apiBase}${endpoint}`); // apenas GET
    const json = await res.json();
    console.log(json.status);
    currentIndex++;
    loadMovies("/moveis", true);
  } catch (err) {
    console.error("Erro ao enviar ação:", err);
  }
}

// Navegação
popularBtn.addEventListener("click", () => loadMovies("/popular_movies"));
recommendedBtn.addEventListener("click", () => loadMovies("/recommended_movies"));
likedBtn.addEventListener("click", () => loadMovies("/liked"));

// Botões de ação
likeBtn.addEventListener("click", () => sendAction("/like"));
dislikeBtn.addEventListener("click", () => sendAction("/dislike"));
didNotWatchBtn.addEventListener("click", () => sendAction("/did_not_watch"));

// Inicializa na tela principal
loadMovies("/moveis", true);
