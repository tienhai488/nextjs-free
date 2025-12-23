import ButtonLogout from '@/components/button-logout'
import { ModeToggle } from '@/components/toggle-theme'
import { AccountResType } from '@/schemaValidations/account.schema'
import Link from 'next/link'

type User = AccountResType['data']

export default async function Header({ user }: { user: User | null }) {
  return (
    <div className='flex space-x-4'>
      <ul className='flex space-x-4'>
        <li>
          <Link href='/products'>Product List</Link>
        </li>
        {user && (
          <>
            <li>
              <Link href='/products/create'>Create Product</Link>
            </li>
            <li>
              <Link href='/me'>Hi, {user.name}</Link>
            </li>
            <li>
              <ButtonLogout />
            </li>
          </>
        )}
        {!user && (
          <>
            <li>
              <Link href='/login'>Login</Link>
            </li>
            <li>
              <Link href='/register'>Register</Link>
            </li>
          </>
        )}
      </ul>
      <ModeToggle />
    </div>
  )
}
