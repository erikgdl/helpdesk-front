function Badge({ children, variant = 'default' }) {
    const variants = {
        aberto: 'border-sky-500/25 bg-sky-500/10 text-sky-300',
        em_atendimento: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
        finalizado: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
        cancelado: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
        aguardando_usuario: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
        baixa: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
        media: 'border-blue-500/25 bg-blue-500/10 text-blue-300',
        alta: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
        urgente: 'border-rose-500/25 bg-rose-500/10 text-rose-300',
        default: 'border-slate-500/30 bg-slate-500/20 text-slate-300',
    }

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${
                variants[variant] ?? variants.default
            }`}
        >
            {children}
        </span>
    )
}

export default Badge
