import { useEffect, useState } from 'react'
import { criarChamado } from '../services/chamadoService'
import { listarCategorias } from '../services/categoriaService'
import Button from './Button'
import Icon from './Icon'
import { Field, Input, Select, Textarea } from './FormField'

function NovoChamadoForm({ onChamadoCriado, onCancelar }) {
    const [form, setForm] = useState({ titulo: '', descricao: '', prioridade: 'media', usuario_id: 1, categoria_id: '' })
    const [categorias, setCategorias] = useState([])
    const [erro, setErro] = useState(null)
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        listarCategorias()
            .then((dados) => {
                const lista = Array.isArray(dados) ? dados : []
                setCategorias(lista)
                if (lista.length) setForm((atual) => ({ ...atual, categoria_id: lista[0].id }))
            })
            .catch((error) => setErro(error.message))
    }, [])

    function atualizar(campo, valor) {
        setForm((atual) => ({ ...atual, [campo]: valor }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErro(null)
        setSalvando(true)

        try {
            await criarChamado({
                ...form,
                usuario_id: Number(form.usuario_id),
                categoria_id: Number(form.categoria_id),
            })
            onChamadoCriado()
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="novo-chamado-title">
            <section className="my-6 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
                <header className="flex items-start justify-between border-b border-slate-800 p-6">
                    <div>
                        <span className="mb-3 grid size-10 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400"><Icon name="plus" /></span>
                        <h2 id="novo-chamado-title" className="text-xl font-bold text-white">Abrir novo chamado</h2>
                        <p className="mt-1 text-sm text-slate-400">Conte o que aconteceu. A equipe de TI cuidará do restante.</p>
                    </div>
                    <button onClick={onCancelar} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="Fechar"><Icon name="close" /></button>
                </header>

                <form onSubmit={handleSubmit} className="grid gap-5 p-6">
                    {erro && <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{erro}</p>}

                    <Field label="Qual é o problema?">
                        <Input value={form.titulo} onChange={(e) => atualizar('titulo', e.target.value)} placeholder="Ex.: Não consigo acessar o e-mail" required autoFocus />
                    </Field>

                    <Field label="Conte mais detalhes" hint="Informe quando começou e o que você já tentou fazer.">
                        <Textarea value={form.descricao} onChange={(e) => atualizar('descricao', e.target.value)} placeholder="Descreva o problema com suas palavras..." required />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Impacto">
                            <Select value={form.prioridade} onChange={(e) => atualizar('prioridade', e.target.value)}>
                                <option value="baixa">Baixo</option>
                                <option value="media">Médio</option>
                                <option value="alta">Alto</option>
                                <option value="urgente">Urgente</option>
                            </Select>
                        </Field>
                        <Field label="Categoria">
                            <Select value={form.categoria_id} onChange={(e) => atualizar('categoria_id', e.target.value)} required disabled={!categorias.length}>
                                {!categorias.length && <option value="">Carregando...</option>}
                                {categorias.map((categoria) => <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>)}
                            </Select>
                        </Field>
                        <Field label="Seu código" hint="Código do solicitante">
                            <Input type="number" min="1" value={form.usuario_id} onChange={(e) => atualizar('usuario_id', e.target.value)} required />
                        </Field>
                    </div>

                    <footer className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                        <Button variant="ghost" onClick={onCancelar}>Cancelar</Button>
                        <Button type="submit" disabled={salvando || !categorias.length}>
                            {salvando ? 'Enviando...' : <><Icon name="tickets" /> Abrir chamado</>}
                        </Button>
                    </footer>
                </form>
            </section>
        </div>
    )
}

export default NovoChamadoForm
