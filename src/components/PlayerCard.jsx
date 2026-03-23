import '../styles/PlayerCard.css'
import { useState } from 'react'
import PlayerDetailsModal from './PlayerDetailsModal'

export default function PlayerCard({ player }) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Extract player data based on playerData.json structure
    const {
        entityId,
        hpid,
        first_name,
        last_name,
        bio,
        gender,
        dob,
        mobile,
        email,
        profilePicMediaId,
        media = [],
        location = {},
        sportfolio = [],
        'locker-room': lockerRoom,
        algoliaMetadata = {} // Extract Algolia metadata for relevance display
    } = player

    // Generate unique key - use hpid if no entityId
    const uniqueId = entityId || hpid || Math.random().toString(36).substr(2, 9)

    // Get profile picture
    const profilePic = media && media.length > 0 ? media[0].mediaUrl : null

    // Get current location
    const currentLocation = location?.current
    const currentCity = currentLocation?.city || 'Unknown'
    const currentState = currentLocation?.state || ''

    // Get sports info
    const primarySport = sportfolio && sportfolio.length > 0 ? sportfolio[0] : null
    const skillLevel = primarySport?.skillLevel || 'Not specified'
    const frequency = primarySport?.frequency || 'Not specified'

    // Format date of birth
    const formatDOB = (dob) => {
        if (!dob) return 'Not specified'
        const date = new Date(dob)
        const today = new Date()
        const age = today.getFullYear() - date.getFullYear()
        return `${age} years (${new Date(dob).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })})`
    }

    return (
        <div className="player-card">
            {/* Card Header with Image */}
            <div className="player-card-header">
                {profilePic ? (
                    <img
                        src={profilePic}
                        alt={first_name}
                        className="player-avatar"
                        onError={(e) => {
                            e.target.src =
                                'https://via.placeholder.com/200?text=No+Image'
                        }}
                    />
                ) : (
                    <div className="player-avatar-placeholder">
                        👤
                    </div>
                )}
            </div>

            {/* Card Body */}
            <div className="player-card-body">
                {/* Name */}
                <h3 className="player-name">
                    {first_name}
                    {last_name && ` ${last_name}`}
                </h3>

                {/* Gender & Age */}
                <div className="player-meta">
                    {gender && <span className="badge badge-gender">{gender === 'male' ? '👨' : '👩'} {gender}</span>}
                    {dob && <span className="badge badge-age">{formatDOB(dob)}</span>}
                </div>

                {/* Bio */}
                {bio && (
                    <p className="player-bio">
                        {bio.length > 100 ? `${bio.substring(0, 100)}...` : bio}
                    </p>
                )}

                {/* Location */}
                {currentLocation && (
                    <div className="player-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">
                            {currentCity}{currentState ? `, ${currentState}` : ''}
                        </span>
                    </div>
                )}

                {/* Sports Info */}
                {primarySport && (
                    <div className="player-sports">
                        <div className="sport-item">
                            <span className="label">Skill Level:</span>
                            <span className="badge badge-skill">{skillLevel}</span>
                        </div>
                        <div className="sport-item">
                            <span className="label">Frequency:</span>
                            <span className="badge badge-frequency">{frequency}</span>
                        </div>
                    </div>
                )}

                {/* Contact Info */}
                <div className="player-contact">
                    {mobile && (
                        <div className="contact-item">
                            <span className="label">📱</span>
                            <span className="value">{mobile}</span>
                        </div>
                    )}
                    {email && (
                        <div className="contact-item">
                            <span className="label">✉️</span>
                            <span className="value">{email}</span>
                        </div>
                    )}
                </div>

                {/* Entity ID */}
                <div className="player-id">
                    <small>{entityId ? `ID: ${entityId}` : `HPID: ${hpid?.substring(0, 16)}...`}</small>
                </div>

                {/* Algolia Relevance Metadata */}
                {algoliaMetadata && Object.keys(algoliaMetadata).length > 0 && (
                    <div className="algolia-relevance">
                        <details className="relevance-details">
                            <summary className="relevance-summary">
                                🔍 Search Relevance
                                {algoliaMetadata.score && <span className="relevance-score">Score: {(algoliaMetadata.score * 100).toFixed(1)}%</span>}
                            </summary>
                            <div className="relevance-content">
                                {/* Matching Fields */}
                                {algoliaMetadata.search_tokens_array && (
                                    <div className="relevance-field">
                                        <span className="field-label">📝 Matching Tokens:</span>
                                        <div className="field-values">
                                            {algoliaMetadata.search_tokens_array.map((token, idx) => (
                                                <span key={idx} className="token-badge">{token}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sports Match */}
                                {algoliaMetadata.sports_names && algoliaMetadata.sports_names.length > 0 && (
                                    <div className="relevance-field">
                                        <span className="field-label">🏆 Sports Match:</span>
                                        <div className="field-values">
                                            {algoliaMetadata.sports_names.map((sport, idx) => (
                                                <span key={idx} className="match-badge match-sport">{sport}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Skill Level Match */}
                                {algoliaMetadata.skill_levels && algoliaMetadata.skill_levels.length > 0 && (
                                    <div className="relevance-field">
                                        <span className="field-label">⚡ Skill Level Match:</span>
                                        <div className="field-values">
                                            {algoliaMetadata.skill_levels.map((level, idx) => (
                                                <span key={idx} className="match-badge match-skill">{level}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Location Match */}
                                {algoliaMetadata.location_names && algoliaMetadata.location_names.length > 0 && (
                                    <div className="relevance-field">
                                        <span className="field-label">📍 Location Match:</span>
                                        <div className="field-values">
                                            {algoliaMetadata.location_names.map((loc, idx) => (
                                                <span key={idx} className="match-badge match-location">{loc}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Popularity Score */}
                                {algoliaMetadata.popularity_score !== undefined && (
                                    <div className="relevance-field">
                                        <span className="field-label">⭐ Popularity:</span>
                                        <span className="field-value">{algoliaMetadata.popularity_score}</span>
                                    </div>
                                )}

                                {/* Keywords */}
                                {algoliaMetadata.search_keywords && (
                                    <div className="relevance-field">
                                        <span className="field-label">🔑 Keywords:</span>
                                        <span className="field-value keywords-text">{algoliaMetadata.search_keywords}</span>
                                    </div>
                                )}
                            </div>
                        </details>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="player-card-footer">
                <button
                    className="btn btn-small btn-primary"
                    onClick={() => setIsModalOpen(true)}
                >
                    View Details
                </button>
            </div>

            {/* Player Details Modal - Rendered via Portal */}
            {isModalOpen && (
                <PlayerDetailsModal
                    player={player}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}
