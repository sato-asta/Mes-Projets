import { Link } from 'react-router-dom'

const nodePositions = {
  Apex: { x: 110, y: 90 },
  Echo: { x: 260, y: 90 },
  Warden: { x: 110, y: 230 },
  Xeno: { x: 260, y: 230 },
  Zion: { x: 410, y: 230 },
  Sea: { x: 430, y: 120 }
}

const links = [
  ['Apex', 'Echo'],
  ['Apex', 'Warden'],
  ['Apex', 'Xeno'],
  ['Echo', 'Xeno'],
  ['Warden', 'Xeno'],
  ['Warden', 'Zion'],
  ['Xeno', 'Zion'],
  ['Echo', 'Sea'],
  ['Xeno', 'Sea'],
  ['Zion', 'Sea']
]

const severityClassMap = {
  Critical: 'city-map-node--critical',
  Watch: 'city-map-node--watch',
  Stable: 'city-map-node--stable'
}

export function CityMap({ variant = 'dashboard', districts = [] }) {
  const isOverview = variant === 'overview'
  const severityByName = Object.fromEntries(districts.map((district) => [district.name, district.severity]))

  const nodes = isOverview
    ? [
        { id: 'Apex', label: 'Apex', x: 18, y: 24 },
        { id: 'Echo', label: 'Echo', x: 42, y: 24 },
        { id: 'Warden', label: 'Warden', x: 18, y: 62 },
        { id: 'Xeno', label: 'Xeno', x: 42, y: 62 },
        { id: 'Zion', label: 'Zion', x: 68, y: 62 },
        { id: 'Sea', label: 'Sea', x: 72, y: 18, sea: true }
      ]
    : [
        { id: 'Apex', label: 'Apex', x: 18, y: 30 },
        { id: 'Echo', label: 'Echo', x: 42, y: 30 },
        { id: 'Warden', label: 'Warden', x: 18, y: 66 },
        { id: 'Xeno', label: 'Xeno', x: 42, y: 66 },
        { id: 'Zion', label: 'Zion', x: 68, y: 66 },
        { id: 'Sea', label: 'Sea', x: 72, y: 18, sea: true }
      ]

  return (
    <div className={isOverview ? 'city-map-shell city-map-shell--overview' : 'city-map-shell'} aria-label="City topology map">
      <svg className="city-map-connections" viewBox="0 0 520 320" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {links.map(([start, end]) => {
          const from = nodePositions[start]
          const to = nodePositions[end]
          return <path key={`${start}-${end}`} d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`} />
        })}
      </svg>

      {nodes.map((node) => {
        const severityClass = node.sea ? '' : ` ${severityClassMap[severityByName[node.id]] || ''}`
        return (
          <Link
            key={node.id}
            to="/city-overview"
            className={`city-map-node${node.sea ? ' city-map-node--sea' : ''}${severityClass}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            aria-label={`Open ${node.label}`}
            title={node.label}
          >
            <span>{node.label}</span>
          </Link>
        )
      })}
    </div>
  )
}
