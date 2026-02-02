const apiKey = "cad8d8114ffeedb538fcff20c4be6d21"; // Replace with your actual API key
const baseUrl = "https://api.themoviedb.org/3";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500"; // You can choose different image sizes
// Add Vidsrc.rip to Sources
// Declare these variables in a scope accessible by the relevant functions
let currentTMDBId = null;
let currentTitle = "";
let currentIsMovie = true;
let currentSeasons = 0;
let currentSeason = null;
let currentEpisode = 1;
let currentVideoUrl = "";
let searchingTMDBId = false;
let sportsContainer = null;
let networkId = "19";
// Remove the global genre variable
// let genre = "10751";

async function fetchTMDBData(endpoint) {
  try {
    const separator = endpoint.includes("?") ? "&" : "?";
    const url = `${baseUrl}/${endpoint}${separator}api_key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error("Error fetching TMDB data:", error);
    return [];
  }
}
    const TMDB_API_KEY = "cad8d8114ffeedb538fcff20c4be6d21";
      const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

      const searchInput = document.getElementById("search-input");
      const mediaTypeSelect = document.getElementById("media-type-select");
      const searchButton = document.getElementById("search-button");
      const resultsContainer = document.getElementById("results-container");
      const startMessage = document.getElementById("start-message");
      const movieGrid = document.getElementById("movie-grid");
      const tvGrid = document.getElementById("tv-grid");
      const movieResults = document.getElementById("movie-results");
      const tvResults = document.getElementById("tv-results");

      function showStartMessage(show) {
        startMessage.style.display = show ? "flex" : "none";
        resultsContainer.style.display = show ? "none" : "block";
      }

      async function searchTMDb(query, type) {
        if (!query.trim()) {
          showStartMessage(true);
          movieGrid.innerHTML = "";
          tvGrid.innerHTML = "";
          return;
        }

        showStartMessage(false);
        movieGrid.innerHTML = "";
        tvGrid.innerHTML = "";
        movieResults.style.display = "none";
        tvResults.style.display = "none";

        let results = [];

        try {
          if (type === "multi") {
            const [moviesRes, tvRes] = await Promise.all([
              fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                  query
                )}`
              ).then((r) => r.json()),
              fetch(
                `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                  query
                )}`
              ).then((r) => r.json()),
            ]);
            results = [
              ...moviesRes.results.map((item) => ({
                ...item,
                media_type: "movie",
              })),
              ...tvRes.results.map((item) => ({
                ...item,
                media_type: "tv",
              })),
            ];
          } else {
            const res = await fetch(
              `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
                query
              )}`
            );
            const data = await res.json();
            results = data.results.map((item) => ({
              ...item,
              media_type: type,
            }));
          }

          if (!results.length) {
            resultsContainer.innerHTML =
              "<p style='padding:20px;'>No results found.</p>";
            return;
          }

          results.forEach((item) => {
            const card = document.createElement("div");
            card.className = "result-card";

            const img = document.createElement("img");
            img.className = "result-poster";
            img.alt = (item.title || item.name) + " poster";
            const fallbackPoster =
              "https://streamez.pages.dev/oh%20deer!.png";

            img.src = item.poster_path
              ? TMDB_IMAGE_BASE + item.poster_path
              : fallbackPoster;
            img.onerror = () => {
              img.onerror = null;
              img.src = fallbackPoster;
            };

            const titleEl = document.createElement("div");
            titleEl.className = "result-title";
            titleEl.textContent = item.title || item.name;

            card.appendChild(img);
            card.appendChild(titleEl);

            card.onclick = async () => {
              if (item.media_type === "tv") {
                const tvDetailsRes = await fetch(
                  `https://api.themoviedb.org/3/tv/${item.id}?api_key=${TMDB_API_KEY}`
                );
                const tvDetails = await tvDetailsRes.json();
                const seasons = tvDetails.number_of_seasons || 1;
                openVideoOverlay(item.id, titleEl.textContent, false, seasons);
              } else {
                openVideoOverlay(item.id, titleEl.textContent, true, 0);
              }
            };

            if (item.media_type === "movie") {
              movieGrid.appendChild(card);
              movieResults.style.display = "block";
            } else if (item.media_type === "tv") {
              tvGrid.appendChild(card);
              tvResults.style.display = "block";
            }
          });
        } catch (err) {
          console.error(err);
          resultsContainer.innerHTML =
            "<p style='padding:20px;'>Error loading results.</p>";
        }
      }

      searchButton.addEventListener("click", () => {
        searchTMDb(searchInput.value, mediaTypeSelect.value);
      });

      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          searchTMDb(searchInput.value, mediaTypeSelect.value);
        }
      });

      showStartMessage(true);
async function getNewReleasesFromTMDB() {
  // Example: Fetch popular movies as "new releases"
  
  return await fetchTMDBData(`discover/movie`);
}
async function getTopRatedFromTMDB() {
  // Example: Fetch popular movies as "new releases"
  
  return await fetchTMDBData(`discover/movie?include_adult=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=200`);
}

async function getAllMoviesFromTMDB() {
  
  return await fetchTMDBData(`discover/movie`);
}
async function getTrendingMoviesFromTMDB() {
  
  return await fetchTMDBData(`trending/movie/week`);
}


async function getAllTVShowsFromTMDB() {   
  const shows = await fetchTMDBData(`discover/tv`);
  return shows.filter(show => !show.name.toLowerCase().includes("late"));
}

async function getTrendingTVShowsFromTMDB() {   
  const shows = await fetchTMDBData(`trending/tv/week`);
  return shows.filter(show => !show.name.toLowerCase().includes("late"));
}

async function getTopRatedTVShowsFromTMDB() {   
  const shows = await fetchTMDBData(`discover/tv?include_adult=false&language=en-US&page=1&sort_by=vote_average.desc&vote_count.gte=200`);
  return shows.filter(show => !show.name.toLowerCase().includes("late"));
}

async function getTVShowDetails(tvShowId) {
  try {
    const response = await fetch(`${baseUrl}/tv/${tvShowId}?api_key=${apiKey}`);
    const data = await response.json();
    return data.number_of_seasons || 0;
  } catch (error) {
    console.error(`Error fetching details for TV show ${tvShowId}:`, error);
    return 0;
  }
}

function nextEpisode() {
  const episodeInput = document.getElementById("current-episode");
  const seasonInput = document.getElementById("current-season");

  let episode = parseInt(episodeInput.value, 10);
  let season = parseInt(seasonInput.value, 10);

  episode += 1;

  episodeInput.value = episode.toString().padStart(2, '0');
  updatePlayerAndTabOption();
}
function previousEpisode() {
  const episodeInput = document.getElementById("current-episode");
  const seasonInput = document.getElementById("current-season");

  let episode = parseInt(episodeInput.value, 10);
  let season = parseInt(seasonInput.value, 10);

  if (episode > 1) {
    episode -= 1;
    episodeInput.value = episode.toString().padStart(2, '0');
    updatePlayerAndTabOption();
  }
}



function renderSection(items, sectionId, isMovie = true) { 
  const section = document.getElementById(sectionId);
  section.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "movie-card";

    const imageUrl = item.poster_path
      ? `${imageBaseUrl}${item.poster_path}`
      : "placeholder_image_url.jpg";

    const title = item.title || item.name;
    const tmdbId = item.id;
    const seasons = item.number_of_seasons || 0;

    card.innerHTML = `
      <div class="poster-container">
        <img src="${imageUrl}" alt="${title}" onclick="openVideoOverlay(${tmdbId}, '${title.replace(/'/g, "\\'")}', ${isMovie}, ${seasons})">
        <div class="title-overlay"><h2>${title}</h2></div>
      </div>
    `;

    section.appendChild(card);
  });
}



function updatePlayerAndTabOption() {
  const source = document.getElementById("video-source-select").value;
  const player = document.getElementById("video-player-iframe");
  const seasonInput = document.getElementById("current-season");
  const episodeInput = document.getElementById("current-episode");

  const selectedSeason = seasonInput ? seasonInput.value : currentSeason;
  const selectedEpisode = episodeInput ? episodeInput.value : currentEpisode;

  let finalSource = source || "selectsource"; // Default to vidsrccc if no source selected

  if (
    finalSource &&
    currentTMDBId &&
    !currentIsMovie &&
    selectedSeason &&
    selectedEpisode
  ) {
    const seasonString = String(selectedSeason).padStart(2, "0");
    const episodeString = String(selectedEpisode).padStart(2, "0");
    let embedUrl = "";

    switch (finalSource) {
      case "selectsource":
        embedUrl = `data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%2280%22%3E%0A%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23ffffff%22%3E%3C%2Frect%3E%0A%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23000000%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%0A%20%20%20%20Select%20Source%0A%20%20%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A`;
        break;
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}&season=${seasonString}&episode=${episodeString}`;
        break;
      case "embedsu":
        embedUrl = `https://embed.su/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}?autoPlay=false`;
        break;
      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/tv/${currentTMDBId}/?season=${seasonString}&episode=${episodeString}`;
        break;
      case "vidora":
        embedUrl = `https://vidora.su/tv/${currentTMDBId}/${seasonString}/${episodeString}?autoplay=true&colour=00ff9d&backbutton=https://streameasy.glitch.me/&logo=https://shorturl.at/tvWQf?v=1745537855225%22width=%22100%%22height=%22100%%22allowfullscreen`;
        break;
      case "vidsrcvip":
        embedUrl = `https://vidsrc.vip/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidfast":
        embedUrl = `https://vidfast.pro/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidlink":
        embedUrl = `https://vidlink.pro/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "moviekex":
        embedUrl = `https://moviekex.online/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "2embed":
        embedUrl = `https://2embed.cc/embedtv/${currentTMDBId}&s=${seasonString}&e=${episodeString}`;
        break;
      case "videasy":
        embedUrl = `https://player.videasy.net/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "moviesclub":
        embedUrl = `https://moviesapi.club/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidsrcrip":
        embedUrl = `https://vidsrc.rip/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "superembed":
        embedUrl = `https://multiembed.mov/directstream.php?video_id=tt0000000&tmdb=${currentTMDBId}&s=${seasonString}&e=${episodeString}`;
        break;
      case "vidsrcco":
        embedUrl = ` https://player.vidsrc.co/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}?autoplay=true&autonext=true&nextbutton=true&poster=true&primarycolor=6C63FF&secondarycolor=9F9BFF&iconcolor=FFFFFF&fontcolor=FFFFFF&fontsize=16px&opacity=0.5&font=Helvetica&server=1`;
        break;
      case "vidsrcsu":
        embedUrl = ` https://vidsrc.su/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidbinge":
        embedUrl = ` https://dodo-v2.pages.dev/media/tmdb-tv-${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "embedescape":
        embedUrl = ` https://embed.escape.com.np/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidjoy":
        embedUrl = ` https://vidjoy.pro/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "111movies":
        embedUrl = ` https://111movies.com/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "filmex":
        embedUrl = ` https://fmovies4u.com/embed/tmdb-tv-${currentTMDBId}/${seasonString}/${episodeString}`;
        break;
      case "vidzee":
        embedUrl = ` https://player.vidzee.wtf/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        break;

      default:
        embedUrl = "";
        break;
    }
    player.src = embedUrl;
    currentVideoUrl = embedUrl;
  } else if (finalSource && currentTMDBId && currentIsMovie) {
    let embedUrl = "";
    switch (finalSource) {
      case "selectsource":
        embedUrl = `data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%2280%22%3E%0A%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23ffffff%22%3E%3C%2Frect%3E%0A%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23000000%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%0A%20%20%20%20Select%20Source%0A%20%20%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A`;
        break;
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/movie?tmdb=${currentTMDBId}`;
        break;
      case "embedsu":
        embedUrl = `https://embed.su/embed/movie/${currentTMDBId}`;
        break;
      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/movie/${currentTMDBId}?autoPlay=false`;
        break;
      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/movie/${currentTMDBId}`;
        break;
      case "vidora":
        embedUrl = `https://vidora.su/movie/${currentTMDBId}?autoplay=true&colour=00ff9d&backbutton=https://streameasy.glitch.me/&logo=https://shorturl.at/tvWQf?v=1745537855225%22width=%22100%%22height=%22100%%22allowfullscreen`;
        break;
      case "vidsrcvip":
        embedUrl = `https://vidsrc.vip/embed/movie/${currentTMDBId}`;
        break;
      case "vidfast":
        embedUrl = `https://vidfast.pro/movie/${currentTMDBId}`;
        break;
      case "vidlink":
        embedUrl = `https://vidlink.pro/movie/${currentTMDBId}`;
        break;
      case "moviekex":
        embedUrl = `https://moviekex.online/embed/movie/${currentTMDBId}`;
        break;
      case "2embed":
        embedUrl = `https://2embed.cc/embed/${currentTMDBId}`;
        break;
      case "videasy":
        embedUrl = `https://player.videasy.net/movie/${currentTMDBId}`;
        break;
      case "moviesclub":
        embedUrl = `https://moviesapi.club/movie/${currentTMDBId}`;
        break;
      case "vidsrcrip":
        embedUrl = `https://vidsrc.rip/embed/movie/${currentTMDBId}`;
        break;
      case "superembed":
        embedUrl = `https://multiembed.mov/directstream.php?video_id=tt0000000&tmdb=${currentTMDBId}`;
        break;
      case "vidsrcco":
        embedUrl = ` https://player.vidsrc.co/embed/movie/${currentTMDBId}?autoplay=true&autonext=true&nextbutton=true&poster=true&primarycolor=6C63FF&secondarycolor=9F9BFF&iconcolor=FFFFFF&fontcolor=FFFFFF&fontsize=16px&opacity=0.5&font=Helvetica&server=1`;
        break;
      case "vidsrcsu":
        embedUrl = ` https://vidsrc.su/embed/movie/${currentTMDBId}`;
        break;
      case "vidbinge":
        embedUrl = ` https://dodo-v2.pages.dev/media/tmdb-movie-${currentTMDBId}`;
        break;
      case "embedescape":
        embedUrl = ` https://embed.escape.com.np/movie/${currentTMDBId}`;
        break;
      case "vidjoy":
        embedUrl = ` https://vidjoy.pro/embed/movie/${currentTMDBId}`;
        break;
      case "111movies":
        embedUrl = ` https://111movies.com/embed/movie/${currentTMDBId}`;
        break;
      case "filmex":
        embedUrl = ` https://fmovies4u.com/embed/tmdb-movie-${currentTMDBId}`;
      case "vidzee":
        embedUrl = ` https://player.vidzee.wtf/embed/movie/${currentTMDBId}`;
        break;
      default:
        embedUrl = "";
        break;
    }
    player.src = embedUrl;
    currentVideoUrl = embedUrl;
  } else if (finalSource && currentTMDBId && !currentIsMovie) {
    let embedUrl = "";
    switch (finalSource) {
      case "selectsource":
        embedUrl = `data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%2280%22%3E%0A%20%20%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23ffffff%22%3E%3C%2Frect%3E%0A%20%20%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Helvetica%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%23000000%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%0A%20%20%20%20Select%20Source%0A%20%20%3C%2Ftext%3E%0A%3C%2Fsvg%3E%0A`;
        break;
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}`;
        break;
      case "embedsu":
        embedUrl = `https://embed.su/embed/tv/${currentTMDBId}/1/1`;
        break;
      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${currentTMDBId}?autoPlay=false`;
        break;
      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/tv/${currentTMDBId}?season=1&episode=1`;
        break;
      case "vidora":
        embedUrl = `https://vidora.su/tv/${currentTMDBId}/1/1?autoplay=true&colour=00ff9d&backbutton=https://streameasy.glitch.me/&logo=https://shorturl.at/tvWQf?v=1745537855225%22width=%22100%%22height=%22100%%22allowfullscreen`;
        break;
      case "vidsrcvip":
        embedUrl = `https://vidsrc.vip/embed/tv/${currentTMDBId}/1/1`;
        break;
      case "vidfast":
        embedUrl = `https://vidfast.pro/tv/${currentTMDBId}/1/1`;
        break;
      case "vidlink":
        embedUrl = `https://vidlink.pro/tv/${currentTMDBId}/1/1`;
        break;
      case "moviekex":
        embedUrl = `https://moviekex.online/embed/tv/${currentTMDBId}/1/1`;
        break;
      case "2embed":
        embedUrl = `https://2embed.cc/embedtvfull/${currentTMDBId}`;
        break;
      case "videasy":
        embedUrl = `https://player,videasy.net/tv/${currentTMDBId}/1/1`;
        break;
      case "moviesclub":
        embedUrl = `https://moviesapi.club/tv/${currentTMDBId}/1/1`;
        break;
      case "vidsrcrip":
        embedUrl = `https://vidsrc.rip/embed/tv/${currentTMDBId}/1/1`;
        break;
      case "superembed":
        embedUrl = `https://multiembed.mov/directstream.php?video_id=tt0000000&tmdb=${currentTMDBId}&s=1&e=1`;
        break;
      case "vidsrcco":
        embedUrl = ` https://player.vidsrc.co/embed/tv/${currentTMDBId}/1/1?autoplay=true&autonext=true&nextbutton=true&poster=true&primarycolor=6C63FF&secondarycolor=9F9BFF&iconcolor=FFFFFF&fontcolor=FFFFFF&fontsize=16px&opacity=0.5&font=Helvetica&server=1`;
        break;
      case "filmex":
        embedUrl = ` https://fmovies4u.com/embed/tmdb-tv-${currentTMDBId}`;
        break;
      case "vidzee":
        embedUrl = ` https://player.vidzee.wtf/embed/tv/${currentTMDBId}`;
        break;
      default:
        embedUrl = "";
        break;
    }
    player.src = embedUrl;
    currentVideoUrl = embedUrl;
  } else {
    player.src = "";
    currentVideoUrl = "";
  }
}
function openEmbedInNewTab() {
  const iframe = document.getElementById("video-player-iframe");
  const currentUrl = iframe?.src;

  if (!currentUrl || currentUrl.includes("selectsource") || currentUrl === "about:blank") {
    alert("No valid video URL set.");
    return;
  }

  window.open(currentUrl, "_blank");
}


function openVideoOverlay(tmdbId, title, isMovie, seasons = 0) {
  currentTMDBId = tmdbId;
  currentTitle = title;
  currentIsMovie = isMovie;
  currentSeasons = seasons;
  document.getElementById("overlay-title").innerText = title;
  document.getElementById("video-source-select").value = "selectsource";

  const tmdbButton = document.getElementById("tmdb-button");
  tmdbButton.onclick = () =>
    window.open(
      `https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${currentTMDBId}`,
      "_blank"
    );
  const overlayContent = document.querySelector(".overlay-content");
  const tvControls = document.getElementById("tv-controls");
  const tvControls2 = document.getElementById("tv-controls");
  const episodeSelection = document.getElementById("episode-selection");
  const toggleButton = document.getElementById("toggle-episodes");

  if (!isMovie && seasons > 0) {
    tvControls.style.display = "block";
    toggleButton.style.display = "block";
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    
    overlayContent.classList.add("tv-active");
    document.getElementById("current-season").value = currentSeason || 1; // Initialize with 1 or a stored value
    document.getElementById("current-episode").value = currentEpisode || 1; // Initialize with 1 or a stored value
  } else {
    tvControls.style.display = "none";
    toggleButton.style.display = "none";
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    
    overlayContent.classList.remove("tv-active");
    currentSeason = null;
    currentEpisode = null;
  }
  document.getElementById("video-overlay").style.display = "flex";
  document.getElementById("video-player-iframe").src = "";
  currentVideoUrl = "";
}

function closeOverlay() {
  document.getElementById("video-overlay").style.display = "none";
  document.getElementById("video-player-iframe").src = "";
  currentVideoUrl = "";

  const tvControls = document.getElementById("tv-controls");
  const tvControls2 = document.getElementById("tv-controls");
  tvControls.style.display = "none";
  const toggleButton = document.getElementById("toggle-episodes");
  toggleButton.style.display = "none";
  
  const episodeSelection = document.getElementById("episode-selection");
  episodeSelection.style.display = "none";
  episodeSelection.classList.remove("row");
  const overlayContent = document.querySelector(".overlay-content");
  overlayContent.classList.remove("tv-active");
  currentSeason = null;
  currentEpisode = null;
  searchingTMDBId = false;
  const mediaTypeSelection = document.getElementById("media-type-selection");
  if (mediaTypeSelection) {
    mediaTypeSelection.remove();
  }
}

function openBannerMovie(tmdbId, title, isMovie, seasons = 0) {
  currentTMDBId = 991494;
  currentTitle = "The Spongebob Movie: Search for SquarePants";
  currentIsMovie = true; // Ensure this is a boolean
  currentSeasons = seasons;
  document.getElementById("overlay-title").innerText = "A Minecraft Movie";
  document.getElementById("video-source-select").value = "selectsource";

  const tmdbButton = document.getElementById("tmdb-button");
  tmdbButton.onclick = () =>
    window.open(
      `https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${currentTMDBId}`,
      "_blank"
    );
  const overlayContent = document.querySelector(".overlay-content");
  const tvControls = document.getElementById("tv-controls");
  const tvControls2 = document.getElementById("tv-controls");
  const episodeSelection = document.getElementById("episode-selection");
  const toggleButton = document.getElementById("toggle-episodes");
  if (!isMovie && seasons > 0) {
    tvControls.style.display = "block";
    toggleButton.style.display = "block";
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    
    overlayContent.classList.add("tv-active");
    document.getElementById("current-season").value = currentSeason || 1;
    document.getElementById("current-episode").value = currentEpisode || 1;
  } else {
    tvControls.style.display = "none";
    toggleButton.style.display = "none";
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    toggleButton.textContent = "Show Options";
    overlayContent.classList.remove("tv-active");
    currentSeason = null;
    currentEpisode = null;
  }
  document.getElementById("video-overlay").style.display = "flex";
  document.getElementById("video-player-iframe").src = "";
  currentVideoUrl = "";
}

function addSportsCards() {
  const sports = [
    {
      name: "Basketball",
      imageUrl:
        "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/1024px/1f3c0.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/basketball",
    },
    {
      name: "Football",
      imageUrl:
        "https://images.emojiterra.com/google/android-12l/512px/1f3c8.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/american-football",
    },
    {
      name: "Soccer",
      imageUrl:
        "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/1024px/26bd.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/football",
    },
    {
      name: "Hockey",
      imageUrl:
        "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3d2_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/hockey",
    },
    {
      name: "Tennis",
      imageUrl:
        "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3be_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/tennis",
    },
    {
      name: "Cricket",
      imageUrl:
        "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3cf_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/cricket",
    },
    {
      name: "Baseball",
      imageUrl:
        "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/26be_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/baseball",
    },
  ];

  sportsContainer = document.createElement("div");
  sportsContainer.className = "sports-container";
  sportsContainer.style.display = "flex";
  sportsContainer.style.flexDirection = "column";
  sportsContainer.style.gap = "20px";
  sportsContainer.style.padding = "20px";

  const poweredBy = document.createElement("h1");
  poweredBy.textContent = "Live Sports";
  poweredBy.style.textAlign = "left";
  poweredBy.style.fontFamily = "Helvetica, sans-serif";
  poweredBy.style.margin = "10px 0";

  const cardWrapper = document.createElement("div");
  cardWrapper.style.display = "flex";
  cardWrapper.style.flexWrap = "wrap";
  cardWrapper.style.gap = "20px";

  sports.forEach((sport) => {
    const card = document.createElement("div");
    card.className = "sports-card";
    const img = document.createElement("img");
    img.src = sport.imageUrl;
    img.alt = sport.name;
    const heading = document.createElement("h3");
    heading.textContent = sport.name;
    const link = document.createElement("a");
    link.href = sport.url;
    link.target = "_blank";
    link.style.textDecoration = "none";
    link.style.color = "inherit";
    link.appendChild(img);
    link.appendChild(heading);
    card.appendChild(link);
    cardWrapper.appendChild(card);
  });

  sportsContainer.appendChild(poweredBy);
  sportsContainer.appendChild(cardWrapper);

  const style = document.createElement("style");
  style.textContent = `.sports-card { width: 150px; height: 180px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease-in-out; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background-color: #f8f9fa; }
    .sports-card:hover { transform: scale(1.05); }
    .sports-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; margin-bottom: 10px; }
    .sports-card h3 { margin: 0; font-size: 1.2em; color: #333; }
  `;
  document.head.appendChild(style);
}

function showHomePage() {
  loadHomePageData();
  document.getElementById("homepage-section").style.display = "block";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("search").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-tv-shows-section").style.display = "none";
}

function showMoviesPage() {
  loadAllMoviesPage();
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  document.getElementById("search").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-movies-section").style.display = "block";
}

function showTVShowsPage() {
  loadAllTVShowsPage();
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("search").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-tv-shows-section").style.display = "block";
}

function showSportsPage() {
  if (!sportsContainer) {
    addSportsCards();
  }

  if (!document.body.contains(sportsContainer)) {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.appendChild(sportsContainer);
    } else {
      document.body.appendChild(sportsContainer);
    }
  }

  sportsContainer.style.display = "flex";
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  document.getElementById("search").style.display = "none";
}

function showSearchPage() {
  loadAllTVShowsPage();
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("search").style.display = "block";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-tv-shows-section").style.display = "none";
}


async function handleTMDBIdSearch(tmdbId) {
  searchingTMDBId = true;
  const overlayContent = document.querySelector(".overlay-content");
  const mediaTypeSelection = document.createElement("div");
  mediaTypeSelection.id = "media-type-selection";
  mediaTypeSelection.style.display = "flex";
  mediaTypeSelection.style.gap = "10px";
  mediaTypeSelection.style.marginBottom = "10px";
  mediaTypeSelection.style.alignItems = "center";
  const movieButton = document.createElement("button");
  movieButton.textContent = "Movie";
  movieButton.className = "blue-button";
  movieButton.onclick = () => {
    currentIsMovie = true;
    currentSeasons = 0;
    document.getElementById("tv-controls").style.display = "none";
    const tvControls2 = document.getElementById("tv-controls").style.display = "none";
    document.getElementById("toggle-episodes").style.display = "none";
    document.getElementById("episode-selection").style.display = "none";
    document.getElementById("episode-selection").classList.remove("row");
    const overlayContent = document.querySelector(".overlay-content");
    overlayContent.classList.remove("tv-active");
    openVideoOverlay(tmdbId, `TMDB ID: ${tmdbId} (Movie)`, true, 0);
    mediaTypeSelection.remove();
    searchingTMDBId = false;
  };
  const tvShowButton = document.createElement("button");
  tvShowButton.textContent = "TV Show";
  tvShowButton.className = "blue-button";
  tvShowButton.onclick = async () => {
    currentIsMovie = false;
    // Fetch TV show details to get the number of seasons
    const tvShowDetails = await fetchTMDBData(`tv/${tmdbId}`);
    currentSeasons = tvShowDetails ? tvShowDetails.number_of_seasons : 1; // Default to 1 if info not found
    const tvControls = document.getElementById("tv-controls");
    const tvControls2 = document.getElementById("tv-controls");
    tvControls.style.display = "block";
    document.getElementById("toggle-episodes").style.display = "block";
    const episodeSelection = document.getElementById("episode-selection");
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    const overlayContent = document.querySelector(".overlay-content");
    overlayContent.classList.add("tv-active");
    openVideoOverlay(
      tmdbId,
      `TMDB ID: ${tmdbId} (TV Show)`,
      false,
      currentSeasons
    );
    mediaTypeSelection.remove();
    searchingTMDBId = false;
  };
  mediaTypeSelection.appendChild(
    document.createTextNode("Is this TMDB ID for a Movie or a TV Show?")
  );
  mediaTypeSelection.appendChild(movieButton);
  mediaTypeSelection.appendChild(tvShowButton);
  const overlayHeader = document.querySelector(".overlay-header");
  overlayContent.insertBefore(mediaTypeSelection, overlayHeader.nextSibling);
  document.getElementById("video-overlay").style.display = "flex";
  document.getElementById("video-player-iframe").src = "";
  currentVideoUrl = "";
}

async function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (!searchTerm) {
    alert("Please enter a TMDB ID or keywords.");
    return;
  }
  if (/^\d+$/.test(searchTerm)) {
    const tmdbId = parseInt(searchTerm);
    handleTMDBIdSearch(tmdbId);
  } else {
    const [movieResults, tvResults] = await Promise.all([
      fetchTMDBData(`search/movie?query=${encodeURIComponent(searchTerm)}`),
      fetchTMDBData(`search/tv?query=${encodeURIComponent(searchTerm)}`),
    ]);

    const allSearchResults = [...(movieResults || []), ...(tvResults || [])];

    if (allSearchResults.length > 0) {
      const firstResult = allSearchResults[0];
      openVideoOverlay(
        firstResult.id,
        firstResult.title || firstResult.name,
        !!firstResult.title,
        firstResult.number_of_seasons || 0
      );
    } else {
      alert(`No results found for "${searchTerm}".`);
    }
  }
}

function toggleEpisodeDropdowns() {
  const episodeSelection = document.getElementById("episode-selection");
  const toggleButton = document.getElementById("toggle-episodes");
  episodeSelection.style.display =
    episodeSelection.style.display === "none" ? "flex" : "none";
  episodeSelection.classList.toggle("row");
  
}

function playSpecificEpisodeFromCard(tmdbId, title, totalSeasons) {
  currentTMDBId = tmdbId;
  currentTitle = title;
  currentIsMovie = false;
  currentSeasons = totalSeasons;
  openVideoOverlay(tmdbId, title, false, totalSeasons);
}

async function loadHomePageData() {
  const newReleasesData = await getNewReleasesFromTMDB();
  const topRatedTVData = await getTopRatedTVShowsFromTMDB();
  const trendingMovies = await getTrendingMoviesFromTMDB();
  const topRatedTVShowsWithSeasons = [];
  renderSection(newReleasesData.slice(0, 4), "new-releases");
  for (const show of topRatedTVData) {
    const seasons = await getTVShowDetails(show.id);
    topRatedTVShowsWithSeasons.push({ ...show, number_of_seasons: seasons });
  }
  
  renderSection(newReleasesData.slice(0, 4), "new-releases");
  renderSection(topRatedTVShowsWithSeasons.slice(0, 4), "top-rated-tv-shows", false);
  renderSection(trendingMovies.slice(0, 4), "trending-movies", true);
}

async function loadAllMoviesPage() {
  const allMoviesData = await getAllMoviesFromTMDB();
  const topRatedMoviesData = await getTopRatedFromTMDB();
  const trendingMovies = await getTrendingMoviesFromTMDB();
  renderSection(allMoviesData.slice(0, 8), "all-movies", true);
  renderSection(topRatedMoviesData.slice(0, 8), "top-movies", true);
  renderSection(trendingMovies.slice(0, 8), "trending-movies-2", true);
}

async function loadAllTVShowsPage() {
  const popularTVShows = await getAllTVShowsFromTMDB();
  const trendingTVData = await getTrendingTVShowsFromTMDB();
  const topRatedTVData = await getTopRatedTVShowsFromTMDB();
  const tvShowsWithSeasons = [];
  const trendingTVShowsWithSeasons = [];
  const topRatedTVShowsWithSeasons = [];
  
  for (const show of popularTVShows) {
    const seasons = await getTVShowDetails(show.id);
    tvShowsWithSeasons.push({ ...show, number_of_seasons: seasons });
  }
  for (const show of trendingTVData) {
    const seasons = await getTVShowDetails(show.id);
    trendingTVShowsWithSeasons.push({ ...show, number_of_seasons: seasons });
  }
  for (const show of topRatedTVData) {
    const seasons = await getTVShowDetails(show.id);
    topRatedTVShowsWithSeasons.push({ ...show, number_of_seasons: seasons });
  }

  renderSection(tvShowsWithSeasons.slice(0, 8), "all-tv-shows", false);
  renderSection(trendingTVShowsWithSeasons.slice(0, 8), "trending-tv-shows", false);
  renderSection(topRatedTVShowsWithSeasons.slice(0, 8), "top-rated-tv-shows-2", false);
}

// Initialize the homepage data
showHomePage();
