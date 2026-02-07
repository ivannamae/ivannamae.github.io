/* =========================================
   SORT ARTWORK BY DATE (NEWEST FIRST)
   ========================================= */

const gallery = document.getElementById("gallery");

if (gallery) {
  const works = Array.from(gallery.children);

  works
    .sort((a, b) => {
      return new Date(b.dataset.date) - new Date(a.dataset.date);
    })
    .forEach(work => gallery.appendChild(work));
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

if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    viewer.style.display = "none";
  });
}
