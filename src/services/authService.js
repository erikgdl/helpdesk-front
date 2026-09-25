import API_URL, { apiFetch } from '../api/api'

async function lerResposta(resposta, mensagem) {
    const dados = await resposta.json().catch(() => null)
    if (!resposta.ok) {
        const erros = dados?.errors ? Object.values(dados.errors).flat().join(' ') : null
        throw new Error(erros || dados?.message || mensagem)
    }
    return dados
}

export async function entrar(credenciais) {
    const resposta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciais),
    })
    return lerResposta(resposta, 'Não foi possível entrar.')
}

export async function sair() {
    const resposta = await apiFetch('/logout', { method: 'POST' })
    return lerResposta(resposta, 'Não foi possível encerrar a sessão.')
}
