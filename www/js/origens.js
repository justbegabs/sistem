// Detalhes das origens
const origensDetalhes = {
    humano: {
        titulo: "Humano",
        descricao: `Os humanos são uma raça versátil e adaptável, conhecida por sua determinação e ambição. 
        Características principais:
        • +1 em todos os atributos
        • Proficiência extra à sua escolha
        • Talento adicional no 1º nível`
    },
    elfo: {
        titulo: "Elfo",
        descricao: `Os elfos são uma raça graciosa e longeva, com afinidade natural para magia e precisão.
        Características principais:
        • +2 Destreza, +1 Inteligência
        • Visão no escuro
        • Resistência a encantamentos`
    },
    anao: {
        titulo: "Anão",
        descricao: `Os anões são conhecidos por sua resistência e habilidade como artesãos.
        Características principais:
        • +2 Constituição, +1 Força
        • Resistência a veneno
        • Proficiência com ferramentas de artesão`
    },
    orc: {
        titulo: "Orc",
        descricao: `Os orcs são guerreiros formidáveis, conhecidos por sua força bruta e resistência.
        Características principais:
        • +2 Força, +1 Constituição
        • Visão no escuro
        • Resistência a dano físico`
    }
};

// Elementos do DOM
const modal = document.getElementById('modal');
const modalTitulo = document.getElementById('modal-titulo');
const modalDescricao = document.getElementById('modal-descricao');
const btnFecharModal = document.querySelector('.close');
const btnSelecionarOrigem = document.getElementById('selecionar-origem');
const btnContinuar = document.getElementById('continuar');
const origensCards = document.querySelectorAll('.origem-card');

let origemSelecionada = null;

// Funções do Modal
function abrirModal(origem) {
    const detalhes = origensDetalhes[origem];
    modalTitulo.textContent = detalhes.titulo;
    modalDescricao.textContent = detalhes.descricao;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function fecharModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners
origensCards.forEach(card => {
    card.addEventListener('click', () => {
        const origem = card.dataset.origem;
        origemSelecionada = origem;
        abrirModal(origem);

        // Remove seleção anterior
        origensCards.forEach(c => c.classList.remove('selecionado'));
        card.classList.add('selecionado');
    });
});

btnFecharModal.addEventListener('click', fecharModal);

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        fecharModal();
    }
});

btnSelecionarOrigem.addEventListener('click', () => {
    if (origemSelecionada) {
        fecharModal();
        btnContinuar.disabled = false;
    }
});

btnContinuar.addEventListener('click', () => {
    if (origemSelecionada) {
        // Salva a origem selecionada
        localStorage.setItem('origemSelecionada', origemSelecionada);
        // Redireciona para a página de atributos
        window.location.href = 'atributos.html';
    }
}); 