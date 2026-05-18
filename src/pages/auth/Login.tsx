import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth'
import { loginSchema } from '../../forms/auth'
import type { LoginInput } from '../../forms/auth'
import apiClient from '../../api/client'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ApiError } from '../../utils/api-error'

export const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [globalError, setGlobalError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      setGlobalError(null)
      const response = await apiClient.post<{ token: string; user: { id: string; name: string; email: string; role: string } }>('/auth/login', data)
      login(response.data.token, response.data.user)
      navigate('/')
    } catch (error) {
      if (error instanceof ApiError) {
        setGlobalError(error.message)
      } else {
        setGlobalError('An unexpected network error occurred')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Sign In</h2>
        <p className="text-sm text-neutral-500">Access your  Leads Sandbox</p>
      </div>

      {globalError && (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />

        <Button type="submit" loading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-neutral-500">Don't have an account? </span>
        <Link to="/register" className="font-semibold text-neutral-900 hover:underline dark:text-neutral-50">
          Register here
        </Link>
      </div>
    </div>
  )
}

export default Login
