// O array 'jogos' é importado do gameList.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERÊNCIAS DE ELEMENTOS ---
    // Menu Mobile
    const menuToggle = document.getElementById('menu-toggle');
    let mobileMenu = document.getElementById('mobile-menu');

    // Se não existir um elemento com id 'mobile-menu' (algumas páginas não o têm), clonamos a nav desktop
    if (!mobileMenu) {
        const desktopNav = document.querySelector('.main-nav');
        if (desktopNav) {
            try {
                mobileMenu = desktopNav.cloneNode(true);
                mobileMenu.id = 'mobile-menu';
                mobileMenu.classList.add('main-nav');
                // Garantir que não fique visível em desktop até que a classe menu-open seja aplicada
                mobileMenu.classList.remove('menu-open');
                document.body.insertBefore(mobileMenu, document.body.firstChild);
            } catch (err) {
                // Falha ao clonar não é crítica; seguimos sem menu mobile
                console.warn('Não foi possível clonar a nav para o mobile menu:', err);
            }
        }
    }

    // Catálogo/Filtros (catalogo.html)
    const genreSelect = document.getElementById('genre-select');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const gameListContainer = document.getElementById('gameList'); // Container onde os cards são renderizados
    const sortSelect = document.getElementById('sort-select'); // NOVO: Elemento para ordenação

    
    // --- 2. FUNÇÕES DE RENDERIZAÇÃO E FILTRAGEM ---

    /**
     * @description Cria e insere os cards de jogo no container.
     * @param {Array} games - Array de objetos de jogo a serem renderizados.
     */
    function renderGames(games) {
        if (!gameListContainer) return; // Sai se não estiver na página de catálogo
        
        gameListContainer.innerHTML = ''; // Limpa o conteúdo anterior
        
        if (games.length === 0) {
            gameListContainer.innerHTML = '<p class="no-results-message">Nenhum jogo encontrado com os filtros aplicados.</p>';
            return;
        }

        games.forEach(jogo => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            // Lógica para formatar o preço (remove 'R$ ' e substitui vírgula por ponto para conversão)
            const priceValue = parseFloat(jogo.infos.price.replace('R$ ', '').replace(',', '.'));
            
            card.innerHTML = `
                <img src="${jogo.img.src}" alt="${jogo.img.alt}">
                <h4>${jogo.infos.name}</h4>
                <p class="game-price" data-price="${priceValue}">${jogo.infos.price}</p>
                <p class="game-impact">${jogo.infos.theme}</p>
                <a href="${jogo.infos.href}" class="btn-secondary" target="_blank">Comprar</a>
            `;
            gameListContainer.appendChild(card);
        });
    }

    /**
     * @description Aplica todos os filtros e a ordenação atuais.
     */
    function filterAndSortGames() {
        if (!window.jogos) return; // Certifica-se que o array global está disponível
        let currentGames = [...window.jogos]; // Cria uma cópia para filtrar e ordenar
        // --- A. FILTRAGEM ---
        const selectedGenre = genreSelect ? genreSelect.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';

        currentGames = currentGames.filter(jogo => {
            const cardGenres = jogo.infos.genre; // Array de gêneros
            const cardTitle = jogo.infos.name.toLowerCase(); 

            // Critério 1: Gênero
            const matchesGenre = selectedGenre === 'all' || cardGenres.includes(selectedGenre);

            // Critério 2: Busca por Nome
            const matchesSearch = cardTitle.includes(searchTerm);
            
            return matchesGenre && matchesSearch;
        });
        
        // --- B. ORDENAÇÃO (Será implementada na próxima etapa) ---
        const sortValue = sortSelect ? sortSelect.value : 'recent';
        
        // TODO: Adicionar a lógica de ordenação aqui

        // --- C. RENDERIZAÇÃO ---
        renderGames(currentGames);
    }
    
    // --- 3. LÓGICA DO MENU MOBILE ---

    function setupMobileMenu() {
        if (menuToggle && mobileMenu) {
            // define estado inicial acessível
            menuToggle.setAttribute('aria-controls', mobileMenu.id || 'mobile-menu');
            menuToggle.setAttribute('aria-expanded', 'false');
            // display control via CSS transform; do not force display here
            // Alterna visibilidade e acessibilidade
            menuToggle.addEventListener('click', (e) => {
                const opened = mobileMenu.classList.toggle('menu-open');
                menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
                // Atualiza ícone do botão (hamburger -> fechar)
                menuToggle.textContent = opened ? '✕' : '☰';
                // Evita scroll do body quando o menu estiver aberto
                document.body.classList.toggle('no-scroll', opened);
                // Backdrop (drawer estilo YouTube)
                toggleBackdrop(opened);
                // Em mobile, garante que o menu de usuário esteja dentro do drawer
                manageProfileMenuInDrawer();
            });

            // Fecha o menu ao clicar em qualquer link interno
            const menuLinks = mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    // Fecha o menu visualmente antes da navegação
                    mobileMenu.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.textContent = '☰';
                    document.body.classList.remove('no-scroll');
                    toggleBackdrop(false);
                });
            });

            // Fecha ao clicar fora do menu
            document.addEventListener('click', (ev) => {
                if (!mobileMenu.classList.contains('menu-open')) return;
                const isClickInside = ev.target.closest && ev.target.closest('#mobile-menu, #menu-toggle');
                const isBackdrop = ev.target.classList && ev.target.classList.contains('mobile-backdrop');
                if (!isClickInside || isBackdrop) {
                    mobileMenu.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll');
                    toggleBackdrop(false);
                }
            });

            // Fecha com Esc
            document.addEventListener('keydown', (ev) => {
                if (ev.key === 'Escape' && mobileMenu.classList.contains('menu-open')) {
                    mobileMenu.classList.remove('menu-open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.classList.remove('no-scroll');
                    toggleBackdrop(false);
                }
            });
        }
    }

    // Move o menu de usuário (dropdown) para dentro do drawer em mobile e retorna em desktop
    function manageProfileMenuInDrawer(){
        const profileContainer = document.getElementById('profile-menu-container');
        const profileDropdown = document.getElementById('profile-dropdown-content');
        if (!mobileMenu || !profileDropdown || !profileContainer) return;

        const isMobile = window.innerWidth <= 768;
        // Placeholder para restaurar em desktop
        let placeholder = document.getElementById('profile-dropdown-placeholder');
        if (!placeholder){
            placeholder = document.createElement('div');
            placeholder.id = 'profile-dropdown-placeholder';
            profileContainer.parentNode.insertBefore(placeholder, profileContainer.nextSibling);
        }

        if (isMobile){
            // Move dropdown para dentro do drawer e torna visível como lista
            if (!mobileMenu.contains(profileDropdown)){
                mobileMenu.appendChild(profileDropdown);
                profileDropdown.classList.remove('hidden');
            }
        } else {
            // Retorna dropdown para o container original e mantém comportamento padrão
            if (!profileContainer.contains(profileDropdown)){
                profileContainer.appendChild(profileDropdown);
                // Em desktop, mantém o estado oculto até o avatar abrir
                if (!profileDropdown.classList.contains('hidden')){
                    profileDropdown.classList.add('hidden');
                }
            }
        }
    }


    // --- 4. INICIALIZAÇÃO E EVENT LISTENERS ---
    
    // 4.1. Configura o Menu Mobile
    setupMobileMenu();
    // 4.1.1. Ajusta a posição do menu de usuário conforme viewport
    manageProfileMenuInDrawer();

    // 4.2. Configura os Listeners do Catálogo
    if (gameListContainer) { // Só executa a lógica do catálogo se os elementos existirem
        
        // Inicializa a renderização de todos os jogos
        renderGames(window.jogos); 

        // Listeners para Filtros
        if (genreSelect) {
            genreSelect.addEventListener('change', filterAndSortGames);
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', filterAndSortGames); // NOVO: Listener para ordenação
        }
        if (searchButton) {
            searchButton.addEventListener('click', filterAndSortGames);
        }
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    filterAndSortGames();
                }
            });
        }
    }

});

// Backdrop para o drawer mobile (inserido ao final para escopo global)
function toggleBackdrop(show){
    let backdrop = document.querySelector('.mobile-backdrop');
    if (show){
        if (!backdrop){
            backdrop = document.createElement('div');
            backdrop.className = 'mobile-backdrop';
            document.body.appendChild(backdrop);
        }
        backdrop.style.display = 'block';
    } else if (backdrop){
        backdrop.style.display = 'none';
    }
}

// Reage a mudanças de tamanho de janela para reposicionar o menu de usuário
window.addEventListener('resize', () => {
    try { if (typeof manageProfileMenuInDrawer === 'function') manageProfileMenuInDrawer(); } catch(e){}
});

function filterGames() {
    // 1. OBTÉM os valores de filtro
    const selectedGenre = genreSelect ? genreSelect.value : 'all';
    // 🚨 Obtém o valor do input de busca
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : ''; 
    
    // Filtra o array 'jogos' (que está em gameList.js)
    const filteredGames = jogos.filter(jogo => {
        const cardGenres = jogo.infos.genre;
        const cardTitle = jogo.infos.name.toLowerCase(); 

        // Critério 1: Gênero
        const matchesGenre = selectedGenre === 'all' || cardGenres.includes(selectedGenre);

        // Critério 2: Busca por Nome
        const matchesSearch = cardTitle.includes(searchTerm);
        
        // Retorna apenas se atender a AMBOS os critérios
        return matchesGenre && matchesSearch;
    });

    // 2. RENDERIZA OS JOGOS FILTRADOS
    renderGames(filteredGames);
}

// 5. INICIALIZAÇÃO DO SWIPER (FORA DO DOMContentLoaded, pois já é um objeto global)
// A função 'animateSlideContent' e os listeners do swiper devem vir aqui,
// se o swiper estiver sendo usado em 'index.html' e você estiver reutilizando main.js.

// (SE O CÓDIGO DO SWIPER ESTAVA AQUI, DEIXE-O AQUI)
/*
const swiper = new Swiper(".mySwiper", { 
    // ... suas configurações de swiper
});

function animateSlideContent(slideElement) { //... }

swiper.on('slideChangeTransitionEnd', function () { //... });
*/
// FIM DO SWIPER

// --------------------------------------------------------------------------------

// Funções 'animateSlideContent' e 'swiper' não estavam completas no snippet,
// mas o bloco de código acima garante que elas podem ser coladas aqui, no final do arquivo, se necessário.
// mas o bloco de código acima garante que elas podem ser coladas aqui, no final do arquivo, se necessário.
// mas o bloco de código acima garante que elas podem ser coladas aqui, no final do arquivo, se necessário.
// mas o bloco de código acima garante que elas podem ser coladas aqui, no final do arquivo, se necessário.

