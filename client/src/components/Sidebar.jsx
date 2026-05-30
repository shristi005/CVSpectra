import { useState } from 'react'
import { useIsMobile } from '../utils/useIsMobile'

function Sidebar({ page, setPage, darkMode, setDarkMode, user, onLogout }) {

    const navItems = [
        { id: 'upload', label: 'New Screening', icon: '✦' },
        { id: 'history', label: 'History', icon: '🕓' },
    ]
    const isMobile = useIsMobile()
    const [menuOpen, setMenuOpen] = useState(false)
    const [showLogout, setShowLogout] = useState(false)

    return (
        <>
            {/* Mobile hamburger button */}
            {isMobile && (
                <button
                    style={{
                        ...styles.hamburger,
                        left: menuOpen ? '178px' : '12px',  // ← move X to edge of sidebar
                        zIndex: 400,
                    }}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? '✕' : '☰'}
                </button>
            )}

            {/* Mobile overlay */}
            {isMobile && menuOpen && (
                <div
                    style={styles.overlay}
                    onClick={() => setMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div style={{
                ...styles.sidebar,
                transform: isMobile
                    ? menuOpen ? 'translateX(0)' : 'translateX(-100%)'
                    : 'translateX(0)',
                transition: 'transform 0.3s ease',
            }}>
                {/* Logo */}
                <div style={{
                    ...styles.logoWrap,
                    paddingLeft: '40px'
                }}>
                    <span style={{
                        fontSize: '22px',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #4fc3f7, #7c4dff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-1px',
                    }}>CV</span>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                    }}>Spectra</span>
                </div>

                {/* Nav items */}
                <nav style={styles.nav}>
                    {navItems.map(item => (
                        <div
                            key={item.id}
                            style={{
                                ...styles.navItem,
                                background: page === item.id ? 'var(--accent)' : 'transparent',
                                color: page === item.id ? '#fff' : 'var(--text-secondary)',
                            }}
                            onClick={() => {
                                setPage(item.id)
                                setMenuOpen(false) // close menu on mobile after click
                            }}
                        >
                            <span style={styles.navIcon}>{item.icon}</span>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>

                {/* Bottom section */}
                <div style={styles.bottom}>
                    <div style={styles.darkToggle} onClick={() => setDarkMode(!darkMode)}>
                        <span>{darkMode ? '☀️ Light mode' : '🌙 Dark mode'}</span>
                        <div style={{
                            ...styles.toggleTrack,
                            background: darkMode ? '#4f6ef7' : '#e5e7eb'
                        }}>
                            <div style={{
                                ...styles.toggleThumb,
                                transform: darkMode ? 'translateX(16px)' : 'translateX(0)'
                            }} />
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={styles.userRow} onClick={() => setShowLogout(!showLogout)}>
                            <div style={styles.userAvatar}>
                                {user.email[0].toUpperCase()}
                            </div>
                            <span style={styles.userEmail}>{user.email}</span>
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: '10px',
                                border: '1px solid var(--border)',
                                borderRadius: '4px',
                                padding: '1px 4px',
                            }}>▾</span>
                        </div>
                        {showLogout && (
                            <div style={styles.logoutDropdown} onClick={onLogout}>
                                ⎋ Sign out
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    sidebar: {
        width: '220px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 12px',
        zIndex: 300,
        paddingBottom: '20px',
        overflowY: 'auto',
    },
    hamburger: {
        position: 'fixed',
        top: '12px',
        left: '12px',
        zIndex: 400,
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '6px 10px',
        fontSize: '18px',
        cursor: 'pointer',
        color: 'var(--text-primary)',
    },
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.4)',
        zIndex: 200,
    },
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '0 8px',
        marginBottom: '32px',
    },
    logoImg: {
        width: '100px',
        height: '100px',
        objectFit: 'contain',
    },
    logoText: {
        fontSize: '16px',
        fontWeight: '700',
        color: 'var(--text-primary)',
    },
    nav: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '9px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.15s',
    },
    navIcon: {
        fontSize: '16px',
        width: '20px',
        textAlign: 'center',
    },
    bottom: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    darkToggle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '9px 12px',
        cursor: 'pointer',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        borderRadius: '8px',
    },
    toggleTrack: {
        width: '32px',
        height: '18px',
        borderRadius: '100px',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
    },
    toggleThumb: {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: '#fff',
        position: 'absolute',
        top: '2px',
        left: '2px',
        transition: 'transform 0.2s',
    },
    userRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 12px',
        borderTop: '1px solid var(--border)',
        marginTop: '8px',
        cursor: 'pointer',
        borderRadius: '8px',
        transition: 'background 0.15s',
    },
    userAvatar: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: '#4f6ef7',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: '700',
        flexShrink: 0,
    },
    userEmail: {
        fontSize: '11px',
        color: 'var(--text-secondary)',
        flex: 1,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    logoutIcon: {
        fontSize: '16px',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        flexShrink: 0,
    },
    logoutDropdown: {
        position: 'absolute',
        bottom: '48px',
        left: '12px',
        right: '12px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '13px',
        color: '#ef4444',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }
}

export default Sidebar