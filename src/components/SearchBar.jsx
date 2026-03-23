import { useState, useRef } from 'react'
import '../styles/SearchBar.css'
import Autocomplete from './Autocomplete'

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('')
    const [showLocationForm, setShowLocationForm] = useState(false)
    const autocompleteRef = useRef(null)
    const [locations, setLocations] = useState({
        current: null,
        home: null,
        work: null,
        playground: null
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            onSearch(query, locations)
        }
    }

    /**
     * Handle autocomplete suggestion selection
     * When user selects a suggestion, populate the query and trigger search
     */
    const handleSuggestionSelect = (suggestion) => {
        // Use the suggestion name/title for search
        const searchQuery = suggestion.name || suggestion.title || suggestion.displayName || ''
        setQuery(searchQuery)

        // Trigger search immediately with the selected suggestion
        onSearch(searchQuery, locations)
    }

    const handleLocationChange = (locationType, field, value) => {
        setLocations(prev => ({
            ...prev,
            [locationType]: {
                ...prev[locationType],
                [field]: parseFloat(value) || 0
            }
        }))
    }

    const clearLocations = () => {
        setLocations({
            current: null,
            home: null,
            work: null,
            playground: null
        })
    }

    const setCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    setLocations(prev => ({
                        ...prev,
                        current: { lat: latitude, lng: longitude }
                    }))
                    alert(`Current location set: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
                },
                (error) => {
                    alert(`Error getting location: ${error.message}`)
                }
            )
        } else {
            alert('Geolocation is not supported by your browser')
        }
    }

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                {/* Main Search Input with Autocomplete - Wrapped separately */}
                <div className="search-input-wrapper">
                    <div className="autocomplete-search-container">
                        <Autocomplete
                            ref={autocompleteRef}
                            placeholder="Search for players (e.g., 'badminton players', 'cricket experts')"
                            onSuggestionSelect={handleSuggestionSelect}
                            onQueryChange={setQuery}
                            maxSuggestions={10}
                            location={locations.current}
                        />
                    </div>
                    {/* Close button for autocomplete dropdown */}
                    <button
                        type="button"
                        className="btn btn-close autocomplete-close-btn"
                        onClick={() => {
                            if (autocompleteRef.current) {
                                autocompleteRef.current.clearSuggestions()
                            }
                        }}
                        title="Close suggestions"
                        aria-label="Close autocomplete dropdown"
                    >
                        ✕
                    </button>
                    <button type="submit" className="btn btn-primary search-btn">
                        🔍 Search
                    </button>
                </div>

                {/* Location Toggle */}
                <button
                    type="button"
                    className="btn btn-secondary location-toggle"
                    onClick={() => setShowLocationForm(!showLocationForm)}
                >
                    📍 {showLocationForm ? 'Hide Locations' : 'Add Locations'}
                </button>

                {/* Location Form */}
                {showLocationForm && (
                    <div className="location-form">
                        <div className="location-group">
                            <h4>Current Location</h4>
                            <div className="location-inputs">
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    step="0.0001"
                                    value={locations.current?.lat || ''}
                                    onChange={(e) => handleLocationChange('current', 'lat', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    step="0.0001"
                                    value={locations.current?.lng || ''}
                                    onChange={(e) => handleLocationChange('current', 'lng', e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="btn btn-secondary get-location-btn"
                                    onClick={setCurrentLocation}
                                >
                                    📍 Use My Location
                                </button>
                            </div>
                        </div>

                        <div className="location-group">
                            <h4>Home Location</h4>
                            <div className="location-inputs">
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    step="0.0001"
                                    value={locations.home?.lat || ''}
                                    onChange={(e) => handleLocationChange('home', 'lat', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    step="0.0001"
                                    value={locations.home?.lng || ''}
                                    onChange={(e) => handleLocationChange('home', 'lng', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="location-group">
                            <h4>Work Location</h4>
                            <div className="location-inputs">
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    step="0.0001"
                                    value={locations.work?.lat || ''}
                                    onChange={(e) => handleLocationChange('work', 'lat', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    step="0.0001"
                                    value={locations.work?.lng || ''}
                                    onChange={(e) => handleLocationChange('work', 'lng', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="location-group">
                            <h4>Playground Location</h4>
                            <div className="location-inputs">
                                <input
                                    type="number"
                                    placeholder="Latitude"
                                    step="0.0001"
                                    value={locations.playground?.lat || ''}
                                    onChange={(e) => handleLocationChange('playground', 'lat', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Longitude"
                                    step="0.0001"
                                    value={locations.playground?.lng || ''}
                                    onChange={(e) => handleLocationChange('playground', 'lng', e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary clear-locations-btn"
                            onClick={clearLocations}
                        >
                            Clear All Locations
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}
