let currentArt = null;
let currentImgIndex = 0;

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const response = await fetch('art.json');
  const artworks = await response.json();
  artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

  const pageCategory = gallery.getAttribute("data-category");
  const limit = gallery.getAttribute("data-limit") ? parseInt(gallery.getAttribute("data-limit")) : null;

  let count = 0;
  artworks.forEach(art => {
    if (pageCategory === "all" || art.category === pageCategory) {
      if (limit && count >= limit) return;

      const figure = document.createElement("figure");
      figure.className = "artwork";
      // We show the first image as the thumbnail
      figure.innerHTML = `<img src="${art.images[0]}" loading="lazy">`;
      figure.onclick = () => openViewer(art);
      
      gallery.appendChild(figure);
      count++;
    }
  });
}

function openViewer(art) {
  currentArt = art;
  currentImgIndex = 0;
  
  const viewer = document.getElementById("fullscreen-viewer");
  viewer.style.display = "flex";
  updateViewerContent();
}

function updateViewerContent() {
  const imgElement = document.getElementById("viewer-img");
  const titleElement = document.getElementById("viewer-title");
  const metaElement = document.getElementById("viewer-meta");
  const descElement = document.getElementById("viewer-desc");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  imgElement.src = currentArt.images[currentImgIndex];
  titleElement.innerText = currentArt.title;
  metaElement.innerText = `${currentArt.date} | ${currentArt.material}`;
  descElement.innerText = currentArt.description;

  // Only show buttons if there are multiple images
  const hasMultiple = currentArt.images.length > 1;
  prevBtn.style.display = hasMultiple ? "block" : "none";
  nextBtn.style.display = hasMultiple ? "block" : "none";
}

// Navigation Logic
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
