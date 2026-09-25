import { useEffect, useMemo, useState } from 'react'
import { AUTH_STORAGE_KEY } from './api/api'
import CategoriasPage from './pages/CategoriasPage'
import ChamadoDetalhesPage from './pages/ChamadoDetalhesPage'
import ChamadosPage from './pages/ChamadosPage'
import LoginPage from './pages/LoginPage'
import Icon from './components/Icon'
import { entrar, sair } from './services/authService'

const nomesTipo = { solicitante: 'Solicitante', tecnico: 'Técnico', admin: 'Administrador' }

function App() {
    const [sessao, setSessao] = useState(() => JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? 'null'))
    const [pagina, setPagina] = useState('chamados')
    const [chamadoId, setChamadoId] = useState(null)
    const itens = useMemo(() => [
        { id: 'chamados', nome: 'Chamados', icon: 'tickets' },
        ...(sessao?.user?.tipo !== 'solicitante' ? [{ id: 'categorias', nome: 'Categorias', icon: 'category' }] : []),
    ], [sessao])

    useEffect(() => {
        const encerrarSessao = () => { setSessao(null); setPagina('chamados'); setChamadoId(null) }
        window.addEventListener('helpdesk:unauthorized', encerrarSessao)
        return () => window.removeEventListener('helpdesk:unauthorized', encerrarSessao)
    }, [])

    async function fazerLogin(credenciais) {
        const dados = await entrar(credenciais)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dados))
        setSessao(dados)
    }

    async function fazerLogout() {
        try { await sair() } catch { /* A sessão local também deve ser encerrada. */ }
        localStorage.removeItem(AUTH_STORAGE_KEY)
        setSessao(null)
        setPagina('chamados')
        setChamadoId(null)
    }

    function navegar(destino) {
        setPagina(destino)
        setChamadoId(null)
    }

    if (!sessao?.token || !sessao?.user) return <LoginPage onLogin={fazerLogin} />

    const usuario = sessao.user

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.08),transparent_28%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.06),transparent_28%)]" />

            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-slate-950/95 p-5 backdrop-blur lg:flex">
                <button onClick={() => navegar('chamados')} className="flex items-center gap-3 rounded-xl text-left">
                    <span className="grid size-10 place-items-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"><Icon name="server" size={21} /></span>
                    <span><strong className="block text-base tracking-tight text-white">NEXO<span className="text-cyan-400">TI</span></strong><small className="block text-[10px] uppercase tracking-[0.2em] text-slate-500">Service desk</small></span>
                </button>

                <nav className="mt-10 grid gap-2" aria-label="Menu principal">
                    <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">Atendimento</p>
                    {itens.map((item) => {
                        const ativo = pagina === item.id && !chamadoId
                        return <button key={item.id} onClick={() => navegar(item.id)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${ativo ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}><Icon name={item.icon} /><span>{item.nome}</span>{ativo && <span className="ml-auto size-1.5 rounded-full bg-cyan-400" />}</button>
                    })}
                </nav>

                <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-cyan-500/10 text-cyan-400"><Icon name="user" size={16} /></span><div className="min-w-0"><strong className="block truncate text-sm text-white">{usuario.name}</strong><span className="text-xs text-slate-500">{nomesTipo[usuario.tipo]}</span></div></div>
                    <button onClick={fazerLogout} className="mt-4 w-full rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-rose-500/30 hover:text-rose-300">Sair da conta</button>
                </div>
            </aside>

            <div className="relative lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/85 px-4 backdrop-blur-xl lg:hidden">
                    <button onClick={() => navegar('chamados')} className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-cyan-400 text-slate-950"><Icon name="server" size={17} /></span><strong>NEXO<span className="text-cyan-400">TI</span></strong></button>
                    <nav className="flex gap-1" aria-label="Menu mobile">{itens.map((item) => <button key={item.id} onClick={() => navegar(item.id)} className={`rounded-lg p-2 ${pagina === item.id && !chamadoId ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500'}`} aria-label={item.nome}><Icon name={item.icon} /></button>)}<button onClick={fazerLogout} className="rounded-lg p-2 text-slate-500" aria-label="Sair"><Icon name="close" /></button></nav>
                </header>

                <div className="mx-auto w-full max-w-7xl p-4 py-7 sm:p-7 lg:p-10">
                    {chamadoId ? <ChamadoDetalhesPage chamadoId={chamadoId} usuario={usuario} onVoltar={() => setChamadoId(null)} /> : pagina === 'categorias' && usuario.tipo !== 'solicitante' ? <CategoriasPage usuario={usuario} /> : <ChamadosPage usuario={usuario} onAbrirChamado={setChamadoId} />}
                </div>
            </div>
        </div>
    )
}

export default App
