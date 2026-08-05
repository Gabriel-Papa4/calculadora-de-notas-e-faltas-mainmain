// controle-faltas-7periodo.js
document.addEventListener('DOMContentLoaded', () => {
    
    const DADOS_DISCIPLINAS_FALTAS = {
        'orto': { percPorFalta: 5.56, nome: 'ORTOPEDIA' },               // 18h total
        'oftalmo': { percPorFalta: 1.852, nome: 'OFTALMOLOGIA' },        // 54h total
        'cgo': { percPorFalta: 1.087, nome: 'CLÍNICA GINECOLÓGICA' },    // 92h total
        'cca': { percPorFalta: 0.695, nome: 'CLÍNICA DA CRIANÇA' },      // 144h total
        'cm1': { percPorFalta: 0.3475, nome: 'CLÍNICA MÉDICA I' }        // 288h total
    };
    // **********************************

    function calcularFaltas(disciplinaIdRef) {
        const dataDisciplina = DADOS_DISCIPLINAS_FALTAS[disciplinaIdRef];
        
        if (!dataDisciplina) {
            console.error(`Disciplina "${disciplinaIdRef}" não encontrada no JS.`);
            return;
        }

        const inputElement = document.getElementById(`faltas-${disciplinaIdRef}-input`);
        const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
        const resultadoProuniElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni`);
        const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);

        if (!inputElement || !resultadoGeralElement || !resultadoProuniElement || !prouniContainerElement) {
            console.error(`Elementos HTML não encontrados para a disciplina: ${disciplinaIdRef}. Verifique os IDs no HTML.`);
            return;
        }
        
        const faltasCometidasStr = inputElement.value;
        
        if (faltasCometidasStr.trim() === '') { 
            resultadoGeralElement.textContent = ''; 
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        const faltasCometidas = parseInt(faltasCometidasStr);

        // Validação
        if (isNaN(faltasCometidas) || faltasCometidas < 0) {
            resultadoGeralElement.textContent = 'Inválido';
            resultadoProuniElement.textContent = '';
            prouniContainerElement.style.display = 'none';
            return;
        }

        // Cálculos
        const percPorFalta = dataDisciplina.percPorFalta;
        const currentAbsencePercentage = faltasCometidas * percPorFalta;
        const currentPresencePercentage = 100 - currentAbsencePercentage;

        // Cálculo para 75% de presença (Geral)
        let podeTerGeral = 0;
        if (currentPresencePercentage > 75) {
            podeTerGeral = Math.floor((currentPresencePercentage - 75) / percPorFalta);
        } else {
             // Caso já tenha estourado ou esteja no limite
             podeTerGeral = 0; 
        }
        
        // Se já reprovou por faltas (presença < 75%), avisa o usuário
        if (currentPresencePercentage < 75) {
             resultadoGeralElement.textContent = "Reprovado por faltas";
             resultadoGeralElement.style.color = "red";
        } else {
             resultadoGeralElement.textContent = `${podeTerGeral} faltas`;
             resultadoGeralElement.style.color = ""; // Reseta cor
        }

        // Cálculo para 80% de presença (PROUNI)
        let podeTerProuni = 0;
        if (currentPresencePercentage > 80) {
            podeTerProuni = Math.floor((currentPresencePercentage - 80) / percPorFalta);
        }
        
        resultadoProuniElement.textContent = `Obs: PROUNI = ${podeTerProuni} faltas`;
        prouniContainerElement.style.display = 'block'; 
    }

    // Adiciona o evento de clique nos botões
    const botoesCalcular = document.querySelectorAll('.btn-calcular-falta');
    
    if (botoesCalcular.length === 0) {
        console.warn("Nenhum botão com a classe .btn-calcular-falta foi encontrado.");
    }

    botoesCalcular.forEach(botao => {
        botao.addEventListener('click', () => {
            const disciplinaIdRef = botao.getAttribute('data-disciplina-ref');
            calcularFaltas(disciplinaIdRef);
        });
    });

    // Limpeza automática ao apagar o input
    const inputsFaltas = document.querySelectorAll('.input-group-faltas input[type="number"]');
    inputsFaltas.forEach(input => {
        input.addEventListener('input', (event) => {
            if (event.target.value.trim() === '') {
                const parts = event.target.id.split('-');
                if (parts.length >= 2) {
                    const disciplinaIdRef = parts[1]; 
                    const resultadoGeralElement = document.getElementById(`faltas-${disciplinaIdRef}-geral`);
                    const prouniContainerElement = document.getElementById(`faltas-${disciplinaIdRef}-prouni-container`);
                    
                    if(resultadoGeralElement) {
                        resultadoGeralElement.textContent = '';
                        resultadoGeralElement.style.color = "";
                    }
                    if(prouniContainerElement) prouniContainerElement.style.display = 'none';
                }
            }
        });
    });
});