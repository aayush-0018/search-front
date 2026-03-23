import '../styles/PlayerDetailsModal.css'
import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function PlayerDetailsModal({ player, isOpen, onClose }) {
    const [expandedSection, setExpandedSection] = useState(null)
    const [copiedToClipboard, setCopiedToClipboard] = useState(false)

    if (!isOpen || !player) {
        return null
    }

    // Get player name for modal title
    const playerName = `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Player Details'

    // Helper function to format values for display
    const formatValue = (value) => {
        if (value === null || value === undefined) return '—'
        if (typeof value === 'boolean') return value ? '✓ Yes' : '✗ No'
        if (typeof value === 'object') return JSON.stringify(value, null, 2)
        if (typeof value === 'string') return value
        return String(value)
    }

    // Helper function to render complex objects as nested tables
    const renderComplexValue = (value) => {
        if (value === null || value === undefined) return '—'
        if (typeof value === 'object' && !Array.isArray(value)) {
            return (
                <table className="nested-table">
                    <tbody>
                        {Object.entries(value).map(([k, v]) => (
                            <tr key={k}>
                                <td className="nested-key">{k}:</td>
                                <td className="nested-value">{formatValue(v)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
        if (Array.isArray(value)) {
            if (value.length === 0) return '[]'
            if (typeof value[0] === 'object') {
                return (
                    <div className="array-items">
                        {value.map((item, idx) => (
                            <div key={idx} className="array-item">
                                <strong>Item {idx + 1}:</strong>
                                {typeof item === 'object' ? (
                                    <table className="nested-table">
                                        <tbody>
                                            {Object.entries(item).map(([k, v]) => (
                                                <tr key={k}>
                                                    <td className="nested-key">{k}:</td>
                                                    <td className="nested-value">{formatValue(v)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <span>{formatValue(item)}</span>
                                )}
                            </div>
                        ))}
                    </div>
                )
            }
            return value.join(', ')
        }
        return formatValue(value)
    }

    // Copy JSON to clipboard
    const handleCopyToClipboard = () => {
        const filteredPlayer = { ...player }
        delete filteredPlayer.algoliaMetadata
        const jsonString = JSON.stringify(filteredPlayer, null, 2)
        navigator.clipboard.writeText(jsonString).then(() => {
            setCopiedToClipboard(true)
            setTimeout(() => setCopiedToClipboard(false), 2000)
        })
    }

    return createPortal(
        <>
            {/* Modal Backdrop */}
            <div className="modal-backdrop" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="player-details-modal">
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-title-section">
                        <h2 className="modal-title">👤 Player Details</h2>
                        <p className="modal-subtitle">{playerName}</p>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {/* Toolbar */}
                    <div className="modal-toolbar">
                        <button
                            className="toolbar-btn copy-btn"
                            onClick={handleCopyToClipboard}
                            title="Copy player data (excluding algolia metadata) to clipboard"
                        >
                            {copiedToClipboard ? '✓ Copied!' : '📋 Copy Data'}
                        </button>
                        <div className="toolbar-info">
                            <span className="field-count">
                                {Object.keys(player).filter(k => k !== 'algoliaMetadata').length} fields
                            </span>
                        </div>
                    </div>

                    {/* Details Table - Organized by sections */}
                    <div className="details-table-container">

                        {/* BASIC INFO SECTION */}
                        <section className="details-section">
                            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'basic' ? null : 'basic')}>
                                <h3 className="section-title">👤 Basic Information</h3>
                                <span className="section-toggle">{expandedSection === 'basic' ? '▼' : '▶'}</span>
                            </div>
                            {expandedSection === 'basic' && (
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td className="field-name">First Name</td>
                                            <td className="field-value">{formatValue(player.first_name)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Last Name</td>
                                            <td className="field-value">{formatValue(player.last_name)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Gender</td>
                                            <td className="field-value">{player.gender === 'male' ? '👨 Male' : player.gender === 'female' ? '👩 Female' : formatValue(player.gender)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Date of Birth</td>
                                            <td className="field-value">{player.dob ? new Date(player.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Profile Type</td>
                                            <td className="field-value">{formatValue(player.profile_type)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Bio</td>
                                            <td className="field-value bio-text">{formatValue(player.bio)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </section>

                        {/* CONTACT INFO SECTION */}
                        <section className="details-section">
                            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'contact' ? null : 'contact')}>
                                <h3 className="section-title">📞 Contact Information</h3>
                                <span className="section-toggle">{expandedSection === 'contact' ? '▼' : '▶'}</span>
                            </div>
                            {expandedSection === 'contact' && (
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td className="field-name">Mobile</td>
                                            <td className="field-value">{formatValue(player.mobile)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Email</td>
                                            <td className="field-value">{formatValue(player.email)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Username</td>
                                            <td className="field-value">{formatValue(player.username)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </section>

                        {/* IDENTIFICATION SECTION */}
                        <section className="details-section">
                            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'id' ? null : 'id')}>
                                <h3 className="section-title">🆔 Identification</h3>
                                <span className="section-toggle">{expandedSection === 'id' ? '▼' : '▶'}</span>
                            </div>
                            {expandedSection === 'id' && (
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td className="field-name">Entity ID</td>
                                            <td className="field-value mono">{formatValue(player.entityId)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Entity Type</td>
                                            <td className="field-value">{formatValue(player.entityType)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">HPID</td>
                                            <td className="field-value mono">{player.hpid ? player.hpid.substring(0, 32) + '...' : '—'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </section>

                        {/* SPORTS & SKILLS SECTION */}
                        {player.sportfolio && player.sportfolio.length > 0 && (
                            <section className="details-section">
                                <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'sports' ? null : 'sports')}>
                                    <h3 className="section-title">🏆 Sports & Skills</h3>
                                    <span className="section-toggle">{expandedSection === 'sports' ? '▼' : '▶'}</span>
                                </div>
                                {expandedSection === 'sports' && (
                                    <div className="sports-section-content">
                                        {player.sportfolio.map((sport, idx) => (
                                            <div key={idx} className="sport-item-details">
                                                <h4>Sport {idx + 1}</h4>
                                                <table className="details-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="field-name">ID</td>
                                                            <td className="field-value">{sport.sfId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Skill Level</td>
                                                            <td className="field-value"><span className="badge">{sport.skillLevel}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Frequency</td>
                                                            <td className="field-value"><span className="badge">{sport.frequency}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Is Primary</td>
                                                            <td className="field-value">{sport.isPrimary ? '✓ Yes' : '✗ No'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Playing Experience</td>
                                                            <td className="field-value">{sport.playingExperience} years</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Coaching Experience</td>
                                                            <td className="field-value">{sport.coachingExperience} years</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Active</td>
                                                            <td className="field-value">{sport.isActive ? '✓ Yes' : '✗ No'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* LOCATION SECTION */}
                        {player.location && (
                            <section className="details-section">
                                <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'location' ? null : 'location')}>
                                    <h3 className="section-title">📍 Location Information</h3>
                                    <span className="section-toggle">{expandedSection === 'location' ? '▼' : '▶'}</span>
                                </div>
                                {expandedSection === 'location' && (
                                    <div className="location-section-content">
                                        {player.location.current && (
                                            <div className="location-subsection">
                                                <h4>Current Location</h4>
                                                <table className="details-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="field-name">City</td>
                                                            <td className="field-value">{player.location.current.city}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">State</td>
                                                            <td className="field-value">{player.location.current.state}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Country</td>
                                                            <td className="field-value">{player.location.current.country}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Postal Code</td>
                                                            <td className="field-value">{player.location.current.postalCode}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Address</td>
                                                            <td className="field-value">{player.location.current.address}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Coordinates</td>
                                                            <td className="field-value">{player.location.current.lat}, {player.location.current.lng}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                        {player.location.work && (
                                            <div className="location-subsection">
                                                <h4>Work Location</h4>
                                                <table className="details-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="field-name">City</td>
                                                            <td className="field-value">{player.location.work.city}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">State</td>
                                                            <td className="field-value">{player.location.work.state}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Country</td>
                                                            <td className="field-value">{player.location.work.country}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Address</td>
                                                            <td className="field-value">{player.location.work.address}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Verified</td>
                                                            <td className="field-value">{player.isWorkLocVerified ? '✓ Yes' : '✗ No'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* MEDIA SECTION */}
                        {player.media && player.media.length > 0 && (
                            <section className="details-section">
                                <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'media' ? null : 'media')}>
                                    <h3 className="section-title">📸 Media ({player.media.length})</h3>
                                    <span className="section-toggle">{expandedSection === 'media' ? '▼' : '▶'}</span>
                                </div>
                                {expandedSection === 'media' && (
                                    <div className="media-section-content">
                                        {player.media.map((media, idx) => (
                                            <div key={idx} className="media-item-details">
                                                <h4>Media {idx + 1}</h4>
                                                <table className="details-table">
                                                    <tbody>
                                                        <tr>
                                                            <td className="field-name">Type</td>
                                                            <td className="field-value"><span className="badge">{media.mediaType}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Media ID</td>
                                                            <td className="field-value">{media.mediaId}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">URL</td>
                                                            <td className="field-value url-text">{media.mediaUrl}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Verified</td>
                                                            <td className="field-value">{media.isVerified ? '✓ Yes' : '✗ No'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="field-name">Active</td>
                                                            <td className="field-value">{media.isActive ? '✓ Yes' : '✗ No'}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* PRIVACY SECTION */}
                        {player.privacy && (
                            <section className="details-section">
                                <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'privacy' ? null : 'privacy')}>
                                    <h3 className="section-title">🔒 Privacy Settings</h3>
                                    <span className="section-toggle">{expandedSection === 'privacy' ? '▼' : '▶'}</span>
                                </div>
                                {expandedSection === 'privacy' && (
                                    <table className="details-table">
                                        <tbody>
                                            {Object.entries(player.privacy).map(([key, value]) => (
                                                <tr key={key}>
                                                    <td className="field-name">{key}</td>
                                                    <td className="field-value">{value ? '🔒 Private' : '🔓 Public'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </section>
                        )}

                        {/* LOCKER ROOM SECTION */}
                        {player['locker-room'] && (
                            <section className="details-section">
                                <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'locker' ? null : 'locker')}>
                                    <h3 className="section-title">🔑 Locker Room</h3>
                                    <span className="section-toggle">{expandedSection === 'locker' ? '▼' : '▶'}</span>
                                </div>
                                {expandedSection === 'locker' && (
                                    <table className="details-table">
                                        <tbody>
                                            <tr>
                                                <td className="field-name">UID</td>
                                                <td className="field-value mono">{player['locker-room'].uid}</td>
                                            </tr>
                                            <tr>
                                                <td className="field-name">Player Token</td>
                                                <td className="field-value mono">{player['locker-room'].player_token?.substring(0, 32)}...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </section>
                        )}

                        {/* MISCELLANEOUS SECTION */}
                        <section className="details-section">
                            <div className="section-header" onClick={() => setExpandedSection(expandedSection === 'misc' ? null : 'misc')}>
                                <h3 className="section-title">🔧 Miscellaneous</h3>
                                <span className="section-toggle">{expandedSection === 'misc' ? '▼' : '▶'}</span>
                            </div>
                            {expandedSection === 'misc' && (
                                <table className="details-table">
                                    <tbody>
                                        <tr>
                                            <td className="field-name">Distance (km)</td>
                                            <td className="field-value">{formatValue(player.distanceKm)}</td>
                                        </tr>
                                        <tr>
                                            <td className="field-name">Languages</td>
                                            <td className="field-value">{Array.isArray(player.languages) && player.languages.length > 0 ? player.languages.join(', ') : '—'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </section>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </>,
        document.body
    )
}
