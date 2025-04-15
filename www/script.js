document.addEventListener('DOMContentLoaded', () => {
    // Atualizar barras de progresso dos status vitais
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        const input = item.querySelector('input');
        const maxValue = item.querySelector('span').textContent;
        const barra = item.querySelector('.barra-progresso');

        function atualizarBarra() {
            const porcentagem = (input.value / maxValue) * 100;
            barra.style.background = `linear-gradient(to right, 
                ${getCorBarra(input.parentElement.previousElementSibling.textContent)} ${porcentagem}%, 
                #eee ${porcentagem}%)`;
        }

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
        if (label.includes('⭐')) return '#ffbb33';
        return '#666';
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
}); 