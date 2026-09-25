import { apiFetch } from '../api/api'

async function tratarResposta(resposta, mensagemPadrao) {
    const dados = await resposta.json().catch(() => null)

    if (!resposta.ok) {
        const erros = dados?.errors ? Object.values(dados.errors).flat().join(' ') : null
        throw new Error(erros || dados?.message || mensagemPadrao)
    }

    return dados?.data ?? dados
}

export async function listarChamados() {
    const resposta = await apiFetch('/chamados')
    return tratarResposta(resposta, 'Não foi possível carregar os chamados.')
}

export async function criarChamado(dados) {
    const resposta = await apiFetch('/chamados', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    return tratarResposta(resposta, 'Não foi possível abrir o chamado.')
}

export async function buscarChamado(id) {
    const resposta = await apiFetch(`/chamados/${id}`)
    return tratarResposta(resposta, 'Não foi possível carregar este chamado.')
}

export async function removerChamado(id) {
    const resposta = await apiFetch(`/chamados/${id}`, { method: 'DELETE' })
    return tratarResposta(resposta, 'Não foi possível remover o chamado da lista.')
}

async function executarAcao(id, acao, dados, mensagem) {
    const resposta = await apiFetch(`/chamados/${id}/${acao}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })

    return tratarResposta(resposta, mensagem)
}

export function assumirChamado(id) {
    return executarAcao(id, 'assumir', {}, 'Não foi possível assumir o chamado.')
}

export function adicionarComentario(id, dados) {
    return executarAcao(id, 'comentarios', {
        mensagem: dados.mensagem,
    }, 'Não foi possível adicionar o comentário.')
}

export function finalizarChamado(id) {
    return executarAcao(id, 'finalizar', {}, 'Não foi possível finalizar o chamado.')
}

export function cancelarChamado(id) {
    return executarAcao(id, 'cancelar', {}, 'Não foi possível cancelar o chamado.')
}
