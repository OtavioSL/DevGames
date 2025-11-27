document.addEventListener('DOMContentLoaded', () => {
  const defaultAvatar = '../assets/images/avatar/avatar.jpg';

  const el = id => document.getElementById(id);

  const loggedOutSection = el('logged-out-content');
  const loggedInSection = el('logged-in-content');

  function getUsers() {
    try { return JSON.parse(localStorage.getItem('devgames_users') || '[]'); }
    catch { return []; }
  }
  function saveUsers(users) { localStorage.setItem('devgames_users', JSON.stringify(users)); }
  // retorna o objeto do usuário ativo salvo em localStorage pelo fluxo de login (contém name e email)
  function getActiveUser() {
    const raw = localStorage.getItem('devgames_active_user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  }

  // procura um usuário na lista por email (registro original guarda {name,email,password}).
  // se não existir, cria um registro enriquecido com campos usados pela conta (avatar, description, favorites, reviews)
  function findOrCreateUser(activeUser) {
    const users = getUsers();
    if (!activeUser || !activeUser.email) {
      // fallback: se activeUser não informado, retorna um usuário vazio
      return { email: null, name: '', avatar: null, description: '', favorites: [], reviews: [] };
    }
    let user = users.find(u => u.email === activeUser.email);
    if (!user) {
      user = { email: activeUser.email, name: activeUser.name || activeUser.email, avatar: null, description: '', favorites: [], reviews: [] };
      users.push(user);
      saveUsers(users);
    } else {
      // garante campos
      user.favorites = user.favorites || [];
      user.reviews = user.reviews || [];
      user.avatar = user.avatar || null;
      user.description = user.description || '';
      user.name = user.name || activeUser.name || user.email;
    }
    return user;
  }

  function saveUser(user) {
    const users = getUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx >= 0) users[idx] = user; else users.push(user);
    saveUsers(users);
  }

  function showLoggedIn(user) {
    if (loggedOutSection) loggedOutSection.classList.add('hidden');
    if (loggedInSection) loggedInSection.classList.remove('hidden');
    // populate fields
    // preenche o nome com o nome cadastrado
    el('profile-name').value = user.name || '';
    el('profile-description').value = user.description || '';
    el('account-avatar').src = user.avatar || defaultAvatar;
    renderFavorites(user);
    renderReviews(user);
    renderPublicReviews();
  }

  function showLoggedOut() {
    if (loggedInSection) loggedInSection.classList.add('hidden');
    if (loggedOutSection) loggedOutSection.classList.remove('hidden');
  }

  function renderFavorites(user) {
    const container = el('favorites-list');
    container.innerHTML = '';
    if (!user.favorites || user.favorites.length === 0) {
      container.innerHTML = '<p class="muted">Nenhum favorito ainda.</p>';
      return;
    }
    user.favorites.forEach((f, i) => {
      const card = document.createElement('div'); card.className = 'fav-card';
      const img = document.createElement('img'); img.src = f.img || '../assets/images/capasJogos/default_capa.jpg'; img.alt = f.title;
      const title = document.createElement('div'); title.className = 'fav-title'; title.textContent = f.title;
      const btn = document.createElement('button'); btn.className = 'btn-remove'; btn.textContent = 'Remover';
      btn.addEventListener('click', () => {
        user.favorites.splice(i,1); saveUser(user); renderFavorites(user);
      });
      card.appendChild(img); card.appendChild(title); card.appendChild(btn);
      container.appendChild(card);
    });
  }

  function renderReviews(user) {
    const container = el('reviews-list'); container.innerHTML = '';
    if (!user.reviews || user.reviews.length === 0) { container.innerHTML = '<p class="muted">Nenhuma review ainda.</p>'; return; }
    user.reviews.forEach((r, i) => {
      const card = document.createElement('div'); card.className = 'review-card';
      const h = document.createElement('h4'); h.textContent = r.title;
      const p = document.createElement('p'); p.textContent = r.content;
      const meta = document.createElement('div'); meta.className = 'review-meta'; meta.textContent = r.public ? 'Pública' : 'Privada';
      const btn = document.createElement('button'); btn.className = 'btn-remove'; btn.textContent = 'Remover';
      btn.addEventListener('click', () => { user.reviews.splice(i,1); saveUser(user); renderReviews(user); renderPublicReviews(); });
      card.appendChild(h); card.appendChild(meta); card.appendChild(p); card.appendChild(btn);
      container.appendChild(card);
    });
  }

  function renderPublicReviews() {
    const container = el('public-reviews-list'); container.innerHTML = '';
    const users = getUsers();
    const publicReviews = [];
    users.forEach(u => {
      (u.reviews||[]).forEach(r => { if (r.public) publicReviews.push({ user: u.username, avatar: u.avatar, title: r.title, content: r.content }); });
    });
    if (publicReviews.length === 0) { container.innerHTML = '<p class="muted">Nenhuma review pública publicada.</p>'; return; }
    publicReviews.forEach(pr => {
      const card = document.createElement('div'); card.className = 'review-card public';
      const header = document.createElement('div'); header.className = 'review-header';
      const img = document.createElement('img'); img.src = pr.avatar || defaultAvatar; img.className = 'small-avatar';
      const who = document.createElement('div'); who.textContent = pr.user;
      header.appendChild(img); header.appendChild(who);
      const h = document.createElement('h4'); h.textContent = pr.title;
      const p = document.createElement('p'); p.textContent = pr.content;
      card.appendChild(header); card.appendChild(h); card.appendChild(p);
      container.appendChild(card);
    });
  }

  // Tab switching
  document.querySelectorAll('.tab-links button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-links button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
      document.getElementById(tab).classList.remove('hidden');
    });
  });

  // main init: obtém o usuário ativo (objeto com name/email) e encontra/normaliza o registro local
  const active = getActiveUser();
  if (!active) { showLoggedOut(); return; }
  const user = findOrCreateUser(active);
  showLoggedIn(user);

  // Avatar upload preview and save
  el('avatar-input').addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => { el('account-avatar').src = reader.result; user.avatar = reader.result; saveUser(user); renderPublicReviews(); };
    reader.readAsDataURL(f);
  });

  el('save-profile').addEventListener('click', () => {
    user.name = el('profile-name').value.trim() || user.username;
    user.description = el('profile-description').value.trim();
    if (!user.avatar) user.avatar = null;
    saveUser(user);
    alert('Perfil salvo.');
    renderPublicReviews();
  });

  // Favorites
  el('add-fav').addEventListener('click', () => {
    const title = el('fav-title').value.trim(); const img = el('fav-img').value.trim();
    if (!title) { alert('Informe o título do jogo.'); return; }
    user.favorites = user.favorites || []; user.favorites.push({ title, img }); saveUser(user); renderFavorites(user);
    el('fav-title').value = ''; el('fav-img').value = '';
  });

  // Reviews
  el('add-review').addEventListener('click', () => {
    const title = el('review-title').value.trim(); const content = el('review-content').value.trim(); const isPublic = el('review-public').checked;
    if (!title || !content) { alert('Título e conteúdo são necessários.'); return; }
    user.reviews = user.reviews || []; user.reviews.push({ title, content, public: !!isPublic }); saveUser(user); renderReviews(user); renderPublicReviews();
    el('review-title').value = ''; el('review-content').value = ''; el('review-public').checked = false;
  });

});
