/* =========================================
   SORT & LIMIT ARTWORK
   ========================================= */
const gallery = document.getElementById("gallery");

if (gallery) {
  // Convert children to an array to sort them
  const works = Array.from(gallery.children);

  // 1. Sort by date (Newest First)
  works.sort((a, b) => {
    return new Date(b.dataset.date) - new Date(a.dataset.date);
  });

  // 2. Clear the gallery
  gallery.innerHTML = "";
  
  // 3. Check if there is a limit (e.g., 20) set on this specific page
  const limitAttr = gallery.getAttribute("data-limit");
  const limit = limitAttr ? parseInt(limitAttr) : null;

  works.forEach((work, index) => {
    // If a limit exists and we've reached it, hide the extra items
    if (limit && index >= limit) {
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

// Open viewer
document.querySelectorAll(".fullscreen-trigger").forEach(img => {
  img.addEventListener("click", () => {
    if (viewer && viewerImg) {
      viewer.style.display = "flex";
      viewerImg.src = img.src;
    }
  });
});

// Close viewer when clicking 'X' or the dark background
if (viewer) {
    viewer.addEventListener("click", (e) => {
        if (e.target === viewer || e.target === closeBtn) {
            viewer.style.display = "none";
        }
    });
}
