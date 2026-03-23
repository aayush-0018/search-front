import { useAutocomplete } from '../hooks/useAutocomplete'
import '../styles/Autocomplete.css'
import { forwardRef, useImperativeHandle } from 'react'

/**
 * Autocomplete component with dropdown suggestions
 * 
 * Features:
 * - Real-time suggestions as user types
 * - Keyboard navigation (arrow keys, enter, escape)
 * - Debounced API calls to prevent excessive requests
 * - Cached suggestions for performance
 * - Location-based filtering (optional)
 * - Loading and error states
 * - Mobile-friendly design
 * 
 * @param {string} placeholder - Input placeholder text
 * @param {Function} onSuggestionSelect - Callback when user selects a suggestion
 * @param {number} maxSuggestions - Maximum number of suggestions to show
 * @param {Object} location - Optional location object with lat, lng, radius for location-based filtering
 * @returns {JSX.Element} Autocomplete input with suggestions dropdown
 */
const Autocomplete = forwardRef(function Autocomplete({
    placeholder = 'Search for players...',
    onSuggestionSelect,
    maxSuggestions = 10,
    onQueryChange,
    location = null
}, ref) {
    const {
        suggestions,
        loading,
        error,
        isOpen,
        selectedIndex,
        handleInputChange,
        handleKeyDown,
        clearSuggestions,
        selectSuggestion
    } = useAutocomplete(maxSuggestions)

    // Expose clearSuggestions to parent component via ref
    useImperativeHandle(ref, () => ({
        clearSuggestions
    }), [clearSuggestions])

    const handleSelect = (suggestion) => {
        const selected = selectSuggestion(suggestion)
        if (onSuggestionSelect) {
            onSuggestionSelect(selected)
        }
        clearSuggestions()
    }

    const handleInputChangeLocal = (e) => {
        const value = e.target.value

        // Notify parent of query change if callback provided
        if (onQueryChange) {
            onQueryChange(value)
        }

        if (value.trim() === '') {
            clearSuggestions()
        } else {
            // Pass location to handleInputChange if available
            handleInputChange(value, location)
        }
    }

    const handleKeyDownLocal = (e) => {
        if (isOpen) {
            handleKeyDown(e, handleSelect)
        } else if (e.key === 'ArrowDown') {
            // Open suggestions on arrow down if closed
            e.preventDefault()
        }
    }

    return (
        <div className="autocomplete-wrapper">
            {/* Input Field */}
            <div className="autocomplete-input-container">
                <input
                    type="text"
                    className="autocomplete-input"
                    placeholder={placeholder}
                    onChange={handleInputChangeLocal}
                    onKeyDown={handleKeyDownLocal}
                    autoComplete="off"
                    aria-label="Autocomplete search input"
                    aria-expanded={isOpen}
                    aria-controls="autocomplete-dropdown"
                />

                {/* Loading Indicator */}
                {loading && (
                    <div className="autocomplete-loading">
                        <span className="spinner"></span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="autocomplete-error-icon" title={error}>
                        ⚠️
                    </div>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="autocomplete-dropdown" id="autocomplete-dropdown">
                    {suggestions.length > 0 ? (
                        <ul className="autocomplete-list" role="listbox">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={`${suggestion.id || suggestion.objectId}-${index}`}
                                    className={`autocomplete-item ${index === selectedIndex ? 'selected' : ''
                                        }`}
                                    onClick={() => handleSelect(suggestion)}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                >
                                    <div className="suggestion-content">
                                        {/* Entity Type Badge */}
                                        <span className="suggestion-type">
                                            {suggestion.entityType === 'PLAYER' ? '👤' :
                                                suggestion.entityType === 'SQUAD' ? '👥' :
                                                    suggestion.entityType === 'EVENT' ? '🎯' : '📍'}
                                        </span>

                                        {/* Primary Name */}
                                        <span className="suggestion-name">
                                            {suggestion.name || suggestion.title || suggestion.displayName}
                                        </span>

                                        {/* Secondary Info */}
                                        {suggestion.sports && suggestion.sports.length > 0 && (
                                            <span className="suggestion-secondary">
                                                {suggestion.sports.join(', ')}
                                            </span>
                                        )}

                                        {suggestion.location && (
                                            <span className="suggestion-secondary">
                                                📍 {suggestion.location}
                                            </span>
                                        )}
                                    </div>

                                    {/* Relevance Score */}
                                    {/* {suggestion.score && (
                                        <span className="suggestion-score" title={`Relevance: ${suggestion.score}`}>
                                            {(suggestion.score * 100).toFixed(0)}%
                                        </span>
                                    )} */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="autocomplete-empty">
                            No suggestions found
                        </div>
                    )}
                </div>
            )}

            {/* Error Banner */}
            {error && (
                <div className="autocomplete-error-message" role="alert">
                    {error}
                </div>
            )}
        </div>
    )
})

export default Autocomplete
