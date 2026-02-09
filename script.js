let currentArt = null;
let currentImgIndex = 0;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  if (!dateString || !dateString.includes('-')) return dateString || "";
  const parts = dateString.split('-');
  return `${monthNames[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  
  // Apply slow-load to all static text on the page immediately
  document.querySelectorAll('.content h2, .content p').forEach(el => el.classList.add('slow-load'));

  if (!gallery) return;

  try {
    const response = await fetch('art.json?v=' + new Date().getTime());
    const artworks = await response.json();
    
    // Sort Newest First
    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageCategory = gallery.getAttribute("data-category");
    gallery.innerHTML = ""; 

    artworks.forEach((art, index) => {
      if (pageCategory === "all" || art.category === pageCategory) {
        const figure = document.createElement("figure");
        figure.className = "artwork";
        // Stagger the fade-in of images
        figure.style.animationDelay = `${index * 0.1}s`;
        figure.classList.add('slow-load');
        
        const displayDate = formatDate(art.date);
        const dims = art.dimensions ? `, ${art.dimensions}` : "";
        const captionText = `${art.title}, ${displayDate}${dims}, ${art.material}`;

        figure.innerHTML = `
          <div class="img-container">
            <img src="${art.images[0]}" 
                 alt="${art.title}" 
                 onerror="this.onerror=null; this.src='https://via.placeholder.com/400x500?text=Image+Not+Found';">
          </div>
          <figcaption class="gallery-caption">${captionText}</figcaption>
        `;
        
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
      }
    });
  } catch (error) {
    console.error("Error loading gallery:", error);
  }
}

// Viewer Functions (Backtrack protection: kept exactly as before)
function openViewer(art) {
  currentArt = art;
  currentImgIndex = 0;
  document.getElementById("fullscreen-viewer").style.display = "flex";
  updateViewerContent();
}

function updateViewerContent() {
  const vImg = document.getElementById("viewer-img");
  vImg.src = currentArt.images[currentImgIndex];
  
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

window.onload = loadGallery;
