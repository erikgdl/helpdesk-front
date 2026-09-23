import { useEffect, useMemo, useState } from 'react'
import { listarChamados } from '../services/chamadoService'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback'
import Icon from '../components/Icon'
import NovoChamadoForm from '../components/NovoChamadoForm'

const nomesStatus = {
    aberto: 'Aberto',
    em_atendimento: 'Em atendimento',
    aguardando_usuario: 'Aguardando você',
    finalizado: 'Finalizado',
    cancelado: 'Cancelado',
}

const nomesPrioridade = { baixa: 'Baixa', media: 'Média', alta: 'Alta', urgente: 'Urgente' }

function nomePessoa(pessoa, vazio) {
    return pessoa?.name ?? pessoa?.nome ?? vazio
}

function formatarData(data) {
    if (!data) return 'Data não informada'
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(data))
}

function ChamadosPage({ onAbrirChamado }) {
    const [chamados, setChamados] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState('todos')

    async function carregarChamados() {
        setCarregando(true)
        setErro(null)
        try {
            const dados = await listarChamados()
            setChamados(Array.isArray(dados) ? dados : [])
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        listarChamados()
            .then((dados) => setChamados(Array.isArray(dados) ? dados : []))
            .catch((error) => setErro(error.message))
            .finally(() => setCarregando(false))
    }, [])

    const filtrados = useMemo(() => chamados.filter((chamado) => {
        const termo = busca.toLowerCase()
        const correspondeBusca = chamado.titulo?.toLowerCase().includes(termo) || String(chamado.id).includes(termo)
        const correspondeFiltro = filtro === 'todos' || chamado.status === filtro
        return correspondeBusca && correspondeFiltro
    }), [chamados, busca, filtro])

    const ativos = chamados.filter((item) => ['aberto', 'em_atendimento', 'aguardando_usuario'].includes(item.status)).length
    const urgentes = chamados.filter((item) => item.prioridade === 'urgente' && !['finalizado', 'cancelado'].includes(item.status)).length

    return (
        <>
            <header className="mb-7 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">Central de suporte</p>
                    <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Como podemos ajudar?</h1>
                    <p className="mt-2 text-slate-400">Acompanhe suas solicitações ou informe um novo problema.</p>
                </div>
                <Button onClick={() => setMostrarFormulario(true)} className="md:self-center"><Icon name="plus" /> Novo chamado</Button>
            </header>

            {!carregando && !erro && (
                <div className="mb-6 grid gap-3 sm:grid-cols-3">
                    <Card className="flex items-center gap-4 p-4" as="div"><span className="grid size-11 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400"><Icon name="tickets" /></span><div><strong className="block text-2xl text-white">{chamados.length}</strong><span className="text-xs text-slate-400">Total de chamados</span></div></Card>
                    <Card className="flex items-center gap-4 p-4" as="div"><span className="grid size-11 place-items-center rounded-xl bg-amber-500/10 text-amber-400"><Icon name="clock" /></span><div><strong className="block text-2xl text-white">{ativos}</strong><span className="text-xs text-slate-400">Precisam de atenção</span></div></Card>
                    <Card className="flex items-center gap-4 p-4" as="div"><span className="grid size-11 place-items-center rounded-xl bg-rose-500/10 text-rose-400"><Icon name="alert" /></span><div><strong className="block text-2xl text-white">{urgentes}</strong><span className="text-xs text-slate-400">Com impacto urgente</span></div></Card>
                </div>
            )}

            <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
                <div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row">
                    <label className="relative flex-1">
                        <span className="sr-only">Buscar chamado</span>
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input value={busca} onChange={(e) => setBusca(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950/60 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500" placeholder="Buscar por título ou número..." />
                    </label>
                    <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500">
                        <option value="todos">Todos os status</option>
                        {Object.entries(nomesStatus).map(([valor, nome]) => <option key={valor} value={valor}>{nome}</option>)}
                    </select>
                </div>

                <div className="p-4">
                    {carregando ? <Loading text="Buscando chamados..." /> : erro ? <ErrorMessage message={erro} onRetry={carregarChamados} /> : filtrados.length === 0 ? (
                        <EmptyState title={chamados.length ? 'Nenhum resultado encontrado' : 'Nenhum chamado por aqui'} description={chamados.length ? 'Tente buscar usando outras palavras ou filtros.' : 'Quando precisar da TI, abra um chamado e acompanhe tudo por aqui.'} action={!chamados.length && <Button onClick={() => setMostrarFormulario(true)}><Icon name="plus" /> Abrir primeiro chamado</Button>} />
                    ) : (
                        <div className="grid gap-3">
                            {filtrados.map((chamado) => (
                                <button key={chamado.id} onClick={() => onAbrirChamado(chamado.id)} className="group grid w-full gap-4 rounded-xl border border-slate-800 bg-slate-950/30 p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-500/30 hover:bg-slate-800/60 sm:grid-cols-[1fr_auto] sm:items-center">
                                    <div className="min-w-0">
                                        <div className="mb-2 flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-cyan-400">#{chamado.id}</span><Badge variant={chamado.status}>{nomesStatus[chamado.status] ?? chamado.status}</Badge><Badge variant={chamado.prioridade}>{nomesPrioridade[chamado.prioridade] ?? chamado.prioridade}</Badge></div>
                                        <h3 className="truncate font-bold text-white group-hover:text-cyan-300">{chamado.titulo}</h3>
                                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500"><span>{chamado.categoria?.nome ?? 'Sem categoria'}</span><span>Solicitante: {nomePessoa(chamado.usuario ?? chamado.solicitante, 'Não informado')}</span><span>{formatarData(chamado.data_abertura ?? chamado.created_at)}</span></div>
                                    </div>
                                    <span className="flex items-center justify-between gap-4 text-xs text-slate-500 sm:justify-end">{nomePessoa(chamado.tecnico, 'Aguardando técnico')}<Icon name="arrow" className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-400" /></span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {mostrarFormulario && <NovoChamadoForm onCancelar={() => setMostrarFormulario(false)} onChamadoCriado={() => { setMostrarFormulario(false); carregarChamados() }} />}
        </>
    )
}

export default ChamadosPage
