const allMoviesData = [
  {
    title: "A Minecraft Movie",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuYD3spgNTPkZOsL-4v4CfSd0gjuVNmySD5SCg5Sm5Tpra1-Jf",
    tmdb: 950387,
  },
  {
    title: "The Wild Robot",
    img: "https://upload.wikimedia.org/wikipedia/en/7/70/The_Wild_Robot_poster.jpg",
    tmdb: 1184918,
  },
  {
    title: "Dog Man",
    img: "https://upload.wikimedia.org/wikipedia/en/6/67/Dog_Man_film_poster.jpg",
    tmdb: 774370,
  },
  {
    title: "The Garfield Movie",
    img: "https://peoplesbanktheatre.com/wp-content/uploads/2024/05/garfield.webp",
    tmdb: 33051,
  },
  {
    title: "The Bad Guys",
    img: "https://upload.wikimedia.org/wikipedia/en/0/00/The_Bad_Guys_poster.jpeg",
    tmdb: 822271,
  },
  {
    title: "Sonic the Hedgehog 3",
    img: "https://upload.wikimedia.org/wikipedia/en/f/f2/Sonic_the_Hedgehog_3_film_poster.jpg",
    tmdb: 1222264,
  },
  {
    title: "Inside Out 2",
    img: "https://upload.wikimedia.org/wikipedia/en/f/f7/Inside_Out_2_poster.jpg",
    tmdb: 1022789,
  },
  {
    title: "Moana 2",
    img: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR4ctemLCUypsHiL19p_1Rl9lt2pttZ0YOlfpYzgd3R198-eEmD",
    tmdb: 1241982,
  },
];
const newReleases = allMoviesData.slice(0, 4);
const allTVShowsData = [
  {
    title: "South Park",
    img: "https://cdn.glitch.global/2a7fd730-62bc-453f-96c2-91756be0c721/Screenshot%202025-04-22%20085327.png?v=1745326888308",
    tmdb: 231,
    seasons: 27,
  },
  {
    title: "The Simpsons",
    img: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTAxmhnrzBIDS4CJHsPXkLqtsmUuBKiuLgnrL8WwuiCePcHFk02",
    tmdb: 456,
    seasons: 35,
  },
  {
    title: "Family Guy",
    img: "https://cdn.glitch.global/2a7fd730-62bc-453f-96c2-91756be0c721/Screenshot%202025-04-22%20085327.png?v=1745326888308",
    tmdb: 1666,
    seasons: 22,
  },
  {
    title: "Gravity Falls",
    img: "https://cdn.glitch.global/2a7fd730-62bc-453f-96c2-91756be0c721/Screenshot%202025-04-22%20085327.png?v=1745326888308",
    tmdb: 40600,
    seasons: 2,
  },
];
let currentTMDBId = null;
let currentTitle = "";
let currentVideoUrl = "";
let currentIsMovie = true;
let currentSeasons = 0;
let currentSeason = null;
let currentEpisode = null;
let allMedia = [
  ...allMoviesData,
  ...allTVShowsData.map((tvShow) => ({ ...tvShow, isMovie: false })),
];
let searchingTMDBId = false;
function renderSection(items, sectionId, isMovie = true) {
  const section = document.getElementById(sectionId);
  section.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `<div class="poster-container"><img src="${item.img}" alt="${item.title}"></div><h3>${item.title}</h3><button onclick="openVideoOverlay(${item.tmdb}, '${item.title}', ${isMovie}, ${item.seasons})">Watch</button>`;
    section.appendChild(card);
  });
}
function openVideoOverlay(tmdbId, title, isMovie, seasons = 0) {
  currentTMDBId = tmdbId;
  currentTitle = title;
  currentIsMovie = isMovie;
  currentSeasons = seasons;
  document.getElementById("overlay-title").innerText = title;
  document.getElementById("video-source-select").value = "";
  document.getElementById("open-player-tab").disabled = true;
  document.getElementById("open-pstream").disabled = true;
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
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    toggleButton.textContent = "Show Episodes";
    overlayContent.classList.add("tv-active");
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
  document.getElementById("current-season").value = "";
  document.getElementById("current-episode").value = "";
}
function closeOverlay() {
  document.getElementById("video-overlay").style.display = "none";
  document.getElementById("video-player-iframe").src = "";
  currentVideoUrl = "";
  document.getElementById("open-player-tab").disabled = true;
  document.getElementById("open-pstream").disabled = true;
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
function updatePlayerAndTabOption() {
  const source = document.getElementById("video-source-select").value;
  const player = document.getElementById("video-player-iframe");
  const openTabButton = document.getElementById("open-player-tab");
  const openPStreamButton = document.getElementById("open-pstream");
  currentSeason = document.getElementById("current-season").value;
  currentEpisode = document.getElementById("current-episode").value;
  if (source && currentTMDBId) {
    let embedUrl = "";
    openTabButton.disabled = false;
    openPStreamButton.disabled = false;
    let episodeString = currentEpisode
      ? String(currentEpisode).padStart(2, "0")
      : "";
    let seasonString = currentSeason
      ? String(currentSeason).padStart(2, "0")
      : "";
    switch (source) {
      case "vidsrc":
        embedUrl = currentIsMovie
          ? `https://vidsrc.xyz/embed/movie?tmdb=${currentTMDBId}`
          : `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}&season=${seasonString}&episode=${episodeString}`;
        player.src = embedUrl;
        break;
      case "embedsu":
        embedUrl = currentIsMovie
          ? `https://embed.su/embed/movie/${currentTMDBId}`
          : `https://embed.su/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;
        player.src = embedUrl;
        break;
      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/${
          currentIsMovie ? "movie" : "tv"
        }/${currentTMDBId}?autoPlay=false${
          currentIsMovie
            ? ""
            : `&season=${seasonString}&episode=${episodeString}`
        }`;
        player.src = embedUrl;
        break;
      case "autoembed":
        embedUrl = currentIsMovie
          ? `https://player.autoembed.cc/embed/movie/${currentTMDBId}`
          : `https://player.autoembed.cc/embed/tv/${currentTMDBId}?season=${seasonString}&episode=${episodeString}`;
        player.src = embedUrl;
        break;
      default:
        embedUrl = "";
        player.src = "";
        openTabButton.disabled = true;
        openPStreamButton.disabled = true;
        break;
    }
    currentVideoUrl = embedUrl;
  } else {
    player.src = "";
    openTabButton.disabled = true;
    openPStreamButton.disabled = true;
  }
}
function openPlayerInNewTab() {
  if (currentVideoUrl) {
    window.open(currentVideoUrl, "_blank");
  }
}
function openPStreamInNewTab() {
  if (currentTMDBId && !currentIsMovie && currentSeason && currentEpisode) {
    const pstreamUrl = `https://pstream.org/media/tmdb-tv-${currentTMDBId}-s${String(
      currentSeason
    ).padStart(2, "0")}-e${String(currentEpisode).padStart(2, "0")}`;
    window.open(pstreamUrl, "_blank");
  } else if (currentTMDBId && currentIsMovie) {
    const pstreamUrl = `https://pstream.org/media/tmdb-movie-${currentTMDBId}`;
    window.open(pstreamUrl, "_blank");
  }
}
function openTMDB() {}
function showHomePage() {
  document.getElementById("homepage-section").style.display = "block";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
}
function showMoviesPage() {
  renderSection(allMoviesData, "all-movies", true);
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "block"; // This line was missing
}
function showTVShowsPage() {
  renderSection(allTVShowsData, "all-tv-shows", false);
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "block";
}
function handleTMDBIdSearch(tmdbId) {
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
  tvShowButton.onclick = () => {
    currentIsMovie = false;
    currentSeasons = 5;
    const tvControls = document.getElementById("tv-controls");
    tvControls.style.display = "block";
    document.getElementById("toggle-episodes").style.display = "block";
    const episodeSelection = document.getElementById("episode-selection");
    episodeSelection.style.display = "none";
    episodeSelection.classList.remove("row");
    const overlayContent = document.querySelector(".overlay-content");
    overlayContent.classList.add("tv-active");
    openVideoOverlay(tmdbId, `TMDB ID: ${tmdbId} (TV Show)`, false, 5);
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
function performSearch() {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (!searchTerm) {
    alert("Please enter a TMDB ID or keywords.");
    return;
  }
  if (/^\d+$/.test(searchTerm)) {
    const tmdbId = parseInt(searchTerm);
    handleTMDBIdSearch(tmdbId);
  } else {
    const results = allMedia.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (results.length > 0) {
      const firstResult = results[0];
      openVideoOverlay(
        firstResult.tmdb,
        firstResult.title,
        !firstResult.isMovie,
        firstResult.seasons
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
let originalURL = window.location.href;
const safeDomains = [window.location.hostname];
function monitorRedirects() {
  setInterval(() => {
    if (
      window.location.href !== originalURL &&
      !safeDomains.some((domain) => window.location.href.includes(domain))
    ) {
      console.warn(
        "Potential malicious redirect detected:",
        window.location.href
      );
      window.history.back();
      const warningDiv = document.createElement("div");
      warningDiv.style.position = "fixed";
      warningDiv.style.top = "0";
      warningDiv.style.left = "0";
      warningDiv.style.width = "100%";
      warningDiv.style.backgroundColor = "yellow";
      warningDiv.style.color = "red";
      warningDiv.style.padding = "10px";
      warningDiv.style.textAlign = "center";
      warningDiv.textContent =
        "Warning: A potential redirect was blocked. Please try again or use a different source.";
      document.body.appendChild(warningDiv);
      setTimeout(() => {
        document.body.removeChild(warningDiv);
        originalURL = window.location.href;
      }, 5000);
    }
  }, 1000);
}
window.onload = () => {
  originalURL = window.location.href;
  monitorRedirects();
};
renderSection(newReleases, "new-releases");
