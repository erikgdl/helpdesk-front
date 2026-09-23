import API_URL from '../api/api'

async function tratarResposta(resposta, mensagemPadrao) {
    const dados = await resposta.json().catch(() => null)

    if (!resposta.ok) {
        const erros = dados?.errors ? Object.values(dados.errors).flat().join(' ') : null
        throw new Error(erros || dados?.message || mensagemPadrao)
    }

    return dados?.data ?? dados
}

export async function listarChamados() {
    const resposta = await fetch(`${API_URL}/chamados`)
    return tratarResposta(resposta, 'Não foi possível carregar os chamados.')
}

export async function criarChamado(dados) {
    const resposta = await fetch(`${API_URL}/chamados`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    })

    return tratarResposta(resposta, 'Não foi possível abrir o chamado.')
}

export async function buscarChamado(id) {
    const resposta = await fetch(`${API_URL}/chamados/${id}`)
    return tratarResposta(resposta, 'Não foi possível carregar este chamado.')
}

async function executarAcao(id, acao, dados, mensagem) {
    const resposta = await fetch(`${API_URL}/chamados/${id}/${acao}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
    })

    return tratarResposta(resposta, mensagem)
}

export function assumirChamado(id, tecnicoId) {
    return executarAcao(id, 'assumir', { tecnico_id: Number(tecnicoId) }, 'Não foi possível assumir o chamado.')
}

export function adicionarComentario(id, dados) {
    return executarAcao(id, 'comentarios', {
        usuario_id: Number(dados.usuario_id),
        mensagem: dados.mensagem,
    }, 'Não foi possível adicionar o comentário.')
}

export function finalizarChamado(id, tecnicoId) {
    return executarAcao(id, 'finalizar', { tecnico_id: Number(tecnicoId) }, 'Não foi possível finalizar o chamado.')
}

export function cancelarChamado(id, usuarioId) {
    return executarAcao(id, 'cancelar', { usuario_id: Number(usuarioId) }, 'Não foi possível cancelar o chamado.')
}
