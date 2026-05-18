import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/auth-context'
import { ThemeProvider } from './context/theme-context'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
