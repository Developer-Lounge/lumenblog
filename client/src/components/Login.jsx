import { useState } from 'react'
import axios from 'axios'
import { Eye, Lock, Mail, LogIn } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const initialForm = {
  email: '',
  password: '',
}

function Login({ onSuccess }) {
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
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await axios.post('/api/auth/login', formData)
      const { token, user } = response.data

      onSuccess(token, user, navigate)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Unable to sign in right now. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="glass-container py-8">
      <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="glass-panel hero-copy">
          <span className="badge w-fit">
            <LogIn className="h-4 w-4 text-amber-300" />
            Welcome back
          </span>

          <div className="space-y-3">
            <h1>Sign in and keep publishing.</h1>
            <p>
              Access your personalized feed, create posts, and keep your JWT session
              synced across refreshes.
            </p>
          </div>

          <div className="metrics-grid">
            <div className="metric">
              <strong>Fast</strong>
              <span>axios-powered auth flow</span>
            </div>
            <div className="metric">
              <strong>Secure</strong>
              <span>JWT-backed sign-in</span>
            </div>
            <div className="metric">
              <strong>Polished</strong>
              <span>glassmorphic interface</span>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-3">
              <div className="avatar-pill">
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Tip</p>
                <p className="helper-text">
                  Use the same email and password you registered with on the Express API.
                </p>
              </div>
            </div>
          </div>
        </div>

        <form className="glass-panel form-card" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">Login</h2>
            <p className="helper-text">Enter your account credentials to continue.</p>
          </div>

          {errorMessage ? <div className="status-error">{errorMessage}</div> : null}

          <div className="field">
            <label htmlFor="login-email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email"
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
            <label htmlFor="login-password">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password"
                className="input pl-11"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="helper-text text-center">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-amber-300 hover:text-amber-200">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default Login
