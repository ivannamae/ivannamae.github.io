let currentArt = null;
let currentImgIndex = 0;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  if (!dateString || !dateString.includes('-')) return dateString || "";
  const parts = dateString.split('-');
  const year = parts[0];
  const month = parts[1];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    // Adding a timestamp to the URL prevents the browser from loading an "old" cached version of your json
    const response = await fetch('art.json?v=' + new Date().getTime());
    const artworks = await response.json();
    
    // Sort Newest to Oldest
    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageCategory = gallery.getAttribute("data-category");
    gallery.innerHTML = ""; 

    artworks.forEach(art => {
      if (pageCategory === "all" || art.category === pageCategory) {
        const figure = document.createElement("figure");
        figure.className = "artwork";
        
        const displayDate = formatDate(art.date);
        const dims = art.dimensions ? `, ${art.dimensions}` : "";
        const captionText = `${art.title}, ${displayDate}${dims}, ${art.material}`;

        figure.innerHTML = `
          <img src="${art.images[0]}" alt="${art.title}" onerror="this.src='https://via.placeholder.com/400?text=Image+Missing'">
          <figcaption class="gallery-caption">${captionText}</figcaption>
        `;
        
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
      }
    });
  } catch (error) {
      console.error("Gallery failed to load. If viewing locally, you need a local server or to upload to GitHub.", error);
      gallery.innerHTML = "<p>Loading artwork... if this stays, check art.json format.</p>";
  }
}

function openViewer(art) {
  currentArt = art;
  currentImgIndex = 0;
  document.getElementById("fullscreen-viewer").style.display = "flex";
  updateViewerContent();
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

// Initialize
window.onload = loadGallery;
