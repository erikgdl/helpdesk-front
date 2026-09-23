import API_URL from '../api/api'

export async function listarChamados() {
    const resposta = await fetch(`${API_URL}/chamados`)

    if (!resposta.ok) {
        throw new Error('Erro ao buscar chamados')
    }

    return resposta.json()
}

export async function criarChamado(dados) {
    const resposta = await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    if (!resposta.ok) {
        throw new Error('Erro ao criar chamado')
    }

    return resposta.json()
}