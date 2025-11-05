// 🔗 Substitua pelo link ATUAL do seu ngrok
const apiBase = "https://6e456367f813.ngrok-free.app";

// Referências de elementos da interface
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

// Função para carregar filmes de uma rota específica
async function loadMovies(endpoint, single = false) {
  try {
    console.log(`📡 Requisição para: ${apiBase}${endpoint}`);
    const response = await fetch(`${apiBase}${endpoint}`);
    
    // Verifica se a resposta é válida
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const json = await response.json();
    console.log("✅ Resposta recebida:", json);

    const data = json.data;
    if (!data) {
      movieContainer.innerHTML = "<h2>Sem mais filmes disponíveis</h2>";
      return;
    }

    currentMovies = Array.isArray(data) ? data : [data];
    currentIndex = 0;

    actionButtons.classList.toggle("hidden", !single);
    renderMovies(single);

  } catch (err) {
    console.error("❌ Erro ao carregar filmes:", err);
    movieContainer.innerHTML = `<p style="color:red;">Erro ao carregar filmes. Verifique o console.</p>`;
  }
}

// Função para renderizar os filmes na tela
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

// Função que monta o HTML de cada filme
function createMovieCard(movie) {
  const stars = "★".repeat(Math.round(movie.rating)) + "☆".repeat(5 - Math.round(movie.rating));

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

// Função para enviar ações (like, dislike, did_not_watch)
async function sendAction(endpoint) {
  try {
    console.log(`📨 Enviando ação para: ${apiBase}${endpoint}`);
    const res = await fetch(`${apiBase}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentMovies[currentIndex] || {})
    });

    if (!res.ok) {
      throw new Error(`Erro HTTP: ${res.status}`);
    }

    const json = await res.json();
    console.log(`✅ Ação ${endpoint} enviada:`, json);

    // Avança para o próximo filme
    currentIndex++;
    loadMovies("/moveis", true);

  } catch (err) {
    console.error(`❌ Erro ao enviar ação (${endpoint}):`, err);
  }
}

// Botões de navegação
popularBtn.addEventListener("click", () => loadMovies("/popular_movies"));
recommendedBtn.addEventListener("click", () => loadMovies("/recommended_movies"));
likedBtn.addEventListener("click", () => loadMovies("/liked"));

// Botões de ação (curtir, não curtir, não assisti)
likeBtn.addEventListener("click", () => sendAction("/like"));
dislikeBtn.addEventListener("click", () => sendAction("/dislike"));
didNotWatchBtn.addEventListener("click", () => sendAction("/did_not_watch"));

// Inicializa na tela principal
loadMovies("/moveis", true);
