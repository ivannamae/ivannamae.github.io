document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const viewer = document.getElementById("fullscreen-viewer");
  const viewerImg = document.getElementById("viewer-img");
  const viewerTitle = document.getElementById("viewer-title");
  const viewerMeta = document.getElementById("viewer-meta");
  const viewerDesc = document.getElementById("viewer-desc");
  const closeBtn = document.getElementById("close-viewer");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentArtList = [];
  let currentIndex = 0;

  if (gallery) {
    const category = gallery.getAttribute("data-category");

    fetch("art.json")
      .then((response) => response.json())
      .then((data) => {
        // Filter by category if on a specific category page
        currentArtList = category ? data.filter((item) => item.category === category) : data;

        currentArtList.forEach((item, index) => {
          const card = document.createElement("div");
          card.className = "art-card";
          
          // Ensure pathing is correct: assuming images are in the root
          const mainImage = item.images[0];
          
          card.innerHTML = `
            <img src="${mainImage}" alt="${item.title}" loading="lazy">
            <div class="art-info">
              <h3>${item.title}</h3>
              <p>${item.date}</p>
            </div>
          `;

          card.addEventListener("click", () => openViewer(index));
          gallery.appendChild(card);
        });
      })
      .catch((err) => console.error("Error loading art.json:", err));
  }

  function openViewer(index) {
    currentIndex = index;
    const item = currentArtList[currentIndex];

    viewerImg.src = item.images[0];
    viewerTitle.innerText = item.title;
    viewerMeta.innerText = `${item.date} | ${item.material} | ${item.dimensions}`;
    viewerDesc.innerText = item.description;

    viewer.style.display = "flex";
    document.body.style.overflow = "hidden"; // Stop scrolling
  }

  closeBtn.addEventListener("click", () => {
    viewer.style.display = "none";
    document.body.style.overflow = "auto";
  });

  // Close on background click
  viewer.addEventListener("click", (e) => {
    if (e.target === viewer) {
      viewer.style.display = "none";
      document.body.style.overflow = "auto";
    }
  });

  // Navigation Logic
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % currentArtList.length;
    openViewer(currentIndex);
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + currentArtList.length) % currentArtList.length;
    openViewer(currentIndex);
  });
});
