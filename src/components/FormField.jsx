export function Field({ label, hint, children }) {
    return (
        <label className="grid gap-1.5 text-sm font-semibold text-slate-200">
            {label}
            {children}
            {hint && <span className="text-xs font-normal text-slate-500">{hint}</span>}
        </label>
    )
}

const baseClass = 'w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10'

export function Input({ className = '', ...props }) {
    return <input className={`${baseClass} ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }) {
    return <select className={`${baseClass} ${className}`} {...props}>{children}</select>
}

export function Textarea({ className = '', ...props }) {
    return <textarea className={`${baseClass} min-h-28 resize-y ${className}`} {...props} />
}
