import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/auth-context'
import { ThemeProvider } from './context/theme-context'
import { ToastProvider } from './context/toast-context'
import ErrorBoundary from './components/states/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
