import RegisterForm from '@/app/(auth)/register/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register'
}

export default function RegisterPage() {
  return (
    <div>
      <h1 className='text-xl font-semibold text-center'>Register</h1>
      <div className='flex justify-center'>
        <RegisterForm />
      </div>
    </div>
  )
}
