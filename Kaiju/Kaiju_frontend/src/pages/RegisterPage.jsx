import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KaijuLogoMark } from '../components/ui/KaijuLogoMark'
import { authService } from '../services/authService'

const quarterOptions = ['Apex', 'Echo', 'Warden', 'Xeno', 'Zion']

export function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ fullName: '', email: '', quarter: 'Apex', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setIsSubmitting(true)
      await authService.register(formData)
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--register">
        <div className="auth-brand">
          <div className="brand-logo brand-logo--large">
            <KaijuLogoMark className="brand-logo__svg" />
          </div>
          <div>
            <div className="brand-name">KAIJU</div>
            <p>Tokyork crisis command</p>
          </div>
        </div>

        <div className="auth-header">
          <h2>Create account</h2>
          <p>Register a new user for the response network.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Full name</span>
            <input type="text" name="fullName" value={formData.fullName} placeholder="Officer Sato" onChange={handleChange} />
          </label>

          <label>
            <span>Email</span>
            <input type="email" name="email" value={formData.email} placeholder="name@tokyork.gov" onChange={handleChange} />
          </label>

          <label>
            <span>Quarter assignment</span>
            <select name="quarter" value={formData.quarter} onChange={handleChange}>
              {quarterOptions.map((quarter) => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </select>
          </label>

          <label>
            <span>Password</span>
            <input type="password" name="password" value={formData.password} placeholder="Minimum 8 characters" onChange={handleChange} />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
