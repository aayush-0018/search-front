import '../styles/ErrorMessage.css'

export default function ErrorMessage({ message }) {
    return (
        <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{message}</span>
        </div>
    )
}
