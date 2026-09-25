import { apiFetch } from '../api/api'

async function tratarResposta(resposta, mensagemPadrao) {
    const dados = await resposta.json().catch(() => null)

    if (!resposta.ok) {
        const erros = dados?.errors ? Object.values(dados.errors).flat().join(' ') : null
        throw new Error(erros || dados?.message || mensagemPadrao)
    }

    return dados?.data ?? dados
}

export async function listarCategorias() {
    const resposta = await apiFetch('/categorias')
    return tratarResposta(resposta, 'Não foi possível carregar as categorias.')
}

export async function criarCategoria(dados) {
    const resposta = await apiFetch('/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    return tratarResposta(resposta, 'Não foi possível criar a categoria.')
}

export async function editarCategoria(id, dados) {
    const resposta = await apiFetch(`/categorias/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })
    return tratarResposta(resposta, 'Não foi possível atualizar a categoria.')
}

export async function removerCategoria(id) {
    const resposta = await apiFetch(`/categorias/${id}`, { method: 'DELETE' })

    if (resposta.status === 204) {
        return null
    }

    return tratarResposta(resposta, 'Não foi possível remover a categoria.')
}
