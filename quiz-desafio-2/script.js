// ==========================
// LISTA → perguntas
// ==========================
let perguntas = [

    // ===== ORIGINAIS =====
    {
        texto: "O que significa LIFO?",
        opcoes: ["First In First Out", "Last In First Out", "Fila"],
        correta: "Last In First Out"
    },
    {
        texto: "Qual estrutura usa FIFO?",
        opcoes: ["Pilha", "Fila", "Árvore"],
        correta: "Fila"
    },
    {
        texto: "Qual estrutura usa chave-valor?",
        opcoes: ["Lista", "Dicionário", "Fila"],
        correta: "Dicionário"
    },

    // ===== BIG DATA =====
    {
        texto: "O que caracteriza Big Data?",
        opcoes: [
            "Pouco volume de dados",
            "Grande volume, variedade e velocidade de dados",
            "Apenas dados estruturados"
        ],
        correta: "Grande volume, variedade e velocidade de dados"
    },
    {
        texto: "Qual tecnologia é usada em Big Data?",
        opcoes: [
            "Photoshop",
            "Hadoop",
            "Excel básico"
        ],
        correta: "Hadoop"
    },
    {
        texto: "O que significa o 'V' de Volume em Big Data?",
        opcoes: [
            "Velocidade de processamento",
            "Quantidade de dados",
            "Variedade de dados"
        ],
        correta: "Quantidade de dados"
    },

    // ===== ARRAY =====
    {
        texto: "O que é um Array?",
        opcoes: [
            "Estrutura que armazena dados aleatórios sem ordem",
            "Estrutura que armazena elementos do mesmo tipo em sequência",
            "Banco de dados"
        ],
        correta: "Estrutura que armazena elementos do mesmo tipo em sequência"
    },
    {
        texto: "Como acessamos elementos em um Array?",
        opcoes: [
            "Por índice",
            "Por senha",
            "Por chave aleatória"
        ],
        correta: "Por índice"
    }
];

/*
“Foram utilizadas as seguintes estruturas de dados:
Lista → para armazenar as perguntas
Fila → para controlar a ordem das perguntas (FIFO)
Pilha → para armazenar o histórico (LIFO)
Dicionário → para associar perguntas às respostas”
 Se quiser simplificar:
“A fila garante a ordem, a pilha guarda o histórico, e o dicionário conecta pergunta com resposta.”
*/

// FILA Para amarzenar a ordens da perguntas
let fila = [];

// PILHA PARA AMARZENAR O HISTORICO
let historico = [];

// Controle
let perguntaAtual;
let pontos = 0;
let nomeJogador = "";

// Tempo
let tempo = 15; // segundos por pergunta
let intervalo;

// ==========================
// INICIAR QUIZ
// ==========================
function iniciar() {

    fila = [...perguntas].sort(() => Math.random() - 0.5);

    nomeJogador = document.getElementById("nome").value;

    if (nomeJogador === "") {
        alert("Digite seu nome!");
        return;
    }

    // Esconde botão iniciar
    document.getElementById("btnIniciar").style.display = "none";
    document.getElementById("nome").style.display = "none";

    fila = [...perguntas];
    pontos = 0;
    historico = [];

    proximaPergunta();
}

// ==========================
// PRÓXIMA PERGUNTA
// ==========================
function proximaPergunta() {

    // limpa timer anterior
    clearInterval(intervalo);

    if (fila.length === 0) {
        finalizarQuiz();
        return;
    }

    perguntaAtual = fila.shift();

    document.getElementById("pergunta").innerText = perguntaAtual.texto;

    let div = document.getElementById("opcoes");
    div.innerHTML = "";

    // cria botões
    perguntaAtual.opcoes.forEach(opcao => {
        let btn = document.createElement("button");
        btn.innerText = opcao;

        btn.onclick = () => responder(opcao);

        div.appendChild(btn);
    });

    document.getElementById("feedback").innerText = "";

    iniciarTempo();
}

// ==========================
// TEMPO
// ==========================
function iniciarTempo() {
    tempo = 15;

    document.getElementById("tempo").innerText = "Tempo: " + tempo;

    intervalo = setInterval(() => {
        tempo--;

        document.getElementById("tempo").innerText = "Tempo: " + tempo;

        if (tempo === 0) {
            clearInterval(intervalo);
            document.getElementById("feedback").innerText = "⏱️ Tempo esgotado!";
            proximaPergunta();
        }
    }, 1000);
}

// ==========================
// RESPONDER
// ==========================
function responder(respostaEscolhida) {

    clearInterval(intervalo);

    historico.push({
        pergunta: perguntaAtual.texto,
        resposta: respostaEscolhida
    });

    if (respostaEscolhida === perguntaAtual.correta) {
        pontos++;
        document.getElementById("feedback").innerText = "✅ Acertou!";
    } else {
        document.getElementById("feedback").innerText =
            "❌ Errou! " + perguntaAtual.correta;
    }

    setTimeout(proximaPergunta, 1000);
}

// ==========================
// FINALIZAR QUIZ
// ==========================
function finalizarQuiz() {

    document.getElementById("pergunta").innerText = "🏁 Fim do Quiz!";
    document.getElementById("opcoes").innerHTML = "";
    document.getElementById("pontuacao").innerText =
        nomeJogador + " - Pontos: " + pontos;

    salvarRanking();
    mostrarRanking();
}

// ==========================
// SALVAR RANKING (TOP 5)
// ==========================
function salvarRanking() {

    // Pega ranking atual ou cria vazio
    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    // Adiciona jogador atual
    ranking.push({ nome: nomeJogador, pontos: pontos });

    // Ordena do maior para o menor
    ranking.sort((a, b) => b.pontos - a.pontos);

    // 🔥 Mantém apenas os 5 melhores
    ranking = ranking.slice(0, 5);

    // Salva novamente
    localStorage.setItem("ranking", JSON.stringify(ranking));
}

// ==========================
// MOSTRAR RANKING (com destaque)
// ==========================
function mostrarRanking() {

    let lista = document.getElementById("ranking");
    lista.innerHTML = "";

    let ranking = JSON.parse(localStorage.getItem("ranking")) || [];

    ranking.forEach((jogador, index) => {

        let li = document.createElement("li");

        // 🥇 Primeiro lugar
        if (index === 0) {
            li.innerText = "🥇 " + jogador.nome + " - " + jogador.pontos;
            li.style.fontWeight = "bold";
            li.style.color = "gold";
        }
        // 🥈 Segundo lugar
        else if (index === 1) {
            li.innerText = "🥈 " + jogador.nome + " - " + jogador.pontos;
        }
        // 🥉 Terceiro lugar
        else if (index === 2) {
            li.innerText = "🥉 " + jogador.nome + " - " + jogador.pontos;
        }
        else {
            li.innerText = jogador.nome + " - " + jogador.pontos;
        }

        lista.appendChild(li);
    });
}