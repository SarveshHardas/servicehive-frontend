import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { registerSchema } from '../../forms/auth'
import type { RegisterInput } from '../../forms/auth'
import { useToast } from '../../hooks/use-toast'
import apiClient from '../../api/client'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { ApiError } from '../../utils/api-error'

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const { success, error: showToastError } = useToast()
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'sales',
    },
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      setGlobalError(null)
      setSuccessMessage(null)
      await apiClient.post('/auth/register', data)
      success('Account created successfully')
      setSuccessMessage('Registration successful! Redirecting to login...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err) {
      let errMsg = 'An unexpected network error occurred'
      if (err instanceof ApiError) {
        errMsg = err.message
      }
      setGlobalError(errMsg)
      showToastError(errMsg)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">Create Account</h2>
        <p className="text-sm text-neutral-500">Sign up to get started</p>
      </div>

      {globalError && (
        <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-600 dark:bg-red-950/20 dark:text-red-400">
          {globalError}
        </div>
      )}

      {successMessage && (
        <div className="rounded-md bg-green-50 p-3 text-sm font-medium text-green-600 dark:bg-green-950/20 dark:text-green-400">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          disabled={isSubmitting}
          {...register('name')}
        />

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

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Role
          </label>
          <select
            disabled={isSubmitting}
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50 dark:focus:border-neutral-50"
            {...register('role')}
          >
            <option value="sales">Sales Representative</option>
            <option value="admin">Administrator</option>
          </select>
          {errors.role?.message && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400">
              {errors.role.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={isSubmitting}>
          Register
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-neutral-500">Already have an account? </span>
        <Link to="/login" className="font-semibold text-neutral-900 hover:underline dark:text-neutral-50">
          Sign in instead
        </Link>
      </div>
    </div>
  )
}

export default Register
