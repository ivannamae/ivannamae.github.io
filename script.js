async function initPage() {
  // 1. Target all text for fade-in IMMEDIATELY
  const textElements = document.querySelectorAll('.content h2, .content p, .content section');
  textElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('slow-load');
    }, i * 150);
  });

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // 2. Load Gallery
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
          <div class="img-container"><img src="${art.images[0]}" alt="${art.title}"></div>
          <figcaption class="gallery-caption">${art.title}, ${art.material}</figcaption>
        `;
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
        
        // Stagger fade-in for images and labels
        setTimeout(() => {
          figure.classList.add('slow-load');
          figure.querySelector('.img-container').classList.add('slow-load');
          figure.querySelector('.gallery-caption').classList.add('slow-load');
        }, (index + textElements.length) * 100);
      }
    });
  } catch (error) {
    console.warn("Local JSON fetch blocked. Use 'Live Server' to see images.", error);
  }
}

// Viewer (Preserved)
function openViewer(art) {
  const viewer = document.getElementById("fullscreen-viewer");
  viewer.style.display = "flex";
  document.getElementById("viewer-img").src = art.images[0];
  document.getElementById("viewer-title").innerText = art.title;
  document.getElementById("viewer-meta").innerText = `${art.date} | ${art.material}`;
  document.getElementById("viewer-desc").innerText = art.description || "";
}

document.getElementById("close-viewer").onclick = () => {
  document.getElementById("fullscreen-viewer").style.display = "none";
};

window.onload = initPage;
