/* =========================================
   SORT & LIMIT ARTWORK
   ========================================= */
const gallery = document.getElementById("gallery");

if (gallery) {
  const works = Array.from(gallery.children);

  // 1. Sort everything by date (Newest First)
  works.sort((a, b) => {
    return new Date(b.dataset.date) - new Date(a.dataset.date);
  });

  // 2. Clear the gallery and re-add sorted items
  gallery.innerHTML = "";
  
  // 3. Check if we should limit the display (for the "Works" tab)
  const limit = gallery.getAttribute("data-limit");
  
  works.forEach((work, index) => {
    if (limit && index >= parseInt(limit)) {
      // If we are over the limit, don't show it
      work.style.display = "none"; 
    }
    gallery.appendChild(work);
  });
}

/* =========================================
   FULLSCREEN VIEWER
   ========================================= */
const viewer = document.getElementById("fullscreen-viewer");
const viewerImg = document.getElementById("fullscreen-image");
const closeBtn = document.getElementById("close-viewer");

document.querySelectorAll(".fullscreen-trigger").forEach(img => {
  img.addEventListener("click", () => {
    viewer.style.display = "flex";
    viewerImg.src = img.src;
  });
});

if (viewer) {
    viewer.addEventListener("click", (e) => {
        if (e.target === viewer || e.target === closeBtn) {
            viewer.style.display = "none";
        }
    });
}
