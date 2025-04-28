// Função para alternar o tema
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', newTheme);

    // Salva a preferência do usuário
    localStorage.setItem('theme', newTheme);

    // Atualiza o ícone do botão
    const themeIcon = document.querySelector('#themeIcon');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar a barra de nível
    const nivelInput = document.getElementById('nivel');
    const nivelProgress = document.getElementById('nivel-progress');
    if (nivelInput) {
        atualizarNivel();
    }

    // Atualizar barras de progresso dos status vitais
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        const input = item.querySelector('input');
        const maxValue = item.querySelector('span').textContent;
        const barra = item.querySelector('.barra-progresso');

        function atualizarBarra() {
            const porcentagem = (input.value / maxValue) * 100;
            barra.style.setProperty('--progresso', `${porcentagem}%`);

            // Define a cor da barra baseado no tipo de status
            let corBarra = '#4CAF50'; // Verde padrão
            if (item.querySelector('label').textContent.includes('❤️')) corBarra = '#ff4444'; // Vermelho para vida
            if (item.querySelector('label').textContent.includes('🧠')) corBarra = '#9933cc'; // Roxo para mana
            if (item.querySelector('label').textContent.includes('⚡')) corBarra = '#33b5e5'; // Azul para alma
            if (item.querySelector('label').textContent.includes('⭐')) corBarra = '#ffd700'; // Amarelo para sanidade

            barra.style.setProperty('--cor-barra', corBarra);
        }

        // Adiciona evento de clique na barra
        barra.addEventListener('click', (e) => {
            const rect = barra.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const porcentagem = (x / rect.width) * 100;
            const novoValor = Math.round((porcentagem / 100) * maxValue);

            input.value = novoValor;
            atualizarBarra();
        });

        input.addEventListener('input', () => {
            if (input.value < 0) input.value = 0;
            if (input.value > maxValue) input.value = maxValue;
            atualizarBarra();
        });

        atualizarBarra();
    });

    // Atualizar contadores de atributos
    const secoes = ['atributos-teste', 'atributos-sorte'];
    secoes.forEach(secao => {
        const inputs = document.querySelector(`.${secao}`).querySelectorAll('input');
        const contador = document.querySelector(`.${secao} h2 span`);

        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value < 0) input.value = 0;
                if (input.value > 12) input.value = 12;

                const total = Array.from(inputs).reduce((sum, inp) => sum + Number(inp.value), 0);
                contador.textContent = `${total}/12`;
            });
        });
    });

    // Função para determinar a cor da barra baseado no tipo de status
    function getCorBarra(label) {
        if (label.includes('❤️')) return '#ff4444';
        if (label.includes('🧠')) return '#9933cc';
        if (label.includes('⚡')) return '#33b5e5';
        if (label.includes('⭐')) return 'var(--cor-primaria)';
        return 'var(--cor-cinza)';
    }

    // Botões do cabeçalho
    document.querySelector('.voltar').addEventListener('click', () => {
        // Implementar função de voltar
        console.log('Voltar');
    });

    document.querySelector('.obs').addEventListener('click', () => {
        // Implementar função de observações
        console.log('Observações');
    });

    document.querySelector('.salvar').addEventListener('click', () => {
        // Implementar função de salvar
        const dados = {
            informacoesBasicas: {
                nome: document.querySelector('[placeholder="Nome do personagem"]').value,
                idade: document.querySelector('[placeholder="Idade"]').value,
                dataNascimento: document.querySelector('[placeholder="Ex: 01/01/1990"]').value,
                altura: document.querySelector('[placeholder="Ex: 1,75m"]').value,
                tipoSanguineo: document.querySelector('[placeholder="Ex: A+"]').value,
                sexualidade: document.querySelector('[placeholder="Sexualidade"]').value
            },
            statusVitais: Array.from(document.querySelectorAll('.status-item')).map(item => ({
                tipo: item.querySelector('label').textContent.trim(),
                valor: item.querySelector('input').value,
                maximo: item.querySelector('span').textContent
            })),
            statusCombate: {
                defesa: document.querySelector('.status-combate input[value="10"]').value,
                esquiva: document.querySelector('.status-combate input[value="10"]').value,
                bloqueio: document.querySelector('.status-combate input[value="0"]').value
            },
            infoPersonagem: {
                raca: document.querySelector('[placeholder="Raça"]').value,
                classe: document.querySelector('[placeholder="Classe"]').value,
                origem: document.querySelector('[placeholder="Origem"]').value
            },
            atributosTeste: Array.from(document.querySelectorAll('.atributos-teste .atributo-item')).map(item => ({
                nome: item.querySelector('label').textContent,
                valor: item.querySelector('input').value
            })),
            atributosSorte: Array.from(document.querySelectorAll('.atributos-sorte .atributo-item')).map(item => ({
                nome: item.querySelector('label').textContent,
                valor: item.querySelector('input').value
            }))
        };

        console.log('Dados salvos:', dados);
        // Aqui você pode implementar a chamada para sua API para salvar os dados
    });

    // Carrega a preferência do usuário ao iniciar
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeIcon = document.querySelector('#themeIcon');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
});

function atualizarNivel() {
    const nivelInput = document.getElementById('nivel');
    const nivelProgress = document.getElementById('nivel-progress');
    const nivel = parseInt(nivelInput.value) || 0;

    // Limita o valor entre 0 e 100
    nivelInput.value = Math.min(Math.max(nivel, 0), 100);

    // Atualiza a barra de progresso
    nivelProgress.style.width = `${nivelInput.value}%`;

    // Atualiza o contador de atributos baseado no nível
    atualizarContadorAtributos();
}

function atualizarContadorAtributos() {
    const nivel = parseInt(document.getElementById('nivel').value) || 0;
    const contador = document.querySelector('.atributos-teste h2 span');
    const totalAtributos = 12;
    const atributosAtivos = Math.min(Math.max(nivel, 0), totalAtributos);

    contador.textContent = `${atributosAtivos}/${totalAtributos}`;
} 