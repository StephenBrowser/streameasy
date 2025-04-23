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

    img: "https://image.tmdb.org/t/p/w1280/xJnbMTrJ2fl1AXAKx34U4BPvOhs.jpg",

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

    img: "https://image.tmdb.org/t/p/w1280/8o8kiBkWFK3gVytHdyzEWUBXVfK.jpg",

    tmdb: 1434,

    seasons: 22,
  },

  {
    title: "Gravity Falls",

    img: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/dNxEEK5CdNQbp4YcEtICXelRqvP.jpg",

    tmdb: 40075,

    seasons: 2,
  },

  {
    title: "The Good Doctor",

    img: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/luhKkdD80qe62fwop6sdrXK9jUT.jpg",

    tmdb: 71712,

    seasons: 5,
  },

  {
    title: "Young Sheldon",

    img: "https://media.themoviedb.org/t/p/w600_and_h900_bestv2/kidkbZRBGbsEIrX7pODRSKi9ipl.jpg",

    tmdb: 71728,

    seasons: 7,
  },

  {
    title: "Futurama",

    img: "https://image.tmdb.org/t/p/w1280/sdJcX2cXirwQurLLlrDLYov7hcD.jpg",

    tmdb: 615,

    seasons: 12,
  },
];

let currentTMDBId = null;

let currentTitle = "";

let currentVideoUrl = "";

let currentIsMovie = true;

let currentSeasons = 0;

let currentSeason = null;

let currentEpisode = 1;

let allMedia = [
  ...allMoviesData,

  ...allTVShowsData.map((tvShow) => ({ ...tvShow, isMovie: false })),
];

let searchingTMDBId = false;

function updatePlayerAndTabOption() {
  const source = document.getElementById("video-source-select").value;

  const player = document.getElementById("video-player-iframe");

  const openTabButton = document.getElementById("open-player-tab");

  const openPStreamButton = document.getElementById("open-pstream");

  const seasonInput = document.getElementById("current-season");

  const episodeInput = document.getElementById("current-episode");

  if (seasonInput && episodeInput) {
    currentSeason = seasonInput.value;

    currentEpisode = episodeInput.value;
  }

  if (
    source &&
    currentTMDBId &&
    !currentIsMovie &&
    currentSeason &&
    currentEpisode
  ) {
    let embedUrl = "";

    openTabButton.disabled = false;

    openPStreamButton.disabled = false;

    let episodeString = String(currentEpisode).padStart(2, "0");

    let seasonString = String(currentSeason).padStart(2, "0");

    switch (source) {
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}&season=${seasonString}&episode=${episodeString}`;

        player.src = embedUrl;

        break;

      case "embedsu":
        embedUrl = `https://embed.su/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}`;

        player.src = embedUrl;

        break;

      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${currentTMDBId}/${seasonString}/${episodeString}?autoPlay=false`;

        player.src = embedUrl;

        break;

      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/tv/${currentTMDBId}?season=${seasonString}&episode=${episodeString}`;

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
  } else if (source && currentTMDBId && currentIsMovie) {
    let embedUrl = "";

    openTabButton.disabled = false;

    openPStreamButton.disabled = false;

    switch (source) {
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/movie?tmdb=${currentTMDBId}`;

        player.src = embedUrl;

        break;

      case "embedsu":
        embedUrl = `https://embed.su/embed/movie/${currentTMDBId}`;

        player.src = embedUrl;

        break;

      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/movie/${currentTMDBId}?autoPlay=false`;

        player.src = embedUrl;

        break;

      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/movie/${currentTMDBId}`;

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
  } else if (source && currentTMDBId && !currentIsMovie) {
    // If no specific season/episode selected, try to load the base series URL

    let embedUrl = "";

    openTabButton.disabled = false;

    openPStreamButton.disabled = false;

    switch (source) {
      case "vidsrc":
        embedUrl = `https://vidsrc.xyz/embed/tv?tmdb=${currentTMDBId}`;

        player.src = embedUrl;

        break;

      case "embedsu":
        embedUrl = `https://embed.su/embed/tv/${currentTMDBId}/1/1`; // Provide a default to try and load the player

        player.src = embedUrl;

        break;

      case "vidsrccc":
        embedUrl = `https://vidsrc.cc/v2/embed/tv/${currentTMDBId}?autoPlay=false`;

        player.src = embedUrl;

        break;

      case "autoembed":
        embedUrl = `https://player.autoembed.cc/embed/tv/${currentTMDBId}?season=1&episode=1`; // Provide a default

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

function renderSection(items, sectionId, isMovie = true) {
  const section = document.getElementById(sectionId);
  section.innerHTML = "";
  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "movie-card";
    const watchButtonHTML = `<button onclick="openVideoOverlay(${item.tmdb}, '${item.title}', ${isMovie}, ${item.seasons})">Watch</button>`;
    card.innerHTML = `<div class="poster-container"><img src="${item.img}" alt="${item.title}"></div><h3>${item.title}</h3>${watchButtonHTML}`;
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
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
    toggleButton.textContent = "Hide Episodes";
    overlayContent.classList.add("tv-active");
    document.getElementById("current-season").value = currentSeason || "";
    document.getElementById("current-episode").value = currentEpisode || "";
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
let sportsContainer = null;
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
        "https://images.emojiterra.com/google/android-10/512px/26bd.png",
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
  sportsContainer.style.flexWrap = "wrap";
  sportsContainer.style.gap = "20px";
  sportsContainer.style.padding = "20px";
  const style = document.createElement("style");
  style.textContent = `.sports-card { width: 150px; height: 180px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease-in-out; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background-color: #f8f9fa; } .sports-card:hover { transform: scale(1.05); } .sports-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; margin-bottom: 10px; } .sports-card h3 { margin: 0; font-size: 1.2em; color: #333; } .sports-container { display: none; flex-wrap: wrap; gap: 20px; padding: 20px; }`;
  document.head.appendChild(style);
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
    sportsContainer.appendChild(card);
  });
  document.body.appendChild(sportsContainer);
  const poweredBy = document.createElement("h1");
  poweredBy.textContent = "Powered by Streamed.su";
  poweredBy.style.textAlign = "left";
  poweredBy.style.marginTop = "20px";
  poweredBy.style.fontFamily = "Helvetica, sans-serif";
  document.body.appendChild(poweredBy);
}
function showHomePage() {
  document.getElementById("homepage-section").style.display = "block";
  document.getElementById("all-movies-section").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
    const poweredByElement = document.querySelector("h1");
    if (
      poweredByElement &&
      poweredByElement.textContent === "Powered by Streamed.su"
    ) {
      poweredByElement.remove();
    }
  }
  document.getElementById("all-tv-shows-section").style.display = "none";
}
function showMoviesPage() {
  renderSection(allMoviesData, "all-movies", true);
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
    const poweredByElement = document.querySelector("h1");
    if (
      poweredByElement &&
      poweredByElement.textContent === "Powered by Streamed.su"
    ) {
      poweredByElement.remove();
    }
  }
  document.getElementById("all-movies-section").style.display = "block";
}
function showTVShowsPage() {
  renderSection(allTVShowsData, "all-tv-shows", false);
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  if (sportsContainer) {
    sportsContainer.style.display = "none";
    const poweredByElement = document.querySelector("h1");
    if (
      poweredByElement &&
      poweredByElement.textContent === "Powered by Streamed.su"
    ) {
      poweredByElement.remove();
    }
  }
  document.getElementById("all-tv-shows-section").style.display = "block";
}
function showSportsPage() {
  if (!sportsContainer) {
    addSportsCards();
  } else {
    sportsContainer.style.display = "flex";
    let poweredByElement = document.querySelector("h1");
    if (
      !poweredByElement ||
      poweredByElement.textContent !== "Powered by Streamed.su"
    ) {
      poweredByElement = document.createElement("h1");
      poweredByElement.textContent = "Powered by Streamed.su";
      poweredByElement.style.textAlign = "left";
      poweredByElement.style.marginTop = "20px";
      poweredByElement.style.fontFamily = "Helvetica, sans-serif";
      document.body.appendChild(poweredByElement);
    }
  }
  document.getElementById("homepage-section").style.display = "none";
  document.getElementById("all-movies-section").style.display = "none";
  document.getElementById("all-tv-shows-section").style.display = "none";
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.appendChild(sportsContainer);
  } else {
    document.body.appendChild(sportsContainer);
  }
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
    episodeSelection.style.display = "flex";
    episodeSelection.classList.add("row");
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
function playSpecificEpisodeFromCard(tmdbId, title, totalSeasons) {}
renderSection(newReleases, "new-releases");

