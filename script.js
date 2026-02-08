document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    const viewer = document.getElementById("fullscreen-viewer");
    let currentArtList = [];
    let currentIndex = 0;

    // 1. Load Data
    fetch('art.json')
        .then(response => response.json())
        .then(data => {
            const pageCategory = gallery?.getAttribute("data-category");
            
            if (pageCategory === "featured") {
                // RANDOMIZE for Home Page
                currentArtList = data.sort(() => 0.5 - Math.random()).slice(0, 3);
                renderGallery(currentArtList);
            } else if (pageCategory) {
                // Newest for Works/Media
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                currentArtList = (pageCategory === "all") ? data : data.filter(a => a.category === pageCategory);
                renderGallery(currentArtList);
            }
        });

    function renderGallery(list) {
        gallery.innerHTML = "";
        list.forEach((art, index) => {
            const figure = document.createElement("figure");
            figure.className = "artwork";
            figure.style.animation = `fadeIn ${0.3 + index * 0.2}s ease-out`;
            
            figure.innerHTML = `
                <img src="${art.images[0]}" alt="${art.title}">
                <figcaption class="gallery-caption">
                    <strong>${art.title}</strong><br>${art.material}
                </figcaption>
            `;
            figure.onclick = () => openViewer(index, list);
            gallery.appendChild(figure);
        });
    }

    function openViewer(index, list) {
        currentIndex = index;
        const art = list[currentIndex];
        document.getElementById("viewer-img").src = art.images[0];
        document.getElementById("viewer-title").innerText = art.title;
        document.getElementById("viewer-desc").innerText = art.description || "";
        viewer.style.display = "flex";
    }

    document.getElementById("close-viewer").onclick = () => viewer.style.display = "none";
});
