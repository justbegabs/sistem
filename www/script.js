// Função para alternar o tema
function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    root.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const themeIcon = document.querySelector('#themeIcon');
    themeIcon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

function atualizarBarra(statusItem) {
    if (!statusItem) return;

    const input = statusItem.querySelector('input');
    const maxValue = statusItem.querySelector('span')?.textContent;
    const barra = statusItem.querySelector('.barra-progresso');

    if (input && maxValue && barra) {
        const valor = parseInt(input.value) || 0;
        const max = parseInt(maxValue) || 100;
        const porcentagem = (valor / max) * 100;
        barra.style.setProperty('--progresso', `${porcentagem}%`);
    }
}

function getCorBarra(label) {
    const cores = {
        'Vida': '#ff0000',
        'Energia': '#0000ff',
        'Sanidade': '#00ff00'
    };
    return cores[label] || '#gray';
}

function atualizarNivel() {
    const nivelInput = document.getElementById('nivel-input');
    const nivelProgress = document.getElementById('nivel-progress');

    if (nivelInput && nivelProgress) {
        const nivel = parseInt(nivelInput.value) || 0;
        // Calcula a porcentagem diretamente baseada no nível (0-100)
        const porcentagem = Math.min(nivel, 100);
        nivelProgress.style.width = `${porcentagem}%`;

        // Atualizar pontos disponíveis
        const pontosDisponiveis = nivel * 5;
        const contadorDados = document.querySelector('.contador-dados');
        if (contadorDados) {
            contadorDados.textContent = pontosDisponiveis;
        }

        // Atualizar contador de atributos
        atualizarContadorAtributos();
    }
}

function atualizarContadorAtributos() {
    const nivelInput = document.getElementById('nivel-input');
    const contadorSpan = document.querySelector('.contador-atributos');

    if (nivelInput && contadorSpan) {
        const nivel = parseInt(nivelInput.value) || 0;
        const pontosDisponiveis = nivel * 5;
        contadorSpan.textContent = pontosDisponiveis;

        // Atualizar dados
        const inputs = document.querySelectorAll('.dados-container input');
        inputs.forEach(input => {
            const maxValue = Math.min(pontosDisponiveis, 20); // Máximo de 20 pontos por atributo
            if (parseInt(input.value) > maxValue) {
                input.value = maxValue;
            }
        });
    }
}

// Função para abrir o modal de perícias
function abrirModalPericia(tipo) {
    const modal = document.getElementById('modal-pericias');
    const titulo = document.getElementById('modal-pericia-titulo');
    const lista = document.getElementById('modal-pericia-lista');

    // Atualiza o título
    titulo.textContent = `Perícias de ${tipo}`;

    // Limpa a lista atual
    lista.innerHTML = '';

    // Inicializa o objeto de valores se não existir
    if (!valoresPericias[tipo]) valoresPericias[tipo] = {};

    // Adiciona as perícias do tipo selecionado
    periciasData[tipo].forEach(pericia => {
        const valorSalvo = valoresPericias[tipo][pericia] ?? 0;
        console.log(`Carregando perícia ${pericia} do tipo ${tipo} com valor:`, valorSalvo);

        const item = document.createElement('div');
        item.className = 'pericia-item';
        item.innerHTML = `
            <label>
                ${pericia}
                <img src="./img/dado.png" class="dado-icon" onclick="rolarD10(this)" alt="Rolar dado">
            </label>
            <div class="valor-container">
                <input type="number" value="${valorSalvo}" min="-5">
            </div>
        `;

        // Evento para salvar o valor ao alterar
        const input = item.querySelector('input');
        input.addEventListener('input', function () {
            const novoValor = parseInt(this.value) || 0;
            valoresPericias[tipo][pericia] = novoValor;
            console.log(`Valor atualizado: ${tipo} -> ${pericia} = ${novoValor}`);
        });

        lista.appendChild(item);
    });

    // Mostra o modal
    modal.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando...');

    // Carregar dados da API
    if (window.location.pathname.includes('index.html')) {
        console.log('Carregando dados da API...');
        fetch('https://sistema-dos-deuses-o9ih.onrender.com/items')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(dados => {
                if (!dados || !Array.isArray(dados)) {
                    console.error('Dados inválidos recebidos da API:', dados);
                    return;
                }

                // Pegar o último registro (mais recente)
                const dadosRecentes = dados[dados.length - 1];
                if (!dadosRecentes) {
                    console.log('Nenhum dado encontrado');
                    return;
                }

                console.log('Carregando dados:', dadosRecentes);

                try {
                    // No carregamento
                    console.log('Dados recebidos para carregar:', dadosRecentes);

                    // Carregar nível
                    const nivelInput = document.getElementById('nivel-input');
                    if (nivelInput && dadosRecentes.nivel !== undefined) {
                        const nivelValue = parseInt(dadosRecentes.nivel) || 0;
                        console.log('Nível antes do carregamento:', nivelInput.value);
                        console.log('Nível a ser carregado:', nivelValue);
                        nivelInput.value = nivelValue;
                        nivelInput.dispatchEvent(new Event('input'));
                        console.log('Nível após carregamento:', nivelInput.value);
                        atualizarNivel();
                    } else {
                        console.error('Elemento de nível não encontrado ou dados inválidos:', {
                            elementoEncontrado: !!nivelInput,
                            nivelNosDados: dadosRecentes.nivel
                        });
                    }

                    // Carregar informações do personagem
                    if (dadosRecentes.infoPersonagem) {
                        console.log('Carregando informações do personagem:', dadosRecentes.infoPersonagem);
                        const campos = {
                            raca: 'Raça',
                            classe: 'Classe',
                            origem: 'Origem'
                        };

                        Object.entries(campos).forEach(([key, placeholder]) => {
                            const input = document.querySelector(`input[placeholder="${placeholder}"]`);
                            if (input && dadosRecentes.infoPersonagem[key]) {
                                console.log(`Carregando ${key} - Valor anterior:`, input.value);
                                input.value = dadosRecentes.infoPersonagem[key];
                                console.log(`${key} carregado - Novo valor:`, input.value);
                            } else {
                                console.error(`Erro ao carregar ${key}:`, {
                                    inputEncontrado: !!input,
                                    valorNosDados: dadosRecentes.infoPersonagem[key]
                                });
                            }
                        });
                    }

                    // Carregar perícias
                    if (Array.isArray(dadosRecentes.pericias)) {
                        console.log('Iniciando carregamento de perícias:', dadosRecentes.pericias);

                        // Agrupar perícias por categoria
                        dadosRecentes.pericias.forEach(pericia => {
                            if (!pericia || !pericia.nome) {
                                console.error('Perícia inválida:', pericia);
                                return;
                            }

                            // Encontrar a categoria da perícia
                            let categoriaEncontrada = null;
                            for (const [categoria, pericias] of Object.entries(periciasData)) {
                                if (pericias.includes(pericia.nome)) {
                                    categoriaEncontrada = categoria;
                                    break;
                                }
                            }

                            if (categoriaEncontrada) {
                                // Inicializar a categoria se não existir
                                if (!valoresPericias[categoriaEncontrada]) {
                                    valoresPericias[categoriaEncontrada] = {};
                                }

                                // Armazenar o valor
                                valoresPericias[categoriaEncontrada][pericia.nome] = pericia.valor;
                                console.log(`Valor carregado: ${categoriaEncontrada} -> ${pericia.nome} = ${pericia.valor}`);
                            } else {
                                console.error(`Categoria não encontrada para perícia: ${pericia.nome}`);
                            }
                        });

                        console.log('Estado final dos valores das perícias:', valoresPericias);
                    } else {
                        console.error('Dados de perícias inválidos:', dadosRecentes.pericias);
                    }

                    // Carregar informações básicas
                    if (dadosRecentes.informacoesBasicas) {
                        const mapeamentoCampos = {
                            nome: 'Nome do personagem',
                            idade: 'Idade',
                            dataNascimento: 'Ex: 01/01/1990',
                            altura: 'Ex: 1,75m',
                            tipoSanguineo: 'Ex: A+',
                            sexualidade: 'Sexualidade'
                        };

                        Object.entries(dadosRecentes.informacoesBasicas).forEach(([campo, valor]) => {
                            const placeholder = mapeamentoCampos[campo];
                            if (placeholder) {
                                const input = document.querySelector(`[placeholder="${placeholder}"]`);
                                if (input) {
                                    input.value = valor || '';
                                    console.log(`Campo ${campo} carregado:`, valor);
                                }
                            }
                        });
                    }

                    // Carregar status vitais
                    if (dadosRecentes.statusVitais) {
                        dadosRecentes.statusVitais.forEach(status => {
                            const item = Array.from(document.querySelectorAll('.status-item'))
                                .find(el => el.querySelector('label')?.textContent.trim() === status.tipo);
                            if (item) {
                                const input = item.querySelector('input');
                                const span = item.querySelector('span');
                                if (input) input.value = status.valor || '0';
                                if (span) span.textContent = status.maximo || '100';
                                atualizarBarra(item);
                                console.log(`Status ${status.tipo} carregado:`, status);
                            }
                        });
                    }

                    // Carregar status de combate
                    if (dadosRecentes.statusCombate) {
                        const statusCombate = {
                            defesa: 'Defesa',
                            esquiva: 'Esquiva',
                            bloqueio: 'Bloqueio'
                        };

                        Object.entries(statusCombate).forEach(([key, label]) => {
                            const input = document.querySelector(`.status-combate input[placeholder="${label}"]`);
                            if (input && dadosRecentes.statusCombate[key]) {
                                input.value = dadosRecentes.statusCombate[key];
                                console.log(`${label} carregado:`, input.value);
                            }
                        });
                    }

                    // Carregar atributos
                    ['atributosTeste', 'atributosSorte'].forEach(tipo => {
                        if (dadosRecentes[tipo]) {
                            dadosRecentes[tipo].forEach(atributo => {
                                const container = tipo === 'atributosTeste' ? '.atributos-teste' : '.atributos-sorte';
                                const item = Array.from(document.querySelectorAll(`${container} .atributo-item`))
                                    .find(el => el.querySelector('label')?.textContent === atributo.nome);

                                if (item) {
                                    const input = item.querySelector('input');
                                    if (input) {
                                        input.value = atributo.valor || '0';
                                        input.dispatchEvent(new Event('input'));
                                        console.log(`${tipo} ${atributo.nome} carregado:`, atributo.valor);
                                    }
                                }
                            });
                        }
                    });

                    // Carregar inventário
                    if (dadosRecentes.inventario) {
                        const container = document.querySelector('.inventario-container');
                        if (container) {
                            container.innerHTML = ''; // Limpar inventário existente

                            dadosRecentes.inventario.forEach(item => {
                                const itemElement = document.createElement('div');
                                itemElement.className = 'inventario-item';
                                itemElement.innerHTML = `
                                    <input type="text" placeholder="Nome do item" value="${item.nome || ''}">
                                    <input type="text" placeholder="Descrição" value="${item.descricao || ''}">
                                    <input type="number" placeholder="Peso" value="${item.peso || '0'}">
                                    <input type="number" placeholder="Quantidade" value="${item.quantidade || '1'}">
                                `;
                                container.appendChild(itemElement);
                                console.log('Item do inventário carregado:', item);
                            });
                        }
                    }

                    // Atualizar todos os contadores e cálculos
                    atualizarNivel();
                    atualizarContadorAtributos();
                    document.querySelectorAll('.status-item').forEach(item => atualizarBarra(item));

                    console.log('Carregamento concluído com sucesso!');
                } catch (error) {
                    console.error('Erro ao carregar dados:', error);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }

    const botaoSalvar = document.querySelector('.salvar');
    console.log('Botão de salvar encontrado:', botaoSalvar);

    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', () => {
            console.log('Botão de salvar clicado!');

            if (!window.location.pathname.includes('index.html')) {
                console.log('Não estamos na página principal - ignorando função de salvar');
                return;
            }

            // Criar e mostrar o spinner
            const spinnerOverlay = document.createElement('div');
            spinnerOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `;

            const spinnerContainer = document.createElement('div');
            spinnerContainer.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 0 20px rgba(0,0,0,0.3);
            `;

            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #F2780C;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px auto;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);

            const spinnerText = document.createElement('div');
            spinnerText.textContent = 'Salvando...';
            spinnerText.style.cssText = `
                color: #333;
                font-family: Arial, sans-serif;
                font-size: 16px;
                margin-top: 10px;
            `;

            spinnerContainer.appendChild(spinner);
            spinnerContainer.appendChild(spinnerText);
            spinnerOverlay.appendChild(spinnerContainer);
            document.body.appendChild(spinnerOverlay);

            try {
                const mapeamentoCampos = {
                    nome: 'Nome do personagem',
                    idade: 'Idade',
                    dataNascimento: 'Ex: 01/01/1990',
                    altura: 'Ex: 1,75m',
                    tipoSanguineo: 'Ex: A+',
                    sexualidade: 'Sexualidade'
                };

                // Coletar nível
                const nivelInput = document.getElementById('nivel-input');
                if (!nivelInput) {
                    console.error('Input de nível não encontrado');
                } else {
                    console.log('Input de nível encontrado:', nivelInput.value);
                }
                const nivel = nivelInput ? parseInt(nivelInput.value) || 0 : 0;
                console.log('Salvando nível:', nivel);

                // Coletar informações do personagem
                const infoPersonagem = {
                    raca: document.querySelector('input[placeholder="Raça"]')?.value || '',
                    classe: document.querySelector('input[placeholder="Classe"]')?.value || '',
                    origem: document.querySelector('input[placeholder="Origem"]')?.value || ''
                };
                console.log('Salvando informações do personagem:', infoPersonagem);

                // Coletar perícias de todas as categorias
                const pericias = [];
                Object.entries(valoresPericias).forEach(([categoria, periciasCategoria]) => {
                    Object.entries(periciasCategoria).forEach(([nome, valor]) => {
                        pericias.push({ nome, valor });
                        console.log(`Coletando perícia para salvar - Categoria: ${categoria}, Nome: ${nome}, Valor: ${valor}`);
                    });
                });

                console.log('Perícias coletadas para salvar:', pericias);

                const dados = {
                    nivel,
                    infoPersonagem,
                    pericias,
                    informacoesBasicas: Object.entries(mapeamentoCampos).reduce((acc, [campo, placeholder]) => {
                        const input = document.querySelector(`[placeholder="${placeholder}"]`);
                        acc[campo] = input ? input.value : '';
                        return acc;
                    }, {}),
                    statusVitais: Array.from(document.querySelectorAll('.status-item')).map(item => {
                        const label = item.querySelector('label');
                        const input = item.querySelector('input');
                        const span = item.querySelector('span');
                        return {
                            tipo: label ? label.textContent.trim() : '',
                            valor: input ? input.value : '0',
                            maximo: span ? span.textContent : '100'
                        };
                    }),
                    statusCombate: {
                        defesa: document.querySelector('.status-combate input[placeholder="Defesa"]')?.value || '10',
                        esquiva: document.querySelector('.status-combate input[placeholder="Esquiva"]')?.value || '10',
                        bloqueio: document.querySelector('.status-combate input[placeholder="Bloqueio"]')?.value || '0'
                    },
                    atributosTeste: Array.from(document.querySelectorAll('.atributos-teste .atributo-item')).map(item => {
                        const label = item.querySelector('label');
                        const input = item.querySelector('input');
                        return {
                            nome: label ? label.textContent : '',
                            valor: input ? input.value : '0'
                        };
                    }),
                    atributosSorte: Array.from(document.querySelectorAll('.atributos-sorte .atributo-item')).map(item => {
                        const label = item.querySelector('label');
                        const input = item.querySelector('input');
                        return {
                            nome: label ? label.textContent : '',
                            valor: input ? input.value : '0'
                        };
                    }),
                    inventario: Array.from(document.querySelectorAll('.inventario-item')).map(item => {
                        return {
                            nome: item.querySelector('input[placeholder="Nome do item"]')?.value || '',
                            descricao: item.querySelector('input[placeholder="Descrição"]')?.value || '',
                            peso: item.querySelector('input[placeholder="Peso"]')?.value || '0',
                            quantidade: item.querySelector('input[placeholder="Quantidade"]')?.value || '1'
                        };
                    })
                };

                console.log('Dados completos sendo salvos:', dados);

                // Primeiro, buscar dados existentes
                fetch('https://sistema-dos-deuses-o9ih.onrender.com/items')
                    .then(response => response.json())
                    .then(dadosExistentes => {
                        let fetchPromise;
                        let isUpdate = false;

                        // Se já existem dados, atualizar o último registro
                        if (Array.isArray(dadosExistentes) && dadosExistentes.length > 0) {
                            const ultimoId = dadosExistentes[dadosExistentes.length - 1].id;
                            console.log('Atualizando registro existente:', ultimoId);
                            isUpdate = true;

                            fetchPromise = fetch(`https://sistema-dos-deuses-o9ih.onrender.com/items/${ultimoId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dados)
                            });
                        } else {
                            console.log('Criando novo registro');
                            fetchPromise = fetch('https://sistema-dos-deuses-o9ih.onrender.com/items', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dados)
                            });
                        }

                        return fetchPromise.then(response => {
                            if (!response.ok) {
                                throw new Error(`Erro ${response.status}: ${response.statusText}`);
                            }
                            return response.json().then(data => ({ data, isUpdate }));
                        });
                    })
                    .then(({ data, isUpdate }) => {
                        // Remover o spinner
                        spinnerOverlay.remove();

                        console.log('Dados salvos com sucesso:', data);

                        // Criar mensagem detalhada
                        let mensagem = 'Dados salvos com sucesso!\n\n';
                        mensagem += `Nível: ${dados.nivel}\n`;
                        mensagem += `Raça: ${dados.infoPersonagem.raca}\n`;
                        mensagem += `Classe: ${dados.infoPersonagem.classe}\n`;
                        mensagem += `Origem: ${dados.infoPersonagem.origem}\n`;
                        mensagem += `Perícias salvas: ${dados.pericias.length}\n`;

                        // Mostrar mensagem em um alert estilizado
                        const modalMensagem = document.createElement('div');
                        modalMensagem.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(242, 120, 12, 0.9);
                            color: white;
                            padding: 20px;
                            border-radius: 10px;
                            z-index: 1000;
                            box-shadow: 0 0 20px rgba(0,0,0,0.5);
                            font-family: Arial, sans-serif;
                            white-space: pre-line;
                            text-align: left;
                        `;
                        modalMensagem.textContent = mensagem;

                        // Adicionar botão de fechar
                        const botaoFechar = document.createElement('button');
                        botaoFechar.textContent = '✕';
                        botaoFechar.style.cssText = `
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            background: none;
                            border: none;
                            color: white;
                            font-size: 20px;
                            cursor: pointer;
                            padding: 5px;
                        `;
                        botaoFechar.onclick = () => modalMensagem.remove();
                        modalMensagem.appendChild(botaoFechar);

                        // Remover automaticamente após 5 segundos
                        document.body.appendChild(modalMensagem);
                        setTimeout(() => modalMensagem.remove(), 5000);
                    })
                    .catch(error => {
                        // Remover o spinner
                        spinnerOverlay.remove();

                        console.error('Erro ao salvar dados:', error);

                        // Mostrar mensagem de erro
                        const modalErro = document.createElement('div');
                        modalErro.style.cssText = `
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(220, 53, 69, 0.9);
                            color: white;
                            padding: 20px;
                            border-radius: 10px;
                            z-index: 1000;
                            box-shadow: 0 0 20px rgba(0,0,0,0.5);
                            font-family: Arial, sans-serif;
                            white-space: pre-line;
                            text-align: left;
                        `;
                        modalErro.textContent = `Erro ao salvar os dados:\n${error.message}`;

                        // Adicionar botão de fechar
                        const botaoFechar = document.createElement('button');
                        botaoFechar.textContent = '✕';
                        botaoFechar.style.cssText = `
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            background: none;
                            border: none;
                            color: white;
                            font-size: 20px;
                            cursor: pointer;
                            padding: 5px;
                        `;
                        botaoFechar.onclick = () => modalErro.remove();
                        modalErro.appendChild(botaoFechar);

                        // Remover automaticamente após 5 segundos
                        document.body.appendChild(modalErro);
                        setTimeout(() => modalErro.remove(), 5000);
                    });
            } catch (error) {
                // Remover o spinner em caso de erro na coleta de dados
                spinnerOverlay.remove();

                console.error('Erro ao coletar dados:', error);
                alert('Erro ao coletar os dados do formulário: ' + error.message);
            }
        });
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

    // Carrega a preferência do usuário ao iniciar
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    const themeIcon = document.querySelector('#themeIcon');
    if (themeIcon) {
        themeIcon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
});

// Função utilitária para normalizar nomes de chaves
function normalizarChave(str) {
    return str
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/\s+/g, '') // remove espaços
        .toLowerCase();
}

// Adicione um objeto para armazenar o valor do dado rolado para cada perícia
if (!window.dadosRoladosPericias) window.dadosRoladosPericias = {};
if (!window.valoresPericias) window.valoresPericias = {};

// Função para rolar o d10
function rolarD10(elemento) {
    const resultado = Math.floor(Math.random() * 10) + 1;
    const input = elemento.closest('.pericia-item').querySelector('input');
    let tipo = document.getElementById('modal-pericia-titulo').textContent.replace('Perícias de ', '').trim();
    let label = elemento.closest('.pericia-item').querySelector('label').childNodes[0].textContent.trim();

    // Normaliza as chaves
    const tipoKey = normalizarChave(tipo);
    const labelKey = normalizarChave(label);

    // Salve o valor do dado rolado separadamente
    if (!window.dadosRoladosPericias[tipoKey]) window.dadosRoladosPericias[tipoKey] = {};
    window.dadosRoladosPericias[tipoKey][labelKey] = resultado;

    // Atualize o input para mostrar a soma da perícia + dado
    let valorPericia = 0;
    if (window.valoresPericias[tipo] && typeof window.valoresPericias[tipo][label] !== 'undefined') {
        valorPericia = parseInt(window.valoresPericias[tipo][label]) || 0;
    }
    input.value = valorPericia + resultado;

    // Efeito visual de rotação
    elemento.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        elemento.style.transform = 'rotate(0deg)';
    }, 500);

    // Atualiza Esquiva se Reflexos, ou Bloqueio se Fortitude (usando nomes normalizados)
    if (tipoKey === normalizarChave('Destreza') && labelKey === normalizarChave('Reflexos')) {
        atualizarEsquiva();
    }
    if (tipoKey === normalizarChave('Constituição') && labelKey === normalizarChave('Fortitude')) {
        atualizarBloqueio();
    }
}

// Função para atualizar a Esquiva com base em Defesa, Reflexos (Perícia) e dado rolado
function atualizarEsquiva() {
    console.log("⏱ Atualizando Esquiva");

    let defesa = 10;
    document.querySelectorAll('.status-combate .status-item').forEach(item => {
        const label = item.querySelector('label');
        if (label && label.textContent.trim() === 'Defesa') {
            defesa = parseInt(item.querySelector('input').value) || 0;
        }
    });

    console.log("➡ Defesa:", defesa);

    let reflexos = 0;
    let dadoPericia = 0;

    // Use chaves normalizadas para garantir acesso correto
    const tipoKey = normalizarChave('Destreza');
    const labelKey = normalizarChave('Reflexos');

    // Valor salvo da perícia Reflexos
    if (window.valoresPericias && valoresPericias['Destreza'] && typeof valoresPericias['Destreza']['Reflexos'] !== 'undefined') {
        reflexos = parseInt(valoresPericias['Destreza']['Reflexos']) || 0;
    }

    // Valor do dado rolado para Reflexos (usando chaves normalizadas)
    if (
        window.dadosRoladosPericias &&
        dadosRoladosPericias[tipoKey] &&
        typeof dadosRoladosPericias[tipoKey][labelKey] !== 'undefined'
    ) {
        dadoPericia = parseInt(dadosRoladosPericias[tipoKey][labelKey]) || 0;
    } else {
        dadoPericia = 0;
    }

    console.log("➡ Reflexos (perícia salva):", reflexos);
    console.log("🎲 Dado rolado para Reflexos:", dadoPericia);

    // Aplicar no input de Esquiva
    document.querySelectorAll('.status-combate .status-item').forEach(item => {
        const label = item.querySelector('label');
        if (label && label.textContent.trim() === 'Esquiva') {
            const esquivaInput = item.querySelector('input');
            if (esquivaInput) {
                const total = defesa + reflexos + dadoPericia;
                console.log("✅ Total Esquiva calculado:", total);
                esquivaInput.value = total;
            }
        }
    });
}

function atualizarBloqueio() {
    console.log("⏱ Atualizando Bloqueio");

    let constituicao = 0;

    // Busca o valor da Constituição no DOM
    document.querySelectorAll('.atributos-teste .atributo-item').forEach(item => {
        const label = item.querySelector('label');
        if (label && label.textContent.trim() === 'Constituição') {
            const input = item.querySelector('input');
            if (input) {
                constituicao = parseInt(input.value) || 0;
            }
        }
    });

    console.log("➡ Constituição:", constituicao);

    let fortitude = 0;
    let dadoPericia = 0;

    // Verifica valor salvo da perícia Fortitude
    if (window.valoresPericias && valoresPericias['Constituição'] && typeof valoresPericias['Constituição']['Fortitude'] !== 'undefined') {
        fortitude = parseInt(valoresPericias['Constituição']['Fortitude']) || 0;
    }

    // Sempre usar o valor do dado rolado, se houver
    if (window.dadosRoladosPericias && dadosRoladosPericias['Constituição'] && typeof dadosRoladosPericias['Constituição']['Fortitude'] !== 'undefined') {
        dadoPericia = parseInt(dadosRoladosPericias['Constituição']['Fortitude']) || 0;
    } else {
        dadoPericia = 0;
    }

    console.log("➡ Fortitude (perícia salva):", fortitude);
    console.log("🎲 Dado rolado para Fortitude:", dadoPericia);

    const bloqueio = constituicao + fortitude + dadoPericia;

    // Atualiza o input de Bloqueio no DOM
    document.querySelectorAll('.status-combate .status-item').forEach(item => {
        const label = item.querySelector('label');
        if (label && label.textContent.trim() === 'Bloqueio') {
            const input = item.querySelector('input');
            if (input) {
                input.value = bloqueio;
                console.log("✅ Bloqueio atualizado para:", bloqueio);
            }
        }
    });
}