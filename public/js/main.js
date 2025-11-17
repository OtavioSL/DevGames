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