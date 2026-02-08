let currentArtList = [];
let currentIndex = 0;
let isJsonMode = false;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  if (!dateString || !dateString.includes('-')) return dateString || "";
  const parts = dateString.split('-');
  const month = parseInt(parts[1]) - 1;
  return `${monthNames[month]} ${parts[0]}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("fullscreen-viewer");

  // --- 1. DYNAMIC GALLERY (art.json) ---
  if (gallery) {
    isJsonMode = true;
    const category = gallery.getAttribute("data-category");

    fetch("art.json")
      .then(response => response.json())
      .then(data => {
        // Filter by category
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
              ${formatDate(item.date)} | ${item.material}
            </figcaption>
          `;

          figure.addEventListener("click", () => openViewer(index));
          gallery.appendChild(figure);
        });
      })
      .catch(err => console.error("Could not load art.json:", err));
  }

  // --- 2. MANUAL IMAGES (index.html / home.html) ---
  // This looks for your <img src="art1.jpg" class="fullscreen-trigger">
  const manualImages = document.querySelectorAll('.fullscreen-trigger');
  manualImages.forEach(img => {
    img.addEventListener('click', () => {
        isJsonMode = false;
        const viewerImg = document.getElementById("viewer-img");
        viewerImg.src = img.src;
        document.getElementById("viewer-title").innerText = img.alt || "Artwork";
        document.getElementById("viewer-meta").innerText = "";
        document.getElementById("viewer-desc").innerText = "";
        viewer.style.display = "flex";
        document.body.style.overflow = "hidden";
    });
  });

  // --- 3. VIEWER CONTROLS ---
  const closeBtn = document.getElementById("close-viewer");
  if (closeBtn) {
    closeBtn.onclick = () => {
      viewer.style.display = "none";
      document.body.style.overflow = "auto";
    };
  }

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
  document.getElementById("viewer-meta").innerText = `${formatDate(item.date)} | ${item.material}`;
  document.getElementById("viewer-desc").innerText = item.description || "";

  viewer.style.display = "flex";
  document.body.style.overflow = "hidden";
}
