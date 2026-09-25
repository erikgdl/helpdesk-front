const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

export const AUTH_STORAGE_KEY = 'helpdesk_auth'

export async function apiFetch(caminho, opcoes = {}) {
    const sessao = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null')
    const headers = {
        Accept: 'application/json',
        ...opcoes.headers,
    }

    if (sessao?.token) headers.Authorization = `Bearer ${sessao.token}`

    const resposta = await fetch(`${API_URL}${caminho}`, { ...opcoes, headers })

    if (resposta.status === 401 && sessao?.token) {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        window.dispatchEvent(new Event('helpdesk:unauthorized'))
    }

    return resposta
}

export default API_URL
