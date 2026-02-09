async function initPage() {
  // 1. Instantly target and fade in all static text found on the page
  const elements = document.querySelectorAll('.content h2, .content p, .content section');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('slow-load');
    }, i * 150);
  });

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // 2. Only try to fetch JSON if there is a gallery on the page
  try {
    const response = await fetch('art.json?v=' + new Date().getTime());
    if (!response.ok) throw new Error("File not found");
    
    const artworks = await response.json();
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
        
        // Staggered fade in for gallery items
        setTimeout(() => figure.classList.add('slow-load'), (index + elements.length) * 100);
      }
    });
  } catch (error) {
    console.warn("Gallery failed to load. If you are local, use Live Server.", error);
  }
}

// Global viewer logic remains unchanged to preserve your progress
function openViewer(art) {
  document.getElementById("fullscreen-viewer").style.display = "flex";
  document.getElementById("viewer-img").src = art.images[0];
  document.getElementById("viewer-title").innerText = art.title;
  document.getElementById("viewer-meta").innerText = `${art.date} | ${art.material}`;
  document.getElementById("viewer-desc").innerText = art.description || "";
}

document.getElementById("close-viewer").onclick = () => {
  document.getElementById("fullscreen-viewer").style.display = "none";
};

window.onload = initPage;
