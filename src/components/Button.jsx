function Button({ children, type = 'button', onClick, variant = 'primary', disabled = false, className = '' }) {
    const variants = {
        primary: 'bg-cyan-500 text-slate-950 shadow-cyan-500/20 hover:bg-cyan-400',
        secondary: 'border border-slate-700 bg-slate-800 text-slate-100 hover:border-slate-600 hover:bg-slate-700',
        success: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
        danger: 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20',
        ghost: 'text-slate-300 hover:bg-slate-800 hover:text-white',
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

export default Button
