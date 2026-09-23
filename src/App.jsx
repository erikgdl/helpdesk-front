import ChamadosPage from './pages/ChamadosPage'

function App() {
    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
            <header className="mx-auto mb-10 max-w-6xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
                <h1 className="text-4xl font-bold text-white">Helpdesk Front</h1>

                <p className="mt-2 text-slate-400">
                    Front-end do sistema de chamados
                </p>
            </header>

            <ChamadosPage />
        </main>
    )
}

export default App