document.addEventListener('DOMContentLoaded', () => {
    // 1. Elementos da DOM
    const newsGrid = document.querySelector('.news-grid');
    const newsCards = Array.from(newsGrid.querySelectorAll('.news-card'));
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumberSpan = document.getElementById('page-number');

    // 2. Variáveis de Paginação
    const NEWS_PER_PAGE = 3; // Define 3 notícias por página (igual ao número de cards iniciais)
    let currentPage = 1;
    const totalPages = Math.ceil(newsCards.length / NEWS_PER_PAGE);

    // 3. Função principal para exibir a página correta
    function displayPage(page) {
        // Garante que a página esteja dentro dos limites
        if (page < 1 || page > totalPages) return;
        
        currentPage = page;

        const start = (currentPage - 1) * NEWS_PER_PAGE;
        const end = start + NEWS_PER_PAGE;

        // Itera sobre todos os cards para mostrar/esconder
        newsCards.forEach((card, index) => {
            if (index >= start && index < end) {
                card.style.display = 'flex'; // Mostra o card (usando flex do CSS)
            } else {
                card.style.display = 'none'; // Esconde o card
            }
        });

        // Atualiza o texto e o estado dos botões
        pageNumberSpan.textContent = `Página ${currentPage} de ${totalPages}`;
        
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    // 4. Listeners para os botões de navegação
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            displayPage(currentPage - 1);
            window.scrollTo(0, 0); // Opcional: Rola a página para o topo ao mudar de página
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            displayPage(currentPage + 1);
            window.scrollTo(0, 0); // Opcional: Rola a página para o topo ao mudar de página
        }
    });

    // 5. Inicializa a página
    displayPage(1);
});