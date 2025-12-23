import LoginForm from '@/app/(auth)/login/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login'
}

export default function LoginPage() {
  return (
    <div>
      <h1 className='text-xl font-semibold text-center'>Login</h1>
      <div className='flex justify-center'>
        <LoginForm />
      </div>
    </div>
  )
}
