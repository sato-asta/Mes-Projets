import { Card } from '../components/ui/Card'

export function PlaceholderPage({ title, description }) {
  return (
    <div className="placeholder-page">
      <Card title={title} subtitle={description || 'This section is scheduled for the next release.'}>
        <div className="placeholder-box">
          <p>Planning and business rules for this module are queued for the next frontend milestone.</p>
          <span>Coming soon</span>
        </div>
      </Card>
    </div>
  )
}
