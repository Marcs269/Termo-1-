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
const maxRodadas = 5;

function iniciar() {
    const posicao = Math.floor(Math.random() * palavrasEducacao.length);
    segredo = palavrasEducacao[posicao].toUpperCase();
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
        Array.from(tentativa).forEach((letra) => {
            if (letra && !conjunto.has(letra)) {
                conjunto.add(letra);
                letras.push(letra);
            }
        });
    });

    letrasUtilizadas.textContent = letras.length ? letras.join(" ") : "Nenhuma";
}

function setEstadoLetra(input, estado) {
    if (!input) return;

    const mapa = {
        correta: "green",
        presente: "yellow",
        errada: "gray"
    };

    input.style.backgroundColor = mapa[estado] || "gray";
    input.style.color = "#123";
    input.style.fontWeight = "700";
    input.setAttribute("data-estado", estado);
}

function verificar() {
    const form = document.forms["termo" + rodada];
    if (!form) return;

    let tentativa = "";
    const letrasUsadas = new Set();

    for (let i = 0; i < qtdLetras; i++) {
        const input = form["letra" + i];
        if (!input) continue;

        const caixa = input.value.trim().toUpperCase();
        if (!caixa) {
            input.focus();
            return;
        }

        letrasUsadas.add(caixa);
        tentativa += caixa;
    }

    const letrasCorretas = new Set();
    const letrasPresentes = new Set();

    for (let i = 0; i < qtdLetras; i++) {
        const caixa = tentativa[i];
        const input = form["letra" + i];

        if (!input) continue;

        if (caixa === segredo[i]) {
            setEstadoLetra(input, "correta");
            letrasCorretas.add(caixa);
        }
    }

    for (let i = 0; i < qtdLetras; i++) {
        const caixa = tentativa[i];
        const input = form["letra" + i];
        if (!input) continue;

        if (input.getAttribute("data-estado") === "correta") {
            continue;
        }

        if (segredo.includes(caixa)) {
            if (!letrasCorretas.has(caixa) && !letrasPresentes.has(caixa)) {
                setEstadoLetra(input, "presente");
                letrasPresentes.add(caixa);
            } else {
                setEstadoLetra(input, "errada");
            }
        } else {
            setEstadoLetra(input, "errada");
        }
    }

    tentativas.push(tentativa);
    atualizarLetrasUtilizadas();

    if (tentativa === segredo) {
        alert("Acertou!");
        return;
    }

    rodada++;

    if (rodada < maxRodadas) {
        criarFormulario();
    } else {
        alert("Fim de jogo! A palavra era: " + segredo);
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
        caixa.value = "";
        caixa.style.textTransform = "uppercase";
        caixa.addEventListener("input", () => {
            caixa.value = caixa.value.toUpperCase().replace(/[^A-ZÀ-Ú]/g, "");
            if (caixa.value && i < qtdLetras - 1) {
                const proximo = formulario["letra" + (i + 1)];
                if (proximo) proximo.focus();
            }
        });
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
