import { useState, useCallback, useRef } from 'react'

// Detect environment and set API base URL accordingly
const getApiBaseUrl = () => {
    // Production: practise.stapubox.com
    if (window.location.hostname.includes('practise.stapubox.com') ||
        window.location.hostname.includes('stapubox.com')) {
        return 'https://practise.stapubox.com'
    }
    // Development: localhost
    return 'http://localhost:2040'
}

const API_BASE_URL = getApiBaseUrl()
const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

/**
 * Custom hook for Algolia autocomplete functionality
 * 
 * Features:
 * - Debounced search requests
 * - Minimum query length validation
 * - Caching of recent queries
 * - Error handling and loading states
 * - Keyboard navigation support
 * 
 * @param {number} maxSuggestions - Maximum number of suggestions to return
 * @returns {Object} Autocomplete state and handlers
 */
export function useAutocomplete(maxSuggestions = 10) {
    const [suggestions, setSuggestions] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)

    // Debounce timer reference
    const debounceTimer = useRef(null)

    // Cache for recent queries to reduce API calls
    const suggestionCache = useRef(new Map())

    /**
     * Fetch autocomplete suggestions from backend
     * Implements debouncing and caching
     * Supports optional location-based filtering (lat, lng, radius)
     */
    const fetchSuggestions = useCallback(async (query, location = null) => {
        // Clear previous error
        setError(null)

        // Validate query length
        if (query.length < MIN_QUERY_LENGTH) {
            setSuggestions([])
            setIsOpen(false)
            return
        }

        // Create cache key that includes location if provided
        const cacheKey = location
            ? `${query}|${location.lat},${location.lng},${location.radius || 50}`
            : query

        // Check cache first
        if (suggestionCache.current.has(cacheKey)) {
            setSuggestions(suggestionCache.current.get(cacheKey))
            setIsOpen(true)
            return
        }

        setLoading(true)

        try {
            // Build URL with query and optional location parameters
            let url = `${API_BASE_URL}/api/search/autocomplete?query=${encodeURIComponent(query)}&limit=${maxSuggestions}`

            // Add location parameters if provided
            if (location && location.lat != null && location.lng != null) {
                url += `&lat=${location.lat}&lng=${location.lng}`
                if (location.radius != null) {
                    url += `&radius=${location.radius}`
                }
            }

            // Call the autocomplete endpoint with location support
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Autocomplete failed: ${response.status}`)
            }

            const data = await response.json()
            const results = data.suggestions || data.results || []

            // Cache the results with location-aware key
            suggestionCache.current.set(cacheKey, results)

            setSuggestions(results)
            setIsOpen(results.length > 0)
            setSelectedIndex(-1)
        } catch (err) {
            console.error('❌ Autocomplete error:', err)
            setError(`Autocomplete error: ${err.message}`)
            setSuggestions([])
            setIsOpen(false)
        } finally {
            setLoading(false)
        }
    }, [maxSuggestions])

    /**
     * Handle input change with debouncing
     * Prevents excessive API calls while user is typing
     * Supports optional location parameter for location-based filtering
     */
    const handleInputChange = useCallback((query, location = null) => {
        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        // Set new debounced timer
        debounceTimer.current = setTimeout(() => {
            fetchSuggestions(query, location)
        }, DEBOUNCE_MS)
    }, [fetchSuggestions])

    /**
     * Handle keyboard navigation (arrow keys, enter, escape)
     */
    const handleKeyDown = useCallback((event, onSelectSuggestion) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                )
                break

            case 'ArrowUp':
                event.preventDefault()
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
                break

            case 'Enter':
                event.preventDefault()
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    const selectedSuggestion = suggestions[selectedIndex]
                    onSelectSuggestion(selectedSuggestion)
                    setIsOpen(false)
                }
                break

            case 'Escape':
                event.preventDefault()
                setIsOpen(false)
                setSuggestions([])
                setSelectedIndex(-1)
                break

            default:
                break
        }
    }, [suggestions, selectedIndex])

    /**
     * Clear all suggestions and close dropdown
     */
    const clearSuggestions = useCallback(() => {
        setSuggestions([])
        setIsOpen(false)
        setSelectedIndex(-1)
        setError(null)
    }, [])

    /**
     * Manually select a suggestion
     */
    const selectSuggestion = useCallback((suggestion) => {
        setIsOpen(false)
        setSelectedIndex(-1)
        return suggestion
    }, [])

    return {
        // State
        suggestions,
        loading,
        error,
        isOpen,
        selectedIndex,

        // Methods
        handleInputChange,
        handleKeyDown,
        clearSuggestions,
        selectSuggestion,
        fetchSuggestions,
        setSuggestions,
        setIsOpen
    }
}

/**
 * Export debounce utility for external use if needed
 */
export function debounce(func, ms) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, ms)
    }
}
