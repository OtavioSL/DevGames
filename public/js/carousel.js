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
    // Tornar responsivo: em telas pequenas manter 1 slide com height menor
    breakpoints: {
        // quando largura >= 768px
        768: {
            slidesPerView: 1,
            spaceBetween: 0,
        },
        // quando largura >= 1024px (desktop) mantenha o mesmo comportamento
        1024: {
            slidesPerView: 1,
            spaceBetween: 0,
        }
    },
    // Habilita arrastar/slide por toque em mobile
    simulateTouch: true,
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

// Ajusta comportamento ao redimensionar: reduz altura do wrapper em telas pequenas
function adjustCarouselForViewport() {
    const wrap = document.querySelector('.slide-content-wrapper');
    if (!wrap) return;
    if (window.innerWidth <= 768) {
        wrap.style.flexDirection = 'column';
        wrap.style.height = '60vh';
        wrap.style.padding = '16px';
    } else {
        wrap.style.flexDirection = '';
        wrap.style.height = '';
        wrap.style.padding = '';
    }
}

window.addEventListener('load', adjustCarouselForViewport);
window.addEventListener('resize', adjustCarouselForViewport);