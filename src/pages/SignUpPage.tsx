import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import '../styles/SignUpPage.css'

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !username || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    // Show success and redirect to login
    setSuccess(true)
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">
          Join Foliogram
        </h1>
        <p className="signup-subtitle">Create your account to get started</p>

        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}

        {success && (
          <div className="signup-success">
            <span className="signup-success-message">
            ✓ Account created successfully! Redirecting to login...
                      </span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="signup-form">
            <div className="signup-form-group">
              <label htmlFor="email" className="signup-form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="your@email.com"
                className="signup-form-input"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="username" className="signup-form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder="Choose a username"
                className="signup-form-input"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="password" className="signup-form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="At least 6 characters"
                className="signup-form-input"
                required
              />
            </div>

            <div className="signup-form-group">
              <label htmlFor="confirmPassword" className="signup-form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setError('')
                }}
                placeholder="Confirm your password"
                className="signup-form-input"
                required
              />
            </div>

            <button
              type="submit"
              className="signup-button"
            >
              Create Account
            </button>
          </form>
        )}

        <div className="signup-divider">
          <p className="signup-divider-text">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="signup-signin-link"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
