function Button({ children, type = 'button', onClick }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
        >
            {children}
        </button>
    )
}

export default Button