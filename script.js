let currentArtList = [];
let currentIndex = 0;
let isJsonMode = false;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  if (!dateString || !dateString.includes('-')) return dateString || "";
  const parts = dateString.split('-');
  return `${monthNames[parseInt(parts[1]) - 1]} ${parts[0]}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("fullscreen-viewer");

  // 1. DYNAMIC GALLERY LOADING (For Ceramics, Digital, etc.)
  if (gallery) {
    isJsonMode = true;
    const category = gallery.getAttribute("data-category");

    fetch("art.json")
      .then(response => response.json())
      .then(data => {
        // Sort by date newest first
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Filter by category
        currentArtList = (category === "all") ? data : data.filter(item => item.category === category);

        gallery.innerHTML = ""; // Clear loader text
        currentArtList.forEach((item, index) => {
          const figure = document.createElement("figure");
          figure.className = "artwork";
          
          // Use the first image in the array
          const imageSrc = item.images[0];
          
          figure.innerHTML = `
            <div class="img-container">
              <img src="${imageSrc}" alt="${item.title}" loading="lazy">
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
      .catch(err => console.error("Error loading art.json. Check if file exists in root.", err));
  }

  // 2. MANUAL IMAGE TRIGGER (For index.html / home.html)
  const manualImages = document.querySelectorAll('.fullscreen-trigger');
  manualImages.forEach(img => {
    img.style.cursor = "pointer";
    img.addEventListener('click', () => {
        isJsonMode = false;
        const viewerImg = document.getElementById("viewer-img");
        viewerImg.src = img.src;
        document.getElementById("viewer-title").innerText = img.alt || "Artwork";
        document.getElementById("viewer-meta").innerText = "";
        document.getElementById("viewer-desc").innerText = "";
        viewer.style.display = "flex";
    });
  });

  // 3. VIEWER CONTROLS
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
  document.getElementById("viewer-meta").innerText = `${formatDate(item.date)} | ${item.material} | ${item.dimensions}`;
  document.getElementById("viewer-desc").innerText = item.description || "";

  viewer.style.display = "flex";
  document.body.style.overflow = "hidden";
}
