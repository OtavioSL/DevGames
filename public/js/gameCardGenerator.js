// public/js/gameCardGenerator.js
// Renderer and controls for the game cards, with filters and favorite-heart
(() => {
    const container = document.querySelector('#gameList');
    if (!container) return;

    function parsePrice(text) {
        if (!text) return Number.POSITIVE_INFINITY;
        const num = text.replace(/[^0-9,,-.]/g, '').replace(',', '.');
        const v = parseFloat(num);
        return Number.isFinite(v) ? v : Number.POSITIVE_INFINITY;
    }

    function sanitizeGenres(arr) {
        // normaliza texto removendo acentos e espaços extras
            return (arr || []).map(g => {
                const s = String(g || '');
                const lower = s.toLowerCase();
                if (typeof lower.normalize === 'function') {
                    return lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
                }
                return lower.trim();
            });
    }

    function escapeHtml(s){ return String(s).replace(/"/g, '&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

    function createCard(jogo, index) {
        const { img, infos } = jogo;
        const genresArr = Array.isArray(infos.genre) ? infos.genre : [];
        const genres = genresArr.length ? genresArr.join(',') : '';
        const priceVal = parsePrice(infos.price || '');
        // estado favorito inicial
        let isFav = false;
        try {
            const favs = (window.DevGamesProfile && typeof window.DevGamesProfile.listFavorites === 'function')
                ? window.DevGamesProfile.listFavorites()
                : (JSON.parse(localStorage.getItem('devgames_favorites')) || []);
            const id = jogo.id != null ? String(jogo.id) : null;
            isFav = favs.some(g => id ? String(g.id) === id : (String(g.name).toLowerCase() === String(infos.name).toLowerCase()));
        } catch(e){ isFav = false; }

                return `
        <div class="game-card" data-genre="${genres}" data-price="${priceVal}" data-index="${index}">
                <div class="card-image-wrap">
                    <img src="${img.src}" alt="${img.alt}">
                </div>
                <div class="game-header-row">
                    <h4>${infos.name}</h4>
                    <button class="fav-heart${isFav ? ' favorited' : ''}" aria-label="Favoritar" title="Favoritar" data-title="${escapeHtml(infos.name)}" data-img="${img.src}" ${isFav ? 'aria-pressed=\"true\"' : ''}>&#10084;</button>
                </div>
        <p class="game-price">${infos.price}</p>
        <p class="game-genres">${genresArr.map(info => `<span class=\"genre-tag\">${info}</span>`).join('')}</p>
        <p class="game-impact">${infos.theme}</p>
        <div class="card-actions">
          <a href="${infos.href}" target="_blank" class="btn-secondary">Comprar</a>
        </div>
    </div>`;
    }

    // render a list of jogos
    function renderList(list) {
        let html = '';
        for (let i = 0; i < list.length; i++) html += createCard(list[i], list[i].__originalIndex || i);
        container.innerHTML = html;
        ensureHearts();
    }

    // inicial: normaliza dados e marca índice original
    function normalizeText(s){
        const t = String(s || '').toLowerCase();
        return typeof t.normalize === 'function' ? t.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : t;
    }
    function inferGenres(j){
        const infos = j.infos || {};
        const base = (Array.isArray(infos.genre) ? infos.genre.slice() : []).map(g => normalizeText(g));
        const theme = normalizeText(infos.theme);
        const name = normalizeText(infos.name);
        const out = new Set(base);
        // heurísticas simples a partir de theme/nome
        if (theme.includes('acao') || theme.includes('action') || name.includes('action')) out.add('action');
        if (theme.includes('estrategia') || theme.includes('strategy') || name.includes('strategy')) out.add('strategy');
        if (theme.includes('rpg') || name.includes('rpg')) out.add('rpg');
        // Retorna em inglês (já normalizado)
        return Array.from(out);
    }
    if (window.jogos && Array.isArray(window.jogos)) {
        window.jogos.forEach((j, idx) => {
            j.__originalIndex = idx;
            // Preenche infos.genre se estiver ausente usando heurística
            if (!j.infos) j.infos = {};
            const inferred = inferGenres(j);
            if (!Array.isArray(j.infos.genre) || j.infos.genre.length === 0) {
                j.infos.genre = inferred;
            }
        });
    }

    // filtering logic
    function applyFilters() {
        const search = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
        const genreRaw = (document.getElementById('genre-select')?.value || 'all');
        let genre = String(genreRaw || 'all').toLowerCase().trim();
        if (typeof genre.normalize === 'function') genre = genre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const sort = (document.getElementById('sort-select')?.value || 'recent');

        const allItems = (window.jogos || []).slice();

        // Consideramos filtro ativo apenas busca ou seleção de gênero
        const filtersActive = Boolean(search) || (genre && genre !== 'all');

        let items = allItems;

        // Se nenhum filtro ativo, mostramos a lista completa (mantendo ordem 'recent' por padrão)
        if (filtersActive) {
            if (search) items = items.filter(j => (j.infos.name || '').toLowerCase().includes(search));
            if (genre && genre !== 'all') {
                // Normaliza gêneros dos itens (dataset em inglês), compara exato ou substring
                items = items.filter(j => {
                    const rawGenres = (j.infos && j.infos.genre) || [];
                    const gset = sanitizeGenres(rawGenres).map(g => g.normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
                    return gset.includes(genre) || gset.some(g => g.includes(genre));
                });
            }
        }

        // Aplicar ordenação sempre (não conta como filtro)
        if (sort === 'price-asc') items.sort((a,b)=> parsePrice(a.infos.price) - parsePrice(b.infos.price));
        else if (sort === 'price-desc') items.sort((a,b)=> parsePrice(b.infos.price) - parsePrice(a.infos.price));
        else if (sort === 'recent') items.sort((a,b)=> (a.__originalIndex||0) - (b.__originalIndex||0));

        // Render
        if (!items || items.length === 0) {
            container.innerHTML = '<p class="no-results">Nenhum jogo encontrado.</p>';
        } else {
            renderList(items);
        }

        // Atualiza contador de resultados, se o elemento existir
        const recEl = document.querySelector('.filter-recommendation p');
        if (recEl) recEl.textContent = `${items.length} jogo${items.length !== 1 ? 's' : ''} encontrado${items.length !== 1 ? 's' : ''}!`;
    }

    // Log de auditoria: gêneros únicos presentes no dataset
    try {
        const all = (window.jogos || []).flatMap(j => (Array.isArray(j.infos?.genre) ? j.infos.genre : []));
        const norm = all.map(g => {
            const s = String(g || '').toLowerCase();
            return typeof s.normalize === 'function' ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : s;
        });
        const unique = Array.from(new Set(norm)).sort();
        if (unique.length) console.log('[DevGames] Generos encontrados (normalizados EN):', unique);
    } catch(e) { /* noop */ }

    // initial render
    applyFilters();

    // wire controls
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const genreSelect = document.getElementById('genre-select');
    const sortSelect = document.getElementById('sort-select');

    if (searchButton) searchButton.addEventListener('click', applyFilters);
    if (searchInput) searchInput.addEventListener('input', ()=>{ applyFilters(); });
    if (genreSelect) genreSelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);
    // Garantir coração presente mesmo se algum card vier sem header-row
    function ensureHearts(){
        const favs = (window.DevGamesProfile && typeof window.DevGamesProfile.listFavorites === 'function')
            ? window.DevGamesProfile.listFavorites()
            : (JSON.parse(localStorage.getItem('devgames_favorites')) || []);
        document.querySelectorAll('#gameList .game-card').forEach(card => {
            const titleEl = card.querySelector('h4');
            if (!titleEl) return;
            let header = card.querySelector('.game-header-row');
            if (!header){
                header = document.createElement('div');
                header.className = 'game-header-row';
                card.insertBefore(header, titleEl);
                header.appendChild(titleEl);
            }
            let btn = header.querySelector('.fav-heart');
            if (!btn){
                const title = titleEl.textContent.trim();
                const isFav = favs.some(g => String(g.name).toLowerCase() === title.toLowerCase());
                btn = document.createElement('button');
                btn.className = 'fav-heart' + (isFav ? ' favorited' : '');
                btn.setAttribute('aria-label','Favoritar');
                btn.setAttribute('title','Favoritar');
                btn.setAttribute('data-title', title);
                const img = card.querySelector('img')?.getAttribute('src') || '';
                btn.setAttribute('data-img', img);
                if (isFav) btn.setAttribute('aria-pressed','true');
                btn.innerHTML = '&#10084;';
                header.appendChild(btn);
            }
        });
    }

    // delegated favorite (heart) handler
    document.addEventListener('click', (e) => {
        const btn = e.target.closest && e.target.closest('.fav-heart');
        if (!btn) return;
        const title = btn.getAttribute('data-title');
        const img = btn.getAttribute('data-img');
        // tenta obter jogo pela lista para ter id/gênero/href
        const game = (window.jogos || []).find(j => j.infos && j.infos.name === title);
        const payload = {
            id: game && game.id != null ? game.id : title,
            name: title,
            img: img,
            genre: game && game.infos && game.infos.genre ? game.infos.genre : [],
            href: game && game.infos && game.infos.href ? game.infos.href : '#'
        };
        if (window.DevGamesProfile && typeof window.DevGamesProfile.addFavorite === 'function') {
            window.DevGamesProfile.addFavorite(payload);
            btn.classList.add('favorited');
            btn.setAttribute('aria-pressed','true');
        } else {
            // fallback localStorage para páginas sem profile.js
            try {
                const list = JSON.parse(localStorage.getItem('devgames_favorites')) || [];
                if (!list.some(g => String(g.id) === String(payload.id))) {
                    list.push(payload);
                    localStorage.setItem('devgames_favorites', JSON.stringify(list));
                }
                btn.classList.add('favorited');
                btn.setAttribute('aria-pressed','true');
            } catch(err){ /* noop */ }
        }
    });

})();