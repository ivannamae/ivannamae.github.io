let currentArtList = [];
let currentIndex = 0;
let isJsonMode = false;

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("fullscreen-viewer");

  // 1. DYNAMIC GALLERY (For Works/Medium pages)
  if (gallery) {
    isJsonMode = true;
    const category = gallery.getAttribute("data-category");

    fetch("art.json")
      .then(response => response.json())
      .then(data => {
        // Filter by category or show all
        currentArtList = (category === "all") ? data : data.filter(item => item.category === category);
        
        gallery.innerHTML = ""; 
        currentArtList.forEach((item, index) => {
          const figure = document.createElement("figure");
          figure.className = "artwork";
          
          // Using item.images[0] as the primary image
          figure.innerHTML = `
            <img src="${item.images[0]}" alt="${item.title}">
            <figcaption class="gallery-caption">
              <strong>${item.title}</strong><br>
              ${item.date} | ${item.material}
            </figcaption>
          `;

          figure.addEventListener("click", () => openViewer(index));
          gallery.appendChild(figure);
        });
      })
      .catch(err => console.error("Error: art.json could not be loaded.", err));
  }

  // 2. MANUAL TRIGGER (For index.html/home.html)
  const triggers = document.querySelectorAll('.fullscreen-trigger');
  triggers.forEach(img => {
    img.addEventListener('click', () => {
      isJsonMode = false;
      document.getElementById("viewer-img").src = img.src;
      document.getElementById("viewer-title").innerText = img.alt || "";
      document.getElementById("viewer-meta").innerText = "";
      document.getElementById("viewer-desc").innerText = "";
      viewer.style.display = "flex";
      document.body.style.overflow = "hidden";
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

  // Next/Prev Buttons
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
