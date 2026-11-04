const inputNome = document.querySelector("#nome");
const inputDataNascimento = document.querySelector("#dataNascimento");
const formulario = document.querySelector("#formIdade");
const botaoLimpar = document.querySelector("#limpar");
const resultado = document.querySelector("#resultado");
const historico = document.querySelector("#historico");

const registros = [];

function calcularIdade(dataString) {
  const dataNascimento = new Date(`${dataString}T00:00:00`);
  const hoje = new Date();

  let idade = hoje.getFullYear() - dataNascimento.getFullYear();
  const diferencaMes = hoje.getMonth() - dataNascimento.getMonth();

  if (
    diferencaMes < 0 ||
    (diferencaMes === 0 && hoje.getDate() < dataNascimento.getDate())
  ) {
    idade -= 1;
  }

  return idade;
}

function mostrarResultado(mensagem, tipo) {
  resultado.textContent = mensagem;
  resultado.className = `resultado ${tipo}`;
}

function atualizarHistorico() {
  if (registros.length === 0) {
    historico.innerHTML =
      '<li class="list-group-item text-muted">Nenhum registro cadastrado ainda.</li>';
    return;
  }

  historico.innerHTML = registros
    .map(
      (registro) => `
        <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
          <div>
            <strong>${registro.nome}</strong>
            <small class="d-block text-muted">${registro.data}</small>
          </div>
          <div class="text-end">
            <span class="badge ${
              registro.maiorDeIdade ? "bg-success" : "bg-warning text-dark"
            }">
              ${registro.maiorDeIdade ? "Maior de idade" : "Menor de idade"}
            </span>
            <small class="d-block text-muted">${registro.idade} anos</small>
          </div>
        </li>
      `
    )
    .join("");
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = inputNome.value.trim();
  const dataNascimento = inputDataNascimento.value;

  if (!nome) {
    mostrarResultado("Digite o nome antes de verificar.", "alert");
    inputNome.focus();
    return;
  }

  if (!dataNascimento) {
    mostrarResultado("Selecione a data de nascimento.", "alert");
    inputDataNascimento.focus();
    return;
  }

  const nascimento = new Date(`${dataNascimento}T00:00:00`);

  if (Number.isNaN(nascimento.getTime())) {
    mostrarResultado("Data inválida. Tente novamente.", "alert");
    inputDataNascimento.focus();
    return;
  }

  const idade = calcularIdade(dataNascimento);

  if (idade < 0 || idade > 120) {
    mostrarResultado("A idade informada deve estar entre 0 e 120 anos.", "alert");
    inputDataNascimento.focus();
    return;
  }

  const maiorDeIdade = idade >= 18;
  const registro = {
    nome,
    idade,
    maiorDeIdade,
    data: new Date().toLocaleString("pt-BR"),
  };

  registros.unshift(registro);

  mostrarResultado(
    `${nome} tem ${idade} anos e ${
      maiorDeIdade ? "é maior de idade." : "é menor de idade."
    }`,
    maiorDeIdade ? "success" : "alert"
  );

  atualizarHistorico();
  formulario.reset();
  inputNome.focus();
});

botaoLimpar.addEventListener("click", () => {
  formulario.reset();
  registros.length = 0;
  mostrarResultado("Dados limpos. Preencha novamente para verificar.", "neutral");
  atualizarHistorico();
  inputNome.focus();
});

atualizarHistorico();