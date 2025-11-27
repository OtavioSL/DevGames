(function(){
  const LS_USER_KEY = 'devgames_active_user';
  const LS_FAVORITES_KEY = 'devgames_favorites';
  const LS_REVIEWS_KEY = 'devgames_reviews';

  function getUser(){
    try { return JSON.parse(localStorage.getItem(LS_USER_KEY)) || null; } catch(e){ return null; }
  }
  function getFavorites(){
    try { return JSON.parse(localStorage.getItem(LS_FAVORITES_KEY)) || []; } catch(e){ return []; }
  }
  function setFavorites(list){ localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(list)); }

  function getReviews(){
    try { return JSON.parse(localStorage.getItem(LS_REVIEWS_KEY)) || []; } catch(e){ return []; }
  }
  function setReviews(list){ localStorage.setItem(LS_REVIEWS_KEY, JSON.stringify(list)); }

  function renderProfileHeader(){
    const user = getUser();
    const usernameEl = document.getElementById('profile-username');
    const bioEl = document.getElementById('profile-bio');
    const avatarEl = document.getElementById('profile-page-avatar');
    if (!usernameEl || !bioEl || !avatarEl) return;
    usernameEl.textContent = (user && user.name) ? user.name : 'Seu Nome';
    bioEl.textContent = (user && user.bio) ? user.bio : 'Adicione uma breve descrição sobre você.';
    if (user && user.avatarUrl) avatarEl.src = user.avatarUrl;
  }

  function renderFavorites(){
    const list = getFavorites();
    const container = document.getElementById('favorites-list');
    const empty = document.getElementById('favorites-empty');
    if (!container || !empty) return;
    container.innerHTML = '';
    if (!list.length){ empty.classList.remove('hidden'); return; } else { empty.classList.add('hidden'); }
    list.forEach(game => {
      const card = document.createElement('div');
      card.className = 'favorite-card';
      card.innerHTML = `
        <img src="${game.img}" alt="${game.name}">
        <div class="favorite-details">
          <h4>${game.name}</h4>
          <p class="favorite-genre">${(game.genre || []).join(', ')}</p>
          <div class="favorite-actions">
            <a href="${game.href || '#'}" target="_blank" class="btn-secondary">Ver</a>
            <button class="btn-remove" data-id="${game.id}">Remover</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-remove');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const updated = getFavorites().filter(g => String(g.id) !== String(id));
      setFavorites(updated);
      renderFavorites();
    });
  }

  function renderReviews(){
    const list = getReviews();
    const container = document.getElementById('reviews-list');
    const empty = document.getElementById('reviews-empty');
    if (!container || !empty) return;
    container.innerHTML = '';
    if (!list.length){ empty.classList.remove('hidden'); return; } else { empty.classList.add('hidden'); }
    list.forEach((rev, idx) => {
      const item = document.createElement('div');
      item.className = 'review-item';
      const coverHtml = rev.cover ? `<img class="review-cover" src="${rev.cover}" alt="Capa de ${rev.game}">` : '';
      const genreHtml = rev.genre && rev.genre.length ? `<span class="review-genre">${rev.genre.join(', ')}</span>` : '';
      item.innerHTML = `
        <div class="review-head">
          ${coverHtml}
          <div class="review-title">
            <strong>${rev.game}</strong>
            ${genreHtml}
          </div>
          <span class="review-rating">Nota: ${rev.rating}/10</span>
        </div>
        <p class="review-text">${rev.text}</p>
        <div class="review-actions">
          <button class="btn-secondary btn-edit" data-index="${idx}">Editar</button>
          <button class="btn-remove btn-delete" data-index="${idx}">Excluir</button>
        </div>
      `;
      container.appendChild(item);
    });

    container.addEventListener('click', (e) => {
      const del = e.target.closest('.btn-delete');
      const edit = e.target.closest('.btn-edit');
      if (del){
        const idx = Number(del.getAttribute('data-index'));
        const arr = getReviews();
        arr.splice(idx,1);
        setReviews(arr);
        renderReviews();
      } else if (edit){
        const idx = Number(edit.getAttribute('data-index'));
        const arr = getReviews();
        const r = arr[idx];
        const newText = prompt('Editar review:', r.text);
        if (newText !== null){ r.text = newText; setReviews(arr); renderReviews(); }
      }
    });
  }

  function setupReviewForm(){
    const form = document.getElementById('review-form');
    if (!form) return;
    // Sugestões de jogos
    const gameInput = document.getElementById('review-game');
    const suggestionsBox = document.getElementById('game-suggestions');
    let selectedGame = null;

    function closeSuggestions(){ if (suggestionsBox) suggestionsBox.classList.add('hidden'); }
    function openSuggestions(){ if (suggestionsBox) suggestionsBox.classList.remove('hidden'); }
    function renderSuggestions(query){
      if (!suggestionsBox) return;
      const games = (window.jogos || []).filter(j => j.infos.name.toLowerCase().includes(query.toLowerCase()));
      suggestionsBox.innerHTML = '';
      if (!games.length){ closeSuggestions(); return; }
      games.slice(0, 10).forEach(j => {
        const item = document.createElement('div');
        item.className = 'game-suggestion-item';
        item.setAttribute('role','option');
        item.innerHTML = `<img class="game-suggestion-thumb" src="${j.img.src}" alt="${j.img.alt}"> <span class="game-suggestion-name">${j.infos.name}</span>`;
        item.addEventListener('click', () => {
          if (gameInput) gameInput.value = j.infos.name;
          selectedGame = j;
          closeSuggestions();
        });
        suggestionsBox.appendChild(item);
      });
      openSuggestions();
    }

    if (gameInput){
      gameInput.addEventListener('input', (e) => {
        selectedGame = null;
        const q = e.target.value.trim();
        if (q.length >= 2) renderSuggestions(q); else closeSuggestions();
      });
      gameInput.addEventListener('focus', () => {
        const q = gameInput.value.trim();
        if (q.length >= 2) renderSuggestions(q);
      });
      document.addEventListener('click', (e) => {
        if (!suggestionsBox) return;
        const inside = e.target.closest && e.target.closest('.game-search');
        if (!inside) closeSuggestions();
      });
    }
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const gameInputEl = document.getElementById('review-game');
      const game = gameInputEl ? gameInputEl.value.trim() : '';
      const rating = Number(document.getElementById('review-rating').value);
      const text = document.getElementById('review-text').value.trim();
      if (!game || !text) return;
      const reviews = getReviews();
      const payload = { game, rating, text, date: new Date().toISOString() };
      if (selectedGame){
        payload.gameId = selectedGame.id;
        payload.cover = selectedGame.img && selectedGame.img.src;
        payload.genre = selectedGame.infos && selectedGame.infos.genre;
      }
      reviews.unshift(payload);
      setReviews(reviews);
      form.reset();
      renderReviews();
    });
  }

  function toggleLoggedState(){
    const user = getUser();
    const loggedOut = document.getElementById('logged-out-content');
    const profileContent = document.getElementById('profile-content');
    if (!loggedOut || !profileContent) return;
    if (user){
      loggedOut.classList.add('hidden');
      profileContent.classList.remove('hidden');
    } else {
      loggedOut.classList.remove('hidden');
      profileContent.classList.add('hidden');
    }
  }

  // Expor funções para outras páginas (catálogo) atualizarem favoritos
  window.DevGamesProfile = {
    addFavorite(game){
      const list = getFavorites();
      const exists = list.some(g => String(g.id) === String(game.id));
      if (!exists){ list.push(game); setFavorites(list); renderFavorites(); }
    },
    removeFavorite(id){
      setFavorites(getFavorites().filter(g => String(g.id) !== String(id)));
      renderFavorites();
    },
    listFavorites(){ return getFavorites(); }
  };

  document.addEventListener('DOMContentLoaded', () => {
    toggleLoggedState();
    renderProfileHeader();
    renderFavorites();
    renderReviews();
    setupReviewForm();

    // Modal editar perfil
    const editBtn = document.getElementById('edit-profile-btn');
    const modal = document.getElementById('edit-profile-modal');
    const closeBtn = document.getElementById('edit-profile-close');
    const cancelBtn = document.getElementById('edit-profile-cancel');
    const form = document.getElementById('edit-profile-form');

    function openModal(){
      if (!modal) return;
      // Preenche com dados atuais
      const user = getUser() || {};
      const nameInput = document.getElementById('edit-name');
      const bioInput = document.getElementById('edit-bio');
      const extraInput = document.getElementById('edit-extra');
      if (nameInput) nameInput.value = user.name || '';
      if (bioInput) bioInput.value = user.bio || '';
      if (extraInput) extraInput.value = user.extra || '';
      modal.classList.remove('hidden');
      document.body.classList.add('no-scroll');
    }
    function closeModal(){
      if (!modal) return;
      modal.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
    if (editBtn) editBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) closeModal();
    });

    if (form){
      form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const current = getUser() || {};
        const name = document.getElementById('edit-name').value.trim();
        const bio = document.getElementById('edit-bio').value.trim();
        const extra = document.getElementById('edit-extra').value.trim();
        const avatarFile = document.getElementById('edit-avatar').files[0];

        function saveUser(avatarUrl){
          const updated = { ...current, name, bio, extra };
          if (avatarUrl) updated.avatarUrl = avatarUrl;
          localStorage.setItem('devgames_active_user', JSON.stringify(updated));
          // Atualiza header do perfil
          renderProfileHeader();
          closeModal();
        }

        if (avatarFile){
          const reader = new FileReader();
          reader.onload = function(){ saveUser(reader.result); };
          reader.readAsDataURL(avatarFile);
        } else {
          saveUser(null);
        }
      });
    }
  });
})();
