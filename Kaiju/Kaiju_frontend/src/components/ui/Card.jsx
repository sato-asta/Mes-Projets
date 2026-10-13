export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`card ${className}`.trim()}>
      {(title || subtitle || action) && (
        <header className="card-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
