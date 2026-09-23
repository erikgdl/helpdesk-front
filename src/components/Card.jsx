function Card({ children }) {
    return (
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
            {children}
        </article>
    )
}

export default Card