const formularioFinanceiro = document.querySelector('#form-financas');
const limparFinanceiro = document.querySelector('#limparFinanceiro');
const resultadoFinanceiro = document.querySelector('#resultadoFinanceiro');
const saldoDisponivel = document.querySelector('#saldoDisponivel');
const gastosTotais = document.querySelector('#gastosTotais');
const percentualGasto = document.querySelector('#percentualGasto');
const situacaoFinanceira = document.querySelector('#situacaoFinanceira');

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

function mostrarMensagem(mensagem, tipo) {
  resultadoFinanceiro.textContent = mensagem;
  resultadoFinanceiro.className = `alert ${tipo}`;
}

function calcularAnaliseFinanceira(rendaMensal, gastosFixos, gastosVariaveis, metaPoupanca) {
  const renda = Number(rendaMensal);
  const fixos = Number(gastosFixos);
  const variaveis = Number(gastosVariaveis);
  const poupanca = Number(metaPoupanca);

  const totalGastos = fixos + variaveis;
  const saldo = renda - totalGastos;
  const percentual = renda > 0 ? (totalGastos / renda) * 100 : 0;

  if (!renda || !Number.isFinite(renda) || renda <= 0) {
    return {
      situacao: 'Dados inválidos',
      mensagem: 'A renda mensal precisa ser maior que zero.',
      tipo: 'alert-danger',
      saldo,
      totalGastos,
      percentual,
    };
  }

  if (totalGastos > renda) {
    return {
      situacao: 'Orçamento crítico',
      mensagem: 'Os gastos totais excedem a renda. Revise os valores com responsabilidade.',
      tipo: 'alert-danger',
      saldo,
      totalGastos,
      percentual,
    };
  }

  if (poupanca > saldo) {
    return {
      situacao: 'Meta muito alta',
      mensagem: 'A meta de poupança está acima do valor disponível após os gastos.',
      tipo: 'alert-warning',
      saldo,
      totalGastos,
      percentual,
    };
  }

  if (percentual <= 60) {
    return {
      situacao: 'Saudável',
      mensagem: 'Seu orçamento está equilibrado e com espaço para planejamento.',
      tipo: 'alert-success',
      saldo,
      totalGastos,
      percentual,
    };
  }

  return {
    situacao: 'Atenção',
    mensagem: 'Você está gastando uma parte alta da renda. Avalie ajustes nos gastos.',
    tipo: 'alert-warning',
    saldo,
    totalGastos,
    percentual,
  };
}

formularioFinanceiro.addEventListener('submit', (event) => {
  event.preventDefault();

  const rendaMensal = document.querySelector('#rendaMensal').value;
  const gastosFixos = document.querySelector('#gastosFixos').value;
  const gastosVariaveis = document.querySelector('#gastosVariaveis').value;
  const metaPoupanca = document.querySelector('#metaPoupanca').value;

  const analise = calcularAnaliseFinanceira(
    rendaMensal,
    gastosFixos,
    gastosVariaveis,
    metaPoupanca
  );

  saldoDisponivel.textContent = formatarMoeda(analise.saldo);
  gastosTotais.textContent = formatarMoeda(analise.totalGastos);
  percentualGasto.textContent = `${analise.percentual.toFixed(1)}%`;
  situacaoFinanceira.textContent = analise.situacao;
  mostrarMensagem(analise.mensagem, analise.tipo);
});

limparFinanceiro.addEventListener('click', () => {
  formularioFinanceiro.reset();
  saldoDisponivel.textContent = 'R$ 0,00';
  gastosTotais.textContent = 'R$ 0,00';
  percentualGasto.textContent = '0%';
  situacaoFinanceira.textContent = 'Aguardando dados';
  mostrarMensagem('Preencha os dados para analisar sua situação financeira.', 'alert alert-info');
  document.querySelector('#rendaMensal').focus();
});
