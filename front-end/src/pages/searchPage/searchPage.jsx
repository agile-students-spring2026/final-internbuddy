import { useState, useEffect, useMemo, useContext } from 'react'
//import { faker } from '@faker-js/faker'
import { ConnectionsContext } from '../../context/ConnectionsContext'
import SwipePage from '../SwipePage'
import './searchPage.css'

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Figma', 'Stripe', 'Notion', 'Airbnb', 'Spotify']
const SCHOOLS = ['NYU', 'Columbia', 'Cornell', 'MIT', 'Stanford', 'UMich', 'UCLA', 'Georgia Tech', 'CMU', 'UPenn']
const ROLES = ['SWE Intern', 'PM Intern', 'Design Intern', 'Data Intern', 'Finance Intern', 'Marketing Intern']
const CITIES = ['New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Chicago, IL']
const RADII = ['5 mi', '10 mi', '25 mi', '50 mi', 'Any']

const CURRENT_USER_ID = '1'

function Degreebadge({ degree }) {
  const labels = {1: '1st', 2: '2nd', 3: '3rd'}
  const d = degree ?? 3
  return <span className={`sp-degree sp-degree--${d}`}>{labels[degree]}</span>
}

function getInitialStatus(person) {
  if (person.connected) return 'connected'
  if (person.connectionStatus === 'pending-outgoing') return 'pending'
  if (person.connectionStatus === 'pending-incoming') return 'incoming'
  return 'idle'
}

function PersonCard({ person, onConnect, onCancel, onAccept }) {
  const [status, setStatus] = useState(() => getInitialStatus(person))
  const [requestId, setRequestId] = useState(null)

  const handleConnect = () => {
    setStatus('pending')
    onConnect(person.id).then(data => setRequestId(data.request.id))
  }

  const handleCancel = () => {
    onCancel(requestId)
    setStatus('idle')
    setRequestId(null)
  }

  const handleAccept = () => {
    onAccept(person.id)
    setStatus('connected')
  }

  const label = {
    connected: 'Connected',
    pending: 'Pending ✕',
    incoming: 'Accept',
    idle: '+ Connect',
  }

  return (
    <div className="sp-card">
      <img
        className="sp-avatar"
        src={`https://picsum.photos/seed/${person.id + 40}/64/64`}
        alt={person.name}
      />
      <div className="sp-card-info">
        <div className="sp-card-row">
          <span className="sp-name">{person.name}</span>
          {person.degree && <Degreebadge degree={person.degree} />}
        </div>
        <p className="sp-role">{person.role} @ {person.company}</p>
        <p className="sp-meta">{person.school} · {person.city}</p>
        {person.mutualCount > 0 && (
          <p className="sp-mutual">{person.mutualCount} mutual connection{person.mutualCount > 1 ? 's' : ''}</p>
        )}
      </div>
      <button
        className={`sp-connect-btn sp-connect-btn--${status}`}
        onClick={
          status === 'pending' ? handleCancel
          : status === 'incoming' ? handleAccept
          : handleConnect
        }
        disabled={status === 'connected'}
      >
        {label[status]}
      </button>
    </div>
  )
}

export default function SearchPage() {
  const { sendRequest, cancelRequest, pending, accepted, acceptRequest } = useContext(ConnectionsContext)
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(false)
  const [swipeMode, setSwipeMode] = useState(false)
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('degree')
  const [filters, setFilters] = useState({
    companies: [],
    schools: [],
    roles: [],
    city: '',
    radius: 'Any',
  })
  const [applied, setApplied] = useState({
    companies: [],
    schools: [],
    roles: [],
    city: '',
    radius: 'Any',
  })

  useEffect(() => {
    console.log('useEffect running, applied:', applied)
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (applied.companies.length === 1) params.set('company', applied.companies[0])
    if (applied.schools.length === 1) params.set('school', applied.schools[0])
    if (applied.roles.length === 1) params.set('role', applied.roles[0])
    if (applied.city) params.set('city', applied.city)
    if (applied.radius !== 'Any') params.set('radius', applied.radius)

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    fetch(`/api/users/search?${params}`, {
      headers: { 'x-current-user-id': CURRENT_USER_ID }
    })
      .then(res => res.json())
      .then(json => setPeople(json.data || []))
      .catch(err => console.error('Search fetch failed:', err))
      .finally(() => setLoading(false))
  }, [query, applied, pending, accepted])

  const toggleMulti = (key, value) => {
    setFilters(prev => {
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  const applyFilters = () => {
    setApplied({ ...filters })
    setShowFilters(false)
  }

  const resetFilters = () => {
    const empty = { companies: [], schools: [], roles: [], city: '', radius: 'Any' }
    setFilters(empty)
    setApplied(empty)
  }

  const activeFilterCount =
    applied.companies.length + applied.schools.length + applied.roles.length +
    (applied.city ? 1 : 0) + (applied.radius !== 'Any' ? 1 : 0)

  const results = useMemo(() => {
    let list = [...people]
    if (sortBy === 'degree') list.sort((a, b) => (a.degree ?? 99) - (b.degree ?? 99))
    else if (sortBy === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'mutual') list.sort((a, b) => (b.mutualCount ?? 0) - (a.mutualCount ?? 0))
    return list
  }, [people, sortBy])

  const handleConnect = (id) => sendRequest(String(id))
  const handleCancel = (requestId) => cancelRequest(requestId)
  const handleAcceptFromSearch = (id) => {
    // find the pending request for this user and accept it
    const req = pending.find(r => r.fromUserId === String(id))
    if (req) acceptRequest(req.id)
  }

  if (swipeMode) {
    return (
      <div className="sp-swipe-shell">
        <button className="sp-mode-toggle sp-mode-toggle--on" onClick={() => setSwipeMode(false)}>
          Swipe Mode: On
        </button>
        <SwipePage />
      </div>
    )
  }

  return (
    <div className="sp-page">
      <div className="sp-mode-row">
        <button className="sp-mode-toggle" onClick={() => setSwipeMode(true)}>
          Swipe Mode: Off
        </button>
      </div>

      {/* Search bar */}
      <div className="sp-search-row">
        <input
          className="sp-search-input"
          type="text"
          placeholder="Search by name, company, school, role…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className={`sp-filter-btn ${activeFilterCount > 0 ? 'sp-filter-btn--active' : ''}`}
          onClick={() => setShowFilters(true)}
        >
          Filters {activeFilterCount > 0 && <span className="sp-filter-badge">{activeFilterCount}</span>}
        </button>
      </div>

      <div className="sp-sort-row">
        <span className="sp-result-count">
          {loading ? 'Loading…' : `${results.length} intern${results.length !== 1 ? 's' : ''}`}
        </span>
        <div className="sp-sort-pills">
          {['degree', 'mutual', 'name'].map(s => (
            <button
              key={s}
              className={`sp-sort-pill ${sortBy === s ? 'active' : ''}`}
              onClick={() => setSortBy(s)}
            >
              {s === 'degree' ? 'Closest' : s === 'mutual' ? 'Mutual' : 'A–Z'}
            </button>
          ))}
        </div>
      </div>

      <div className="sp-results">
        {loading
          ? <p className="sp-empty">Loading…</p>
          : results.length === 0
            ? <p className="sp-empty">No results. Try adjusting your filters.</p>
            : results.map(p => (
                <PersonCard key={p.id} person={p} onConnect={handleConnect} onCancel={handleCancel} onAccept={handleAcceptFromSearch} />
              ))
        }
      </div>

      {showFilters && (
        <div className="sp-drawer-overlay" onClick={() => setShowFilters(false)}>
          <div className="sp-drawer" onClick={e => e.stopPropagation()}>
            <div className="sp-drawer-header">
              <h2 className="sp-drawer-title">Filters</h2>
              <button className="sp-drawer-close" onClick={() => setShowFilters(false)}>✕</button>
            </div>

            <section className="sp-filter-section">
              <h3 className="sp-filter-label">City</h3>
              <div className="sp-chip-group">
                {CITIES.map(c => (
                  <button
                    key={c}
                    className={`sp-chip ${filters.city === c ? 'active' : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, city: prev.city === c ? '' : c }))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <section className="sp-filter-section">
              <h3 className="sp-filter-label">Radius</h3>
              <div className="sp-chip-group">
                {RADII.map(r => (
                  <button
                    key={r}
                    className={`sp-chip ${filters.radius === r ? 'active' : ''}`}
                    onClick={() => setFilters(prev => ({ ...prev, radius: r }))}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>

            <section className="sp-filter-section">
              <h3 className="sp-filter-label">Company</h3>
              <div className="sp-chip-group">
                {COMPANIES.map(c => (
                  <button
                    key={c}
                    className={`sp-chip ${filters.companies.includes(c) ? 'active' : ''}`}
                    onClick={() => toggleMulti('companies', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </section>

            <section className="sp-filter-section">
              <h3 className="sp-filter-label">School</h3>
              <div className="sp-chip-group">
                {SCHOOLS.map(s => (
                  <button
                    key={s}
                    className={`sp-chip ${filters.schools.includes(s) ? 'active' : ''}`}
                    onClick={() => toggleMulti('schools', s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section className="sp-filter-section">
              <h3 className="sp-filter-label">Role</h3>
              <div className="sp-chip-group">
                {ROLES.map(r => (
                  <button
                    key={r}
                    className={`sp-chip ${filters.roles.includes(r) ? 'active' : ''}`}
                    onClick={() => toggleMulti('roles', r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>

            <div className="sp-drawer-actions">
              <button className="sp-reset-btn" onClick={resetFilters}>Reset</button>
              <button className="sp-apply-btn" onClick={applyFilters}>Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}