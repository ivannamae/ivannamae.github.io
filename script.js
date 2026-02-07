async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  // 1. Fetch the data from your JSON list
  const response = await fetch('art.json');
  const artworks = await response.json();

  // 2. Sort by date (Newest first)
  artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

  // 3. Determine what page we are on
  // This looks for a special "data-category" on the gallery tag
  const pageCategory = gallery.getAttribute("data-category");
  const limitAttr = gallery.getAttribute("data-limit");
  const limit = limitAttr ? parseInt(limitAttr) : null;

  let count = 0;

  artworks.forEach(art => {
    // If the page is "all" (Works tab) OR matches the category (Ceramics tab)
    if (pageCategory === "all" || art.category === pageCategory) {
      
      // If we are on the Works tab and hit our limit of 20, stop
      if (limit && count >= limit) return;

      // Create the HTML structure for each piece
      const figure = document.createElement("figure");
      figure.className = "artwork";
      figure.innerHTML = `
        <img src="${art.filename}" class="fullscreen-trigger" loading="lazy">
        <figcaption>
          Ivanna Mae, <em>${art.title}</em>, ${art.date}, ${art.material}
        </figcaption>
      `;
      
      gallery.appendChild(figure);
      count++;
    }
  });

  // Re-enable the fullscreen viewer for these new images
  setupViewer();
}

function setupViewer() {
  const viewer = document.getElementById("fullscreen-viewer");
  const viewerImg = document.getElementById("fullscreen-image");
  const closeBtn = document.getElementById("close-viewer");

  document.querySelectorAll(".fullscreen-trigger").forEach(img => {
    img.onclick = () => {
      viewer.style.display = "flex";
      viewerImg.src = img.src;
    };
  });

  if (viewer) {
    viewer.onclick = (e) => {
      if (e.target === viewer || e.target === closeBtn) viewer.style.display = "none";
    };
  }
}

loadGallery();
