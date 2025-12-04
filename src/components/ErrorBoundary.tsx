import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/ErrorBoundary.css'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <div className="error-icon">
              <AlertTriangle size={64} />
            </div>
            <h1>Oops! Something went wrong</h1>
            <p className="error-message">
              We encountered an unexpected error. Don't worry, your data is safe.
            </p>
            {this.state.error && (
              <details className="error-details">
                <summary>Technical Details</summary>
                <pre className="error-stack">
                  <strong>Error:</strong> {this.state.error.toString()}
                  {this.state.errorInfo && (
                    <>
                      {'\n\n'}
                      <strong>Component Stack:</strong>
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </pre>
              </details>
            )}
            <div className="error-actions">
              <button onClick={this.handleReset} className="btn-retry">
                <RefreshCw size={18} />
                Try Again
              </button>
              <ErrorBoundaryHomeButton />
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Separate component to use the useNavigate hook
function ErrorBoundaryHomeButton() {
  const navigate = useNavigate()
  
  return (
    <button onClick={() => navigate('/')} className="btn-home">
      <Home size={18} />
      Go Home
    </button>
  )
}

export default ErrorBoundary
