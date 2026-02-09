async function initPage() {
  // Fade in all text/containers already on the page
  const staticElements = document.querySelectorAll('.content h2, .content p, .content section');
  staticElements.forEach((el, i) => {
    setTimeout(() => el.classList.add('slow-load'), i * 100);
  });

  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    const response = await fetch('art.json');
    const artworks = await response.json();
    artworks.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pageCategory = gallery.getAttribute("data-category");

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
        
        // Staggered fade in for gallery items
        setTimeout(() => figure.classList.add('slow-load'), (index + staticElements.length) * 100);
      }
    });
  } catch (e) {
    console.error("JSON load failed. Use a local server (like Live Server) to fix this.", e);
  }
}

window.onload = initPage;
