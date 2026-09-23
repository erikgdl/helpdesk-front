import Button from './Button'
import Icon from './Icon'

export function Loading({ text = 'Carregando...' }) {
    return (
        <div className="grid min-h-56 place-items-center rounded-2xl border border-slate-800 bg-slate-900/50">
            <div className="text-center text-sm text-slate-400">
                <span className="mx-auto mb-3 block size-7 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />
                {text}
            </div>
        </div>
    )
}

export function ErrorMessage({ message, onRetry }) {
    return (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <Icon name="alert" size={28} className="mx-auto mb-3 text-rose-400" />
            <h3 className="font-bold text-white">Algo não saiu como esperado</h3>
            <p className="mx-auto mt-1 max-w-lg text-sm text-slate-400">{message}</p>
            {onRetry && <Button variant="secondary" className="mt-4" onClick={onRetry}><Icon name="refresh" /> Tentar novamente</Button>}
        </div>
    )
}

export function EmptyState({ icon = 'tickets', title, description, action }) {
    return (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-14 text-center">
            <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-slate-800 text-cyan-400"><Icon name={icon} size={24} /></span>
            <h3 className="font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
            {action && <div className="mt-5">{action}</div>}
        </div>
    )
}
