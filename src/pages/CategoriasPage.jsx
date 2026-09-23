import { useEffect, useState } from 'react'
import { criarCategoria, editarCategoria, listarCategorias, removerCategoria } from '../services/categoriaService'
import Button from '../components/Button'
import Card from '../components/Card'
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback'
import { Field, Input, Textarea } from '../components/FormField'
import Icon from '../components/Icon'

const formVazio = { nome: '', descricao: '' }

function CategoriasPage() {
    const [categorias, setCategorias] = useState([])
    const [form, setForm] = useState(formVazio)
    const [editando, setEditando] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState(null)

    async function carregar() {
        setCarregando(true); setErro(null)
        try { const dados = await listarCategorias(); setCategorias(Array.isArray(dados) ? dados : []) }
        catch (error) { setErro(error.message) }
        finally { setCarregando(false) }
    }
    useEffect(() => {
        listarCategorias()
            .then((dados) => setCategorias(Array.isArray(dados) ? dados : []))
            .catch((error) => setErro(error.message))
            .finally(() => setCarregando(false))
    }, [])

    async function salvar(event) {
        event.preventDefault(); setSalvando(true); setErro(null)
        try {
            if (editando) await editarCategoria(editando, form)
            else await criarCategoria(form)
            setForm(formVazio); setEditando(null); await carregar()
        } catch (error) { setErro(error.message) }
        finally { setSalvando(false) }
    }

    function iniciarEdicao(categoria) { setEditando(categoria.id); setForm({ nome: categoria.nome, descricao: categoria.descricao ?? '' }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
    function cancelarEdicao() { setEditando(null); setForm(formVazio) }

    async function excluir(categoria) {
        if (!window.confirm(`Remover a categoria “${categoria.nome}”?`)) return
        try { await removerCategoria(categoria.id); await carregar() }
        catch (error) { setErro(error.message) }
    }

    return (
        <div>
            <header className="mb-7"><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">Organização</p><h1 className="text-3xl font-bold text-white md:text-4xl">Categorias</h1><p className="mt-2 text-slate-400">Organize os tipos de solicitação para agilizar o atendimento.</p></header>
            <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
                <Card className="h-fit lg:sticky lg:top-6">
                    <span className="mb-4 grid size-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400"><Icon name={editando ? 'edit' : 'plus'} /></span>
                    <h2 className="font-bold text-white">{editando ? 'Editar categoria' : 'Nova categoria'}</h2>
                    <p className="mb-5 mt-1 text-sm text-slate-500">{editando ? 'Atualize as informações abaixo.' : 'Crie uma opção fácil de identificar.'}</p>
                    <form onSubmit={salvar} className="grid gap-4">
                        <Field label="Nome"><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Acesso a sistemas" required /></Field>
                        <Field label="Descrição"><Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Quais problemas entram aqui?" required /></Field>
                        <Button type="submit" disabled={salvando}>{salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar categoria'}</Button>
                        {editando && <Button variant="ghost" onClick={cancelarEdicao}>Cancelar edição</Button>}
                    </form>
                </Card>

                <section>
                    {erro && <div className="mb-4"><ErrorMessage message={erro} onRetry={carregar} /></div>}
                    {carregando ? <Loading text="Carregando categorias..." /> : categorias.length === 0 ? <EmptyState icon="category" title="Nenhuma categoria cadastrada" description="Use o formulário para criar a primeira categoria." /> : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {categorias.map((categoria) => <Card key={categoria.id} className="group flex min-h-40 flex-col"><div className="mb-4 flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-slate-800 text-cyan-400"><Icon name="category" /></span><span className="font-mono text-xs text-slate-600">#{categoria.id}</span></div><h2 className="font-bold text-white">{categoria.nome}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-400">{categoria.descricao || 'Sem descrição.'}</p><div className="mt-5 flex gap-2 border-t border-slate-800 pt-4"><Button variant="ghost" className="flex-1" onClick={() => iniciarEdicao(categoria)}><Icon name="edit" size={15} /> Editar</Button><Button variant="danger" onClick={() => excluir(categoria)} aria-label={`Remover ${categoria.nome}`}><Icon name="trash" size={15} /></Button></div></Card>)}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default CategoriasPage
