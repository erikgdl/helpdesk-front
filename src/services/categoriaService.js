import API_URL from '../api/api'

export async function listarCategorias() {
    const resposta = await fetch(`${API_URL}/categorias`)

    if (!resposta.ok) {
        throw new Error('Erro ao buscar categorias')
    }

    return resposta.json()
}