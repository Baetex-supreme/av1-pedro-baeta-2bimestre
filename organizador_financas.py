from decimal import Decimal, InvalidOperation


class ErroFinanceiro(Exception):
    """Erro base para validações do orçamento."""


class DadosInvalidosErro(ErroFinanceiro):
    """Quando os dados do cliente não atendem ao formato esperado."""


class SaldoInsuficienteErro(ErroFinanceiro):
    """Quando os gastos ultrapassam a renda mensal."""


def receber_afirmacoes(dados):
    """Recebe os valores do orçamento e valida de forma semântica."""
    try:
        renda = Decimal(str(dados["renda_mensal"]))
        gastos_fixos = Decimal(str(dados["gastos_fixos"]))
        gastos_variaveis = Decimal(str(dados["gastos_variaveis"]))
        meta_poupanca = Decimal(str(dados["meta_poupanca"]))
    except (KeyError, InvalidOperation, TypeError):
        raise DadosInvalidosErro("Os valores informados não são válidos para análise financeira.")

    if renda <= 0:
        raise DadosInvalidosErro("A renda mensal precisa ser maior que zero.")

    gastos_totais = gastos_fixos + gastos_variaveis
    saldo_disponivel = renda - gastos_totais

    if gastos_totais > renda:
        raise SaldoInsuficienteErro(
            "A soma dos gastos excede a renda mensal. Revise o orçamento com responsabilidade."
        )

    if meta_poupanca > saldo_disponivel:
        raise ErroFinanceiro(
            "A meta de poupança está acima do valor disponível depois de pagar os gastos."
        )

    return {
        "renda_mensal": renda,
        "gastos_totais": gastos_totais,
        "saldo_disponivel": saldo_disponivel,
        "meta_poupanca": meta_poupanca,
        "situacao": "Orçamento saudável e sustentável.",
    }


if __name__ == "__main__":
    entradas = {
        "renda_mensal": 4200,
        "gastos_fixos": 1800,
        "gastos_variaveis": 650,
        "meta_poupanca": 500,
    }

    resultado = receber_afirmacoes(entradas)
    print(resultado)
