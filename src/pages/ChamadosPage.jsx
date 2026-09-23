import { useEffect, useState } from 'react'
import { listarChamados } from '../services/chamadoService'
import Button from '../components/Button'
import Card from '../components/Card'
import Badge from '../components/Badge'
import NovoChamadoForm from '../components/NovoChamadoForm'

function ChamadosPage() {
    const [chamados, setChamados] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    async function carregarChamados() {
        try {
            const dados = await listarChamados()
            setChamados(dados)
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregarChamados()
    }, [])

    if (carregando) {
        return (
            <p className="mx-auto max-w-6xl text-slate-300">
                Carregando chamados...
            </p>
        )
    }

    if (erro) {
        return (
            <p className="mx-auto max-w-6xl text-red-400">
                Erro: {erro}
            </p>
        )
    }

    return (
        <section className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Chamados</h2>

                    <p className="mt-1 text-slate-400">
                        Lista de chamados cadastrados na API.
                    </p>
                </div>

                <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                    {mostrarFormulario ? 'Fechar formulário' : 'Novo chamado'}
                </Button>
            </div>

            {mostrarFormulario && (
                <div className="mb-6">
                    <NovoChamadoForm
                        onChamadoCriado={() => {
                            carregarChamados()
                            setMostrarFormulario(false)
                        }}
                    />
                </div>
            )}

            {chamados.length === 0 ? (
                <p className="text-slate-300">Nenhum chamado encontrado.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {chamados.map((chamado) => (
                        <Card key={chamado.id}>
                            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-400">
                  #{chamado.id}
                </span>

                                <Badge variant={chamado.status}>
                                    {chamado.status}
                                </Badge>
                            </div>

                            <h3 className="text-lg font-bold text-white">
                                {chamado.titulo}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                {chamado.descricao}
                            </p>

                            <div className="mt-5 grid gap-2 text-sm text-slate-300">
                                <p>
                  <span className="font-semibold text-slate-100">
                    Prioridade:
                  </span>{' '}
                                    {chamado.prioridade}
                                </p>

                                <p>
                  <span className="font-semibold text-slate-100">
                    Categoria:
                  </span>{' '}
                                    {chamado.categoria?.nome ?? 'Sem categoria'}
                                </p>

                                <p>
                  <span className="font-semibold text-slate-100">
                    Solicitante:
                  </span>{' '}
                                    {chamado.usuario?.name ?? 'Não informado'}
                                </p>

                                <p>
                  <span className="font-semibold text-slate-100">
                    Técnico:
                  </span>{' '}
                                    {chamado.tecnico?.name ?? 'Sem técnico'}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}

export default ChamadosPage