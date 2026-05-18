import React from 'react'
import { Outlet } from 'react-router-dom'
import DotField from '@/components/background/DotField'

export const AuthLayout: React.FC = () => {
  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-4 py-12 text-neutral-50">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          <DotField
            dotRadius={2}
            dotSpacing={12}
            cursorRadius={250}
            cursorForce={0.25}
            bulgeOnly
            bulgeStrength={24}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={2}
            gradientFrom="#000000"
            gradientTo="#746f6f"
            glowColor="#120F17"
          />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6 rounded-lg border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold tracking-tight text-neutral-50">
            Smart Leads
          </span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
