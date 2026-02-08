let currentArtList = [];
let currentIndex = 0;
let isJsonMode = false;

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("fullscreen-viewer");

  // 1. LOAD GALLERY FROM JSON
  if (gallery) {
    isJsonMode = true;
    const category = gallery.getAttribute("data-category");

    fetch("art.json")
      .then(response => response.json())
      .then(data => {
        // Sort newest first
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Filter
        currentArtList = (category === "all") ? data : data.filter(item => item.category === category);

        gallery.innerHTML = ""; 
        currentArtList.forEach((item, index) => {
          const figure = document.createElement("figure");
          figure.className = "artwork";
          figure.innerHTML = `
            <div class="img-container">
              <img src="${item.images[0]}" alt="${item.title}">
            </div>
            <figcaption class="gallery-caption">
              <strong>${item.title}</strong><br>
              ${item.date} | ${item.material}
            </figcaption>
          `;
          figure.onclick = () => openViewer(index);
          gallery.appendChild(figure);
        });
      })
      .catch(err => console.error("Could not load art.json", err));
  }

  // 2. TRIGGER FOR INDEX.HTML IMAGES
  const manualTriggers = document.querySelectorAll('.fullscreen-trigger');
  manualTriggers.forEach(img => {
    img.onclick = () => {
      isJsonMode = false;
      document.getElementById("viewer-img").src = img.src;
      document.getElementById("viewer-title").innerText = img.alt || "Artwork";
      document.getElementById("viewer-meta").innerText = "";
      document.getElementById("viewer-desc").innerText = "";
      viewer.style.display = "flex";
      document.body.style.overflow = "hidden";
    };
  });

  // 3. VIEWER NAVIGATION
  document.getElementById("close-viewer").onclick = () => {
    viewer.style.display = "none";
    document.body.style.overflow = "auto";
  };

  document.getElementById("next-btn").onclick = (e) => {
    e.stopPropagation();
    if (!isJsonMode) return;
    currentIndex = (currentIndex + 1) % currentArtList.length;
    openViewer(currentIndex);
  };

  document.getElementById("prev-btn").onclick = (e) => {
    e.stopPropagation();
    if (!isJsonMode) return;
    currentIndex = (currentIndex - 1 + currentArtList.length) % currentArtList.length;
    openViewer(currentIndex);
  };
});

function openViewer(index) {
  currentIndex = index;
  const item = currentArtList[currentIndex];
  const viewer = document.getElementById("fullscreen-viewer");
  
  document.getElementById("viewer-img").src = item.images[0];
  document.getElementById("viewer-title").innerText = item.title;
  document.getElementById("viewer-meta").innerText = `${item.date} | ${item.material}`;
  document.getElementById("viewer-desc").innerText = item.description || "";

  viewer.style.display = "flex";
  document.body.style.overflow = "hidden";
}
