let currentArt = null;
let currentImgIndex = 0;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function formatDate(dateString) {
  const [year, month] = dateString.split('-');
  return month ? `${monthNames[parseInt(month) - 1]} ${year}` : year;
}

async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  try {
    const response = await fetch('art.json');
    const artworks = await response.json();
    
   // Replace the sorting line in your script.js with this:
artworks.sort((a, b) => {
  return new Date(b.date.toString()) - new Date(a.date.toString());
});

    const pageCategory = gallery.getAttribute("data-category");
    gallery.innerHTML = ""; 

    artworks.forEach(art => {
      if (pageCategory === "all" || art.category === pageCategory) {
        const figure = document.createElement("figure");
        figure.className = "artwork";
        
        // Automated Label: Title, Date, Dimensions, Material
        const label = `${art.title}, ${formatDate(art.date)}, ${art.dimensions || ""}, ${art.material}`;
        
        figure.innerHTML = `
          <img src="${art.images[0]}" alt="${art.title}" loading="lazy">
          <figcaption>${label}</figcaption>
        `;
        figure.onclick = () => openViewer(art);
        gallery.appendChild(figure);
      }
    });
  } catch (error) {
    console.error("Error loading art.json", error);
  }
}

function openViewer(art) {
  currentArt = art;
  currentImgIndex = 0;
  document.getElementById("fullscreen-viewer").style.display = "flex";
  updateViewerContent();
}

function updateViewerContent() {
  document.getElementById("viewer-img").src = currentArt.images[currentImgIndex];
  document.getElementById("viewer-title").innerText = currentArt.title;
  
  // Format the meta string for the popup
  const meta = `${formatDate(currentArt.date)} | ${currentArt.dimensions || ""} | ${currentArt.material}`;
  document.getElementById("viewer-meta").innerText = meta;
  document.getElementById("viewer-desc").innerText = currentArt.description || "";

  const hasMultiple = currentArt.images.length > 1;
  document.getElementById("prev-btn").style.display = hasMultiple ? "block" : "none";
  document.getElementById("next-btn").style.display = hasMultiple ? "block" : "none";
}

// Event Listeners for Closing and Navigation
document.getElementById("close-viewer").onclick = () => document.getElementById("fullscreen-viewer").style.display = "none";
document.getElementById("next-btn").onclick = (e) => { e.stopPropagation(); currentImgIndex = (currentImgIndex + 1) % currentArt.images.length; updateViewerContent(); };
document.getElementById("prev-btn").onclick = (e) => { e.stopPropagation(); currentImgIndex = (currentImgIndex - 1 + currentArt.images.length) % currentArt.images.length; updateViewerContent(); };

loadGallery();
