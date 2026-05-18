import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true }
  }

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-neutral-50 dark:bg-neutral-950">
          <div className="rounded-full bg-red-50 p-4 text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-sm">
            An unexpected application error occurred. Please refresh or try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 focus:outline-none dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-100"
          >
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
