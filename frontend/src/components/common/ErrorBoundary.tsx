import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console (could send to error reporting service)
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="size-8 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We&apos;re sorry, but something unexpected happened. Please try
                refreshing the page.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left bg-muted rounded-lg p-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
                  Error details
                </summary>
                <pre className="mt-2 text-xs overflow-auto text-destructive">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={this.handleReset} variant="outline">
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>
              <Button onClick={() => (window.location.href = '/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
