let currentArt = null;
let currentImgIndex = 0;

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    const response = await fetch('art.json');
    const artworks = await response.json();
    
    // Sort Newest to Oldest
    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageCategory = gallery.getAttribute("data-category");
    const limitAttr = gallery.getAttribute("data-limit");
    const limit = limitAttr ? parseInt(limitAttr) : null;

    let count = 0;
    gallery.innerHTML = ""; // Clear loader

    artworks.forEach(art => {
      if (pageCategory === "all" || art.category === pageCategory) {
        if (limit && count >= limit) return;

        const figure = document.createElement("figure");
        figure.className = "artwork";
        figure.innerHTML = `<img src="${art.images[0]}" alt="${art.title}" loading="lazy">`;
        figure.onclick = () => openViewer(art);
        
        gallery.appendChild(figure);
        count++;
      }
    });
  } catch (error) {
    console.error("Error loading art.json. Check your file name and commas!", error);
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
  document.getElementById("viewer-meta").innerText = `${currentArt.date} | ${currentArt.material}`;
  document.getElementById("viewer-desc").innerText = currentArt.description || "";

  const hasMultiple = currentArt.images.length > 1;
  document.getElementById("prev-btn").style.display = hasMultiple ? "block" : "none";
  document.getElementById("next-btn").style.display = hasMultiple ? "block" : "none";
}

// Button Listeners
document.getElementById("next-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  currentImgIndex = (currentImgIndex + 1) % currentArt.images.length;
  updateViewerContent();
});

document.getElementById("prev-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  currentImgIndex = (currentImgIndex - 1 + currentArt.images.length) % currentArt.images.length;
  updateViewerContent();
});

document.getElementById("close-viewer").addEventListener("click", () => {
  document.getElementById("fullscreen-viewer").style.display = "none";
});

// Run
loadGallery();
