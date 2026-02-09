async function loadGallery() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const category = gallery.dataset.category;

  try {
    const response = await fetch('art.json');
    const data = await response.json();

    gallery.innerHTML = ''; // Clear previous content

    data.forEach(item => {
      if (category === 'all' || item.category === category) {
        const figure = document.createElement('figure');
        figure.className = 'artwork';
        figure.innerHTML = `
          <div class="img-container">
            <img src="${item.images[0]}" alt="${item.title}">
          </div>
          <figcaption class="gallery-caption">
            <strong>${item.title}</strong>, ${item.date}<br>
            ${item.material} ${item.dimensions ? ' — ' + item.dimensions : ''}
          </figcaption>
        `;
        figure.onclick = () => openViewer(item);
        gallery.appendChild(figure);
      }
    });
  } catch (e) {
    console.error("Data failed to load. Check art.json for typos!", e);
  }
}

window.onload = loadGallery;
