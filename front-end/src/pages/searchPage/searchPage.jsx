import { useState, useEffect, useMemo, useContext } from 'react'
import { faker } from '@faker-js/faker'
import { ConnectionsContext } from '../../context/ConnectionsContext'
import SwipePage from '../SwipePage'
import './searchPage.css'

const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft', 'Figma', 'Stripe', 'Notion', 'Airbnb', 'Spotify']
const SCHOOLS = ['NYU', 'Columbia', 'Cornell', 'MIT', 'Stanford', 'UMich', 'UCLA', 'Georgia Tech', 'CMU', 'UPenn']
const ROLES = ['SWE Intern', 'PM Intern', 'Design Intern', 'Data Intern', 'Finance Intern', 'Marketing Intern']
const CITIES = ['New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Boston, MA', 'Chicago, IL']
const RADII = ['5 mi', '10 mi', '25 mi', '50 mi', 'Any']

function generatePeople(count = 20) {
  return Array.from({ length: count }, (_, i) => {
    const degree = i < 3 ? 1 : i < 10 ? 2 : 3
    return {
      id: i + 1,
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement(ROLES),
      company: faker.helpers.arrayElement(COMPANIES),
      school: faker.helpers.arrayElement(SCHOOLS),
      city: faker.helpers.arrayElement(CITIES),
      mutual: degree === 1 ? 0 : faker.number.int({ min: 1, max: 12 }),
      degree,
      connected: false,
    }
  })
}

function Degreebadge({ degree }) {
  const labels = { 1: '1st', 2: '2nd', 3: '3rd' }
  return <span className={`sp-degree sp-degree--${degree}`}>{labels[degree]}</span>
}

function PersonCard({ person, onConnect, onCancel }) {
  const [status, setStatus] = useState(person.connected ? 'connected' : 'idle')
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
          <Degreebadge degree={person.degree} />
        </div>
        <p className="sp-role">{person.role} @ {person.company}</p>
        <p className="sp-meta">{person.school} · {person.city}</p>
        {person.mutual > 0 && (
          <p className="sp-mutual">{person.mutual} mutual connection{person.mutual > 1 ? 's' : ''}</p>
        )}
      </div>
      <button
        className={`sp-connect-btn sp-connect-btn--${status}`}
        onClick={status === 'pending' ? handleCancel : handleConnect}
        disabled={status === 'connected'}
      >
        {status === 'connected' ? 'Connected' : status === 'pending' ? 'Pending ✕' : '+ Connect'}
      </button>
    </div>
  )
}

export default function SearchPage() {
  const { sendRequest, cancelRequest } = useContext(ConnectionsContext)
  const [people, setPeople] = useState([])
  const [swipeMode, setSwipeMode] = useState(false)
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('degree') // 'degree' | 'name' | 'mutual'
  const [filters, setFilters] = useState({
    companies: [],
    schools: [],
    roles: [],
    city: '',
    radius: 'Any',
  })
  const [applied, setApplied] = useState(filters)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPeople(generatePeople(20))
  }, [])

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
    let list = people.filter(p => {
      const q = query.toLowerCase()
      if (q && !p.name.toLowerCase().includes(q) &&
          !p.company.toLowerCase().includes(q) &&
          !p.school.toLowerCase().includes(q) &&
          !p.role.toLowerCase().includes(q)) return false
      if (applied.companies.length && !applied.companies.includes(p.company)) return false
      if (applied.schools.length && !applied.schools.includes(p.school)) return false
      if (applied.roles.length && !applied.roles.includes(p.role)) return false
      if (applied.city && p.city !== applied.city) return false
      return true
    })

    if (sortBy === 'degree') list = [...list].sort((a, b) => a.degree - b.degree)
    else if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else if (sortBy === 'mutual') list = [...list].sort((a, b) => b.mutual - a.mutual)

    return list
  }, [people, query, applied, sortBy])

  const handleConnect = (id) => {
    setPeople(prev => prev.map(p => p.id === id ? { ...p, connected: true } : p))
    return sendRequest(String(id))
  }

  const handleCancel = (requestId) => {
    cancelRequest(requestId)
  }

  if (swipeMode) {
    return (
      <div className="sp-swipe-shell">
        <button
          className="sp-mode-toggle sp-mode-toggle--on"
          onClick={() => setSwipeMode(false)}
        >
          Swipe Mode: On
        </button>
        <SwipePage />
      </div>
    )
  }

  return (
    <div className="sp-page">
      <div className="sp-mode-row">
        <button
          className="sp-mode-toggle"
          onClick={() => setSwipeMode(true)}
        >
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

      {/* Sort row */}
      <div className="sp-sort-row">
        <span className="sp-result-count">{results.length} intern{results.length !== 1 ? 's' : ''}</span>
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

      {/* Results */}
      <div className="sp-results">
        {results.length === 0
          ? <p className="sp-empty">No results. Try adjusting your filters.</p>
          : results.map(p => <PersonCard key={p.id} person={p} onConnect={handleConnect} onCancel={handleCancel} />)
        }
      </div>

      {/* Filter drawer */}
      {showFilters && (
        <div className="sp-drawer-overlay" onClick={() => setShowFilters(false)}>
          <div className="sp-drawer" onClick={e => e.stopPropagation()}>
            <div className="sp-drawer-header">
              <h2 className="sp-drawer-title">Filters</h2>
              <button className="sp-drawer-close" onClick={() => setShowFilters(false)}>✕</button>
            </div>

            {/* Location */}
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

            {/* Radius */}
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

            {/* Company */}
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

            {/* School */}
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

            {/* Role */}
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
