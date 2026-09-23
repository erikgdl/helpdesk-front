function Card({ children, className = '', as: Element = 'article' }) {
    return (
        <Element className={`rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/20 ${className}`}>
            {children}
        </Element>
    )
}

export default Card
