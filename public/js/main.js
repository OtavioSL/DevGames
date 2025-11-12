// 1. INICIALIZAÇÃO DO SWIPER CARROSSEL
const swiper = new Swiper(".mySwiper", {
    // Configurações básicas:
    slidesPerView: 1, // Exibe 1 slide por vez
    spaceBetween: 0,
    loop: true, // Faz o carrossel rodar infinitamente
    autoplay: {
        delay: 5000, // Tempo de espera de 5 segundos
        disableOnInteraction: false, // Continua o autoplay mesmo após interação do usuário
    },

    // Paginação (os pontinhos embaixo)
    pagination: {
        el: ".swiper-pagination",
        clickable: true, // Permite clicar nas bolinhas para mudar o slide
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
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