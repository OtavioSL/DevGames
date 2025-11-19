function createCard(jogo) {
    const { img, infos } = jogo
    return `
    <div class="game-card" data-genre="${infos.genre.join(",")}">
        <img src="${img.src}"alt="${img.alt}">
        <h4>${infos.name}</h4>
        <p class="game-price">${infos.price}</p>
        <p class="game-genres">${infos.genre.map(info => `<span class="genre-tag">${info}</span>`).join('')}</p>
        <p class="game-impact">${infos.theme}</p>
        <a href="${infos.href}" target="_blank" class="btn-secondary">Comprar</a>
    </div>`
}

// 1. Percorre todos os jogos 1 por 1
let htmlLista = ''

// Forma didática de concatenar os cards
for (let i = 0; i < jogos.length; i++) {
    htmlLista += createCard(jogos[i])
}

const list = document.querySelector("#gameList")
if (list) {
    list.innerHTML = htmlLista
}