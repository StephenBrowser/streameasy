const apiKey = 'cad8d8114ffeedb538fcff20c4be6d21'; // Replace with your actual API key
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'; // You can choose different image sizes

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

async function fetchTMDBData(endpoint) {
  try {
    const response = await fetch(`${baseUrl}/${endpoint}?api_key=${apiKey}`);
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching TMDB data:', error);
    return [];
  }
}

async function getNewReleasesFromTMDB() {
  // Example: Fetch popular movies as "new releases"
  return await fetchTMDBData('trending/movie/week');
}

async function getAllMoviesFromTMDB() {
  // Example: Fetch popular movies as "new releases"
  return await fetchTMDBData('movie/popular');
}

async function getAllTVShowsFromTMDB() {
  // Example: Fetch popular TV shows
  return await fetchTMDBData('tv/popular');
}

function renderSection(items, sectionId, isMovie = true) {
  const section = document.getElementById(sectionId);
  section.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    const imageUrl = item.poster_path ? `${imageBaseUrl}${item.poster_path}` : 'placeholder_image_url.jpg';
    const title = item.title || item.name;
    const tmdbId = item.id;
    const seasons = item.number_of_seasons || 0;
    const watchButtonHTML = `<button onclick="openVideoOverlay(${tmdbId}, '${title}', ${isMovie}, ${seasons})">Watch</button>`;
    card.innerHTML = `<div class="poster-container"><img src="${imageUrl}" alt="${title}"></div><h3>${title}</h3>${watchButtonHTML}`;
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

  let finalSource = source || "vidsrccc"; // Default to vidsrccc if no source selected

  if (finalSource && currentTMDBId && !currentIsMovie && selectedSeason && selectedEpisode) {
    const seasonString = String(selectedSeason).padStart(2, "0");
    const episodeString = String(selectedEpisode).padStart(2, "0");
    let embedUrl = "";

    switch (finalSource) {
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}&season=${seasonString}&episode=${episodeString}`;
        break;
      case "embedsu":
        embedUrl = `https://embed.su/embed/tv/${currentTMDBId}/${selectedSeason}/${selectedEpisode}`;
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
      default:
        embedUrl = "";
        break;
    }
    player.src = embedUrl;
    currentVideoUrl = embedUrl;
  } else if (finalSource && currentTMDBId && currentIsMovie) {
    let embedUrl = "";
    switch (finalSource) {
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
      default:
        embedUrl = "";
        break;
    }
    player.src = embedUrl;
    currentVideoUrl = embedUrl;
  } else if (finalSource && currentTMDBId && !currentIsMovie) {
    let embedUrl = "";
    switch (finalSource) {
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

function openVideoOverlay(tmdbId, title, isMovie, seasons = 0) {
  currentTMDBId = tmdbId;
  currentTitle = title;
  currentIsMovie = isMovie;
  currentSeasons = seasons;
  document.getElementById("overlay-title").innerText = title;
  document.getElementById("video-source-select").value = "vidsrccc";

  const tmdbButton = document.getElementById("tmdb-button");
  tmdbButton.onclick = () =>
    window.open(
      `https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${currentTMDBId}`,
      "_blank"
    );
  const overlayContent = document.querySelector(".overlay-content");
  const tvControls = document.getElementById("tv-controls");
  const episodeSelection = document.getElementById("episode-selection");
  const toggleButton = document.getElementById("toggle-episodes");

  if (!isMovie && seasons > 0) {
    tvControls.style.display = "block";
    toggleButton.style.display = "block";
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    toggleButton.textContent = "Hide Episodes";
    overlayContent.classList.add("tv-active");
    document.getElementById("current-season").value = currentSeason || 1; // Initialize with 1 or a stored value
    document.getElementById("current-episode").value = currentEpisode || 1; // Initialize with 1 or a stored value
  } else {
    tvControls.style.display = "none";
    toggleButton.style.display = "none";
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    toggleButton.textContent = "Show Episodes";
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
  tvControls.style.display = "none";
  const toggleButton = document.getElementById("toggle-episodes");
  toggleButton.style.display = "none";
  toggleButton.textContent = "Show Episodes";
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
  currentTMDBId = 950387;
  currentTitle = "A Minecraft Movie";
  currentIsMovie = true; // Ensure this is a boolean
  currentSeasons = seasons;
  document.getElementById("overlay-title").innerText = "A Minecraft Movie";
  document.getElementById("video-source-select").value = "vidsrccc";

  const tmdbButton = document.getElementById("tmdb-button");
  tmdbButton.onclick = () =>
    window.open(
      `https://www.themoviedb.org/${isMovie ? "movie" : "tv"}/${currentTMDBId}`,
      "_blank"
    );
  const overlayContent = document.querySelector(".overlay-content");
  const tvControls = document.getElementById("tv-controls");
  const episodeSelection = document.getElementById("episode-selection");
  const toggleButton = document.getElementById("toggle-episodes");
  if (!isMovie && seasons > 0) {
    tvControls.style.display = "block";
    toggleButton.style.display = "block";
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    toggleButton.textContent = "Hide Episodes";
    overlayContent.classList.add("tv-active");
    document.getElementById("current-season").value = currentSeason || 1;
    document.getElementById("current-episode").value = currentEpisode || 1;
  } else {
    tvControls.style.display = "none";
    toggleButton.style.display = "none";
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    toggleButton.textContent = "Show Episodes";
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
      imageUrl: "https://images.emojiterra.com/google/noto-emoji/unicode-16.0/color/1024px/1f3c0.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/basketball",
    },
    {
      name: "Football",
      imageUrl: "https://images.emojiterra.com/google/android-12l/512px/1f3c8.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/american-football",
    },
    {
      name: "Soccer",
      imageUrl: "https://images.emojiterra.com/google/android-10/512px/26bd.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/football",
    },
    {
      name: "Hockey",
      imageUrl: "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3d2_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/hockey",
    },
    {
      name: "Tennis",
      imageUrl: "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3be_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/tennis",
    },
    {
      name: "Cricket",
      imageUrl: "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/1f3cf_flat.png",
      url: "https://streamedsueasy.global.ssl.fastly.net/category/cricket",
    },
    {
      name: "Baseball",
      imageUrl: "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/256px/26be_flat.png",
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
  poweredBy.textContent = "Live Sports, Powered by Streamed.su";
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
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-tv-shows-section").style.display = "none";
}

function showMoviesPage() {
  loadAllMoviesPage();
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
  }
  document.getElementById("all-movies-section").style.display = "block";
}

function showTVShowsPage() {
  loadAllTVShowsPage();
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
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
    tvControls.style.display = "block";
    document.getElementById("toggle-episodes").style.display = "block";
    const episodeSelection = document.getElementById("episode-selection");
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    const overlayContent = document.querySelector(".overlay-content");
    overlayContent.classList.add("tv-active");
    openVideoOverlay(tmdbId, `TMDB ID: ${tmdbId} (TV Show)`, false, currentSeasons);
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
      fetchTMDBData(`search/tv?query=${encodeURIComponent(searchTerm)}`)
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
  toggleButton.textContent =
    episodeSelection.style.display === "none"
      ? "Show Episodes"
      : "Hide Episodes";
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
  renderSection(newReleasesData.slice(0, 4), "new-releases");
}

async function loadAllMoviesPage() {
  const allMoviesData = await getAllMoviesFromTMDB();
  renderSection(allMoviesData, "all-movies", true);
}

async function loadAllTVShowsPage() {
  const allTVShowsData = await getAllTVShowsFromTMDB();
  renderSection(allTVShowsData, "all-tv-shows", false);
}

// Initialize the homepage data
showHomePage();
