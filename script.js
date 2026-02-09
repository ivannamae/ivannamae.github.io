let currentArt = null;
let currentImgIndex = 0;

async function initPage() {
  // 1. Force all static text to fade in
  const staticElements = document.querySelectorAll('.content h2, .content p, .content section');
  staticElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('slow-load'), i * 150);
  });

  const gallery = document.getElementById("gallery");
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
        
        figure.innerHTML = `
          <div class="img-container">
            <img src="${art.images[0]}" alt="${art.title}">
          </div>
          <figcaption class="gallery-caption">${art.title}, ${art.material}</figcaption>
        `;
        
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
        
        // 2. Fade in gallery items and their labels
        setTimeout(() => {
          figure.classList.add('slow-load');
          figure.querySelector('.img-container').classList.add('slow-load');
          figure.querySelector('.gallery-caption').classList.add('slow-load');
        }, (index + staticElements.length) * 100);
      }
    });
  } catch (error) {
    console.error("Browser blocked local JSON fetch. Use Live Server!", error);
  }
}

// Viewer Logic (Protected - Do Not Change)
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
  document.getElementById("viewer-meta").innerText = `${currentArt.date} | ${currentArt.material}`;
  document.getElementById("viewer-desc").innerText = currentArt.description || "";
}

document.getElementById("close-viewer").onclick = () => {
  document.getElementById("fullscreen-viewer").style.display = "none";
};

window.onload = initPage;
