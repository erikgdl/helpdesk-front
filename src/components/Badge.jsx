function Badge({ children, variant = 'default' }) {
    const variants = {
        aberto: 'border-blue-500/30 bg-blue-500/20 text-blue-300',
        em_atendimento: 'border-yellow-500/30 bg-yellow-500/20 text-yellow-300',
        finalizado: 'border-green-500/30 bg-green-500/20 text-green-300',
        cancelado: 'border-red-500/30 bg-red-500/20 text-red-300',
        aguardando_usuario: 'border-purple-500/30 bg-purple-500/20 text-purple-300',
        default: 'border-slate-500/30 bg-slate-500/20 text-slate-300',
    }

    return (
        <span
            className={`rounded-full border px-3 py-1 text-xs font-bold ${
                variants[variant] ?? variants.default
            }`}
        >
      {children}
    </span>
    )
}

export default Badge