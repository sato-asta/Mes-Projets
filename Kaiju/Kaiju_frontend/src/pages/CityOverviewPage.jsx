import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { CityMap } from '../components/ui/CityMap'
import { districtService } from '../services/districtService'
import { wsService } from '../services/wsService'

export function CityOverviewPage() {
  const [districts, setDistricts] = useState([])
  const [error, setError] = useState('')

  function loadData() {
    districtService.loadOverview().then(setDistricts).catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadData()
    wsService.connect()
    const unsubscribeResource = wsService.subscribe('resource_status_update', () => loadData())
    const unsubscribeLevel = wsService.subscribe('disaster_level_changed', () => loadData())
    const unsubscribeRetention = wsService.subscribe('retention_threshold_lowered', () => loadData())
    return () => {
      unsubscribeResource()
      unsubscribeLevel()
      unsubscribeRetention()
    }
  }, [])

  return (
    <div className="city-overview-grid">
      <Card title="Tokyork topology" subtitle="Adjacency and district supervision" className="card--full">
        <CityMap variant="overview" districts={districts} />
      </Card>

      <Card title="Quarter overview" subtitle="Threat and resource posture" className="card--full">
        {error && <p className="form-error">{error}</p>}
        <div className="quarter-overview-list">
          {districts.map((district) => (
            <div key={district.id} className="district-row">
              <div>
                <strong>{district.name}</strong>
                <span>Code: {district.code}</span>
              </div>
              <span>{district.threatLevel}</span>
              <span>
                {district.resourcesLabel}
                {district.neededResources?.length > 0 && ` — needs ${district.neededResources.join(', ')}`}
              </span>
              <span>{district.sea_access ? 'Maritime access' : 'No sea access'}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
