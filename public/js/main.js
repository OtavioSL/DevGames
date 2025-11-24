document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO MENU MOBILE ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            // Alterna a classe que define se o menu está aberto ou fechado
            mobileMenu.classList.toggle('menu-open');
        });

        // Opcional: Fechar o menu se o usuário clicar em um link (para mobile)
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('menu-open');
            });
        });
    }
});

// 1. INICIALIZAÇÃO DO SWIPER CARROSSEL
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    autoplay: {
        delay: 5000, 
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// FUNÇÃO PARA GERENCIAR ANIMAÇÕES DOS SLIDES
function animateSlideContent(slideElement) {
    // Remove animações antigas para resetar
    const animatedElements = slideElement.querySelectorAll('.active-animation');
    animatedElements.forEach(el => {
        el.classList.remove('active-animation');
        // Força reflow para resetar a animação
        void el.offsetWidth; 
    });

    // Adiciona as classes para a animação começar no próximo frame
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.classList.add('active-animation');
        });
    }, 50); // Pequeno atraso para garantir o reset antes de adicionar
}

// Eventos do Swiper para disparar a animação
swiper.on('slideChangeTransitionEnd', function () {
    const activeSlide = swiper.slides[swiper.activeIndex];
    animateSlideContent(activeSlide);
});

// Dispara a animação no carregamento da página para o primeiro slide
document.addEventListener('DOMContentLoaded', () => {
    const initialActiveSlide = swiper.slides[swiper.activeIndex];
    animateSlideContent(initialActiveSlide);
});


// 2. FUNCIONALIDADE DE NAVEGAÇÃO MOBILE (Para o botão de menu)
// Vamos simular que você adicionou um botão de menu (hamburguer) no seu HTML
// Ex: <button class="menu-toggle">☰</button>

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        // Alterna a classe 'active' para mostrar/esconder o menu
        mainNav.classList.toggle('active');
    });
}

// 3. EFEITO DE CLIQUE SIMPLES NO CARD DO JOGO
// Adiciona um feedback visual quando o usuário clica para "comprar"
document.addEventListener('DOMContentLoaded', () => {
    const buyButtons = document.querySelectorAll('.game-card .btn-secondary');

    buyButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Previne que o link vá para outra página imediatamente
            event.preventDefault();

            // Adiciona um feedback visual rápido
            button.textContent = 'Adicionado ao Carrinho!';
            button.style.backgroundColor = '#28a745'; // Verde de sucesso

            // Opcional: Volta ao estado original após 2 segundos
            setTimeout(() => {
                button.textContent = 'Comprar';
                button.style.backgroundColor = '#007bff'; // Azul original
            }, 2000);
        });
    });
});

// =========================================================
// 4. LÓGICA DE FILTRAGEM E BUSCA DO CATÁLOGO (catalogo.html)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de catálogo
    const gameGridElement = document.querySelector('.game-grid');
    if (!gameGridElement) return; // Sai se não for a página do catálogo

    // ELEMENTOS DO FILTRO
    const genreSelect = document.getElementById('genre-select');
    const searchInput = document.getElementById('game-search');
    const searchButton = document.getElementById('search-button');

    // 1. FUNÇÃO PRINCIPAL DE FILTRAGEM (Filtra o array 'jogos' e renderiza)
    function filterGames() {
        // Obtém os valores de filtro
        const selectedGenre = genreSelect ? genreSelect.value : 'all';
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        
        // Filtra o array 'jogos' (que está em gameList.js)
        const filteredGames = jogos.filter(jogo => {
            const cardGenres = jogo.infos.genre; // Array de gêneros
            const cardTitle = jogo.infos.name.toLowerCase(); 

            // Critério 1: Gênero (Checa se o array do jogo INCLUI o gênero selecionado)
            const matchesGenre = selectedGenre === 'all' || cardGenres.includes(selectedGenre);

            // Critério 2: Busca por Nome (Checa se o nome do jogo INCLUI o termo de busca)
            const matchesSearch = cardTitle.includes(searchTerm);
            
            // Retorna apenas se atender a AMBOS os critérios
            return matchesGenre && matchesSearch;
        });

        // 2. RENDERIZA OS JOGOS FILTRADOS
        renderGames(filteredGames);
    }
    
    // 3. INICIALIZAÇÃO
    // RENDERIZA TODOS OS JOGOS NA PRIMEIRA VEZ
    renderGames(jogos); 

    // 4. ADICIONA LISTENERS
    if (genreSelect) {
        genreSelect.addEventListener('change', filterGames);
    }
    if (searchButton) {
        searchButton.addEventListener('click', filterGames);
    }
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                filterGames();
            }
        });
    }

});

// --- ELEMENTOS DO HEADER ---
const loginContainer = document.getElementById('login-button-container');
const profileContainer = document.getElementById('profile-menu-container');
const logoutButton = document.getElementById('btn-logout');

// --- LÓGICA DE ALTERNÂNCIA DO HEADER ---
function renderHeader(isLoggedIn) {
    if (loginContainer && profileContainer) {
        if (isLoggedIn) {
            // Se logado: Esconde o botão de Login e mostra o Menu de Perfil
            loginContainer.classList.add('hidden');
            profileContainer.classList.remove('hidden');
        } else {
            // Se deslogado: Mostra o botão de Login e esconde o Menu de Perfil
            loginContainer.classList.remove('hidden');
            profileContainer.classList.add('hidden');
        }
    }
}

