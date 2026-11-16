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
const qtdLetras = 5;
const maxRodadas = 5;
let tentativas = [];

function iniciar() {
    const posicao = Math.floor(Math.random() * palavrasEducacao.length);
    segredo = palavrasEducacao[posicao].toUpperCase();
    rodada = 0;
    tentativas = [];

    const jogo = document.getElementById("jogo");
    if (jogo) jogo.replaceChildren();

    atualizarLetrasUtilizadas();
    criarFormulario();
}

function atualizarLetrasUtilizadas() {
    const areaLetras = document.getElementById("letrasultilizadas");
    if (!areaLetras) return;

    const letras = [...new Set(tentativas.join(""))];
    areaLetras.textContent = letras.length ? letras.join(" ") : "Nenhuma";
}

function definirEstado(input, estado) {
    const cores = {
        correta: "green",
        presente: "yellow",
        errada: "gray"
    };
    input.style.backgroundColor = cores[estado];
    input.dataset.estado = estado;
}

function verificar(formulario) {
    if (!formulario || formulario.dataset.respondido === "true") return;

    const campos = Array.from(formulario.querySelectorAll('input[type="text"]'));
    const letras = campos.map((campo) => campo.value.trim().toLocaleUpperCase("pt-BR"));

    const campoVazio = campos.find((campo) => !campo.value.trim());
    if (campoVazio) {
        campoVazio.focus();
        return;
    }

    const tentativa = letras.join("");
    if (tentativa.length !== qtdLetras) return;

    // Impede envios duplicados enquanto esta tentativa é corrigida.
    formulario.dataset.respondido = "true";
    campos.forEach((campo) => { campo.disabled = true; });
    const botao = formulario.querySelector('button[type="submit"]');
    if (botao) botao.disabled = true;

    // Primeiro marca as letras na posição correta. Depois distribui as ocorrências
    // restantes da palavra secreta, respeitando letras repetidas como no Termo.
    const restantes = segredo.split("");
    const estados = Array(qtdLetras).fill("errada");

    for (let i = 0; i < qtdLetras; i++) {
        if (letras[i] === segredo[i]) {
            estados[i] = "correta";
            restantes[i] = null;
        }
    }

    for (let i = 0; i < qtdLetras; i++) {
        if (estados[i] === "correta") continue;
        const indice = restantes.indexOf(letras[i]);
        if (indice !== -1) {
            estados[i] = "presente";
            restantes[indice] = null;
        }
    }

    campos.forEach((campo, i) => definirEstado(campo, estados[i]));
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
    formulario.autocomplete = "off";
    formulario.noValidate = true;

    // O tratamento explícito do submit e preventDefault impedem a navegação/reload.
    formulario.onsubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        verificar(formulario);
        return false;
    };

    for (let i = 0; i < qtdLetras; i++) {
        const campo = document.createElement("input");
        campo.type = "text";
        campo.name = "letra" + i;
        campo.maxLength = 1;
        campo.autocomplete = "off";
        campo.setAttribute("aria-label", "Letra " + (i + 1));
        campo.inputMode = "text";
        campo.required = true;
        campo.addEventListener("input", () => {
            campo.value = campo.value.toLocaleUpperCase("pt-BR").replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g, "");
            if (campo.value && i < qtdLetras - 1) {
                formulario.elements["letra" + (i + 1)].focus();
            }
        });
        campo.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && !campo.value && i > 0) {
                formulario.elements["letra" + (i - 1)].focus();
            }
        });
        formulario.appendChild(campo);
    }

    const botao = document.createElement("button");
    botao.type = "submit";
    botao.textContent = "Enviar";
    formulario.appendChild(botao);
    jogo.appendChild(formulario);

    const primeiroCampo = formulario.querySelector('input[type="text"]');
    if (primeiroCampo) primeiroCampo.focus();
}

iniciar();
