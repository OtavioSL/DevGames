// Adiciona botão de favorito aos cards estáticos da home e sincroniza com perfil
(function(){
  function isFavByName(name){
    try {
      const favs = JSON.parse(localStorage.getItem('devgames_favorites')) || [];
      return favs.some(g => String(g.name).toLowerCase() === String(name).toLowerCase());
    } catch(e){ return false; }
  }
  function addFavorite(payload){
    if (window.DevGamesProfile && typeof window.DevGamesProfile.addFavorite === 'function'){
      window.DevGamesProfile.addFavorite(payload);
      return true;
    }
    try {
      const list = JSON.parse(localStorage.getItem('devgames_favorites')) || [];
      if (!list.some(g => String(g.name).toLowerCase() === String(payload.name).toLowerCase())){
        list.push(payload);
        localStorage.setItem('devgames_favorites', JSON.stringify(list));
      }
      return true;
    } catch(e){ return false; }
  }

  function enhanceHomeCards(){
    document.querySelectorAll('.game-grid .game-card').forEach(card => {
      const titleEl = card.querySelector('h4');
      const imgEl = card.querySelector('img');
      if (!titleEl || !imgEl) return;
      const name = titleEl.textContent.trim();
      const isFav = isFavByName(name);
      // cria header row se não existir
      let header = card.querySelector('.game-header-row');
      if (!header){
        header = document.createElement('div');
        header.className = 'game-header-row';
        card.insertBefore(header, titleEl);
        header.appendChild(titleEl);
      }
      const btn = document.createElement('button');
      btn.className = 'fav-heart' + (isFav ? ' favorited' : '');
      btn.setAttribute('aria-label','Favoritar');
      btn.setAttribute('title','Favoritar');
      btn.textContent = '❤';
      if (isFav) btn.setAttribute('aria-pressed','true');
      header.appendChild(btn);

      btn.addEventListener('click', () => {
        const payload = { id: name, name, img: imgEl.getAttribute('src'), genre: [], href: card.querySelector('a.btn-secondary')?.getAttribute('href') || '#' };
        const ok = addFavorite(payload);
        if (ok){
          btn.classList.add('favorited');
          btn.setAttribute('aria-pressed','true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', enhanceHomeCards);
})();
