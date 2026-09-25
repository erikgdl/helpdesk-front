import { useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'
import { Field, Input } from '../components/FormField'
import Icon from '../components/Icon'

function LoginPage({ onLogin }) {
    const [portal, setPortal] = useState('solicitante')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [erro, setErro] = useState(null)
    const [carregando, setCarregando] = useState(false)

    async function enviar(event) {
        event.preventDefault()
        setErro(null)
        setCarregando(true)
        try { await onLogin({ email, password, portal }) }
        catch (error) { setErro(error.message) }
        finally { setCarregando(false) }
    }

    return (
        <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 p-4 text-slate-100">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(6,182,212,0.12),transparent_32%),radial-gradient(circle_at_10%_90%,rgba(59,130,246,0.09),transparent_30%)]" />
            <div className="relative w-full max-w-md">
                <div className="mb-7 flex justify-center">
                    <span className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-cyan-400 text-slate-950"><Icon name="server" size={22} /></span><span><strong className="block text-lg text-white">NEXO<span className="text-cyan-400">TI</span></strong><small className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Service desk</small></span></span>
                </div>
                <Card className="p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-white">Acessar a central</h1>
                    <p className="mt-2 text-sm text-slate-400">Escolha sua área e informe suas credenciais.</p>

                    <div className="mt-6 grid grid-cols-2 rounded-xl bg-slate-950/70 p-1">
                        {[['solicitante', 'Sou solicitante'], ['equipe', 'Equipe técnica']].map(([valor, texto]) => <button type="button" key={valor} onClick={() => { setPortal(valor); setErro(null) }} className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${portal === valor ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-500 hover:text-slate-300'}`}>{texto}</button>)}
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/30 px-4 py-3 text-xs leading-5 text-slate-400">
                        {portal === 'solicitante' ? 'Abra chamados, acompanhe suas solicitações e converse com a equipe.' : 'Acesso exclusivo para técnicos e administradores.'}
                    </div>

                    {erro && <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{erro}</p>}

                    <form onSubmit={enviar} className="mt-5 grid gap-4">
                        <Field label="E-mail"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" autoComplete="email" required autoFocus /></Field>
                        <Field label="Senha"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" autoComplete="current-password" required /></Field>
                        <Button type="submit" disabled={carregando} className="mt-2 justify-center">{carregando ? 'Entrando...' : <>Entrar <Icon name="arrow" /></>}</Button>
                    </form>
                </Card>
            </div>
        </main>
    )
}

export default LoginPage
