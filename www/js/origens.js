document.addEventListener('DOMContentLoaded', function () {
    // Gerenciamento do tema
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Carregar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Alternar tema
    themeToggle.addEventListener('change', function () {
        const newTheme = this.checked ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Seleção de origem
    const cards = document.querySelectorAll('.origem-card');
    const btnContinuar = document.querySelector('.btn-continuar');
    let origemSelecionada = null;

    // Adiciona evento de clique para cada card
    cards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove a seleção anterior
            cards.forEach(c => c.classList.remove('selected'));

            // Adiciona a seleção ao card clicado
            this.classList.add('selected');
            origemSelecionada = this.getAttribute('data-origem');

            // Habilita o botão continuar
            btnContinuar.disabled = false;
        });
    });

    // Evento do botão voltar
    document.querySelector('.btn-voltar').addEventListener('click', function () {
        window.history.back();
    });

    // Evento do botão continuar
    btnContinuar.addEventListener('click', function () {
        if (origemSelecionada) {
            // Salva a origem selecionada
            localStorage.setItem('origemSelecionada', origemSelecionada);

            // Redireciona para a próxima página
            window.location.href = 'classes.html';
        }
    });

    // Verifica se já existe uma origem selecionada
    const origemSalva = localStorage.getItem('origemSelecionada');
    if (origemSalva) {
        const cardSalvo = document.querySelector(`[data-origem="${origemSalva}"]`);
        if (cardSalvo) {
            cardSalvo.classList.add('selected');
            origemSelecionada = origemSalva;
            btnContinuar.disabled = false;
        }
    }
}); 