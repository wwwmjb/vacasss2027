const FAV_KEY = 'verano-favoritas';

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function toggleFavorite(id) {
  const favs = getFavorites();
  const idx = favs.indexOf(id);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.push(id);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs;
}

function statsLine(h) {
  const parts = [];
  if (h.guests) parts.push(`${h.guests} huéspedes`);
  if (h.bedrooms) parts.push(`${h.bedrooms} dorm.`);
  if (h.beds) parts.push(`${h.beds} camas`);
  if (h.baths) parts.push(`${h.baths} baño${h.baths === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

function cardTemplate(h, isFav) {
  const ratingBadge = h.rating
    ? `<span class="rating-badge">★ ${h.rating.toFixed(2).replace(/0$/, '').replace(/\.$/, '')}${h.reviews ? ` (${h.reviews})` : ''}</span>`
    : '';

  const amenities = (h.amenities || [])
    .map(a => `<span class="amenity-pill">${a}</span>`)
    .join('');

  const notes = h.notes
    ? `<p class="notes">${h.notes}</p>`
    : '';

  return `
    <article class="card" data-id="${h.id}" data-location="${h.location}">
      <div class="card-media">
        <img src="${h.image}" alt="Foto de ${h.title}" loading="lazy"
             onerror="this.closest('.card-media').style.background='var(--wave-back)'; this.remove();">
        <button class="fav-btn ${isFav ? 'active' : ''}" aria-pressed="${isFav}" aria-label="Marcar como favorita" data-id="${h.id}">
          ${isFav ? '♥' : '♡'}
        </button>
        ${ratingBadge}
      </div>
      <div class="card-body">
        <p class="card-location">📍 ${h.location}</p>
        <h2 class="card-title">${h.title}</h2>
        <p class="card-blurb">${h.blurb || ''}</p>
        <div class="stats-row">${statsLine(h)}</div>
        <div class="amenities">${amenities}</div>
        ${notes}
        <div class="card-footer">
          <a class="btn-primary" href="${h.url}" target="_blank" rel="noopener noreferrer">Ver en Airbnb ↗</a>
        </div>
      </div>
    </article>
  `;
}

function populateLocationFilter(houses) {
  const select = document.getElementById('filter-location');
  const locations = [...new Set(houses.map(h => h.location))].sort();
  locations.forEach(loc => {
    const opt = document.createElement('option');
    opt.value = loc;
    opt.textContent = loc;
    select.appendChild(opt);
  });
}

function sortHouses(houses, mode, favs) {
  const copy = [...houses];
  if (mode === 'rating') {
    copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (mode === 'beds') {
    copy.sort((a, b) => (b.beds || 0) - (a.beds || 0));
  } else if (mode === 'favorites') {
    copy.sort((a, b) => (favs.includes(b.id) ? 1 : 0) - (favs.includes(a.id) ? 1 : 0));
  }
  return copy;
}

async function init() {
  const grid = document.getElementById('grid');
  const emptyState = document.getElementById('empty-state');
  const countEl = document.getElementById('result-count');
  const locationFilter = document.getElementById('filter-location');
  const sortBy = document.getElementById('sort-by');

  let houses = [];
  try {
    const res = await fetch('houses.json', { cache: 'no-store' });
    houses = await res.json();
  } catch (err) {
    console.error('No se pudo cargar houses.json', err);
  }

  if (!houses.length) {
    emptyState.hidden = false;
    return;
  }

  populateLocationFilter(houses);

  function render() {
    const favs = getFavorites();
    const locVal = locationFilter.value;
    let filtered = locVal ? houses.filter(h => h.location === locVal) : houses;
    filtered = sortHouses(filtered, sortBy.value, favs);

    grid.innerHTML = filtered.map(h => cardTemplate(h, favs.includes(h.id))).join('');
    countEl.textContent = `${filtered.length} de ${houses.length} casas`;

    grid.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        toggleFavorite(id);
        render();
      });
    });
  }

  locationFilter.addEventListener('change', render);
  sortBy.addEventListener('change', render);

  render();
}

init();
