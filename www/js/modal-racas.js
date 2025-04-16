document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.modal-racas');
    const closeModal = document.querySelector('.close-modal');
    const racaCards = document.querySelectorAll('.raca-card');
    const continuarBtn = document.querySelector('#continuar');
    let selectedRaca = null;

    // Função para abrir o modal
    window.openModal = function () {
        modal.style.display = 'block';
    };

    // Fechar modal ao clicar no X
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Gerenciar seleção de raça
    racaCards.forEach(card => {
        const selecionarBtn = card.querySelector('.selecionar-raca');

        selecionarBtn.addEventListener('click', () => {
            // Remover seleção anterior
            racaCards.forEach(c => c.classList.remove('selected'));

            // Selecionar nova raça
            card.classList.add('selected');
            selectedRaca = card.getAttribute('data-raca');

            // Habilitar botão continuar
            continuarBtn.disabled = false;

            // Fechar modal após seleção
            modal.style.display = 'none';
        });
    });

    // Prevenir que o modal feche ao clicar dentro dele
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 