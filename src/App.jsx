import { useState } from 'react'
import CategoriasPage from './pages/CategoriasPage'
import ChamadoDetalhesPage from './pages/ChamadoDetalhesPage'
import ChamadosPage from './pages/ChamadosPage'
import Icon from './components/Icon'

const itens = [
    { id: 'chamados', nome: 'Chamados', icon: 'tickets' },
    { id: 'categorias', nome: 'Categorias', icon: 'category' },
]

function App() {
    const [pagina, setPagina] = useState('chamados')
    const [chamadoId, setChamadoId] = useState(null)

    function navegar(destino) {
        setPagina(destino)
        setChamadoId(null)
    }

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
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" /><span className="relative inline-flex size-2 rounded-full bg-emerald-400" /></span>Central de ajuda</div>
                    <p className="mt-2 text-xs leading-5 text-slate-500">Abra e acompanhe suas solicitações em um só lugar.</p>
                </div>
            </aside>

            <div className="relative lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/85 px-4 backdrop-blur-xl lg:hidden">
                    <button onClick={() => navegar('chamados')} className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-cyan-400 text-slate-950"><Icon name="server" size={17} /></span><strong>NEXO<span className="text-cyan-400">TI</span></strong></button>
                    <nav className="flex gap-1" aria-label="Menu mobile">{itens.map((item) => <button key={item.id} onClick={() => navegar(item.id)} className={`rounded-lg p-2 ${pagina === item.id && !chamadoId ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500'}`} aria-label={item.nome}><Icon name={item.icon} /></button>)}</nav>
                </header>

                <div className="mx-auto w-full max-w-7xl p-4 py-7 sm:p-7 lg:p-10">
                    {chamadoId ? <ChamadoDetalhesPage chamadoId={chamadoId} onVoltar={() => setChamadoId(null)} /> : pagina === 'categorias' ? <CategoriasPage /> : <ChamadosPage onAbrirChamado={setChamadoId} />}
                </div>
            </div>
        </div>
    )
}

export default App
