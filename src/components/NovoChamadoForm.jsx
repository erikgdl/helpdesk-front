import { useEffect, useState } from 'react'
import { criarChamado } from '../services/chamadoService'
import { listarCategorias } from '../services/categoriaService'
import Button from './Button'
import Card from './Card'

function NovoChamadoForm({ onChamadoCriado }) {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [prioridade, setPrioridade] = useState('media')
    const [usuarioId, setUsuarioId] = useState(1)
    const [categoriaId, setCategoriaId] = useState('')
    const [categorias, setCategorias] = useState([])
    const [erro, setErro] = useState(null)
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        async function carregarCategorias() {
            try {
                const dados = await listarCategorias()
                setCategorias(dados)

                if (dados.length > 0) {
                    setCategoriaId(dados[0].id)
                }
            } catch (error) {
                setErro(error.message)
            }
        }

        carregarCategorias()
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()

        setErro(null)
        setSalvando(true)

        try {
            await criarChamado({
                titulo,
                descricao,
                prioridade,
                usuario_id: Number(usuarioId),
                categoria_id: Number(categoriaId),
            })

            setTitulo('')
            setDescricao('')
            setPrioridade('media')
            setUsuarioId(1)

            onChamadoCriado()
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <Card>
            <h3 className="mb-4 text-lg font-bold text-white">
                Novo chamado
            </h3>

            {erro && (
                <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {erro}
                </p>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                        Título
                    </label>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(event) => setTitulo(event.target.value)}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                        placeholder="Ex: Erro ao acessar sistema"
                        required
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                        Descrição
                    </label>

                    <textarea
                        value={descricao}
                        onChange={(event) => setDescricao(event.target.value)}
                        className="min-h-24 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                        placeholder="Descreva o problema"
                        required
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">
                            Prioridade
                        </label>

                        <select
                            value={prioridade}
                            onChange={(event) => setPrioridade(event.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                        >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                            <option value="urgente">Urgente</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">
                            Usuário ID
                        </label>

                        <input
                            type="number"
                            value={usuarioId}
                            onChange={(event) => setUsuarioId(event.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-300">
                            Categoria
                        </label>

                        <select
                            value={categoriaId}
                            onChange={(event) => setCategoriaId(event.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-blue-500"
                            required
                        >
                            {categorias.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <Button type="submit">
                        {salvando ? 'Salvando...' : 'Criar chamado'}
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default NovoChamadoForm