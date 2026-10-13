import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KaijuLogoMark } from '../components/ui/KaijuLogoMark'
import { authService } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: true })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setIsSubmitting(true)
      await authService.login({ email: formData.email, password: formData.password })
      navigate('/dashboard', { replace: true })
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--login">
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
          <h2>Welcome back</h2>
          <p>Sign in to access incident coordination.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label>
            <span>Email</span>
            <input type="email" name="email" value={formData.email} placeholder="name@tokyork.gov" onChange={handleChange} />
          </label>

          <label>
            <span>Password</span>
            <input type="password" name="password" value={formData.password} placeholder="••••••••" onChange={handleChange} />
          </label>

          <div className="auth-row">
            <label className="checkbox-row">
              <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
              <span>Remember me</span>
            </label>
            <button type="button" className="text-button">Forgot password?</button>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
