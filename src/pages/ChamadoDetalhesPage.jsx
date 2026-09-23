import { useEffect, useState } from 'react'
import { adicionarComentario, assumirChamado, buscarChamado, cancelarChamado, finalizarChamado } from '../services/chamadoService'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import { ErrorMessage, Loading } from '../components/Feedback'
import { Field, Input, Textarea } from '../components/FormField'
import Icon from '../components/Icon'

const statusLabel = { aberto: 'Aberto', em_atendimento: 'Em atendimento', aguardando_usuario: 'Aguardando você', finalizado: 'Finalizado', cancelado: 'Cancelado' }
const prioridadeLabel = { baixa: 'Baixa', media: 'Média', alta: 'Alta', urgente: 'Urgente' }

function nome(pessoa, padrao = 'Não informado') { return pessoa?.name ?? pessoa?.nome ?? padrao }
function dataHora(data) { return data ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(data)) : 'Não informada' }

function ChamadoDetalhesPage({ chamadoId, onVoltar }) {
    const [chamado, setChamado] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [processando, setProcessando] = useState(false)
    const [erro, setErro] = useState(null)
    const [erroAcao, setErroAcao] = useState(null)
    const [tecnicoId, setTecnicoId] = useState(2)
    const [usuarioId, setUsuarioId] = useState(1)
    const [mensagem, setMensagem] = useState('')

    async function carregar() {
        setCarregando(true)
        setErro(null)
        try { setChamado(await buscarChamado(chamadoId)) }
        catch (error) { setErro(error.message) }
        finally { setCarregando(false) }
    }

    useEffect(() => {
        buscarChamado(chamadoId)
            .then(setChamado)
            .catch((error) => setErro(error.message))
            .finally(() => setCarregando(false))
    }, [chamadoId])

    async function executar(acao) {
        setProcessando(true)
        setErroAcao(null)
        try { await acao(); await carregar() }
        catch (error) { setErroAcao(error.message) }
        finally { setProcessando(false) }
    }

    async function comentar(event) {
        event.preventDefault()
        if (!mensagem.trim()) return
        await executar(() => adicionarComentario(chamadoId, { usuario_id: usuarioId, mensagem }))
        setMensagem('')
    }

    if (carregando && !chamado) return <Loading text="Abrindo chamado..." />
    if (erro && !chamado) return <ErrorMessage message={erro} onRetry={carregar} />

    const comentarios = chamado.comentarios ?? []
    const historico = chamado.historico ?? chamado.historicos ?? []
    const encerrado = ['finalizado', 'cancelado'].includes(chamado.status)

    return (
        <div>
            <button onClick={onVoltar} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-300"><Icon name="back" /> Voltar para chamados</button>

            <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2"><span className="font-mono text-sm font-bold text-cyan-400">CHAMADO #{chamado.id}</span><Badge variant={chamado.status}>{statusLabel[chamado.status] ?? chamado.status}</Badge><Badge variant={chamado.prioridade}>{prioridadeLabel[chamado.prioridade] ?? chamado.prioridade}</Badge></div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">{chamado.titulo}</h1>
                    <p className="mt-2 text-sm text-slate-500">Aberto em {dataHora(chamado.data_abertura ?? chamado.created_at)}</p>
                </div>
                {carregando && <span className="text-xs text-cyan-400">Atualizando...</span>}
            </header>

            {erroAcao && <p className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{erroAcao}</p>}

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                <main className="grid content-start gap-5">
                    <Card>
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">Descrição do problema</h2>
                        <p className="whitespace-pre-wrap leading-7 text-slate-200">{chamado.descricao}</p>
                    </Card>

                    <Card>
                        <div className="mb-5 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold text-white"><Icon name="message" className="text-cyan-400" /> Conversa <span className="text-xs text-slate-500">({comentarios.length})</span></h2></div>
                        <div className="grid gap-4">
                            {comentarios.length === 0 ? <p className="rounded-xl bg-slate-950/40 p-5 text-center text-sm text-slate-500">Ainda não há mensagens neste chamado.</p> : comentarios.map((comentario) => (
                                <div key={comentario.id} className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-800 text-slate-400"><Icon name="user" size={16} /></span><div className="min-w-0 flex-1 rounded-xl rounded-tl-none bg-slate-800/60 p-4"><div className="mb-2 flex flex-wrap justify-between gap-2"><strong className="text-sm text-white">{nome(comentario.usuario)}</strong><time className="text-xs text-slate-500">{dataHora(comentario.created_at ?? comentario.data)}</time></div><p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{comentario.mensagem}</p></div></div>
                            ))}
                        </div>
                        {!encerrado && <form onSubmit={comentar} className="mt-5 grid gap-3 border-t border-slate-800 pt-5"><Field label="Adicionar mensagem"><Textarea value={mensagem} onChange={(e) => setMensagem(e.target.value)} placeholder="Escreva uma atualização ou dúvida..." required /></Field><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><Field label="Seu código"><Input className="w-32" type="number" min="1" value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)} required /></Field><Button type="submit" disabled={processando || !mensagem.trim()}><Icon name="message" /> Enviar mensagem</Button></div></form>}
                    </Card>

                    <Card>
                        <h2 className="mb-4 flex items-center gap-2 font-bold text-white"><Icon name="clock" className="text-cyan-400" /> Histórico</h2>
                        {historico.length === 0 ? <p className="text-sm text-slate-500">Nenhum evento registrado.</p> : <ol className="ml-2 border-l border-slate-700 pl-5">{historico.map((item, index) => <li key={item.id ?? index} className="relative pb-5 last:pb-0 before:absolute before:-left-[25px] before:top-1 before:size-2 before:rounded-full before:bg-cyan-400"><p className="text-sm text-slate-300">{item.descricao ?? item.acao ?? item.mensagem}</p><time className="mt-1 block text-xs text-slate-600">{dataHora(item.created_at ?? item.data)}</time></li>)}</ol>}
                    </Card>
                </main>

                <aside className="grid content-start gap-5">
                    <Card>
                        <h2 className="mb-4 font-bold text-white">Informações</h2>
                        <dl className="grid gap-4 text-sm"><div><dt className="text-xs text-slate-500">Categoria</dt><dd className="mt-1 font-semibold text-slate-200">{chamado.categoria?.nome ?? 'Sem categoria'}</dd></div><div><dt className="text-xs text-slate-500">Solicitante</dt><dd className="mt-1 font-semibold text-slate-200">{nome(chamado.usuario ?? chamado.solicitante)}</dd></div><div><dt className="text-xs text-slate-500">Técnico responsável</dt><dd className="mt-1 font-semibold text-slate-200">{nome(chamado.tecnico, 'Aguardando atribuição')}</dd></div>{chamado.data_fechamento && <div><dt className="text-xs text-slate-500">Encerrado em</dt><dd className="mt-1 font-semibold text-slate-200">{dataHora(chamado.data_fechamento)}</dd></div>}</dl>
                    </Card>

                    {!encerrado && <Card>
                        <h2 className="mb-1 font-bold text-white">Ações da equipe</h2>
                        <p className="mb-4 text-xs leading-5 text-slate-500">Área destinada ao atendimento técnico.</p>
                        <Field label="Código do técnico"><Input type="number" min="1" value={tecnicoId} onChange={(e) => setTecnicoId(e.target.value)} /></Field>
                        <div className="mt-4 grid gap-2">
                            {chamado.status === 'aberto' && <Button disabled={processando} onClick={() => executar(() => assumirChamado(chamadoId, tecnicoId))}><Icon name="user" /> Assumir atendimento</Button>}
                            {chamado.status === 'em_atendimento' && <Button variant="success" disabled={processando} onClick={() => executar(() => finalizarChamado(chamadoId, tecnicoId))}><Icon name="check" /> Marcar como resolvido</Button>}
                            <Button variant="danger" disabled={processando} onClick={() => { if (window.confirm('Deseja realmente cancelar este chamado?')) executar(() => cancelarChamado(chamadoId, usuarioId)) }}><Icon name="close" /> Cancelar chamado</Button>
                        </div>
                    </Card>}
                </aside>
            </div>
        </div>
    )
}

export default ChamadoDetalhesPage
