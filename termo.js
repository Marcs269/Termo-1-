const palavrasEducacao = [
    "BETEL", "ALUNO", "TURMA", "LIVRO", "TEXTO",
    "PROVA", "SABER", "LIÇÃO", "NOTAS", "REGRA",
    "AULAS", "MENTE", "LÁPIS", "PAPEL", "RÉGUA",
    "TINTA", "MAPAS", "CURSO", "EXAME", "TESTE",
    "CÓPIA", "TERMO", "CANTO", "ARTES", "CORAL",
    "GRUPO", "AMIGO", "UNIÃO", "ORDEM", "NORMA",
    "VALOR", "AFETO", "CULTO", "VERBO", "SALMO",
    "HONRA", "MORAL", "ÉTICA", "GRAÇA", "SANTO",
    "LOUSA", "LÍDER", "PASTA", "SÁBIO", "IDEIA",
    "FALAR", "OUVIR", "GUIAR", "PAUTA", "REINO"
];

let segredo = "";
let rodada = 0;
let qtdLetras = 5;
let tentativas = [];

function iniciar() {
    const posicao = Math.floor(Math.random() * palavrasEducacao.length);
    segredo = palavrasEducacao[posicao];
    rodada = 0;
    tentativas = [];

    const jogo = document.getElementById("jogo");
    if (jogo) {
        jogo.innerHTML = "";
    }

    atualizarLetrasUtilizadas();
    criarFormulario();
}

function atualizarLetrasUtilizadas() {
    const letrasUtilizadas = document.getElementById("letrasutilizadas");
    if (!letrasUtilizadas) return;

    const letras = [];
    const conjunto = new Set();

    tentativas.forEach((tentativa) => {
        for (const letra of tentativa) {
            if (letra && !conjunto.has(letra)) {
                conjunto.add(letra);
                letras.push(letra);
            }
        }
    });

    letrasUtilizadas.textContent = letras.join(" ") || "Nenhuma";
}

function verificar() {
    const form = document.forms["termo" + rodada];
    if (!form) return;

    let tentativa = "";

    for (let i = 0; i < qtdLetras; i++) {
        const input = form["letra" + i];
        if (!input) continue;

        const caixa = input.value.trim().toUpperCase();

        if (!caixa) {
            input.focus();
            return;
        }

        if (caixa === segredo[i]) {
            input.style.backgroundColor = "green";
        } else if (segredo.includes(caixa)) {
            input.style.backgroundColor = "yellow";
        } else {
            input.style.backgroundColor = "gray";
        }

        tentativa += caixa;
    }

    tentativas.push(tentativa);
    atualizarLetrasUtilizadas();

    if (tentativa === segredo) {
        alert("Acertou!");
        return;
    }

    rodada++;

    if (rodada < 5) {
        criarFormulario();
    } else {
        alert("Fim de Jogo! A palavra era: " + segredo);
    }
}

function criarFormulario() {
    const jogo = document.getElementById("jogo");
    if (!jogo) return;

    const formulario = document.createElement("form");
    formulario.name = "termo" + rodada;
    formulario.addEventListener("submit", (event) => {
        event.preventDefault();
        verificar();
    });

    for (let i = 0; i < qtdLetras; i++) {
        const caixa = document.createElement("input");
        caixa.type = "text";
        caixa.maxLength = 1;
        caixa.name = "letra" + i;
        caixa.autocomplete = "off";
        caixa.inputMode = "text";
        caixa.setAttribute("aria-label", "Letra " + (i + 1));
        formulario.appendChild(caixa);
    }

    const botao = document.createElement("input");
    botao.type = "submit";
    botao.value = "Enviar";
    formulario.appendChild(botao);

    jogo.appendChild(formulario);

    const primeiroCampo = formulario.querySelector("input[type='text']");
    if (primeiroCampo) {
        primeiroCampo.focus();
    }
}

iniciar();
