import { useState } from 'react'
import axios from 'axios'
import { AtSign, Eye, Lock, UserPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const initialForm = {
  email: '',
  password: '',
  confirmPassword: '',
}

function Register({ onSuccess }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
      })

      const loginResponse = await axios.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      })

      const { token, user } = loginResponse.data
      onSuccess(token, user, navigate)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Unable to create your account right now.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="glass-container py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel hero-copy">
          <span className="badge w-fit">
            <UserPlus className="h-4 w-4 text-emerald-300" />
            Join the feed
          </span>

          <div className="space-y-3">
            <h1>Create an account and publish your first post.</h1>
            <p>
              Register once, sign in instantly, and manage your entries with the same
              elevated glass interface.
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <strong>Quick</strong>
              <span>register and auto-login</span>
            </div>
            <div className="metric">
              <strong>Simple</strong>
              <span>email/password signup</span>
            </div>
            <div className="metric">
              <strong>Consistent</strong>
              <span>shared UI and session flow</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="avatar-pill">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Heads up</p>
                <p className="helper-text">
                  The backend currently accepts email and password only, so the form keeps
                  those fields aligned.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="glass-panel form-card" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">Create account</h2>
            <p className="helper-text">Register a new user and continue straight into the app.</p>
          </div>

          {errorMessage ? <div className="status-error">{errorMessage}</div> : null}

          <div className="field">
            <label htmlFor="register-email">Email</label>
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="register-email"
                className="input pl-11"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-password">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="register-password"
                className="input pl-11"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="register-confirm-password">Confirm password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="register-confirm-password"
                className="input pl-11"
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>

          <p className="helper-text text-center">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-amber-300 hover:text-amber-200">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Register
