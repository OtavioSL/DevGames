// O array 'jogos' é importado do gameList.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERÊNCIAS DE ELEMENTOS ---
    // Menu Mobile
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

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
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('menu-open');
            });

            const menuLinks = mobileMenu.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('menu-open');
                });
            });
        }
    }


    // --- 4. INICIALIZAÇÃO E EVENT LISTENERS ---
    
    // 4.1. Configura o Menu Mobile
    setupMobileMenu();

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

