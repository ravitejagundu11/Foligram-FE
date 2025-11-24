import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { findDemoUserByUsernameOrEmail } from '@utils/demoUsers'

import '../styles/LoginPage.css'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [invalid, setInvalid] = useState({ username: false, password: false })
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate empty fields first
    const emptyUsername = username.trim() === ''
    const emptyPassword = password.trim() === ''
    if (emptyUsername || emptyPassword) {
      setInvalid({ username: emptyUsername, password: emptyPassword })
      setError('Please fill in all fields')
      return
    }

    // reset empty-field validation
    setInvalid({ username: false, password: false })

    // Validate credentials against demo users
    const found = findDemoUserByUsernameOrEmail(username)
    if (!found || found.password !== password) {
      setError('Invalid username or password. Try: user@foliogram.com / password123')
      return
    }

    // Successful login - set user data and redirect to dashboard
    login({
      username: found.username,
      email: found.email,
      firstName: found.firstName,
      lastName: found.lastName,
      contactNumber: found.contactNumber,
      role: found.role,
      profileImage: found.profileImage,
    })
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Welcome Back
        </h1>
        <p className="login-subtitle">Sign in to your Foliogram account</p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="username" className="login-form-label">
              Username or Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
                setInvalid((s) => ({ ...s, username: false }))
              }}
              placeholder="Enter your username or email"
              className={`login-form-input ${invalid.username ? 'input-error' : ''}`}
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
                setInvalid((s) => ({ ...s, password: false }))
              }}
              placeholder="Enter your password"
              className={`login-form-input ${invalid.password ? 'input-error' : ''}`}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>
        </form>

        <div className="login-divider">
          <p className="login-divider-text">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="login-signup-link"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
