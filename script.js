let currentArt = null;
let currentImgIndex = 0;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  if (!dateString || !dateString.includes('-')) return dateString || "";
  const [year, month] = dateString.split('-');
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    const response = await fetch('art.json');
    const artworks = await response.json();
    
    // Sort Newest to Oldest (supports YYYY-MM)
    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageCategory = gallery.getAttribute("data-category");
    gallery.innerHTML = ""; 

    artworks.forEach(art => {
      if (pageCategory === "all" || art.category === pageCategory) {
        const figure = document.createElement("figure");
        figure.className = "artwork";
        
        // Label format: Title, Month Year, Dimensions, Material
        const displayDate = formatDate(art.date);
        const dims = art.dimensions ? `, ${art.dimensions}` : "";
        const captionText = `${art.title}, ${displayDate}${dims}, ${art.material}`;

        figure.innerHTML = `
          <img src="${art.images[0]}" alt="${art.title}" loading="lazy">
          <figcaption class="gallery-caption">${captionText}</figcaption>
        `;
        
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
      }
    });
  } catch (error) {
    console.error("Error loading art.json", error);
  }
}

function openViewer(art) {
  currentArt = art;
  currentImgIndex = 0;
  const viewer = document.getElementById("fullscreen-viewer");
  if (viewer) {
    viewer.style.display = "flex";
    updateViewerContent();
  }
}

function updateViewerContent() {
  document.getElementById("viewer-img").src = currentArt.images[currentImgIndex];
  document.getElementById("viewer-title").innerText = currentArt.title;
  
  const displayDate = formatDate(currentArt.date);
  const dims = currentArt.dimensions ? ` | ${currentArt.dimensions}` : "";
  document.getElementById("viewer-meta").innerText = `${displayDate}${dims} | ${currentArt.material}`;
  document.getElementById("viewer-desc").innerText = currentArt.description || "";

  const hasMultiple = currentArt.images.length > 1;
  document.getElementById("prev-btn").style.display = hasMultiple ? "block" : "none";
  document.getElementById("next-btn").style.display = hasMultiple ? "block" : "none";
}

document.getElementById("next-btn").onclick = (e) => {
  e.stopPropagation();
  currentImgIndex = (currentImgIndex + 1) % currentArt.images.length;
  updateViewerContent();
};

document.getElementById("prev-btn").onclick = (e) => {
  e.stopPropagation();
  currentImgIndex = (currentImgIndex - 1 + currentArt.images.length) % currentArt.images.length;
  updateViewerContent();
};

document.getElementById("close-viewer").onclick = () => {
  document.getElementById("fullscreen-viewer").style.display = "none";
};

loadGallery();
