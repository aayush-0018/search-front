import { useState } from 'react'
import '../styles/SearchPage.css'
import SearchBar from '../components/SearchBar'
import PlayerCard from '../components/PlayerCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

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

export default function SearchPage() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [lastQuery, setLastQuery] = useState('')

    const handleSearch = async (query, locations) => {
        if (!query.trim()) {
            setError('Please enter a search query')
            return
        }

        setLoading(true)
        setError(null)
        setCurrentPage(0)
        setLastQuery(query)

        try {
            const payload = {
                query: query,
                userLocations: locations,
                page: 0,
                hitsPerPage: 20
            }

            console.log('📤 Sending request to API:', payload)

            const response = await fetch(`${API_BASE_URL}/api/search/global`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`)
            }

            const data = await response.json()
            console.log('📥 Received response from API:', data)

            // Extract player results (API returns 'player' not 'playerResults')
            const players = data.player || data.playerResults || []
            setResults(players)
            setPagination(data.pagination || null)

            if (players.length === 0) {
                setError('No players found matching your search. Try a different query.')
            }
        } catch (err) {
            console.error('❌ Search error:', err)
            setError(`Search failed: ${err.message}`)
            setResults([])
        } finally {
            setLoading(false)
        }
    }

    const handleNextPage = async () => {
        if (!pagination || currentPage >= pagination.totalPages - 1) return

        setLoading(true)
        setError(null)
        const nextPage = currentPage + 1

        try {
            const payload = {
                query: lastQuery,
                page: nextPage,
                hitsPerPage: 20
            }

            const response = await fetch(`${API_BASE_URL}/api/search/global`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`)
            }

            const data = await response.json()
            setResults(data.player || data.playerResults || [])
            setPagination(data.pagination || null)
            setCurrentPage(nextPage)
        } catch (err) {
            console.error('❌ Pagination error:', err)
            setError(`Failed to load next page: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handlePreviousPage = async () => {
        if (currentPage === 0) return

        setLoading(true)
        setError(null)
        const prevPage = currentPage - 1

        try {
            const payload = {
                query: lastQuery,
                page: prevPage,
                hitsPerPage: 20
            }

            const response = await fetch(`${API_BASE_URL}/api/search/global`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`)
            }

            const data = await response.json()
            setResults(data.player || data.playerResults || [])
            setPagination(data.pagination || null)
            setCurrentPage(prevPage)
        } catch (err) {
            console.error('❌ Pagination error:', err)
            setError(`Failed to load previous page: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="search-page">
            {/* Header */}
            <header className="search-header">
                <div className="header-content">
                    <h1>🏏 StapuBox Player Search</h1>
                    <p>Find players by sport, skill level, and location</p>
                </div>
            </header>

            {/* Search Bar */}
            <div className="search-container">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Error Message */}
            {error && <ErrorMessage message={error} />}

            {/* Loading Spinner */}
            {loading && <LoadingSpinner />}

            {/* Results Section */}
            {!loading && results.length > 0 && (
                <div className="results-section">
                    <div className="results-header">
                        <h2>
                            Found {pagination?.totalHits || 0} Players
                            {lastQuery && ` for "${lastQuery}"`}
                        </h2>
                        {pagination && (
                            <p className="pagination-info">
                                Page {pagination.page + 1} of {pagination.totalPages}
                            </p>
                        )}
                    </div>

                    {/* Player Cards Grid */}
                    <div className="players-grid">
                        {results.map((player, index) => (
                            <PlayerCard key={player.hpid || player.entityId || index} player={player} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="pagination-controls">
                            <button
                                className="btn btn-secondary"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                            >
                                ← Previous
                            </button>
                            <span className="page-indicator">
                                Page {currentPage + 1} of {pagination.totalPages}
                            </span>
                            <button
                                className="btn btn-secondary"
                                onClick={handleNextPage}
                                disabled={currentPage >= pagination.totalPages - 1}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State */}
            {!loading && results.length === 0 && !error && lastQuery && (
                <div className="empty-state">
                    <p>🔍 No results found. Try a different search query.</p>
                </div>
            )}

            {/* Initial State */}
            {!loading && results.length === 0 && !error && !lastQuery && (
                <div className="empty-state">
                    <p>🎯 Start by searching for players, sports, or locations above</p>
                </div>
            )}
        </div>
    )
}
